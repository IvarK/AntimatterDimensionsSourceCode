"use strict";

/**
 * Object that manages the selection of glyphs offered to the player
 */
const GlyphSelection = {
  glyphs: [],
  realityProps: undefined,

  get active() {
    return ui.view.modal.glyphSelection;
  },

  get choiceCount() {
    const baseChoices = Effects.max(
      1,
      Perk.glyphChoice4,
      Perk.glyphChoice3
    );
    const raChoices = Ra.has(RA_UNLOCKS.IMPROVED_GLYPHS)
      ? RA_UNLOCKS.IMPROVED_GLYPHS.effect.choice()
      : 0;
    return baseChoices + raChoices;
  },

  /**
   * Checks that a given glyph is sufficiently different from the current selection.
   *
   * If the list doesn't already contain a glyph of the specified type, it is automatically
   * considered unique.  If not, it then checks the effects of glyphs that have the same type.
   * It calculates a pairwise uniqueness score to each glyph it checks and only adds the new
   * glyph if the score exceeds the specified threshold for every glyph already in the list.
   * This uniqueness score is equal to the number of effects that exactly one of the glyphs has.
   */
  checkUniqueGlyph(glyphToCheck) {
    const uniquenessThreshold = 3;
    const checkEffects = glyphToCheck.effects;
    for (const currGlyph of this.glyphs) {
      const currEffects = currGlyph.effects;
      // eslint-disable-next-line no-bitwise
      const union = checkEffects | currEffects;
      // eslint-disable-next-line no-bitwise
      const intersection = checkEffects & currEffects;
      if (countEffectsFromBitmask(union - intersection) < uniquenessThreshold) return false;
    }
    return true;
  },

  generate(count, realityProps) {
    this.glyphs = [];
    this.realityProps = realityProps;
    const level = realityProps.gainedGlyphLevel;
    for (let out = 0; out < count; ++out) {
      let glyph;
      // Attempt to generate a unique glyph, but give up after 100 tries so the game doesn't
      // get stuck in an infinite loop if we decide to increase the number of glyph choices
      // for some reason and forget about the uniqueness check
      for (let tries = 0; tries < 100; ++tries) {
        glyph = GlyphGenerator.randomGlyph(level, false);
        if (this.checkUniqueGlyph(glyph)) break;
      }
      this.glyphs.push(glyph);
    }
    ui.view.modal.glyphSelection = true;
    if (!Perk.glyphUncommonGuarantee.isBought) return;
    // If no choices are rare enough and the player has the uncommon glyph perk, randomly generate
    // rarities until the threshold is passed and then assign that rarity to a random glyph
    const strengthThreshold = 1.5;
    if (this.glyphs.some(e => e.strength >= strengthThreshold)) return;
    let newStrength;
    do {
      newStrength = GlyphGenerator.randomStrength(false);
    } while (newStrength < strengthThreshold);
    this.glyphs.randomElement().strength = newStrength;
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

  select(index) {
    ui.view.modal.glyphSelection = false;
    Glyphs.addToInventory(this.glyphs[index]);
    this.glyphs = [];
    triggerManualReality(this.realityProps);
    this.realityProps = undefined;
  }
};

function confirmReality() {
  return !player.options.confirmations.reality ||
    confirm("Reality will reset everything except challenge records. Your achievements are also reset, " +
      "but you will automatically get one back every 30 minutes. " +
      "You will also gain reality machines based on your EP, a glyph with a power level " +
      "based on your EP, Replicanti, and Dilated Time, a perk point to spend on quality of " +
      "life upgrades, and unlock various upgrades.");
}

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
  if (GlyphSelection.active || !isRealityAvailable() || !confirmReality()) {
    return;
  }
  if (!Player.hasFreeInventorySpace) {
    alert("Inventory is full. Delete/sacrifice (shift-click) some glyphs.");
    return;
  }
  const realityProps = getRealityProps(false, false);
  if (simulatedRealityCount(false) > 0) {
    triggerManualReality(realityProps);
    return;
  }
  realityProps.alreadyGotGlyph = true;
  if (GlyphSelection.choiceCount === 1) {
    const newGlyph = player.realities === 0
      ? GlyphGenerator.startingGlyph(level)
      : GlyphGenerator.randomGlyph(level);
    Glyphs.addToInventory(newGlyph);
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

function processAutoGlyph(gainedLevel) {
  let newGlyph;
  if (EffarigUnlock.autopicker.isUnlocked) {
    const glyphs = Array.range(0, GlyphSelection.choiceCount)
      .map(() => GlyphGenerator.randomGlyph(gainedLevel));
    newGlyph = AutoGlyphPicker.pick(glyphs);
  } else {
    newGlyph = GlyphGenerator.randomGlyph(gainedLevel, false);
  }
  if (EffarigUnlock.autosacrifice.isUnlocked) {
    if (AutoGlyphSacrifice.wouldSacrifice(newGlyph) || !Player.hasFreeInventorySpace) {
      sacrificeGlyph(newGlyph, true);
      newGlyph = null;
    }
  }
  if (newGlyph && Player.hasFreeInventorySpace) {
    Glyphs.addToInventory(newGlyph);
  }
}

function getRealityProps(isReset, alreadyGotGlyph = false) {
  if (isReset) return {
    reset: true,
  };
  return {
    reset: false,
    gainedRM: gainedRealityMachines(),
    gainedGlyphLevel: gainedGlyphLevel(),
    gainedShards: Effarig.shardsGained,
    simulatedRealities: simulatedRealityCount(true),
    alreadyGotGlyph,
  };
}

function autoReality() {
  if (GlyphSelection.active || !isRealityAvailable()) return;
  beginProcessReality(getRealityProps(false, false));
}

function giveRealityRewards(realityProps) {
  const multiplier = realityProps.simulatedRealities + 1;
  const gainedRM = realityProps.gainedRM;
  player.bestReality = Math.min(player.bestReality, player.thisReality);
  player.reality.realityMachines = player.reality.realityMachines.plus(gainedRM.times(multiplier));
  player.bestRMmin = player.bestRMmin.max(gainedRM.dividedBy(Time.thisRealityRealTime.totalMinutes));
  addRealityTime(player.thisReality, player.thisRealityRealTime, gainedRM, realityProps.gainedGlyphLevel.actualLevel);
  player.realities += multiplier;
  player.reality.pp += multiplier;
  if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) {
    player.celestials.effarig.relicShards += realityProps.gainedShards * multiplier;
  }
  if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])) {
    Ra.giveExp(multiplier);
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
    player.celestials.teresa.bestRunAM = Decimal.max(player.celestials.teresa.bestRunAM, player.antimatter);
  }

  if (Effarig.isRunning && !EffarigUnlock.reality.isUnlocked) {
    EffarigUnlock.reality.unlock();
  }

  if (Enslaved.isRunning) Enslaved.completeRun();

  if (Ra.isRunning) Ra.updateExpBoosts();

  if (Laitela.isRunning) {
    player.celestials.laitela.maxAmGained = Decimal.max(player.celestials.laitela.maxAmGained, player.antimatter);
  }
}

// Due to simulated realities taking a long time in late game, this function might not immediately
// reality, but start an update loop that shows a progress bar.
function beginProcessReality(realityProps) {
  if (realityProps.reset) {
    finishProcessReality(realityProps);
    return;
  }
  EventHub.dispatch(GameEvent.REALITY_RESET_BEFORE);
  const glyphsToProcess = realityProps.simulatedRealities + (realityProps.alreadyGotGlyph ? 0 : 1);
  Async.run(() => processAutoGlyph(realityProps.gainedGlyphLevel),
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
      }
    }).then(() => {
      finishProcessReality(realityProps);
    });
}

function finishProcessReality(realityProps) {
  const isReset = realityProps.reset;
  if (!isReset) giveRealityRewards(realityProps);

  if (player.reality.respec) {
    respecGlyphs();
  }
  clearCelestialRuns();
  recalculateAllGlyphs()

  //reset global values to avoid a tick of unupdated production

  player.sacrificed = new Decimal(0);

  lockAchievementsOnReality();

  NormalChallenges.clearCompletions();
  InfinityChallenges.clearCompletions();
  const isRUPG10Bought = RealityUpgrade(10).isBought;
  if (isRUPG10Bought) NormalChallenges.completeAll();

  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
  if (!isRUPG10Bought) player.infinityUpgrades.clear();
  player.infinitied = new Decimal(0);
  player.infinitiedBank = new Decimal(0);
  player.bestInfinityTime = 999999999999;
  player.thisInfinityTime = 0;
  player.thisInfinityLastBuyTime = 0;
  player.thisInfinityRealTime = 0;
  player.dimensionBoosts = isRUPG10Bought ? 4 : 0;
  player.galaxies = isRUPG10Bought ? 1 : 0;
  player.interval = null;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = isRUPG10Bought ? player.break : false;
  player.infMult = new Decimal(1);
  player.infMultCost = new Decimal(10);
  if (!isRUPG10Bought) {
    player.infinityRebuyables = [0, 0];
  }
  player.postChallUnlocked = 0;
  player.infinityPower = new Decimal(1);
  player.infDimBuyers = isRUPG10Bought ? player.infDimBuyers : [false, false, false, false, false, false, false, false];
  player.timeShards = new Decimal(0);
  player.tickThreshold = new Decimal(1);

  player.eternityPoints = Effects.max(
    0,
    Perk.startEP1,
    Perk.startEP2,
    Perk.startEP3
  ).toDecimal();

  // This has to be reset before player.eternities to make the bumpLimit logic work
  // correctly
  EternityUpgrade.epMult.reset();
  player.eternities = new Decimal(0);
  player.thisEternity = 0;
  player.thisEternityRealTime = 0;
  player.bestEternity = 999999999999;
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.offlineProd = isRUPG10Bought ? player.offlineProd : 0;
  player.offlineProdCost = isRUPG10Bought ? player.offlineProdCost : 1e7;
  player.eternityChalls = {};
  player.reality.lastAutoEC = 0;
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.etercreq = 0;
  player.infMultBuyer = isRUPG10Bought ? player.infMultBuyer : false;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.noSacrifices = true;
  player.onlyEighthDimensons = true;
  player.onlyFirstDimensions = true;
  player.noEighthDimensions = true;
  player.noTheoremPurchases = true;
  player.thisReality = 0;
  player.thisRealityRealTime = 0;
  player.timestudy.theorem = new Decimal(0);
  player.timestudy.amcost = new Decimal("1e20000");
  player.timestudy.ipcost = new Decimal(1);
  player.timestudy.epcost = new Decimal(1);
  player.timestudy.studies = [];
  player.celestials.v.additionalStudies = 0;
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.tachyonParticles = new Decimal(0);
  player.dilation.dilatedTime = new Decimal(0);
  player.dilation.nextThreshold = new Decimal(1000);
  player.dilation.baseFreeGalaxies = 0;
  player.dilation.freeGalaxies = 0;
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0
  };
  player.antimatter = Effects.max(
    10,
    Perk.startAM1,
    Perk.startAM2
  ).toDecimal();
  Enslaved.autoReleaseTick = 0;
  player.celestials.ra.compression.freeDimboosts = 0;

  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetReplicanti();
  resetChallengeStuff();
  NormalDimensions.reset();
  secondSoftReset();
  if (player.celestials.ra.disCharge) disChargeAll();
  if (player.celestials.ra.compression.respec) CompressionUpgrades.respec();
  player.celestials.ra.peakGamespeed = 1;
  if (isRUPG10Bought) {
    player.eternities = new Decimal(100);
  }
  initializeChallengeCompletions();

  if (player.infinitied.gt(0) && !NormalChallenge(1).isCompleted) {
    NormalChallenge(1).complete();
  }
  player.reality.upgReqChecks = [true];
  InfinityDimensions.resetAmount();
  player.bestIPminThisInfinity = new Decimal(0);
  player.bestIPminThisEternity = new Decimal(0);
  player.bestEPminThisEternity = new Decimal(0);
  player.bestEPminThisReality = new Decimal(0);
  player.bestInfinitiesPerMs = new Decimal(0);
  player.bestEternitiesPerMs = new Decimal(0);
  player.bestIpPerMsWithoutMaxAll = new Decimal(0);
  resetTimeDimensions();
  // FIXME: Eternity count is now a Decimal so this needs to be addressed
  // kong.submitStats('Eternities', player.eternities);
  if (!EternityMilestone.autobuyerReplicantiGalaxy.isReached && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
  resetTickspeed();
  playerInfinityUpgradesOnEternity();
  if (player.eternities.lte(1)) {
    Tab.dimensions.normal.show();
  }
  AchievementTimers.marathon2.reset();
  resetInfinityPoints();

  function resetReplicanti() {
    player.replicanti.amount = isRUPG10Bought ? new Decimal(1) : new Decimal(0);
    player.replicanti.unl = isRUPG10Bought;
    player.replicanti.chance = 0.01;
    player.replicanti.chanceCost = new Decimal(1e150);
    player.replicanti.interval = 1000;
    player.replicanti.intervalCost = new Decimal(1e140);
    player.replicanti.gal = 0;
    player.replicanti.galaxies = 0;
    player.replicanti.galCost = new Decimal(1e170);
    player.replicanti.galaxybuyer = isRUPG10Bought ? player.replicanti.galaxybuyer : undefined;
    player.replicanti.auto = [isRUPG10Bought ? player.replicanti.auto[0] : false, isRUPG10Bought ? player.replicanti.auto[1] : false, isRUPG10Bought ? player.replicanti.auto[2] : false];
  }
  if (RealityUpgrade(13).isBought) {
    if (player.reality.epmultbuyer) EternityUpgrade.epMult.buyMax();
    for (var i = 1; i < 9; i++) {
      if (player.reality.tdbuyers[i - 1]) {
        buyMaxTimeDimTier(i);
      }
    }
  }

  Lazy.invalidateAll();
  EventHub.dispatch(GameEvent.REALITY_RESET_AFTER);

  // This immediately gives eternity upgrades and autobuys TDs/5xEP
  if (Ra.has(RA_UNLOCKS.INSTANT_AUTOEC)) {
    applyRealityUpgrades();
  }

  if (Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY)) {
    for (const reaction of AlchemyReactions.all.compact()) {
      reaction.combineReagents();
    }
  }

  player.reality.gainedAutoAchievements = false;

  tryUnlockAchievementsOnReality();
}

function clearCelestialRuns() {
  player.celestials.teresa.run = false;
  player.celestials.effarig.run = false;
  player.celestials.enslaved.run = false;
  player.celestials.v.run = false;
  player.celestials.ra.run = false;
  TimeCompression.isActive = false;
  player.celestials.laitela.run = false;
}

function startRealityOver() {
  if (confirm("This will put you at the start of your reality and reset your progress in this reality." +
    "Are you sure you want to do this?")) {
    beginProcessReality(getRealityProps(true));
    return true;
  }
  return false;
}

function lockAchievementsOnReality() {
  const startRow = GameCache.achSkipPerkCount.value + 1;
  const lastRow = 13;
  if (startRow > lastRow) return;
  const lockedRows = lastRow - startRow + 1;
  for (const row of Achievements.rows(startRow, lockedRows)) {
    for (const achievement of row) {
      achievement.lock();
    }
  }
  player.reality.achTimer = 0;
}

function tryUnlockAchievementsOnReality() {
  const startRow = GameCache.achSkipPerkCount.value + 1;
  const lastRow = 13;
  for (let r = startRow; r <= lastRow; ++r) {
    // If the achievement has a checkEvent set, that means that it
    // can't be checked out of context:
    for (const a of Achievements.row(r)) {
      if (a.config.checkEvent === undefined) a.tryUnlock();
    }
  }
}
