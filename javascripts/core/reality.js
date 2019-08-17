"use strict";

/**
 * Object that manages the selection of glyphs offered to the player
 */
const GlyphSelection = {
  glyphs: [],

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

  generate(count, level) {
    this.glyphs = [];
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
    for (const glyph of this.glyphs.filter(g => g.rawLevel < level.rawLevel)) {
      glyph.rawLevel = level.rawLevel;
    }
    for (const glyph of this.glyphs.filter(g => g.level < level.actualLevel)) {
      glyph.level = level.actualLevel;
      calculateGlyph(glyph);
    }
  },

  select(index) {
    ui.view.modal.glyphSelection = false;
    Glyphs.addToInventory(this.glyphs[index]);
    this.glyphs = [];
    manualReality();
  }
};

function confirmReality() {
  return !player.options.confirmations.reality ||
    confirm("Reality will reset everything except challenge records, and will lock your achievements, " +
      `which you will regain over the course of ${Achievements.nextTotalDisabledTime}. ` +
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
  const amplifiedSim = Enslaved.boostReality ? Enslaved.realityBoostRatio : 0;
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
  const level = gainedGlyphLevel();
  if (simulatedRealityCount(false) > 0) {
    Enslaved.lockedInGlyphLevel = level;
    Enslaved.lockedInRealityMachines = gainedRealityMachines();
    Enslaved.lockedInShardsGained = Effarig.shardsGained;
    manualReality();
    return;
  }
  // If there is no glyph selection, proceed with reality immediately. Otherwise,
  // we generate a glyph selection, and keep the game going while the user dithers over it.
  const choiceCount = GlyphSelection.choiceCount;
  if (choiceCount === 1) {
    // First reality gets a specially generated glyph:
    const newGlyph = player.realities === 0
      ? GlyphGenerator.startingGlyph(level)
      : GlyphGenerator.randomGlyph(level);
    Glyphs.addToInventory(newGlyph);
    manualReality();
    return;
  }
  GlyphSelection.generate(choiceCount, level);
}

function manualReality() {
  if (player.options.animations.reality) {
    document.getElementById("container").style.animation = "realize 10s 1";
    document.getElementById("realityanimbg").style.animation = "realizebg 10s 1";
    document.getElementById("realityanimbg").style.display = "block";
    setTimeout(() => {
      document.getElementById("realityanimbg").play();
      document.getElementById("realityanimbg").currentTime = 0;
      document.getElementById("realityanimbg").play();
    }, 2000);
    setTimeout(() => {
      document.getElementById("container").style.animation = "";
      document.getElementById("realityanimbg").style.animation = "";
      document.getElementById("realityanimbg").style.display = "none";
    }, 10000);
    setTimeout(() => completeReality(false, false), 3000);
  } else {
    completeReality(false, false);
  }
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

function autoReality() {
  if (GlyphSelection.active || !isRealityAvailable()) return;
  const gainedLevel = gainedGlyphLevel();
  if (simulatedRealityCount(false) > 0) {
    Enslaved.lockedInGlyphLevel = gainedLevel;
    Enslaved.lockedInRealityMachines = gainedRealityMachines();
    Enslaved.lockedInShardsGained = Effarig.shardsGained;
    completeReality(false, false, true);
    return;
  }
  processAutoGlyph(gainedLevel);
  completeReality(false, false, true);
}

// The ratio is the amount on top of the regular reality amount.
function boostedRealityRewards(ratio) {
  player.reality.realityMachines = player.reality.realityMachines
    .plus(Enslaved.lockedInRealityMachines.times(ratio));
  // No glyph reward was given earlier
  for (let glyphCount = 0; glyphCount < ratio + 1; ++glyphCount) {
    processAutoGlyph(Enslaved.lockedInGlyphLevel);
  }
  player.realities += ratio;
  player.reality.pp += ratio;
  if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) {
    player.celestials.effarig.relicShards += Enslaved.lockedInShardsGained * ratio;
  }
  if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])) {
    Ra.giveExp();
  }
  if (Enslaved.boostReality) {
    // Real time amplification is capped at 1 second of reality time; if it's faster then using all time at once would
    // be wasteful. Being faster than 1 second will only use as much time as needed to get the 1-second factor instead.
    if (Time.thisRealityRealTime.totalSeconds < 1) {
      player.celestials.enslaved.storedReal *= 1 - Time.thisRealityRealTime.totalSeconds;
    } else {
      player.celestials.enslaved.storedReal = 0;
    }
    Enslaved.boostReality = false;
  }
}

function completeReality(force, reset, auto = false) {
  if (!reset) {
    EventHub.dispatch(GameEvent.REALITY_RESET_BEFORE);
    const simulatedRealities = simulatedRealityCount(true);
    if (simulatedRealities > 0) {
      boostedRealityRewards(simulatedRealities);
    }
    if (player.thisReality < player.bestReality) {
      player.bestReality = player.thisReality;
    }
    player.reality.realityMachines = player.reality.realityMachines.plus(gainedRealityMachines());
    player.bestRMmin = player.bestRMmin.max(gainedRealityMachines().dividedBy(Time.thisRealityRealTime.totalMinutes));
    addRealityTime(player.thisReality, player.thisRealityRealTime, gainedRealityMachines(), gainedGlyphLevel().actualLevel);
    if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) player.celestials.effarig.relicShards += Effarig.shardsGained;
    if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])) {
      Ra.giveExp();
    }
    if (Ra.isRunning) {
      Ra.updateExpBoosts();
    }
  }

  if (player.reality.respec) {
    respecGlyphs();
  }
  handleCelestialRuns(force)
  recalculateAllGlyphs()

  //reset global values to avoid a tick of unupdated production

  player.sacrificed = new Decimal(0);

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
  if (!reset) player.realities = player.realities + 1;
  if (!reset) player.bestReality = Math.min(player.thisReality, player.bestReality);
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
    if (Achievements.totalDisabledTime === 0) {
      initializeChallengeCompletions();
    }
  }
  if (!reset) player.reality.pp++;
  if (player.infinitied.gt(0) && !NormalChallenge(1).isCompleted) {
    NormalChallenge(1).complete();
  }
  player.reality.upgReqChecks = [true];
  InfinityDimensions.resetAmount();
  player.bestIPminThisInfinity = new Decimal(0);
  player.bestIPminThisEternity = new Decimal(0);
  player.bestEPminThisEternity = new Decimal(0);
  player.bestEPminThisReality = new Decimal(0);
  resetTimeDimensions();
  // FIXME: Eternity count is now a Decimal so this needs to be addressed
  // kong.submitStats('Eternities', player.eternities);
  if (player.eternities.gt(2) && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
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
}

function handleCelestialRuns(force) {
  if (Teresa.isRunning) {
    player.celestials.teresa.run = false;
    if (!force && player.celestials.teresa.bestRunAM.lt(player.antimatter)) {
      player.celestials.teresa.bestRunAM = player.antimatter;
    }
  }
  if (Effarig.isRunning) {
    player.celestials.effarig.run = false;
    if (!force && !EffarigUnlock.reality.isUnlocked) {
      EffarigUnlock.reality.unlock();
    }
  }
  if (Enslaved.isRunning) {
    player.celestials.enslaved.run = false;
    if (!force) {
      Enslaved.completeRun();
    }
  }

  if (V.isRunning) {
    player.celestials.v.run = false;
  }

  if (Ra.isRunning) {
    player.celestials.ra.run = false;
  }

  if (TimeCompression.isActive) {
    TimeCompression.isActive = false;
  }

  if (Laitela.isRunning) {
    player.celestials.laitela.run = false;
    if (!force && player.antimatter.gte(player.celestials.laitela.maxAmGained)) {
      player.celestials.laitela.maxAmGained = player.antimatter;
    }
  }
}

function startRealityOver() {
  if (confirm("This will put you at the start of your reality and reset your progress in this reality. Are you sure you want to do this?")) {
    completeReality(true, true);
    return true;
  }
  return false;
}
