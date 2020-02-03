"use strict";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

const kongIPMult = 1;
const kongDimMult = 1;
const kongAllDimMult = 1;
const kongEPMult = 1;

function playerInfinityUpgradesOnEternity() {
  if (!EternityMilestone.keepInfinityUpgrades.isReached) player.infinityUpgrades.clear();
  else if (!EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityUpgrades = new Set(["timeMult", "dimMult", "timeMult2", "skipReset1", "skipReset2",
      "unspentBonus", "27Mult", "18Mult", "36Mult", "resetMult", "skipReset3", "passiveGen",
      "45Mult", "resetBoost", "galaxyBoost", "skipResetGalaxy", "ipOffline"]);
  }
}

function breakInfinity() {
  if (!Autobuyer.bigCrunch.hasMaxedInterval) return;
  if (InfinityChallenge.isRunning) return;
  for (const autobuyer of Autobuyers.all) {
    if (autobuyer.data.interval !== undefined) autobuyer.maxIntervalForFree();
  }
  player.break = !player.break;
  EventHub.dispatch(player.break ? GAME_EVENT.BREAK_INFINITY : GAME_EVENT.FIX_INFINITY);
  GameUI.update();
}

function gainedInfinityPoints() {
  const div = Effects.min(
    308,
    Achievement(103),
    TimeStudy(111)
  );
  let ip = player.break
    ? Decimal.pow10(player.thisInfinityMaxAM.e / div - 0.75)
    : new Decimal(308 / div);
  ip = ip.times(GameCache.totalIPMult.value);
  if (Teresa.isRunning) {
    ip = ip.pow(0.55);
  } else if (V.isRunning) {
    ip = ip.pow(0.5);
  }
  if (GlyphAlteration.isAdded("infinity")) {
    ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
  }
  return ip.floor();
}

function totaEPMult() {
  return new Decimal(getAdjustedGlyphEffect("cursedEP"))
    .times(kongEPMult)
    .timesEffectsOf(
      EternityUpgrade.epMult,
      TimeStudy(61),
      TimeStudy(122),
      TimeStudy(121),
      TimeStudy(123),
      RealityUpgrade(12),
      GlyphEffect.epMult
  );
}

function gainedEternityPoints() {
  const ip = player.infinityPoints.plus(gainedInfinityPoints());
  let ep = Decimal.pow(5, ip.e / 308 - 0.7).times(totaEPMult());

  if (Teresa.isRunning) {
    ep = ep.pow(0.55);
  } else if (V.isRunning) {
    ep = ep.pow(0.5);
  }
  if (GlyphAlteration.isAdded("time")) {
    ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
  }
  return ep.floor();
}

function requiredIPForEP() {
  return Decimal.pow10(Math.ceil(308 * (Decimal.log(totaEPMult().reciprocal(), 5) + 0.7)));
}

function getRealityMachineMultiplier() {
  return Teresa.rmMultiplier * Effects.max(1, PerkShopUpgrade.rmMult) * getAdjustedGlyphEffect("effarigrm");
}

function gainedRealityMachines() {
  const log10FinalEP = player.eternityPoints.plus(gainedEternityPoints()).log10();
  let rmGain = Decimal.pow(1000, log10FinalEP / 4000 - 1);
  // Increase base RM gain if <10 RM
  if (rmGain.lt(10)) rmGain = new Decimal(27 / 4000 * log10FinalEP - 26);
  rmGain = rmGain.times(getRealityMachineMultiplier());
  rmGain = rmGain.plusEffectOf(Perk.realityMachineGain);
  // This happens around ee10 and is necessary to reach e9e15 antimatter without having to deal with the various
  // potential problems associated with having ee9 RM, of which there are lots (both balance-wise and design-wise).
  // The softcap here squishes every additional OoM in the exponent into another factor of e1000 RM, putting e9e15
  // antimatter around e7000 RM instead of e1000000000 RM.
  const softcapRM = new Decimal("1e1000");
  if (rmGain.gt(softcapRM)) {
    const exponentOOMAboveCap = Math.log10(rmGain.log10() / softcapRM.log10());
    rmGain = softcapRM.pow(1 + exponentOOMAboveCap);
  }
  return Decimal.floor(rmGain);
}

function gainedGlyphLevel() {
  const glyphState = getGlyphLevelInputs();
  let rawLevel = Math.floor(glyphState.rawLevel);
  if (!isFinite(rawLevel)) rawLevel = 0;
  let actualLevel = Math.floor(glyphState.actualLevel);
  if (!isFinite(actualLevel)) actualLevel = 0;
  return {
    rawLevel,
    actualLevel
  };
}

function resetChallengeStuff() {
    player.chall2Pow = 1;
    player.chall3Pow = new Decimal(0.01);
    player.matter = new Decimal(0);
    player.chall8TotalSacrifice = new Decimal(1);
    player.postC4Tier = 1;
}

function ratePerMinute(amount, time) {
    return Decimal.divide(amount, time / (60 * 1000));
}

function averageRun(runs) {
  const totalTime = runs
    .map(run => run[0])
    .reduce(Number.sumReducer);
  const totalAmount = runs
    .map(run => run[1])
    .reduce(Decimal.sumReducer);
  const realTime = runs
    .map(run => run[2])
    .reduce(Number.sumReducer);
  return [
    totalTime / runs.length,
    totalAmount.dividedBy(runs.length),
    realTime / runs.length
  ];
}

// eslint-disable-next-line max-params
function addInfinityTime(time, realTime, ip, infinities) {
  player.lastTenRuns.pop();
  player.lastTenRuns.unshift([time, ip, realTime, infinities]);
  GameCache.bestRunIPPM.invalidate();
}

function resetInfinityRuns() {
  player.lastTenRuns = Array.from(
    { length: 10 },
    () => [600 * 60 * 24 * 31, new Decimal(1), 600 * 60 * 24 * 31, new Decimal(1)]
  );
  GameCache.bestRunIPPM.invalidate();
}

// Player gains 50% of infinitied stat they would get based on their best infinitied/hour crunch if they have the
// milestone and turned on infinity autobuyer with 1 minute or less per crunch
function getInfinitiedMilestoneReward(ms) {
  return Autobuyer.bigCrunch.autoInfinitiesAvailable
    ? Decimal.floor(player.bestInfinitiesPerMs.times(ms).dividedBy(2))
    : 0;
}

// eslint-disable-next-line max-params
function addEternityTime(time, realTime, ep, eternities) {
  player.lastTenEternities.pop();
  player.lastTenEternities.unshift([time, ep, realTime, eternities]);
  GameCache.averageEPPerRun.invalidate();
}

function resetEternityRuns() {
  player.lastTenEternities = Array.from(
    { length: 10 },
    () => [600 * 60 * 24 * 31, new Decimal(1), 600 * 60 * 24 * 31, 1]
  );
  GameCache.averageEPPerRun.invalidate();
}

// Player gains 50% of the eternities they would get if they continuously repeated their fastest eternity, if they
// have the auto-eternity milestone and turned on eternity autobuyer with 0 EP
function getEternitiedMilestoneReward(ms) {
  return Autobuyer.eternity.autoEternitiesAvailable
    ? Decimal.floor(player.bestEternitiesPerMs.times(ms).dividedBy(2))
    : 0;
}

function getOfflineEPGain(ms) {
  if (!EternityMilestone.autoEP.isReached) return new Decimal(0);
  return player.bestEPminThisReality.times(TimeSpan.fromMilliseconds(ms).totalMinutes / 4);
}

// eslint-disable-next-line max-params
function addRealityTime(time, realTime, rm, level) {
  player.lastTenRealities.pop();
  player.lastTenRealities.unshift([time, rm, realTime, level]);
}

function gainedInfinities() {
    if (EternityChallenge(4).isRunning) {
        return new Decimal(1);
    }
    let infGain = Effects.max(
      1,
      Achievement(87)
    ).toDecimal();

    infGain = infGain.timesEffectsOf(
      TimeStudy(32),
      RealityUpgrade(5),
      RealityUpgrade(7)
    );
    infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
    infGain = infGain.times(RA_UNLOCKS.TT_BOOST.effect.infinity());
    return infGain;
}

setInterval(() => {
  if (isLocalEnvironment()) return;
  fetch("version.txt")
    .then(response => response.json())
    .then(json => {
      if (json.version > player.version) {
        Modal.message.show(json.message, updateRefresh);
      }
    });
}, 60000);

// TODO: remove before release
(function() {
  if (isLocalEnvironment()) return;
  let commit;
  setInterval(() => {
    const url = "https://api.github.com/repos/IvarK/HahaSlabWontGetHere/commits/master";
    const headers = new Headers();
    // Yes, this is my GitHub API key for reading private repo details
    headers.append("Authorization", `Basic ${btoa("Razenpok:9b15284a7c7a1142b5766f81967a96f90b7879a8")}`);

    fetch(url, { method: "GET", headers })
      .then(response => response.json())
      .then(json => {
        if (commit === undefined) {
          commit = json.sha;
          return;
        }
        if (commit === json.sha) return;
        // GH Pages need some time to get rebuilt, so show message after 30 seconds
        setTimeout(() => {
          Modal.message.show(
            "Refresh the page (game will be saved), we've got new stuff: " +
              `"${json.commit.message}" by ${json.author.login}`,
            updateRefresh,
            true
          );
        }, 30000);
      });
  }, 60000);
}());

function updateRefresh() {
  GameStorage.save(true);
  location.reload(true);
}

function kongLog10StatSubmission() {
  kong.submitStats("Log10 of total antimatter", player.totalAntimatter.e);
  kong.submitStats("Log10 of Infinity Points", player.infinityPoints.e);
  kong.submitStats("Log10 of Eternity Points", player.eternityPoints.e);
}

setInterval(kongLog10StatSubmission, 10000)

const GAME_SPEED_EFFECT = {
  FIXED_SPEED: 1,
  TIME_GLYPH: 2,
  BLACK_HOLE: 3,
  TIME_STORAGE: 4,
  MOMENTUM: 5,
  NERFS: 6
};

/**
  * @param {number[]} effectsToConsider A list of various game speed changing effects to apply when calculating
  *   the game speed.  If left undefined, all effects will be applied.
  * @param {number} blackHolesActiveOverride A numerical value which forces all black holes up to its specified index
  *   to be active for the purposes of game speed calculation. This is only used during offline black hole stuff.
  */
function getGameSpeedupFactor(effectsToConsider, blackHolesActiveOverride) {
  let effects;
  if (effectsToConsider === undefined) {
    effects = [GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH, GAME_SPEED_EFFECT.BLACK_HOLE,
      GAME_SPEED_EFFECT.TIME_STORAGE, GAME_SPEED_EFFECT.MOMENTUM, GAME_SPEED_EFFECT.NERFS];
  } else {
    effects = effectsToConsider;
  }

  if (effects.includes(GAME_SPEED_EFFECT.FIXED_SPEED)) {
    if (TimeCompression.isActive) {
      if (DarkEnergyUpgrade.compressionBoost.isBought) {
        return DarkEnergyUpgrade.compressionBoost.effect * 1e-100;
      }
      return 1e-100;
    }
    if (EternityChallenge(12).isRunning) {
      return 1 / 1000;
    }
  }

  let factor = 1;
  if (effects.includes(GAME_SPEED_EFFECT.BLACK_HOLE)) {
    if (BlackHoles.arePaused) {
      factor *= player.blackHoleNegative;
    } else {
      for (const blackHole of BlackHoles.list) {
        if (!blackHole.isUnlocked) break;
        const isActive = blackHolesActiveOverride === undefined
          ? blackHole.isActive
          : blackHole.id <= blackHolesActiveOverride;
        if (!isActive) break;
        factor *= Math.pow(blackHole.power, BlackHoles.unpauseAccelerationFactor);
        if (V.has(V_UNLOCKS.ACHIEVEMENT_BH)) {
          factor *= V_UNLOCKS.ACHIEVEMENT_BH.effect();
        }
      }
    }
  }

  if (effects.includes(GAME_SPEED_EFFECT.MOMENTUM)) {
    const cappedTime = Math.min(Time.thisRealityRealTime.totalMinutes, 7 * 24 * 60);
    factor *= Math.pow(AlchemyResource.momentum.effectValue, cappedTime);
  }

  if (effects.includes(GAME_SPEED_EFFECT.TIME_GLYPH)) {
    factor *= getAdjustedGlyphEffect("timespeed");
    factor = Math.pow(factor, getAdjustedGlyphEffect("effarigblackhole"));
  }

  // Time storage is linearly scaled because exponential scaling is pretty useless in practice
  if (Enslaved.isStoringGameTime && effects.includes(GAME_SPEED_EFFECT.TIME_STORAGE)) {
    const storedTimeWeight = player.celestials.enslaved.storedFraction;
    factor = factor * (1 - storedTimeWeight) + storedTimeWeight;
  }

  // These effects should always be active, but need to be disabled during offline black hole simulations because
  // otherwise it gets applied twice
  if (effects.includes(GAME_SPEED_EFFECT.NERFS)) {
    if (Effarig.isRunning) {
      factor = Effarig.multiplier(factor).toNumber();
    }
  }

  // Dev speedup should always be active
  if (tempSpeedupToggle) {
    factor *= tempSpeedupFactor;
  }
  return factor;
}

function getGameSpeedupForDisplay() {
  const speedFactor = getGameSpeedupFactor();
  if (Enslaved.isAutoReleasing &&
    !(EternityChallenge(12).isRunning || TimeCompression.isActive ||
      (BlackHoles.arePaused && player.blackHoleNegative < 1))) {
    return Math.max(Enslaved.autoReleaseSpeed, speedFactor);
  }
  return speedFactor;
}

// "diff" is in ms.  It is only unspecified when it's being called normally and not due to simulating time, in which
// case it uses the gap between now and the last time the function was called.  This is on average equal to the update
// rate.
function gameLoop(diff, options = {}) {
  PerformanceStats.start("Frame Time");
  PerformanceStats.start("Game Update");
  EventHub.dispatch(GAME_EVENT.GAME_TICK_BEFORE);
  const thisUpdate = Date.now();
  const realDiff = diff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 21600000)
    : diff;

  // Matter dimensions bypass any kind of stored time mechanics
  Laitela.handleMatterDimensionUnlocks();
  matterDimensionLoop(realDiff);

  // When storing real time, skip everything else having to do with production once stats are updated
  if (Enslaved.isStoringRealTime) {
    player.realTimePlayed += realDiff;
    player.thisInfinityRealTime += realDiff;
    player.thisEternityRealTime += realDiff;
    player.thisRealityRealTime += realDiff;
    Enslaved.storeRealTime();
    GameUI.update();
    return;
  }

  // Ra-Enslaved auto-release stored time (once every 5 ticks)
  if (Enslaved.isAutoReleasing && !Enslaved.isRunning) {
    Enslaved.autoReleaseTick++;
  }
  if (Enslaved.autoReleaseTick >= 5) {
    Enslaved.autoReleaseTick = 0;
    Enslaved.useStoredTime(true);
    Enslaved.isReleaseTick = true;
  } else if (!Enslaved.isReleaseTick) {
    Enslaved.nextTickDiff = realDiff;
  }
  if (diff === undefined) {
    diff = Enslaved.nextTickDiff;
  }

  slowerAutobuyers(realDiff);
  Autobuyers.tick();

  // We do these after autobuyers, since it's possible something there might
  // change a multiplier.
  GameCache.normalDimensionCommonMultiplier.invalidate();
  GameCache.normalDimensionFinalMultipliers.invalidate();
  GameCache.infinityDimensionCommonMultiplier.invalidate();
  GameCache.timeDimensionCommonMultiplier.invalidate();
  GameCache.totalIPMult.invalidate();

  const blackHoleDiff = realDiff;
  const fixedSpeedActive = EternityChallenge(12).isRunning || TimeCompression.isActive;
  if (!Enslaved.isReleaseTick && !fixedSpeedActive) {
    let speedFactor;
    if (options.blackHoleSpeedup === undefined) {
      speedFactor = getGameSpeedupFactor();
    } else {
      // This is only called from simulateTime() and is calculated externally in order to avoid weirdness when game
      // speed is directly nerfed
      speedFactor = options.blackHoleSpeedup;
    }

    if (Enslaved.isStoringGameTime && !fixedSpeedActive) {
      // These variables are the actual game speed used and the game speed unaffected by time storage, respectively
      const reducedTimeFactor = getGameSpeedupFactor();
      const totalTimeFactor = getGameSpeedupFactor([GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH,
        GAME_SPEED_EFFECT.BLACK_HOLE, GAME_SPEED_EFFECT.MOMENTUM]);
      const amplification = Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME)
        ? RA_UNLOCKS.IMPROVED_STORED_TIME.effect.gameTimeAmplification()
        : 1;
      Enslaved.currentBlackHoleStoreAmountPerMs = Math.pow(totalTimeFactor - reducedTimeFactor, amplification);
      player.celestials.enslaved.stored += diff * Enslaved.currentBlackHoleStoreAmountPerMs;
      speedFactor = reducedTimeFactor;
    }
    diff *= speedFactor;
  } else if (fixedSpeedActive) {
    diff *= getGameSpeedupFactor();
  }
  player.celestials.ra.peakGamespeed = Math.max(player.celestials.ra.peakGamespeed, getGameSpeedupFactor());
  Enslaved.isReleaseTick = false;

  // These need to all be done consecutively in order to minimize the chance of a reset occurring between real time
  // updating and game time updating.  This is only particularly noticeable when game speed is 1 and the player
  // expects to see identical numbers.
  player.realTimePlayed += realDiff;
  player.totalTimePlayed += diff;
  player.thisInfinityRealTime += realDiff;
  player.thisInfinityTime += diff;
  player.thisEternityRealTime += realDiff;
  if (Enslaved.isRunning && Enslaved.feltEternity) {
    player.thisEternity += diff * (1 + player.eternities.clampMax(1e66).toNumber());
  } else {
    player.thisEternity += diff;
  }
  player.thisRealityRealTime += realDiff;
  player.thisReality += diff;

  DeltaTimeState.update(realDiff, diff);

  updateNormalAndInfinityChallenges(diff);

  // IP generation is broken into a couple of places in gameLoop; changing that might change the
  // behavior of eternity farming.
  preProductionGenerateIP(diff);

  if (!EternityChallenge(4).isRunning) {
    let infGen = new Decimal(0);
    if (BreakInfinityUpgrade.infinitiedGen.isBought) {
      // Multipliers are done this way to explicitly exclude ach87 and TS32
      infGen = infGen.plus(0.2 * Time.deltaTimeMs / player.bestInfinityTime);
      infGen = infGen.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7)
      );
      infGen = infGen.times(getAdjustedGlyphEffect("infinityinfmult"));
      infGen = infGen.times(RA_UNLOCKS.TT_BOOST.effect.infinity());
    }
    if (RealityUpgrade(11).isBought) {
      infGen = infGen.plus(RealityUpgrade(11).effectValue.times(Time.deltaTime));
    }
    if (EffarigUnlock.eternity.isUnlocked) {
      infGen = infGen.plus(gainedInfinities().times(player.eternities).times(Time.deltaTime));
    }
    infGen = infGen.plus(player.partInfinitied);
    player.infinitied = player.infinitied.plus(infGen.floor());
    player.partInfinitied = infGen.minus(infGen.floor()).toNumber();
  }

  if (RealityUpgrade(14).isBought) {
    let eternitiedGain = Effects.product(
      RealityUpgrade(3),
      RealityUpgrade(14)
    );
    eternitiedGain *= getAdjustedGlyphEffect("timeetermult");
    player.reality.partEternitied = player.reality.partEternitied
      .plus(new Decimal(Time.deltaTime).times(Decimal.pow(eternitiedGain, AlchemyResource.eternity.effectValue))
    );
    player.eternities = player.eternities.plus(player.reality.partEternitied.floor());
    player.reality.partEternitied = player.reality.partEternitied.sub(player.reality.partEternitied.floor());
  }

  applyAutoprestige(realDiff);

  const uncountabilityGain = AlchemyResource.uncountability.effectValue * Time.unscaledDeltaTime.totalSeconds;
  player.realities += uncountabilityGain;
  player.reality.pp += uncountabilityGain;

  if (Perk.autocompleteEC1.isBought && player.reality.autoEC) player.reality.lastAutoEC += realDiff;

  EternityChallenge(12).tryFail();
  Achievements._power.invalidate();

  TimeDimensions.tick(diff);
  InfinityDimensions.tick(diff);
  NormalDimensions.tick(diff);

  const freeTickspeed = FreeTickspeed.fromShards(player.timeShards);
  const gain = Math.max(0, freeTickspeed.newAmount - player.totalTickGained);
  player.totalTickGained += gain;
  player.tickThreshold = freeTickspeed.nextShards;

  const currentIPmin = gainedInfinityPoints().dividedBy(Time.thisInfinityRealTime.totalMinutes);
  if (currentIPmin.gt(player.bestIPminThisInfinity) && canCrunch()) player.bestIPminThisInfinity = currentIPmin;

  tryUnlockInfinityChallenges();

  EternityChallenges.autoComplete.tick();

  replicantiLoop(diff);

  if (player.infMultBuyer) {
    InfinityUpgrade.ipMult.autobuyerTick();
  }

  if (player.reality.epmultbuyer) EternityUpgrade.epMult.buyMax();

  const currentEPmin = gainedEternityPoints().dividedBy(Time.thisEternityRealTime.totalMinutes);
  if (currentEPmin.gt(player.bestEPminThisEternity) && canEternity()) player.bestEPminThisEternity = currentEPmin;

  if (PlayerProgress.dilationUnlocked()) {
    player.dilation.dilatedTime = player.dilation.dilatedTime.plus(getDilationGainPerSecond().times(diff / 1000));
  }

  updateFreeGalaxies();
  player.timestudy.theorem = player.timestudy.theorem.add(getTTPerSecond().times(diff / 1000));
  tryUnlockInfinityDimensions();
  applyAutoprestige();

  BlackHoles.updatePhases(blackHoleDiff);

  // Code to auto-unlock dilation; 16617 is the cost for buying literally all time studies and unlocking dilation
  if (Ra.has(RA_UNLOCKS.INSTANT_AUTOEC) && player.timestudy.theorem.plus(calculateTimeStudiesCost()).gte(16617)) {
    TimeStudy.dilation.purchase(true);
  }

  // TD5-8/Reality unlock and TTgen perk autobuy
  autoBuyExtraTimeDims();
  if (Perk.autounlockDilation3.isBought) {
    buyDilationUpgrade(DilationUpgrade.ttGenerator.id);
  }
  if (Perk.autounlockReality.isBought) TimeStudy.reality.purchase(true);

  if (GlyphSelection.active) GlyphSelection.update(gainedGlyphLevel());

  if (player.dilation.active && Ra.has(RA_UNLOCKS.AUTO_TP)) rewardTP();

  if (Enslaved.isRunning && player.thisRealityRealTime > 2 * 3600 * 1000 && !Enslaved.ec6c10timeHint) {
    Enslaved.ec6c10timeHint = true;
    Modal.message.show("... you need ... to look harder ...");
  }

  Achievements.autoAchieveUpdate(diff);
  V.checkForUnlocks();
  Ra.updateAlchemyFlow();
  AutomatorBackend.update(realDiff);

  EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  GameUI.update();
  player.lastUpdate = thisUpdate;
  PerformanceStats.end("Game Update");
}

// This gives IP/EP/RM from the respective upgrades that reward the prestige currencies continuously
function applyAutoprestige(diff) {
  player.infinityPoints = player.infinityPoints.plusEffectOf(TimeStudy(181));

  if (Teresa.has(TERESA_UNLOCKS.EPGEN)) {
    player.eternityPoints = player.eternityPoints.plus(player.bestEPminThisEternity.times(0.01)
      .times(getGameSpeedupFactor() * diff / 1000).times(RA_UNLOCKS.TT_BOOST.effect.autoPrestige()));
  }

  if (InfinityUpgrade.ipGen.isCharged) {
    const addedRM = gainedRealityMachines()
      .timesEffectsOf(InfinityUpgrade.ipGen.chargedEffect)
      .times(diff / 1000);
    player.reality.realityMachines = player.reality.realityMachines.add(addedRM);
  }
}

function updateFreeGalaxies() {
  const freeGalaxyMult = Effects.max(1, DilationUpgrade.doubleGalaxies);
  const freeGalaxyThreshold = Effects.max(1000, CompressionUpgrade.freeGalaxySoftcap);
  const thresholdMult = getFreeGalaxyMult();
  player.dilation.baseFreeGalaxies = Math.max(player.dilation.baseFreeGalaxies,
    1 + Math.floor(Decimal.log(player.dilation.dilatedTime.dividedBy(1000), thresholdMult)));
  player.dilation.nextThreshold = new Decimal(1000).times(new Decimal(thresholdMult)
    .pow(player.dilation.baseFreeGalaxies));
  player.dilation.freeGalaxies = Math.min(player.dilation.baseFreeGalaxies * freeGalaxyMult, freeGalaxyThreshold) +
    Math.max(player.dilation.baseFreeGalaxies * freeGalaxyMult - freeGalaxyThreshold, 0) / freeGalaxyMult;
}

function getTTPerSecond() {
  // All TT multipliers (note that this is equal to 1 pre-Ra)
  let ttMult = RA_UNLOCKS.TT_BOOST.effect.ttGen();
  ttMult *= Achievement(137).effectValue;
  if (Ra.has(RA_UNLOCKS.TT_ACHIEVEMENT)) ttMult *= RA_UNLOCKS.TT_ACHIEVEMENT.effect();
  if (GlyphAlteration.isAdded("dilation")) ttMult *= getSecondaryGlyphEffect("dilationTTgen");

  // Glyph TT generation
  const glyphTT = Teresa.isRunning || Enslaved.isRunning
    ? 0
    : getAdjustedGlyphEffect("dilationTTgen") * ttMult;

  // Dilation TT generation
  const dilationTT = DilationUpgrade.ttGenerator.isBought
    ? DilationUpgrade.ttGenerator.effectValue.times(ttMult)
    : new Decimal(0);

  return dilationTT.add(glyphTT);
}

function simulateTime(seconds, real, fast) {
  // Don't do asynchronous processing loops nested in simulateTime
  Async.enabled = false;

  // The game is simulated at a base 50ms update rate, with a max of 1000 ticks. additional ticks are converted
  // into a higher diff per tick
  // warning: do not call this function with real unless you know what you're doing
  // calling it with fast will only simulate it with a max of 50 ticks
  let ticks = seconds * 20;
  GameUI.notify.showBlackHoles = false;

  // Limit the tick count (this also applies if the black hole is unlocked)
  if (ticks > 1000 && !real && !fast) {
    ticks = 1000;
  } else if (ticks > 50 && fast) {
    ticks = 50;
  }
  const largeDiff = (1000 * seconds) / ticks;

  const playerStart = deepmerge.all([{}, player]);

  player.infinitied = player.infinitied.plus(getInfinitiedMilestoneReward(seconds * 1000));
  player.eternities = player.eternities.plus(getEternitiedMilestoneReward(seconds * 1000));
  player.eternityPoints = player.eternityPoints.plus(getOfflineEPGain(seconds * 1000));

  if (InfinityUpgrade.ipOffline.isBought) {
    player.infinityPoints = player.infinityPoints.plus(player.bestIpPerMsWithoutMaxAll.times(seconds * 1000 / 2));
  }


  // Simulation code with black hole (doesn't use diff since it splits up based on real time instead)
  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    let remainingRealSeconds = seconds;
    for (let numberOfTicksRemaining = ticks; numberOfTicksRemaining > 0; numberOfTicksRemaining--) {
      const [realTickTime, blackHoleSpeedup] = BlackHoles.calculateOfflineTick(remainingRealSeconds,
        numberOfTicksRemaining, 0.0001);
      remainingRealSeconds -= realTickTime;
      gameLoop(1000 * realTickTime, { blackHoleSpeedup: blackHoleSpeedup });
    }
  } else {
    for (let ticksDone = 0; ticksDone < ticks; ticksDone++) {
      gameLoop(largeDiff);
      if (real) {
        console.log(ticksDone);
      }
    }
  }

  const offlineIncreases = ["While you were away"];
  // OoM increase
  const oomVarNames = ["antimatter", "infinityPower", "timeShards"];
  const oomResourceNames = ["antimatter", "infinity power", "time shards"];
  for (let i = 0; i < oomVarNames.length; i++) {
    const varName = oomVarNames[i];
    const oomIncrease = player[varName].log10() - playerStart[varName].log10();
    // Needs an isFinite check in case it's zero before or afterwards
    if (player[varName].gt(playerStart[varName]) && Number.isFinite(oomIncrease)) {
      offlineIncreases.push(`your ${oomResourceNames[i]} increased by ` +
        `${format(oomIncrease, 2, 2)} orders of magnitude`);
    }
  }
  // Linear increase
  const linearVarNames = ["infinitied", "eternities"];
  const linearResourceNames = ["infinities", "eternities"];
  const prestigeReset = ["eternitied", "realitied"];
  for (let i = 0; i < linearVarNames.length; i++) {
    const varName = linearVarNames[i];
    const linearIncrease = Decimal.sub(player[varName], playerStart[varName]);
    if (linearIncrease.lessThan(0)) {
      // This happens when a prestige autobuyer triggers offline and resets the value
      offlineIncreases.push(`you ${prestigeReset[i]} and then generated ` +
        `${format(player[varName], 2, 0)} more ${linearResourceNames[i]}`);
    } else if (!Decimal.eq(player[varName], playerStart[varName])) {
      offlineIncreases.push(`you generated ${format(linearIncrease, 2, 0)} ${linearResourceNames[i]}`);
    }
  }
  // Black hole activations
  for (let i = 0; i < player.blackHole.length; i++) {
    const currentActivations = player.blackHole[i].activations;
    const oldActivations = playerStart.blackHole[i].activations;
    const activationsDiff = currentActivations - oldActivations;
    const pluralSuffix = activationsDiff === 1 ? " time" : " times";
    if (activationsDiff > 0 && !BlackHole(i + 1).isPermanent) {
      offlineIncreases.push(`Black hole ${i + 1} activated  ${activationsDiff} ${pluralSuffix}`);
    }
  }
  let popupString = `${offlineIncreases.join(", <br>")}.`;
  if (popupString === "While you were away.") {
    popupString += ".. Nothing happened.";
    SecretAchievement(36).unlock();
  }

  Modal.message.show(popupString);
  GameUI.notify.showBlackHoles = true;
  Async.enabled = true;
}

function updateChart(first) {
    if (first !== true && (player.infinitied.gte(1) || player.eternities.gte(1)) && player.options.chart.on === true) {
      addChartData(NormalDimension(1).productionPerSecond);
    }
    if (player.options.chart.updateRate) {
        setTimeout(updateChart, player.options.chart.updateRate);
    } else {
        setTimeout(updateChart, 1000);
    }
}
updateChart(true);

function autoBuyDilationUpgrades() {
  if (Perk.autobuyerDilation.isBought) {
    const upgrades = [DilationUpgrade.dtGain, DilationUpgrade.galaxyThreshold, DilationUpgrade.tachyonGain].filter(
      upgrade => upgrade.isAutobuyerOn);
    for (const upgrade of upgrades) {
      upgrade.purchase(true);
    }
  }
}

function autoBuyInfDims() {
  if (EternityMilestone.autobuyerID(1).isReached && !EternityChallenge(8).isRunning) {
    for (let i = 1; i <= player.eternities.sub(10).clampMax(8).toNumber(); i++) {
      if (player.infDimBuyers[i - 1]) {
        buyMaxInfDims(i)
        buyManyInfinityDimension(i)
      }
    }
  }
}

function autoBuyTimeDims() {
  if (RealityUpgrade(13).isBought) {
    for (let i = 1; i < 9; i++) {
      if (player.reality.tdbuyers[i - 1]) {
        buyMaxTimeDimTier(i)
      }
    }
  }
}

function autoBuyExtraTimeDims() {
  if (TimeDimension(8).bought === 0 && Perk.autounlockTD.isBought) {
    for (let dim = 5; dim <= 8; ++dim) TimeStudy.timeDimension(dim).purchase();
  }
}

function slowerAutobuyers(realDiff) {
  const ampDiff = realDiff * Effects.product(PerkShopUpgrade.autoSpeed);
  player.auto.infDimTimer += ampDiff;
  const infDimPeriod = 1000 * Effects.product(Perk.autobuyerFasterID);
  if (player.auto.infDimTimer >= infDimPeriod) {
    // Note: we need to reset to a low number here, because we don't want a pile of these accumulating during offline
    // time and then releasing normally.
    player.auto.infDimTimer = Math.min(player.auto.infDimTimer - infDimPeriod, infDimPeriod);
    autoBuyInfDims();
  }
  player.auto.timeDimTimer += ampDiff;
  const timeDimPeriod = 1000;
  if (player.auto.timeDimTimer >= timeDimPeriod) {
    player.auto.timeDimTimer = Math.min(player.auto.timeDimTimer - timeDimPeriod, timeDimPeriod);
    autoBuyTimeDims();
  }
  player.auto.repUpgradeTimer += ampDiff;
  const repUpgradePeriod = 1000 * Effects.product(Perk.autobuyerFasterReplicanti);
  if (player.auto.repUpgradeTimer >= repUpgradePeriod) {
    player.auto.repUpgradeTimer = Math.min(player.auto.repUpgradeTimer - repUpgradePeriod, repUpgradePeriod);
    autoBuyReplicantiUpgrades();
  }
  player.auto.dilUpgradeTimer += ampDiff;
  const dilUpgradePeriod = 1000 * Effects.product(Perk.autobuyerFasterDilation);
  if (player.auto.dilUpgradeTimer >= dilUpgradePeriod) {
    player.auto.dilUpgradeTimer = Math.min(player.auto.dilUpgradeTimer - dilUpgradePeriod, dilUpgradePeriod);
    autoBuyDilationUpgrades();
  }
  autoBuyMaxTheorems(ampDiff);
}

setInterval(function () {
    if (playFabId != -1 && player.options.cloud) playFabSaveCheck();
}, 1000*60*5)

window.onload = function() {
  GameUI.initialized = true;
  ui.view.initialized = true;
  GameIntervals.start();
  setTimeout(() => {
    if (kong.enabled) {
      playFabLogin();
      kong.updatePurchases();
    }
    document.getElementById("loading").style.display = "none";
    document.body.style.overflowY = "auto";
  }, 500);
};

window.onfocus = function() {
    setShiftKey(false);
};

window.onblur = function() {
  GameKeyboard.stopSpins();
};

function setShiftKey(isDown) {
  ui.view.shiftDown = isDown;
}

function init() {
  // eslint-disable-next-line no-console
  console.log("🌌 Antimatter Dimensions: Reality Update 🌌");
  Tab.dimensions.normal.show();
  GameStorage.load();
  kong.init();
}

init();

let tweenTime = 0;
(function() {
    let lastFrame;
    function animateTweens(time) {
        requestAnimationFrame(animateTweens);
        if (time === undefined || lastFrame === undefined) {
            lastFrame = time;
            return;
        }
        let delta = time - lastFrame;
        lastFrame = time;
        if (player.dilation.active) {
            delta /= 10;
        }
        tweenTime += delta;
        TWEEN.update(tweenTime);
    }

    animateTweens();
}());
