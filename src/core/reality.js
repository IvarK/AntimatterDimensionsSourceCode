import { DC } from "./constants";

/**
 * Object that manages the selection of glyphs offered to the player
 */
export const GlyphSelection = {
  glyphs: [],
  realityProps: undefined,

  get active() {
    return Modal.reality.isOpen;
  },

  get choiceCount() {
    return Effects.max(1, Perk.firstPerk) *
      Ra.unlocks.extraGlyphChoicesAndRelicShardRarityAlwaysMax.effectOrDefault(1);
  },

  glyphUncommonGuarantee(glyphList, rng) {
    // If no choices are rare enough and the player has the uncommon glyph perk, randomly generate
    // rarities until the threshold is passed and then assign that rarity to a random glyph
    const strengthThreshold = 1.5;
    // Do RNG stuff now so getting a strength-boosting upgrade in this reality
    // can't influence the RNG of the next one.
    const random = rng.uniform();
    let newStrength;
    do {
      newStrength = GlyphGenerator.randomStrength(rng);
    } while (newStrength < strengthThreshold);
    if (glyphList.some(e => e.strength >= strengthThreshold)) return;
    glyphList[Math.floor(random * glyphList.length)].strength = newStrength;
  },

  glyphList(countIn, level, config) {
    // Always generate at least 4 choices so that the RNG never diverges based on
    // the 4-choice perk.
    const count = Math.clampMin(countIn, 4);
    let glyphList = [];
    const rng = config.rng || new GlyphGenerator.RealGlyphRNG();
    const types = [];

    // To attempt to reduce RNG swing, we follow slightly different logic early on in order
    // to spread out types and effects more equally for the first few realities. Types and
    // effects are spread out over the choices of each consecutive group of 5 realities
    if (player.realities <= 5 * GlyphGenerator.uniformityGroups) {
      glyphList = GlyphGenerator.uniformGlyphs(level, rng, player.realities);
    } else {
      for (let out = 0; out < count; ++out) {
        types.push(GlyphGenerator.randomType(rng, types));
      }
      for (let out = 0; out < count; ++out) {
        glyphList.push(GlyphGenerator.randomGlyph(level, rng, types[out]));
      }
    }

    this.glyphUncommonGuarantee(glyphList, rng);
    // If we generated extra choices due to always generating at least 4 choices,
    // we remove the extra choices here.
    glyphList = glyphList.slice(0, countIn);
    // If we passed an explicit RNG in, we assume it'll get finalized later.
    if (!config.rng && config.isChoosingGlyph) {
      rng.finalize();
    }
    return glyphList;
  },

  generate(count, level = gainedGlyphLevel()) {
    this.glyphs = this.glyphList(count, level, { isChoosingGlyph: true });
  },

  update(level) {
    if (this.realityProps === undefined) return;
    if (level.rawLevel > this.realityProps.gainedGlyphLevel.rawLevel) {
      this.realityProps.gainedGlyphLevel.rawLevel = level.rawLevel;
      for (const glyph of this.glyphs) glyph.rawLevel = level.rawLevel;
    }
    if (level.actualLevel > this.realityProps.gainedGlyphLevel.actualLevel) {
      this.realityProps.gainedGlyphLevel.actualLevel = level.actualLevel;
      for (const glyph of this.glyphs) {
        glyph.level = level.actualLevel;
        calculateGlyph(glyph);
      }
    }
  },

  select(glyphID, sacrifice) {
    const chosenGlyph = this.glyphs[glyphID];
    if (sacrifice) {
      GlyphSacrificeHandler.removeGlyph(chosenGlyph, true);
    } else if (GameCache.glyphInventorySpace.value > 0) {
      Glyphs.addToInventory(chosenGlyph);
    } else {
      AutoGlyphProcessor.getRidOfGlyph(chosenGlyph);
    }
    this.glyphs = [];
    this.realityProps = undefined;
  }
};

export function isRealityAvailable() {
  return player.records.thisReality.maxEP.exponent >= 4000 && TimeStudy.reality.isBought;
}

// Returns the number of "extra" realities from stored real time or Multiversal effects, should be called
// with false for checking and true for actual usage, and only "used" once per reality.
export function simulatedRealityCount(advancePartSimCounters) {
  const amplifiedSim = Enslaved.boostReality ? Enslaved.realityBoostRatio - 1 : 0;
  const multiversalSim = AlchemyResource.multiversal.effectValue;
  const simCount = (multiversalSim + 1) * (amplifiedSim + 1) + player.partSimulatedReality - 1;
  if (advancePartSimCounters) {
    player.partSimulatedReality = simCount - Math.floor(simCount);
  }
  return Math.floor(simCount);
}

/**
 * Triggered when the user clicks the reality button. This triggers the glyph selection
 * process, if applicable. Auto sacrifice is never triggered.
 */
export function requestManualReality() {
  if (GlyphSelection.active || !isRealityAvailable()) return;
  if (GameEnd.creditsEverClosed) return;
  if (player.options.confirmations.glyphSelection || ui.view.shiftDown) {
    Modal.reality.show();
    return;
  }
  if (GameCache.glyphInventorySpace.value === 0) {
    Modal.message.show("No available inventory space; free up space by shift-clicking Glyphs to get rid of them.",
      { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
    return;
  }
  startManualReality(false);
}

export function startManualReality(sacrifice, glyphID) {
  if (player.options.animations.reality) {
    runRealityAnimation();
    setTimeout(processManualReality, 3000, sacrifice, glyphID);
  } else {
    processManualReality(sacrifice, glyphID);
  }
}

export function processManualReality(sacrifice, glyphID) {
  if (!isRealityAvailable()) return;

  if (player.realities === 0) {
    // If this is our first Reality, lock in the initial seed and then give the companion and starting glyphs
    player.reality.seed = player.reality.initialSeed;
    Glyphs.addToInventory(GlyphGenerator.startingGlyph(gainedGlyphLevel()));
    Glyphs.addToInventory(GlyphGenerator.companionGlyph(Currency.eternityPoints.value));
  } else if (Perk.firstPerk.isEffectActive) {
    // If we have firstPerk, we pick from 4+ glyphs, and glyph generation functions as normal.
    GlyphSelection.generate(GlyphSelection.choiceCount);

    // If we don't actually have a chosen ID, that means a manual reality was done with the modal disabled or the
    // modal showed up and the player decided not to pick anything
    if (glyphID === undefined) {
      if (EffarigUnlock.glyphFilter.isUnlocked) {
        // Note that this code path is eventually followed regardless of the glyph selection popping up - if it did, we
        // pass through the option selected there; if it didn't, then we apply the filter. If we don't handle it this
        // way, manual realities without the modal will never sacrifice and may give bad glyphs you don't care about
        const newGlyph = AutoGlyphProcessor.pick(GlyphSelection.glyphs);
        const shouldSacrifice = player.options.confirmations.glyphSelection
          ? sacrifice
          : !AutoGlyphProcessor.wouldKeep(newGlyph);
        if (shouldSacrifice || GameCache.glyphInventorySpace.value === 0) {
          AutoGlyphProcessor.getRidOfGlyph(newGlyph);
        } else {
          Glyphs.addToInventory(newGlyph);
        }
      } else {
        // This doesn't use the seeded RNG, but this isn't exploitable since the player can just reenable
        // the modal and choose themselves anyway. The alternative is adding an extra seeded RNG call
        // everywhere else to ensure RNG consistency, which is probably undesirable
        GlyphSelection.select(Math.floor(Math.random() * GlyphSelection.choiceCount), sacrifice);
      }
    } else {
      // In this case, we already picked a choice in the modal
      GlyphSelection.select(glyphID, sacrifice);
    }
  } else {
    // We can't get a random glyph directly here because that makes the RNG depend on when you get the first
    // perk. The internals of generate() still advance the seed properly as if we actually had a choice of
    // more than one glyph, but always selecting the first glyph results in highly biased types when the
    // uniformity code is still active. Therefore, we choose a glyph randomly (but deterministically) instead
    GlyphSelection.generate(1);
    const lexIndex = player.realities * ((player.reality.initialSeed % 5) + 3);
    GlyphSelection.select(permutationIndex(4, lexIndex)[0], sacrifice);
  }

  // We've already gotten a glyph at this point, so the second value has to be true.
  // If we haven't sacrificed, we need to sort and purge glyphs, as applicable.
  beginProcessReality(getRealityProps(false, true));

  // Should be here so that the perk graphics update even when we're on the perk subtab, while also keeping its
  // relatively expensive operations off of the reality reset hot path for when realities are significantly faster
  PerkNetwork.updatePerkColor();
}

export function runRealityAnimation() {
  document.getElementById("ui").style.userSelect = "none";
  document.getElementById("ui").style.animation = "a-realize 10s 1";
  document.getElementById("realityanimbg").style.animation = "a-realizebg 10s 1";
  document.getElementById("realityanimbg").style.display = "block";
  if (Theme.current().isDark()) document.getElementById("realityanimbg").style.filter = "invert(1)";
  else document.getElementById("realityanimbg").style.filter = "";
  setTimeout(() => {
    document.getElementById("realityanimbg").play();
    document.getElementById("realityanimbg").currentTime = 0;
    document.getElementById("realityanimbg").play();
  }, 2000);
  setTimeout(() => {
    document.getElementById("ui").style.userSelect = "auto";
    document.getElementById("ui").style.animation = "";
    document.getElementById("realityanimbg").style.animation = "";
    document.getElementById("realityanimbg").style.display = "none";
  }, 10000);
}

function processAutoGlyph(gainedLevel, rng) {
  let newGlyph;
  // Always generate a list of glyphs to avoid RNG diverging based on whether
  // a reality is done automatically.
  const glyphs = GlyphSelection.glyphList(GlyphSelection.choiceCount, gainedLevel, { rng });
  let keepGlyph;
  if (EffarigUnlock.glyphFilter.isUnlocked) {
    newGlyph = AutoGlyphProcessor.pick(glyphs);
    keepGlyph = AutoGlyphProcessor.wouldKeep(newGlyph);
  } else {
    // It really doesn't matter which we pick since they're random,
    // so we might as well take the first one.
    newGlyph = glyphs[0];
    keepGlyph = true;
  }
  if (keepGlyph && GameCache.glyphInventorySpace.value > 0) {
    Glyphs.addToInventory(newGlyph);
  } else {
    AutoGlyphProcessor.getRidOfGlyph(newGlyph);
  }
}

export function getRealityProps(isReset, alreadyGotGlyph = false) {
  const defaults = {
    glyphUndo: false,
    restoreCelestialState: false,
  };
  if (isReset) return Object.assign(defaults, {
    reset: true,
  });
  return Object.assign(defaults, {
    reset: false,
    gainedRM: MachineHandler.gainedRealityMachines,
    gainedGlyphLevel: gainedGlyphLevel(),
    gainedShards: Effarig.shardsGained,
    simulatedRealities: simulatedRealityCount(true),
    alreadyGotGlyph,
  });
}

export function autoReality() {
  if (GlyphSelection.active || !isRealityAvailable()) return;
  beginProcessReality(getRealityProps(false, false));
}

function updateRealityRecords(realityProps) {
  const thisRunRMmin = realityProps.gainedRM.dividedBy(Math.clampMin(0.0005, Time.thisRealityRealTime.totalMinutes));
  if (player.records.bestReality.RMmin.lt(thisRunRMmin)) {
    player.records.bestReality.RMmin = thisRunRMmin;
    player.records.bestReality.RMminSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
  if (player.records.bestReality.glyphLevel < realityProps.gainedGlyphLevel.actualLevel) {
    player.records.bestReality.glyphLevel = realityProps.gainedGlyphLevel.actualLevel;
    player.records.bestReality.glyphLevelSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
  player.records.bestReality.time = Math.min(player.records.thisReality.time, player.records.bestReality.time);
  if (player.records.thisReality.realTime < player.records.bestReality.realTime) {
    player.records.bestReality.realTime = player.records.thisReality.realTime;
    player.records.bestReality.speedSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
}

function giveRealityRewards(realityProps) {
  const multiplier = realityProps.simulatedRealities + 1;
  const realityAndPPMultiplier = multiplier + binomialDistribution(multiplier, Achievement(154).effectOrDefault(0));
  const gainedRM = Currency.realityMachines.gte(MachineHandler.hardcapRM) ? DC.D0 : realityProps.gainedRM;
  Currency.realityMachines.add(gainedRM.times(multiplier));
  updateRealityRecords(realityProps);
  addRealityTime(
    player.records.thisReality.time, player.records.thisReality.realTime, gainedRM,
    realityProps.gainedGlyphLevel.actualLevel, realityAndPPMultiplier, multiplier,
    MachineHandler.projectedIMCap);
  Currency.realities.add(realityAndPPMultiplier);
  Currency.perkPoints.add(realityAndPPMultiplier);
  if (TeresaUnlocks.effarig.canBeApplied) {
    Currency.relicShards.add(realityProps.gainedShards * multiplier);
  }
  if (multiplier > 1 && Enslaved.boostReality) {
    // Real time amplification is capped at 1 second of reality time; if it's faster then using all time at once would
    // be wasteful. Being faster than 1 second will only use as much time as needed to get the 1-second factor instead.
    if (Time.thisRealityRealTime.totalSeconds < 1) {
      player.celestials.enslaved.storedReal *= 1 - Time.thisRealityRealTime.totalSeconds;
    } else {
      player.celestials.enslaved.storedReal = 0;
    }
    Enslaved.boostReality = false;
  }

  if (Teresa.isRunning) {
    const current = Teresa.runRewardMultiplier;
    const newMultiplier = Teresa.rewardMultiplier(player.antimatter);
    const isHigher = newMultiplier > current;
    const modalText = `You have completed Teresa's Reality! ${isHigher
      ? `Since you gained more Antimatter, you increased your
      Glyph Sacrifice multiplier from ${format(current, 2, 2)} to ${format(newMultiplier, 2, 2)}`
      : `You did not gain more Antimatter during this run, so the Glyph Sacrifice multiplier
      from Teresa did not increase`}.`;
    Modal.message.show(modalText, {}, 2);
    if (Currency.antimatter.gt(player.celestials.teresa.bestRunAM)) {
      player.celestials.teresa.bestRunAM = Currency.antimatter.value;
      player.celestials.teresa.bestAMSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));

      // Encode iM values into the RM variable as e10000 * iM in order to only require one prop
      let machineRecord;
      if (Currency.imaginaryMachines.value === 0) machineRecord = player.reality.maxRM;
      else machineRecord = DC.E10000.times(Currency.imaginaryMachines.value);
      player.celestials.teresa.lastRepeatedMachines = player.celestials.teresa.lastRepeatedMachines
        .clampMin(machineRecord);
    }
    Teresa.quotes.completeReality.show();
  }

  if (Effarig.isRunning && !EffarigUnlock.reality.isUnlocked) {
    EffarigUnlock.reality.unlock();
    Effarig.quotes.completeReality.show();
  }

  if (Enslaved.isRunning) Enslaved.completeRun();

  if (V.isRunning) V.quotes.realityComplete.show();
}

// Due to simulated realities taking a long time in late game, this function might not immediately
// reality, but start an update loop that shows a progress bar.
export function beginProcessReality(realityProps) {
  if (realityProps.reset) {
    finishProcessReality(realityProps);
    return;
  }
  EventHub.dispatch(GAME_EVENT.REALITY_RESET_BEFORE);

  // Save a few important props before resetting all resources. We need to do this before processing glyphs so
  // that we don't try to reality again while async is running, but we need to retain RNG and level or else
  // glyphs will be generated with values based on post-reset values
  const glyphsToProcess = realityProps.simulatedRealities + (realityProps.alreadyGotGlyph ? 0 : 1);
  const rng = GlyphGenerator.getRNG(false);
  const glyphLevel = gainedGlyphLevel();
  finishProcessReality(realityProps);

  // If we have less than a certain amount of simulated realities, then we just shortcut the heavier async and
  // sampling code in order to just directly give all the glyphs. The later code is a fixed amount of overhead
  // which is large enough that quick realities can cause it to softlock the game due to lag on slower devices
  // Note: This is mostly a copy-paste of a code block in processManualReality() with slight modifications
  if (glyphsToProcess < 100) {
    for (let glyphNum = 0; glyphNum < glyphsToProcess; glyphNum++) {
      GlyphSelection.generate(GlyphSelection.choiceCount, glyphLevel);
      if (EffarigUnlock.glyphFilter.isUnlocked) {
        const glyphChoices = GlyphSelection.glyphList(GlyphSelection.choiceCount,
          realityProps.gainedGlyphLevel, { rng });
        const newGlyph = AutoGlyphProcessor.pick(glyphChoices);
        if (!AutoGlyphProcessor.wouldKeep(newGlyph) || GameCache.glyphInventorySpace.value === 0) {
          AutoGlyphProcessor.getRidOfGlyph(newGlyph);
        } else {
          Glyphs.addToInventory(newGlyph);
        }
      } else {
        GlyphSelection.select(Math.floor(Math.random() * GlyphSelection.choiceCount), false);
      }
    }
    Glyphs.processSortingAfterReality();
    return;
  }

  // We need these variables in this scope in order to modify the behavior of the Async loop while it's running
  const progress = {};
  let fastToggle = false;
  // There's a potential rabbit hole of making the sample ever more accurate to the situation of actually generating
  // all the glyphs, but here we make some compromises which are probably mostly accurate in most cases by considering
  // just the distribution of sacrifice values between types and nothing else beyond that
  const glyphSample = {
    toGenerate: 0,
    // We track each glyph type separately; there is the possibility for the glyph filter to be configured in such a
    // way that some types get significantly more or less sacrifice value than the others
    sampleStats: generatedTypes.map(t => ({
      type: t,
      count: 0,
      totalSacrifice: 0,
      // This is (variance * sample count), which is used to get standard deviation later on and makes the math nicer
      varProdSacrifice: 0,
    })),
    totalStats: {
      count: 0,
      totalSacrifice: 0,
      varProdSacrifice: 0,
    },
  };

  // Incrementally calculate mean and variance in a way that doesn't require storing a list of entries
  // See https://datagenetics.com/blog/november22017/index.html for derivation
  const addToStats = (stats, value) => {
    const oldMean = stats.totalSacrifice / stats.count;
    stats.totalSacrifice += value;
    stats.count++;
    const newMean = stats.totalSacrifice / stats.count;
    // Mathematically this is zero on the first iteration, but oldMean is NaN due to division by zero
    if (stats.count !== 1) stats.varProdSacrifice += (value - oldMean) * (value - newMean);
  };

  // Helper function for pulling a random sacrifice value from the sample we gathered
  const sampleFromStats = (stats, glyphsToGenerate) => {
    if (stats.count === 0) return 0;
    const mean = stats.totalSacrifice / stats.count;
    const stdev = Math.sqrt(stats.varProdSacrifice / stats.count);
    return normalDistribution(mean * glyphsToGenerate, stdev * Math.sqrt(glyphsToGenerate));
  };

  // The function we run in the Async loop is either the expected "generate and filter all glyphs normally"
  // behavior (fastToggle === false) or a function that takes a representative sample of 10000 glyphs and
  // analyzes them in order to extrapolate how much sacrifice value to give instead of actually generating
  // and giving any glyphs because the player asked for faster performance (fastToggle === true)
  const glyphFunction = () => {
    if (fastToggle) {
      // Generate glyph choices and subject the choices to the filter in order to choose a glyph for the sampling
      // process - we can't skip the filter even for the sampling because in most cases the filter will affect
      // the actual result (which is arguably the point of the filter)
      const glyphChoices = GlyphSelection.glyphList(GlyphSelection.choiceCount,
        realityProps.gainedGlyphLevel, { rng });
      const sampleGlyph = AutoGlyphProcessor.pick(glyphChoices);
      const sacGain = GlyphSacrificeHandler.glyphSacrificeGain(sampleGlyph);

      // Code and math later on is a lot simpler if we add to both a type-specific stat object and a total stats
      // object right here instead of attempting to combine the types into a total later on
      const thisTypeStats = glyphSample.sampleStats.find(s => s.type === sampleGlyph.type);
      addToStats(thisTypeStats, sacGain);
      addToStats(glyphSample.totalStats, sacGain);
    } else {
      processAutoGlyph(realityProps.gainedGlyphLevel, rng);
      // We'd normally run processSortingAfterReality() here, but also sorting after every glyph is extremely intensive
      // at this scale and largely useless if autoClean is getting run every time too
      if (VUnlocks.autoAutoClean.canBeApplied && player.reality.autoAutoClean) Glyphs.autoClean();
    }
  };
  const glyphsToSample = Math.min(glyphsToProcess, 10000);
  Async.run(glyphFunction,
    glyphsToProcess,
    {
      batchSize: 100,
      maxTime: 33,
      sleepTime: 1,
      asyncEntry: doneSoFar => {
        GameIntervals.stop();
        ui.$viewModel.modal.progressBar = {
          label: "Simulating Amplified Reality",
          info: () => `The game is currently calculating all the resources you would gain from repeating the
            Reality you just completed ${formatInt(glyphsToProcess)} more times. Pressing "Quick Glyphs" with
            more than ${formatInt(glyphsToSample)} Glyphs remaining will speed up the calculation by automatically
            sacrificing all the remaining Glyphs you would get. Pressing "Skip Glyphs" will ignore all resources
            related to Glyphs and stop the simulation after giving all other resources.
            ${Ra.unlocks.unlockGlyphAlchemy.canBeApplied ? `Pressing either button to speed up
            simulation will not update any resources within Glyph Alchemy.` : ""}`,
          progressName: "Realities",
          current: doneSoFar,
          max: glyphsToProcess,
          startTime: Date.now(),
          buttons: [{
            text: "Quick Glyphs",
            condition: (current, max) => max - current > glyphsToSample,
            click: () => {
              // This changes the simulating function to one that just takes a representative sample of 10000 random
              // glyphs to determine what sacrifice totals to give (this is defined above)
              fastToggle = true;
              glyphSample.toGenerate = progress.remaining;

              // We only simulate a smaller set of glyphs for a sample, but that still might take some time to do
              progress.maxIter -= progress.remaining - glyphsToSample;
              progress.remaining = glyphsToSample;
              // We update the progress bar max data (remaining will update automatically).
              ui.$viewModel.modal.progressBar.max = progress.maxIter;
            }
          },
          {
            text: "Skip Glyphs",
            condition: () => true,
            click: () => {
              // Shortcut to the end since we're ignoring all glyph-related resources
              progress.maxIter -= progress.remaining;
              progress.remaining = 0;
            }
          }]
        };
      },
      asyncProgress: doneSoFar => {
        ui.$viewModel.modal.progressBar.current = doneSoFar;
      },
      asyncExit: () => {
        ui.$viewModel.modal.progressBar = undefined;
        GameIntervals.start();
      },
      then: () => {
        // This is where we update sacrifice values if we ended up doing quick mode
        if (glyphSample.toGenerate > 0) {

          // Note: This is the only score mode we consider doing special behavior for because it's the only mode where
          // sacrificing a glyph can significantly affect future glyph choices. Alchemy is not a factor because
          // the in-game wording specifically disallows it.
          if (AutoGlyphProcessor.scoreMode === AUTO_GLYPH_SCORE.LOWEST_SACRIFICE) {
            // General behavior for repeated sacrifice with these settings is that all sacrifice values will increase
            // at an approximately equal rate because any type that falls behind will get prioritized by the filter.
            // We fake this behavior by attempting to fill the lower values until all are equal, and then filling all
            // types equally with whatever is left. We pull from the total stats here because this filter mode
            // effectively ignores types when assigning scores and picking glyphs
            let totalSac = sampleFromStats(glyphSample.totalStats, glyphSample.toGenerate);

            // Incrementing sacrifice totals without regard to glyph type and reassigning the final values in the same
            // ascending order as the starting order makes the code simpler to work with, so we do that
            const generatable = generatedTypes.filter(x => EffarigUnlock.reality.isUnlocked || x !== "effarig");
            const sacArray = generatable.map(x => player.reality.glyphs.sac[x]).sort((a, b) => a - b);
            const typeMap = [];
            for (const type of generatable) typeMap.push({ type, value: player.reality.glyphs.sac[type] });
            const sortedSacTotals = Object.values(typeMap).sort((a, b) => a.value - b.value);

            // Attempt to fill up all the lowest sacrifice totals up to the next highest, stopping early if there isn't
            // enough left to use for filling. The filling process causes the array to progress something like
            // [1,3,4,7,9] => [3,3,4,7,9] => [4,4,4,7,9] => ...
            for (let toFill = 0; toFill < sacArray.length - 1; toFill++) {
              // Calculate how much we need to fully fill
              let needed = 0;
              for (let filling = 0; filling <= toFill; filling++) needed += sacArray[toFill + 1] - sacArray[filling];

              // Fill up the lower indices, but only up to a maximum of what we have available
              const usedToFill = Math.clampMax(needed, totalSac);
              totalSac -= usedToFill;
              for (let filling = 0; filling <= toFill; filling++) sacArray[filling] += usedToFill / (toFill + 1);
              if (totalSac === 0) break;
            }
            // We have some left over, fill all of them equally
            for (let fill = 0; fill < sacArray.length; fill++) sacArray[fill] += totalSac / sacArray.length;

            // Assign the values in increasing order as specified by the original sacrifice totals
            for (let index = 0; index < sacArray.length; index++) {
              player.reality.glyphs.sac[sortedSacTotals[index].type] = sacArray[index];
            }
          } else {
            // Give sacrifice values proportionally according to what we found in the sampling stats
            for (const stats of glyphSample.sampleStats) {
              const toGenerate = glyphSample.toGenerate * stats.count / glyphsToSample;
              player.reality.glyphs.sac[stats.type] += sampleFromStats(stats, toGenerate);
            }
          }
        }
      },
      progress
    });
  Glyphs.processSortingAfterReality();
}

// eslint-disable-next-line complexity
export function finishProcessReality(realityProps) {
  const finalEP = Currency.eternityPoints.value.plus(gainedEternityPoints());
  if (player.records.bestReality.bestEP.lt(finalEP)) {
    player.records.bestReality.bestEP = new Decimal(finalEP);
    player.records.bestReality.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }

  const realityRealTime = player.records.thisReality.realTime;
  const isReset = realityProps.reset;
  if (!isReset) giveRealityRewards(realityProps);
  if (!realityProps.glyphUndo) {
    Glyphs.clearUndo();
    if (player.reality.respec) respecGlyphs();
    if (player.celestials.ra.disCharge) {
      disChargeAll();
    }
  }
  if (player.options.automatorEvents.clearOnReality) AutomatorData.clearEventLog();
  if (Player.automatorUnlocked && AutomatorBackend.state.forceRestart) {
    // Make sure to restart the current script instead of using the editor script - the editor script might
    // not be a valid script to run; this at best stops it from running and at worst causes a crash
    AutomatorBackend.start(AutomatorBackend.state.topLevelScript);
  }

  const celestialRunState = clearCelestialRuns();
  recalculateAllGlyphs();
  Glyphs.updateMaxGlyphCount(true);

  player.sacrificed = DC.D0;

  lockAchievementsOnReality();

  // Because initializeChallengeCompletions has some code that completes normal challenges with 2 eternities,
  // and we haven't reset eternities yet (and I'm nervous about changing the order of this code),
  // add a flag to indicate that this is a reality reset.
  initializeChallengeCompletions(true);

  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.records.bestInfinity.time = 999999999999;
  player.records.bestInfinity.realTime = 999999999999;
  player.records.thisInfinity.time = 0;
  player.records.thisInfinity.lastBuyTime = 0;
  player.records.thisInfinity.realTime = 0;
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  Replicanti.reset(true);

  Currency.eternityPoints.reset();

  // This has to be reset before Currency.eternities to make the bumpLimit logic work correctly
  EternityUpgrade.epMult.reset();
  if (!PelleUpgrade.eternitiesNoReset.canBeApplied) Currency.eternities.reset();
  player.records.thisEternity.time = 0;
  player.records.thisEternity.realTime = 0;
  player.records.bestEternity.time = 999999999999;
  player.records.bestEternity.realTime = 999999999999;
  if (!PelleUpgrade.keepEternityUpgrades.canBeApplied) player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  if (!PelleUpgrade.keepEternityChallenges.canBeApplied) player.eternityChalls = {};
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = 0;
  player.challenge.eternity.current = 0;
  if (!PelleUpgrade.timeStudiesNoReset.canBeApplied) player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  if (realityProps.glyphUndo) {
    player.requirementChecks.reality.maxGlyphs =
      Math.max(Glyphs.bestUndoGlyphCount, player.requirementChecks.reality.maxGlyphs);
  } else {
    Player.resetRequirements("reality");
  }
  player.records.thisReality.time = 0;
  player.records.thisReality.realTime = 0;
  player.records.thisReality.maxReplicanti = DC.D0;
  if (!PelleUpgrade.timeStudiesNoReset.canBeApplied) Currency.timeTheorems.reset();
  player.celestials.v.STSpent = 0;
  if (!PelleUpgrade.timeStudiesNoReset.canBeApplied) {
    player.dilation.studies = [];
    player.dilation.active = false;
  }
  if (!PelleUpgrade.dilationUpgradesNoReset.canBeApplied) {
    player.dilation.upgrades.clear();
    player.dilation.rebuyables = {
      1: 0,
      2: 0,
      3: 0,
      11: 0,
      12: 0,
      13: 0
    };
  }
  if (!PelleUpgrade.tachyonParticlesNoReset.canBeApplied) {
    Currency.tachyonParticles.reset();
  }
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  Currency.dilatedTime.reset();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisReality.maxDT = DC.D0;
  player.dilation.lastEP = DC.DM1;
  Currency.antimatter.reset();
  Enslaved.autoReleaseTick = 0;
  player.celestials.enslaved.hasSecretStudy = false;
  player.celestials.laitela.entropy = 0;

  playerInfinityUpgradesOnReset();
  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  secondSoftReset(false);
  player.celestials.ra.peakGamespeed = 1;

  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.bestEPminReality = DC.D0;
  player.records.thisReality.bestEternitiesPerMs = DC.D0;
  player.records.thisReality.bestRSmin = 0;
  player.records.thisReality.bestRSminVal = 0;
  resetTimeDimensions();
  resetTickspeed();
  AchievementTimers.marathon2.reset();
  Currency.infinityPoints.reset();

  if (RealityUpgrade(10).isBought) applyRUPG10();
  else Tab.dimensions.antimatter.show();

  Lazy.invalidateAll();
  ECTimeStudyState.invalidateCachedRequirements();
  EventHub.dispatch(GAME_EVENT.REALITY_RESET_AFTER);

  if (TeresaUnlocks.startEU.canBeApplied) {
    for (const id of [1, 2, 3, 4, 5, 6]) player.eternityUpgrades.add(id);
  } else if (RealityUpgrade(14).isBought) {
    // Eternal flow will always give eternities after the first tick,
    // better to try apply EU1 immediately once at the start rather than on every tick
    applyEU1();
  }

  if (!isReset) Ra.applyAlchemyReactions(realityRealTime);

  player.reality.gainedAutoAchievements = false;
  player.reality.hasCheckedFilter = false;

  if (realityProps.restoreCelestialState || player.options.retryCelestial) restoreCelestialRuns(celestialRunState);

  if (Pelle.isDoomed && PelleUpgrade.keepAutobuyers.canBeApplied && Autobuyer.bigCrunch.hasMaxedInterval) {
    player.break = true;
  }
}

function restoreCelestialRuns(celestialRunState) {
  player.celestials.teresa.run = celestialRunState.teresa;
  if (player.celestials.teresa.run) Teresa.initializeRun();
  player.celestials.effarig.run = celestialRunState.effarig;
  if (player.celestials.effarig.run) Effarig.initializeRun();
  player.celestials.enslaved.run = celestialRunState.enslaved;
  if (player.celestials.enslaved.run) Enslaved.initializeRun();
  player.celestials.v.run = celestialRunState.v;
  if (player.celestials.v.run) V.initializeRun();
  player.celestials.ra.run = celestialRunState.ra;
  if (player.celestials.ra.run) Ra.initializeRun();
  player.celestials.laitela.run = celestialRunState.laitela;
  if (player.celestials.laitela.run) Laitela.initializeRun();
}

// This is also called when the upgrade is purchased, be aware of potentially having "default" values overwrite values
// which might otherwise be higher. Most explicit values here are the values of upgrades at their caps.
export function applyRUPG10() {
  NormalChallenges.completeAll();
  if (PelleUpgrade.replicantiStayUnlocked.canBeApplied) {
    Replicanti.amount = Replicanti.amount.clampMin(1);
    Replicanti.unlock(true);
  }
  if (Pelle.isDisabled("rupg10")) return;

  player.auto.antimatterDims.all = player.auto.antimatterDims.all.map(current => ({
    isUnlocked: true,
    // These costs are approximately right; if bought manually all dimensions are slightly different from one another
    cost: 1e14,
    interval: 100,
    bulk: 1e10,
    mode: current.mode,
    priority: current.priority,
    isActive: current.isActive,
    lastTick: player.records.realTimePlayed
  }));

  for (const autobuyer of Autobuyers.all) {
    if (autobuyer.data.interval !== undefined) autobuyer.data.interval = 100;
  }

  player.dimensionBoosts = Math.max(4, player.dimensionBoosts);
  player.galaxies = Math.max(1, player.galaxies);
  player.break = true;
  Currency.eternities.bumpTo(100);
  Replicanti.amount = Replicanti.amount.clampMin(1);
  Replicanti.unlock(true);

  applyEU1();
}

export function clearCelestialRuns() {
  const saved = {
    teresa: player.celestials.teresa.run,
    effarig: player.celestials.effarig.run,
    enslaved: player.celestials.enslaved.run,
    v: player.celestials.v.run,
    ra: player.celestials.ra.run,
    laitela: player.celestials.laitela.run,
  };
  player.celestials.teresa.run = false;
  player.celestials.effarig.run = false;
  // Nameless forces all tabs to be visible, but exiting via the header might leave the player on a tab which is
  // otherwise normally hidden - in that case we force them to the Nameless tab. We could scan for the lowest-index tab
  // and subtab, but all other things being equal the Nameless tab makes the most sense. The run flag is toggled
  // *before* the check because otherwise isHidden will always evaluate to false due to still being in Nameless.
  if (Enslaved.isRunning) {
    player.celestials.enslaved.run = false;
    if (Tabs.current.isHidden || Tabs.current._currentSubtab.isHidden) Tab.celestials.enslaved.show();
    // We specifically revalidate here and nowhere else because Nameless changes the unlock state of the BLACK HOLE
    // command, which changes the validity of existing scripts when entering/exiting
    AutomatorData.recalculateErrors();
  }
  player.celestials.v.run = false;
  player.celestials.ra.run = false;
  player.celestials.laitela.run = false;
  return saved;
}

export function isInCelestialReality() {
  return Object.values(player.celestials).some(x => x.run);
}

function lockAchievementsOnReality() {
  if (Perk.achievementGroup5.isBought) return;
  for (const achievement of Achievements.preReality) {
    achievement.lock();
  }
  player.reality.achTimer = 0;
}
