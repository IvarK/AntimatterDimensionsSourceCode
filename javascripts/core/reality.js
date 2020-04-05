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
    let baseChoices = Effects.max(
      1,
      Perk.glyphChoice4,
      Perk.glyphChoice3
    );
    // TODO Make Ra follow GMS pattern so this isn't as dumb as it is right now
    if (Ra.has(RA_UNLOCKS.GLYPH_CHOICES)) baseChoices *= 2;
    return baseChoices;
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

  glyphUncommonGuarantee(rng) {
    // If no choices are rare enough and the player has the uncommon glyph perk, randomly generate
    // rarities until the threshold is passed and then assign that rarity to a random glyph
    const strengthThreshold = 1.5;
    if (this.glyphs.some(e => e.strength >= strengthThreshold)) return;
    let newStrength;
    do {
      newStrength = GlyphGenerator.randomStrength(rng);
    } while (newStrength < strengthThreshold);
    this.glyphs.randomElement().strength = newStrength;
  },

  generate(count, realityProps) {
    this.glyphs = [];
    this.realityProps = realityProps;
    const level = realityProps.gainedGlyphLevel;
    const rng = new GlyphGenerator.RealGlyphRNG();
    for (let out = 0; out < count; ++out) {
      let glyph;
      // Attempt to generate a unique glyph, but give up after 100 tries so the game doesn't
      // get stuck in an infinite loop if we decide to increase the number of glyph choices
      // for some reason and forget about the uniqueness check
      for (let tries = 0; tries < 100; ++tries) {
        glyph = GlyphGenerator.randomGlyph(level, rng);
        if (this.checkUniqueGlyph(glyph)) break;
      }
      this.glyphs.push(glyph);
    }
    ui.view.modal.glyphSelection = true;
    if (Perk.glyphUncommonGuarantee.isBought) this.glyphUncommonGuarantee(rng);
    rng.finalize();
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

  select(index, sacrifice) {
    ui.view.modal.glyphSelection = false;
    if (sacrifice) {
      GlyphSacrificeHandler.removeGlyph(this.glyphs[index], true);
    } else {
      Glyphs.addToInventory(this.glyphs[index]);
    }
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
  if (Glyphs.freeInventorySpace === 0) {
    Modal.message.show("Inventory cannot hold new glyphs. Delete/sacrifice (shift-click) some glyphs.");
    return;
  }
  const realityProps = getRealityProps(false, false);
  if (simulatedRealityCount(false) > 0) {
    triggerManualReality(realityProps);
    if (V.has(V_UNLOCKS.AUTO_AUTOCLEAN) && player.reality.autoAutoClean) Glyphs.autoClean();
    return;
  }
  realityProps.alreadyGotGlyph = true;
  if (GlyphSelection.choiceCount === 1) {
    const newGlyph = player.realities === 0
      ? GlyphGenerator.startingGlyph(realityProps.gainedGlyphLevel)
      : GlyphGenerator.randomGlyph(realityProps.gainedGlyphLevel);
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

function processAutoGlyph(gainedLevel, rng) {
  let newGlyph;
  if (EffarigUnlock.basicFilter.isUnlocked) {
    const glyphs = Array.range(0, GlyphSelection.choiceCount)
      .map(() => GlyphGenerator.randomGlyph(gainedLevel, rng));
    newGlyph = AutoGlyphProcessor.pick(glyphs);
    if (!AutoGlyphProcessor.wouldKeep(newGlyph) || Glyphs.freeInventorySpace === 0) {
      AutoGlyphProcessor.getRidOfGlyph(newGlyph);
      newGlyph = null;
    }
  } else {
    newGlyph = GlyphGenerator.randomGlyph(gainedLevel, rng);
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
  if (V.has(V_UNLOCKS.AUTO_AUTOCLEAN) && player.reality.autoAutoClean) Glyphs.autoClean();
}

function updateRealityRecords(realityProps) {
  const thisRunRMmin = realityProps.gainedRM.dividedBy(Time.thisRealityRealTime.totalMinutes);
  if (player.bestRMmin.lt(thisRunRMmin)) {
    player.bestRMmin = thisRunRMmin;
    player.bestRMminSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
  if (player.bestGlyphLevel < realityProps.gainedGlyphLevel.actualLevel) {
    player.bestGlyphLevel = realityProps.gainedGlyphLevel.actualLevel;
    player.bestGlyphLevelSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
  player.bestReality = Math.min(player.thisReality, player.bestReality);
  if (player.thisRealityRealTime < player.bestRealityRealTime) {
    player.bestRealityRealTime = player.thisRealityRealTime;
    player.bestSpeedSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
}

function giveRealityRewards(realityProps) {
  const multiplier = realityProps.simulatedRealities + 1;
  const gainedRM = realityProps.gainedRM;
  player.reality.realityMachines = player.reality.realityMachines.plus(gainedRM.times(multiplier));
  updateRealityRecords(realityProps);
  addRealityTime(player.thisReality, player.thisRealityRealTime, gainedRM, realityProps.gainedGlyphLevel.actualLevel);
  player.realities += multiplier;
  player.reality.pp += multiplier;
  if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) {
    player.celestials.effarig.relicShards += realityProps.gainedShards * multiplier;
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
    if (player.antimatter.gt(player.celestials.teresa.bestRunAM)) {
      player.celestials.teresa.bestRunAM = player.antimatter;
      player.celestials.teresa.bestAMSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
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
        finishProcessReality(realityProps);
      }
    });
}

function finishProcessReality(realityProps) {
  const finalEP = player.eternityPoints.plus(gainedEternityPoints());
  if (player.bestEP.lt(finalEP)) {
    player.bestEP = new Decimal(finalEP);
    player.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
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

  NormalChallenges.clearCompletions();
  InfinityChallenges.clearCompletions();

  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
  player.infinityUpgrades.clear();
  player.infinitied = new Decimal(0);
  player.infinitiedBank = new Decimal(0);
  player.bestInfinityTime = 999999999999;
  player.thisInfinityTime = 0;
  player.thisInfinityLastBuyTime = 0;
  player.thisInfinityRealTime = 0;
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.infMult = new Decimal(1);
  player.infMultCost = new Decimal(10);
  player.infinityRebuyables = [0, 0];
  player.postChallUnlocked = 0;
  player.infinityPower = new Decimal(1);
  player.infDimBuyers = Array.repeat(false, 8);
  player.timeShards = new Decimal(0);
  player.replicanti.amount = new Decimal(0);
  player.replicanti.unl = false;
  player.replicanti.chance = 0.01;
  player.replicanti.chanceCost = new Decimal(1e150);
  player.replicanti.interval = 1000;
  player.replicanti.intervalCost = new Decimal(1e140);
  player.replicanti.gal = 0;
  player.replicanti.galaxies = 0;
  player.replicanti.galCost = new Decimal(1e170);
  player.replicanti.galaxybuyer = false;
  player.replicanti.auto = Array.repeat(false, 3);

  player.eternityPoints = Player.startingEP;

  // This has to be reset before player.eternities to make the bumpLimit logic work correctly
  EternityUpgrade.epMult.reset();
  player.eternities = new Decimal(0);
  player.thisEternity = 0;
  player.thisEternityRealTime = 0;
  player.bestEternity = 999999999999;
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.offlineProd = 0;
  player.offlineProdCost = 1e7;
  player.eternityChalls = {};
  player.reality.lastAutoEC = 0;
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.etercreq = 0;
  player.infMultBuyer = false;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.noSacrifices = true;
  player.onlyEighthDimensions = true;
  player.onlyFirstDimensions = true;
  player.noEighthDimensions = true;
  player.noFirstDimensions = true;
  player.noTheoremPurchases = true;
  player.noInfinitiesThisReality = true;
  player.noEternitiesThisReality = true;
  player.thisReality = 0;
  player.thisRealityRealTime = 0;
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
  player.dilation.baseFreeGalaxies = 0;
  player.dilation.freeGalaxies = 0;
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0
  };
  player.antimatter = Player.startingAM;
  player.thisInfinityMaxAM = Player.startingAM;
  Enslaved.autoReleaseTick = 0;
  player.celestials.laitela.entropy = 0;

  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetChallengeStuff();
  NormalDimensions.reset();
  secondSoftReset();
  player.celestials.ra.peakGamespeed = 1;

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
  resetTickspeed();
  playerInfinityUpgradesOnEternity();
  AchievementTimers.marathon2.reset();
  player.infinityPoints = Player.startingIP;

  if (RealityUpgrade(10).isBought) applyRUPG10();
  else Tab.dimensions.normal.show();

  Lazy.invalidateAll();
  EventHub.dispatch(GAME_EVENT.REALITY_RESET_AFTER);

  // This immediately gives eternity upgrades instead of after the first eternity
  if (RealityUpgrades.allBought) applyRealityUpgradesAfterEternity(celestialRunState.enslaved);

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

  const hasMaxBulkSecretAch = SecretAchievement(38).isUnlocked;
  player.auto.dimensions = player.auto.dimensions.map(() => ({
    isUnlocked: true,
    // These costs are approximately right; if bought manually all dimensions are slightly different from one another
    cost: hasMaxBulkSecretAch ? 5e133 : 2e126,
    interval: 100,
    // Only completely max bulk if the relevant secret achievement has already been unlocked
    bulk: hasMaxBulkSecretAch ? 1e100 : 1e90,
    mode: AUTOBUYER_MODE.BUY_10,
    priority: 1,
    isActive: true,
    lastTick: player.realTimePlayed
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
  player.infinityRebuyables = [8, 7];
  player.infDimBuyers = Array.repeat(true, 8);
  player.offlineProd = 50;
  player.offlineProdCost = 1e17;
  player.infMultBuyer = true;
  player.eternities = player.eternities.plus(100);
  player.replicanti.amount = player.replicanti.amount.clampMin(1);
  player.replicanti.unl = true;
  player.replicanti.galaxybuyer = true;
  player.replicanti.auto = Array.repeat(true, 3);
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
  if (confirm("This will put you at the start of your reality and reset your progress in this reality, " +
    "giving you no rewards from your progress in your current reality.  Are you sure you want to do this?")) {
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
