"use strict";

/**
 * Object that manages the selection of glyphs offered to the player
 */
const GlyphSelection = {
  glyphs: [],
  realityProps: undefined,
  active: false,

  get choiceCount() {
    return Effects.max(1, Perk.firstPerk) *
      (Ra.has(RA_UNLOCKS.EXTRA_CHOICES_AND_RELIC_SHARD_RARITY_ALWAYS_MAX) ? 2 : 1);
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
    for (let out = 0; out < count; ++out) {
      types.push(GlyphGenerator.randomType(rng, types));
    }
    for (let out = 0; out < count; ++out) {
      glyphList.push(GlyphGenerator.randomGlyph(level, rng, types[out]));
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

  generate(count, realityProps) {
    EventHub.dispatch(GAME_EVENT.GLYPH_CHOICES_GENERATED);
    this.realityProps = realityProps;
    this.glyphs = this.glyphList(count, realityProps.gainedGlyphLevel, { isChoosingGlyph: true });
  },

  update(level) {
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

  select(glyph, sacrifice) {
    if (sacrifice) {
      GlyphSacrificeHandler.removeGlyph(glyph, true);
    } else {
      Glyphs.addToInventory(glyph);
    }
    this.glyphs = [];
    this.realityProps = undefined;
  }
};

function isRealityAvailable() {
  return player.eternityPoints.gte("1e4000") && TimeStudy.reality.isBought;
}

// Returns the number of "extra" realities from stored real time or Multiversal effects, should be called
// with false for checking and true for actual usage, and only "used" once per reality.
function simulatedRealityCount(advancePartSimCounters) {
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
function requestManualReality() {
  if (GlyphSelection.active || !isRealityAvailable()) {
    return;
  }
  if (Glyphs.freeInventorySpace === 0) {
    Modal.message.show("Inventory cannot hold new glyphs. Delete/sacrifice (shift-click) some glyphs.");
    return;
  }
  const realityProps = getRealityProps(false, false);
  if (simulatedRealityCount(false) > 0) {
    triggerManualReality(realityProps);
    Glyphs.processSortingAfterReality();
    return;
  }
  realityProps.alreadyGotGlyph = true;
  if (GlyphSelection.choiceCount === 1) {
    if (player.realities === 0) {
      Glyphs.addToInventory(GlyphGenerator.startingGlyph(realityProps.gainedGlyphLevel));
      Glyphs.addToInventory(GlyphGenerator.companionGlyph(player.eternityPoints));
    } else {
      // We can't get a random glyph directly here because that disturbs the RNG
      // (makes it depend on whether you got first perk or not).
      Glyphs.addToInventory(GlyphSelection.glyphList(1, realityProps.gainedGlyphLevel, { isChoosingGlyph: true })[0]);
    }
    triggerManualReality(realityProps);
    return;
  }
  GlyphSelection.generate(GlyphSelection.choiceCount, realityProps);
}

function triggerManualReality(realityProps) {
  if (player.options.animations.reality) {
    runRealityAnimation();
    setTimeout(beginProcessReality, 3000, realityProps);
  } else {
    beginProcessReality(realityProps);
  }
}

function runRealityAnimation() {
  document.getElementById("ui").style.userSelect = "none";
  document.getElementById("ui").style.animation = "realize 10s 1";
  document.getElementById("realityanimbg").style.animation = "realizebg 10s 1";
  document.getElementById("realityanimbg").style.display = "block";
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
  if (EffarigUnlock.glyphFilter.isUnlocked) {
    newGlyph = AutoGlyphProcessor.pick(glyphs);
    if (!AutoGlyphProcessor.wouldKeep(newGlyph) || Glyphs.freeInventorySpace === 0) {
      AutoGlyphProcessor.getRidOfGlyph(newGlyph);
      newGlyph = null;
    }
  } else {
    // It really doesn't matter which we pick since they're random,
    // so we might as well take the first one.
    newGlyph = glyphs[0];
  }
  if (newGlyph && Glyphs.freeInventorySpace > 0) {
    Glyphs.addToInventory(newGlyph);
  }
}

function getRealityProps(isReset, alreadyGotGlyph = false) {
  const defaults = {
    glyphUndo: false,
    restoreCelestialState: false,
  };
  if (isReset) return Object.assign(defaults, {
    reset: true,
  });
  return Object.assign(defaults, {
    reset: false,
    gainedRM: gainedRealityMachines(),
    gainedGlyphLevel: gainedGlyphLevel(),
    gainedShards: Effarig.shardsGained,
    simulatedRealities: simulatedRealityCount(true),
    alreadyGotGlyph,
  });
}

function autoReality() {
  if (GlyphSelection.active || !isRealityAvailable()) return;
  beginProcessReality(getRealityProps(false, false));
  Glyphs.processSortingAfterReality();
}

function updateRealityRecords(realityProps) {
  const thisRunRMmin = realityProps.gainedRM.dividedBy(Time.thisRealityRealTime.totalMinutes);
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
  const gainedRM = realityProps.gainedRM;
  player.reality.realityMachines = player.reality.realityMachines.plus(gainedRM.times(multiplier));
  updateRealityRecords(realityProps);
  addRealityTime(
    player.records.thisReality.time, player.records.thisReality.realTime, gainedRM,
    realityProps.gainedGlyphLevel.actualLevel, realityAndPPMultiplier);
  player.realities += realityAndPPMultiplier;
  player.reality.perkPoints += realityAndPPMultiplier;
  if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) {
    Effarig.shardAmount += realityProps.gainedShards * multiplier;
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
    if (Currency.antimatter.gt(player.celestials.teresa.bestRunAM)) {
      player.celestials.teresa.bestRunAM = Currency.antimatter.value;
      player.celestials.teresa.bestAMSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
      player.celestials.teresa.lastRepeatedRM = player.celestials.teresa.lastRepeatedRM
        .clampMin(player.reality.realityMachines);
    }
    Teresa.quotes.show(Teresa.quotes.COMPLETE_REALITY);
  }

  if (Effarig.isRunning && !EffarigUnlock.reality.isUnlocked) {
    EffarigUnlock.reality.unlock();
    Effarig.quotes.show(Effarig.quotes.COMPLETE_REALITY);
  }

  if (Enslaved.isRunning) Enslaved.completeRun();
}

// Due to simulated realities taking a long time in late game, this function might not immediately
// reality, but start an update loop that shows a progress bar.
function beginProcessReality(realityProps) {
  if (realityProps.reset) {
    finishProcessReality(realityProps);
    return;
  }
  EventHub.dispatch(GAME_EVENT.REALITY_RESET_BEFORE);
  const glyphsToProcess = realityProps.simulatedRealities + (realityProps.alreadyGotGlyph ? 0 : 1);
  const rng = GlyphGenerator.getRNG(false);
  // Do this before processing glyphs so that we don't try to reality again while async is running.
  finishProcessReality(realityProps);
  Async.run(() => processAutoGlyph(realityProps.gainedGlyphLevel, rng),
    glyphsToProcess,
    {
      batchSize: 100,
      maxTime: 33,
      sleepTime: 1,
      asyncEntry: doneSoFar => {
        GameIntervals.stop();
        ui.$viewModel.modal.progressBar = {
          label: "Processing new glyphs...",
          current: doneSoFar,
          max: glyphsToProcess,
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
        rng.finalize();
      }
    });
}

function finishProcessReality(realityProps) {
  const finalEP = player.eternityPoints.plus(gainedEternityPoints());
  if (player.records.bestReality.bestEP.lt(finalEP)) {
    player.records.bestReality.bestEP = new Decimal(finalEP);
    player.records.bestReality.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }

  const isReset = realityProps.reset;
  if (!isReset) giveRealityRewards(realityProps);
  if (!realityProps.glyphUndo) {
    Glyphs.clearUndo();
    if (player.reality.respec) respecGlyphs();
    if (player.celestials.ra.disCharge) disChargeAll();
  }

  const celestialRunState = clearCelestialRuns();
  recalculateAllGlyphs();
  Glyphs.updateGlyphCountForV(true);

  player.sacrificed = new Decimal(0);

  lockAchievementsOnReality();

  // Because initializeChallengeCompletions has some code that completes normal challenges with 2 eternities,
  // and we haven't reset eternities yet (and I'm nervous about changing the order of this code),
  // add a flag to indicate that this is a reality reset.
  initializeChallengeCompletions(true);

  player.infinityUpgrades.clear();
  player.infinitied = new Decimal(0);
  player.infinitiedBank = new Decimal(0);
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
  player.infMult = new Decimal(1);
  player.infMultCost = new Decimal(10);
  player.infinityRebuyables = [0, 0, 0];
  player.infinityPower = new Decimal(1);
  player.timeShards = new Decimal(0);
  Replicanti.reset(true);

  player.eternityPoints = Player.startingEP;

  // This has to be reset before player.eternities to make the bumpLimit logic work correctly
  EternityUpgrade.epMult.reset();
  player.eternities = new Decimal(0);
  player.records.thisEternity.time = 0;
  player.records.thisEternity.realTime = 0;
  player.records.bestEternity.time = 999999999999;
  player.records.bestEternity.realTime = 999999999999;
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.eternityChalls = {};
  player.reality.lastAutoEC = 0;
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.etercreq = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.achievementChecks.noSacrifices = true;
  player.achievementChecks.onlyEighthDimensions = true;
  player.achievementChecks.onlyFirstDimensions = true;
  player.achievementChecks.noEighthDimensions = true;
  player.achievementChecks.noFirstDimensions = true;
  player.achievementChecks.noAntimatterProduced = true;
  player.achievementChecks.noTriadStudies = true;
  player.achievementChecks.noTheoremPurchases = true;
  player.achievementChecks.noInfinitiesThisReality = true;
  player.achievementChecks.noEternitiesThisReality = true;
  player.achievementChecks.noReplicantiGalaxies = true;
  player.records.thisReality.time = 0;
  player.records.thisReality.realTime = 0;
  player.timestudy.theorem = new Decimal(0);
  player.timestudy.amcost = new Decimal("1e20000");
  player.timestudy.ipcost = new Decimal(1);
  player.timestudy.epcost = new Decimal(1);
  player.timestudy.studies = [];
  player.celestials.v.triadStudies = [];
  player.celestials.v.STSpent = 0;
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.tachyonParticles = new Decimal(0);
  player.dilation.dilatedTime = new Decimal(0);
  player.dilation.nextThreshold = new Decimal(1000);
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0
  };
  player.records.thisInfinity.maxAM = new Decimal(0);
  player.records.thisEternity.maxAM = new Decimal(0);
  player.dilation.lastEP = new Decimal(-1);
  Currency.antimatter.reset();
  Enslaved.autoReleaseTick = 0;
  player.celestials.laitela.entropy = 0;

  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  secondSoftReset();
  player.celestials.ra.peakGamespeed = 1;

  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = new Decimal(0);
  player.records.bestInfinity.bestIPminEternity = new Decimal(0);
  player.records.thisEternity.bestEPmin = new Decimal(0);
  player.records.thisEternity.bestInfinitiesPerMs = new Decimal(0);
  player.records.thisEternity.bestIPMsWithoutMaxAll = new Decimal(0);
  player.records.bestEternity.bestEPminReality = new Decimal(0);
  player.records.thisReality.bestEternitiesPerMs = new Decimal(0);
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnEternity();
  AchievementTimers.marathon2.reset();
  player.infinityPoints = Player.startingIP;

  if (RealityUpgrade(10).isBought) applyRUPG10();
  else Tab.dimensions.antimatter.show();

  Lazy.invalidateAll();
  EventHub.dispatch(GAME_EVENT.REALITY_RESET_AFTER);

  // This immediately gives eternity upgrades instead of after the first eternity
  if (RealityUpgrades.allBought) applyRealityUpgradesAfterEternity();

  if (!isReset) Ra.applyAlchemyReactions();

  player.reality.gainedAutoAchievements = false;

  if (realityProps.restoreCelestialState || player.options.retryCelestial) restoreCelestialRuns(celestialRunState);
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
function applyRUPG10() {
  NormalChallenges.completeAll();

  player.auto.antimatterDims = player.auto.antimatterDims.map(current => ({
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
  player.infinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
    "skipReset1", "skipReset2", "unspentBonus",
    "27Mult", "18Mult", "36Mult", "resetMult",
    "skipReset3", "passiveGen", "45Mult",
    "resetBoost", "galaxyBoost", "skipResetGalaxy",
    "totalMult", "currentMult", "postGalaxy",
    "challengeMult", "achievementMult", "infinitiedMult",
    "infinitiedGeneration", "autoBuyerUpgrade", "bulkBoost",
    "ipOffline"]
  );
  player.dimensionBoosts = Math.max(4, player.dimensionBoosts);
  player.galaxies = Math.max(1, player.galaxies);
  player.break = true;
  player.infinityRebuyables = [8, 7, 10];
  player.eternities = player.eternities.clampMin(100);
  player.replicanti.amount = player.replicanti.amount.clampMin(1);
  Replicanti.unlock(true);
  GameCache.tickSpeedMultDecrease.invalidate();
  GameCache.dimensionMultDecrease.invalidate();
}

function clearCelestialRuns() {
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
  player.celestials.enslaved.run = false;
  player.celestials.v.run = false;
  player.celestials.ra.run = false;
  player.celestials.laitela.run = false;
  return saved;
}

function isInCelestialReality() {
  return player.celestials.teresa.run ||
    player.celestials.effarig.run ||
    player.celestials.enslaved.run ||
    player.celestials.v.run ||
    player.celestials.ra.run ||
    player.celestials.laitela.run;
}

function resetReality() {
  if (confirm("This will put you at the start of your Reality and reset your progress in this Reality, " +
    "giving you no rewards from your progress in your current Reality.  Are you sure you want to do this?")) {
    beginProcessReality(getRealityProps(true));
    return true;
  }
  return false;
}

function lockAchievementsOnReality() {
  if (Perk.achievementGroup6.isBought) return;
  for (const achievement of Achievements.preReality) {
    achievement.lock();
  }
  player.reality.achTimer = 0;
}
