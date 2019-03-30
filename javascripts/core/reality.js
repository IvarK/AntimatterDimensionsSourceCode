/**
 * Object that manages the selection of glyphs offered to the player
 */
const GlyphSelection = {
  glyphs: [],
  get active() {
    return ui.view.modal.glyphSelection;
  },
  get choiceCount() {
    return Perk.glyphChoice4.isBought ? 4 : (Perk.glyphChoice3.isBought ? 3 : 1);
  },
  generate(count, level) {
    this.glyphs = new Array(count).fill().map(() => GlyphGenerator.randomGlyph(level, false));
    ui.view.modal.glyphSelection = true;
    if (!Perk.glyphUncommonGuarantee.isBought) return;
    // If no choices are rare enough, pick one randomly and reroll its rarity until it is
    const strengthThreshold = 1.5;  // Uncommon
    if (this.glyphs.some(e => e.strength >= strengthThreshold)) return;
    let newStrength;
    do {
      newStrength = GlyphGenerator.randomStrength(false);
    } while (newStrength < strengthThreshold);
    this.glyphs.randomElement().strength = newStrength;
  },
  update(level) {
    for (let g of this.glyphs.filter(g => g.rawLevel < level.rawLevel)) {
      g.rawLevel = level.rawLevel;
    }
    for (let g of this.glyphs.filter(g => g.level < level.actualLevel)) {
      g.level = level.actualLevel;
      calculateGlyph(g);
    }
  },
  select(index) {
    ui.view.modal.glyphSelection = false;
    Glyphs.addToInventory(this.glyphs[index]);
    this.glyphs = [];
    manualReality();
  }
}

function confirmReality() {
  return !player.options.confirmations.reality ||
    confirm("Reality will reset everything except challenge records, " +
      "and will lock your achievements, which you will regain over the course of 2 days. " +
      "You will also gain reality machines based on your EP, a glyph with a power level " +
      "based on your EP, Replicanti, and Dilated Time, a perk point to spend on quality of " +
      "life upgrades, and unlock various upgrades.")
}

function isRealityAvailable() {
  return player.eternityPoints.gte("1e4000") && TimeStudy.reality.isBought;
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
  // If there is no glyph selection, proceed with reality immediately. Otherwise,
  // we generate a glyph selection, and keep the game going while the user dithers over it.
  let choiceCount = GlyphSelection.choiceCount;
  let level = gainedGlyphLevel();
  if (choiceCount === 1) {
    // First reality gets a specially generated glyph:
    const newGlyph = player.realities === 0
      ? GlyphGenerator.startingGlyph(level)
      : GlyphGenerator.randomGlyph(level);
    Glyphs.addToInventory(newGlyph);
    return manualReality();
  }
  GlyphSelection.generate(choiceCount, level);
}

function manualReality() {
  if (player.options.animations.reality) {
    document.getElementById("container").style.animation = "realize 10s 1";
    document.getElementById("realityanimbg").style.animation = "realizebg 10s 1";
    document.getElementById("realityanimbg").style.display = "block";
    setTimeout(function () {
      document.getElementById("realityanimbg").play();
      document.getElementById("realityanimbg").currentTime = 0;
      document.getElementById("realityanimbg").play();
    }, 2000);
    setTimeout(function () {
      document.getElementById("container").style.animation = "";
      document.getElementById("realityanimbg").style.animation = "";
      document.getElementById("realityanimbg").style.display = "none";
    }, 10000);
    setTimeout(() => completeReality(false, false), 3000);
  } else {
    completeReality(false, false);
  }
}

function autoReality() {
  if (GlyphSelection.active || !isRealityAvailable()) return;
  let gainedLevel = gainedGlyphLevel();
  let newGlyph;
  if (EffarigUnlock.autopicker.isUnlocked) {
    let glyphs = Array.range(0, GlyphSelection.choiceCount)
      .map(() => GlyphGenerator.randomGlyph(gainedLevel));
    newGlyph = AutoGlyphPicker.pick(glyphs);
  } else {
    newGlyph = GlyphGenerator.randomGlyph(gainedLevel, false);
  }
  if (EffarigUnlock.autosacrifice.isUnlocked) {
    if (AutoGlyphSacrifice.wouldSacrifice(newGlyph) || !Player.hasFreeInventorySpace) {
      // FIXME: remove console.log after initial rollout to testers
      console.log("Sacrificing a glyph: ")
      console.log(newGlyph);
      sacrificeGlyph(newGlyph, true);
      newGlyph = null;
    }
  }
  if (newGlyph && Player.hasFreeInventorySpace) {
    Glyphs.addToInventory(newGlyph);
  }
  completeReality(false, false, true);
}

function completeReality(force, reset, auto = false) {
  if (!reset) {
    if (player.thisReality < player.bestReality) {
      player.bestReality = player.thisReality
    }
    giveAchievement("Snap back to reality");
    player.reality.realityMachines = player.reality.realityMachines.plus(gainedRealityMachines());
    addRealityTime(player.thisReality, player.thisRealityRealTime, gainedRealityMachines(), gainedGlyphLevel().actualLevel);
    RealityUpgrades.tryUnlock([9, 16, 17, 18, 19, 23, 24]);
    if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) player.celestials.effarig.relicShards += Effarig.shardsGained
    if (player.bestReality < 3000) giveAchievement("I didn't even realize how fast you are")
    if (GLYPH_TYPES.every((type) => type === "effarig" || player.reality.glyphs.active.some((g) => g.type == type))) giveAchievement("Royal Flush")
    if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])) {
      Ra.giveExp(Ra.gainedExp(gainedGlyphLevel().actualLevel, auto))
    }
  }

  if (player.reality.respec) {
    respecGlyphs();
  }
  handleCelestialRuns(force)
  recalculateAllGlyphs()

  //reset global values to avoid a tick of unupdated production
  postc8Mult = new Decimal(0);
  mult18 = new Decimal(1);

  player.sacrificed = new Decimal(0);

  player.challenges = [];
  let isRUPG10Bought = RealityUpgrade(10).isBought;
  if (isRUPG10Bought) {
    for (let challenge of Challenge.all) {
      challenge.complete();
    }
  }
  player.currentChallenge = "";
  if (!isRUPG10Bought) player.infinityUpgrades.clear();
  player.infinitied = new Decimal(0);
  player.infinitiedBank = new Decimal(0);
  player.bestInfinityTime = 999999999999;
  player.thisInfinityTime = 0;
  player.thisInfinityRealTime = 0;
  player.resets = isRUPG10Bought ? 4 : 0;
  player.galaxies = isRUPG10Bought ? 1 : 0;
  player.tickDecrease = 0.9;
  player.interval = null;
  if (!isRUPG10Bought) {
    Autobuyer.resetUnlockables();
  }
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = isRUPG10Bought ? player.break : false;
  player.infMult = new Decimal(1);
  player.infMultCost = new Decimal(10);
  if (!isRUPG10Bought) {
    player.infinityRebuyables = [0, 0];
  }
  player.postChallUnlocked = 0;
  player.infDimensionsUnlocked = [false, false, false, false, false, false, false, false];
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
  player.eternities = 0;
  player.thisEternity = 0;
  player.thisEternityRealTime = 0;
  player.bestEternity = 999999999999;
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.offlineProd = isRUPG10Bought ? player.offlineProd : 0;
  player.offlineProdCost = isRUPG10Bought ? player.offlineProdCost : 1e7;
  player.challengeTarget = new Decimal(0);
  if (!isRUPG10Bought) {
    player.autoSacrifice = 1;
  }
  player.eternityChalls = {};
  player.eternityChallGoal = new Decimal(Number.MAX_VALUE);
  player.reality.lastAutoEC = 0;
  player.currentEternityChall = "";
  player.eternityChallUnlocked = 0;
  player.etercreq = 0;
  player.autoIP = new Decimal(0);
  player.autoTime = 1e300;
  player.infMultBuyer = isRUPG10Bought ? player.infMultBuyer : false;
  if (!isRUPG10Bought) {
    player.autoCrunchMode = AutoCrunchMode.AMOUNT;
  }
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  player.dimlife = true;
  player.dead = true;
  if (!reset) player.realities = player.realities + 1;
  if (!reset) player.bestReality = Math.min(player.thisReality, player.bestReality);
  player.thisReality = 0;
  player.thisRealityRealTime = 0;
  player.timestudy.theorem = new Decimal(0);
  player.timestudy.amcost = new Decimal("1e20000");
  player.timestudy.ipcost = new Decimal(1);
  player.timestudy.epcost = new Decimal(1);
  player.timestudy.studies = [];
  if (!RealityUpgrade(10).isBought) {
    player.eternityBuyer.isOn = false;
  }
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.tachyonParticles = new Decimal(0);
  player.dilation.dilatedTime = new Decimal(0);
  player.dilation.totalTachyonParticles = new Decimal(0);
  player.dilation.nextThreshold = new Decimal(1000);
  player.dilation.baseFreeGalaxies = 0;
  player.dilation.freeGalaxies = 0;
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0
  };
  player.money = Effects.max(
    10,
    Perk.startAM1,
    Perk.startAM2
  ).toDecimal();

  resetInfinityRuns();
  resetEternityRuns();
  fullResetInfDimensions();
  fullResetTimeDimensions();
  resetReplicanti();
  resetChallengeStuff();
  resetDimensions();
  secondSoftReset();
  if (isRUPG10Bought) player.eternities = 100;
  if (!reset) player.reality.pp++;
  $("#pp").text("You have " + player.reality.pp + " Perk Point" + ((player.reality.pp === 1) ? "." : "s."))
  if (player.infinitied.gt(0) && !Challenge(1).isCompleted) {
    Challenge(1).complete();
  }
  Autobuyer.tryUnlockAny()
  if (player.realities === 4) player.reality.automatorCommands = new Set([12, 24, 25]);
  player.reality.upgReqChecks = [true];
  resetInfDimensions();
  IPminpeak = new Decimal(0);
  EPminpeak = new Decimal(0);
  resetTimeDimensions();
  kong.submitStats('Eternities', player.eternities);
  if (player.eternities > 2 && player.replicanti.galaxybuyer === undefined) player.replicanti.galaxybuyer = false;
  resetTickspeed();
  playerInfinityUpgradesOnEternity();
  if (player.eternities <= 1) {
    Tab.dimensions.normal.show();
  }
  Marathon2 = 0;
  updateBlackHoleUpgrades();
  updateAutomatorRows();
  drawPerkNetwork();
  document.getElementById("pp").textContent = "You have " + player.reality.pp + " Perk Point" + ((player.reality.pp === 1) ? "." : "s.")

  if (player.realities >= 4) giveAchievement("How does this work?")

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

  GameCache.invalidate();
  GameUI.dispatch(GameEvent.REALITY);
}

function handleCelestialRuns(force) {
  if (Teresa.isRunning) {
    player.celestials.teresa.run = false
    if (!force && player.celestials.teresa.bestRunAM.lt(player.money)) player.celestials.teresa.bestRunAM = player.money
  }
  if (Effarig.isRunning) {
    player.celestials.effarig.run = false
    if (!force && !EffarigUnlock.reality.isUnlocked) {
      EffarigUnlock.reality.unlock();
    }
  }
  if (Enslaved.isRunning) {
    player.celestials.enslaved.run = false
  }

  if (V.isRunning) {
    player.celestials.v.run = false
  }

  if (Ra.isRunning) {
    player.celestials.ra.run = false
  }

  if (Laitela.isRunning) {
    player.celestials.laitela.run = false
  }
}

function fullResetTimeDimensions() {
  const cost = [1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"];
  for (let i = 0; i < 8; i++) {
    let dimension = player["timeDimension" + (i + 1)];
    dimension.cost = new Decimal(cost[i]);
    dimension.amount = new Decimal(0);
    dimension.bought = 0;
    dimension.power = new Decimal(1);
  }
}

function startRealityOver() {
  if (confirm("This will put you at the start of your reality and reset your progress in this reality. Are you sure you want to do this?")) {
    completeReality(true, true);
    return true;
  }
  return false;
}