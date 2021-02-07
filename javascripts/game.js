"use strict";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

function playerInfinityUpgradesOnEternity() {
  if (!EternityMilestone.keepInfinityUpgrades.isReached) player.infinityUpgrades.clear();
  else if (!EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityUpgrades = new Set(["timeMult", "dimMult", "timeMult2", "skipReset1", "skipReset2",
      "unspentBonus", "27Mult", "18Mult", "36Mult", "resetMult", "skipReset3", "passiveGen",
      "45Mult", "resetBoost", "galaxyBoost", "skipResetGalaxy", "ipOffline"]);
  }
  if (Pelle.isDisabled()) player.infinityUpgrades = new Set(player.celestials.pelle.infinityUpgrades);
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
  if (Pelle.isDisabled("IPGain")) return new Decimal(0);
  if (Pelle.isDisabled("IPMults")) {
    return Decimal.pow10(player.records.thisInfinity.maxAM.log10() / 308 - 0.75).floor();
  }
  const div = Effects.min(
    308,
    Achievement(103),
    TimeStudy(111)
  );
  let ip = player.break
    ? Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75)
    : new Decimal(308 / div);
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) {
    ip = ip.min(1e200);
  }
  ip = ip.times(GameCache.totalIPMult.value);
  if (Teresa.isRunning) {
    ip = ip.pow(0.55);
  } else if (V.isRunning) {
    ip = ip.pow(0.5);
  } else if (Laitela.isRunning) {
    ip = dilatedValueOf(ip);
  }
  if (GlyphAlteration.isAdded("infinity")) {
    ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
  }

  if (Pelle.isDoomed) {
    ip = ip.times(GameCache.totalIPMult.value.pow(-2 / 3));
  }
  return ip.floor();
}

function totalEPMult() {
  return new Decimal(getAdjustedGlyphEffect("cursedEP"))
    .times(ShopPurchase.EPPurchases.currentMult)
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
  if (Pelle.isDisabled("EPGain")) return new Decimal(0);
  let ep = Decimal.pow(5, player.infinityPoints.plus(gainedInfinityPoints()).log10() / 308 - 0.7).times(totalEPMult());
  if (Pelle.isDisabled("EPMults")) return ep.dividedBy(totalEPMult());

  if (Teresa.isRunning) {
    ep = ep.pow(0.55);
  } else if (V.isRunning) {
    ep = ep.pow(0.5);
  } else if (Laitela.isRunning) {
    ep = dilatedValueOf(ep);
  }
  if (GlyphAlteration.isAdded("time")) {
    ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
  }
  return ep.floor();
}

function requiredIPForEP() {
  return Decimal.pow10(Math.ceil(308 * (Decimal.log(totalEPMult().reciprocal(), 5) + 0.7)));
}

function getRealityMachineMultiplier() {
  return Teresa.rmMultiplier * Effects.max(1, PerkShopUpgrade.rmMult) *
    getAdjustedGlyphEffect("effarigrm") * Achievement(167).effectOrDefault(1);
}

function gainedRealityMachines() {
  let log10FinalEP = player.eternityPoints.plus(gainedEternityPoints()).log10();
  if (player.realities === 0 && log10FinalEP > 6000 && player.saveOverThresholdFlag) {
    log10FinalEP -= (log10FinalEP - 6000) * 0.75;
  }
  let rmGain = Decimal.pow(1000, log10FinalEP / 4000 - 1);
  // Increase base RM gain if <10 RM
  if (rmGain.gte(1) && rmGain.lt(10)) rmGain = new Decimal(27 / 4000 * log10FinalEP - 26);
  rmGain = rmGain.times(getRealityMachineMultiplier());
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

function averageRun(runs, name) {
  const totalTime = runs.map(run => run[0]).sum();
  const totalAmount = runs
    .map(run => run[1])
    .reduce(Decimal.sumReducer);
  const totalPrestigeGain = runs
    .map(run => run[2])
    .reduce(name === "Reality" ? Number.sumReducer : Decimal.sumReducer);
  const realTime = runs.map(run => run[3]).sum();
  const average = [
    totalTime / runs.length,
    totalAmount.dividedBy(runs.length),
    (name === "Reality") ? totalPrestigeGain / runs.length : totalPrestigeGain.dividedBy(runs.length),
    realTime / runs.length
  ];
  if (name === "Reality") {
    average.push(runs.map(x => x[4]).sum() / runs.length);
  }
  return average;
}

// eslint-disable-next-line max-params
function addInfinityTime(time, realTime, ip, infinities) {
  player.records.lastTenInfinities.pop();
  player.records.lastTenInfinities.unshift([time, ip, infinities, realTime]);
  GameCache.bestRunIPPM.invalidate();
}

function resetInfinityRuns() {
  player.records.lastTenInfinities = Array.from(
    { length: 10 },
    () => [Number.MAX_VALUE, new Decimal(1), new Decimal(1), Number.MAX_VALUE]
  );
  GameCache.bestRunIPPM.invalidate();
}

// Player gains 50% of infinitied stat they would get based on their best infinitied/hour crunch if they have the
// milestone and turned on infinity autobuyer with 1 minute or less per crunch
function getInfinitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.bigCrunch.autoInfinitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisEternity.bestInfinitiesPerMs.times(ms).dividedBy(2))
    : new Decimal(0);
}

// eslint-disable-next-line max-params
function addEternityTime(time, realTime, ep, eternities) {
  player.records.lastTenEternities.pop();
  player.records.lastTenEternities.unshift([time, ep, eternities, realTime]);
  GameCache.averageRealTimePerEternity.invalidate();
}

function resetEternityRuns() {
  player.records.lastTenEternities = Array.from(
    { length: 10 },
    () => [Number.MAX_VALUE, new Decimal(1), new Decimal(1), Number.MAX_VALUE]
  );
  GameCache.averageRealTimePerEternity.invalidate();
}

// Player gains 50% of the eternities they would get if they continuously repeated their fastest eternity, if they
// have the auto-eternity milestone and turned on eternity autobuyer with 0 EP
function getEternitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.eternity.autoEternitiesAvailable(considerMilestoneReached)
    ? Decimal.floor(player.records.thisReality.bestEternitiesPerMs.times(ms).dividedBy(2))
    : new Decimal(0);
}

function isOfflineEPGainEnabled() {
  return !Autobuyer.bigCrunch.autoInfinitiesAvailable() &&
    !Autobuyer.eternity.autoEternitiesAvailable();
}

function getOfflineEPGain(ms) {
  if (!EternityMilestone.autoEP.isReached || !isOfflineEPGainEnabled()) return new Decimal(0);
  return player.records.bestEternity.bestEPminReality.times(TimeSpan.fromMilliseconds(ms).totalMinutes / 4);
}

// eslint-disable-next-line max-params
function addRealityTime(time, realTime, rm, level, realities) {
  player.records.lastTenRealities.pop();
  player.records.lastTenRealities.unshift([time, rm, realities, realTime, level]);
}

function gainedInfinities() {
    if (EternityChallenge(4).isRunning || Pelle.isDisabled("InfinitiedMults")) {
        return new Decimal(1);
    }
    let infGain = Effects.max(
      1,
      Achievement(87)
    ).toDecimal();

    infGain = infGain.timesEffectsOf(
      TimeStudy(32),
      RealityUpgrade(5),
      RealityUpgrade(7),
      Achievement(164)
    );
    infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
    infGain = infGain.times(RA_UNLOCKS.TT_BOOST.effect.infinity());
    infGain = infGain.powEffectOf(SingularityMilestone.infinitiedPow);
    return infGain;
}

// TODO: remove before release
(function() {
  if (isLocalEnvironment()) return;
  let commit;
  setInterval(() => {
    const url = "https://api.github.com/repos/IvarK/IToughtAboutCurseWordsButThatWouldBeMeanToOmsi/commits/master";
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

const GAME_SPEED_EFFECT = {
  FIXED_SPEED: 1,
  TIME_GLYPH: 2,
  BLACK_HOLE: 3,
  TIME_STORAGE: 4,
  SINGULARITY_MILESTONE: 5,
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
      GAME_SPEED_EFFECT.TIME_STORAGE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.NERFS];
  } else {
    effects = effectsToConsider;
  }

  if (effects.includes(GAME_SPEED_EFFECT.FIXED_SPEED)) {
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

  if (effects.includes(GAME_SPEED_EFFECT.SINGULARITY_MILESTONE)) {
    factor *= SingularityMilestone.gamespeedFromSingularities.canBeApplied
      ? SingularityMilestone.gamespeedFromSingularities.effectValue
      : 1;
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
    } else if (Laitela.isRunning) {
      const nerfModifier = Math.clampMax(Time.thisRealityRealTime.totalMinutes / 10, 1);
      factor = Math.pow(factor, nerfModifier);
    }
  }

  // 1e-300 is now possible with max inverted BH, going below it would be possible with
  // an effarig glyph.
  factor = Math.clamp(factor, 1e-300, 1e300);

  // Dev speedup should always be active
  if (tempSpeedupToggle) {
    factor *= tempSpeedupFactor;
  }
  return factor;
}

function getGameSpeedupForDisplay() {
  const speedFactor = getGameSpeedupFactor();
  if (Enslaved.isAutoReleasing && Enslaved.canRelease(true) &&
  !BlackHoles.areNegative && !Pelle.isDisabled("blackhole")) {
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

  // Ra memory generation bypasses stored real time, but memory chunk generation is disabled when storing real time.
  // This is in order to prevent players from using time inside of Ra's reality for amplification as well
  Ra.memoryTick(realDiff, !Enslaved.isStoringRealTime);
  if (AlchemyResource.momentum.isUnlocked) player.celestials.ra.momentumTime += realDiff;

  // Lai'tela mechanics should bypass stored real time entirely
  Laitela.handleMatterDimensionUnlocks();
  Laitela.tickDarkMatter(realDiff);
  Laitela.autobuyerLoop(realDiff);

  // When storing real time, skip everything else having to do with production once stats are updated
  if (Enslaved.isStoringRealTime) {
    player.records.realTimePlayed += realDiff;
    player.records.thisInfinity.realTime += realDiff;
    player.records.thisEternity.realTime += realDiff;
    player.records.thisReality.realTime += realDiff;
    Enslaved.storeRealTime();
    GameUI.update();
    return;
  }

  // Ra-Enslaved auto-release stored time (once every 5 ticks)
  if (Enslaved.isAutoReleasing) {
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

  if (Achievement(165).isUnlocked && player.celestials.effarig.autoAdjustGlyphWeights) {
    autoAdjustGlyphWeights();
  }

  // We do these after autobuyers, since it's possible something there might
  // change a multiplier.
  GameCache.antimatterDimensionCommonMultiplier.invalidate();
  GameCache.antimatterDimensionFinalMultipliers.invalidate();
  GameCache.infinityDimensionCommonMultiplier.invalidate();
  GameCache.timeDimensionCommonMultiplier.invalidate();
  GameCache.totalIPMult.invalidate();

  const blackHoleDiff = realDiff;
  const fixedSpeedActive = EternityChallenge(12).isRunning;
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
        GAME_SPEED_EFFECT.BLACK_HOLE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE]);
      const amplification = Ra.has(RA_UNLOCKS.IMPROVED_STORED_TIME)
        ? RA_UNLOCKS.IMPROVED_STORED_TIME.effect.gameTimeAmplification()
        : 1;
      Enslaved.currentBlackHoleStoreAmountPerMs = Math.pow(totalTimeFactor - reducedTimeFactor, amplification);
      player.celestials.enslaved.stored = Math.clampMax(player.celestials.enslaved.stored +
        diff * Enslaved.currentBlackHoleStoreAmountPerMs, Enslaved.timeCap);
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
  player.records.realTimePlayed += realDiff;
  player.records.totalTimePlayed += diff;
  player.records.thisInfinity.realTime += realDiff;
  player.records.thisInfinity.time += diff;
  player.records.thisEternity.realTime += realDiff;
  if (Enslaved.isRunning && Enslaved.feltEternity && !EternityChallenge(12).isRunning) {
    player.records.thisEternity.time += diff * (1 + player.eternities.clampMax(1e66).toNumber());
  } else {
    player.records.thisEternity.time += diff;
  }
  player.records.thisReality.realTime += realDiff;
  player.records.thisReality.time += diff;

  DeltaTimeState.update(realDiff, diff);

  updateNormalAndInfinityChallenges(diff);

  // IP generation is broken into a couple of places in gameLoop; changing that might change the
  // behavior of eternity farming.
  preProductionGenerateIP(diff);

  if (!Pelle.isDisabled("infinitiedGen")) {
    passivePrestigeGen();
  }

  applyAutoprestige(realDiff);

  if (Perk.autocompleteEC1.isBought && player.reality.autoEC) player.reality.lastAutoEC += realDiff;

  EternityChallenge(12).tryFail();
  Achievements._power.invalidate();

  TimeDimensions.tick(diff);
  InfinityDimensions.tick(diff);
  AntimatterDimensions.tick(diff);

  const gain = Math.clampMin(FreeTickspeed.fromShards(player.timeShards).newAmount - player.totalTickGained, 0);
  player.totalTickGained += gain;

  const currentIPmin = gainedInfinityPoints().dividedBy(Time.thisInfinityRealTime.totalMinutes);
  if (currentIPmin.gt(player.records.thisInfinity.bestIPmin) && Player.canCrunch)
    player.records.thisInfinity.bestIPmin = currentIPmin;

  tryUnlockInfinityChallenges();

  EternityChallenges.autoComplete.tick();

  replicantiLoop(diff);

  if (player.infMultBuyer) {
    InfinityUpgrade.ipMult.autobuyerTick();
  }

  if (player.reality.epmultbuyer) EternityUpgrade.epMult.buyMax();

  const currentEPmin = gainedEternityPoints().dividedBy(Time.thisEternityRealTime.totalMinutes);
  if (currentEPmin.gt(player.records.thisEternity.bestEPmin) && Player.canEternity)
    player.records.thisEternity.bestEPmin = currentEPmin;

  if (PlayerProgress.dilationUnlocked()) {
    player.dilation.dilatedTime = player.dilation.dilatedTime.plus(getDilationGainPerSecond().times(diff / 1000));
  }

  updateTachyonGalaxies();
  player.timestudy.theorem = player.timestudy.theorem.add(getTTPerSecond().times(diff / 1000));
  tryUnlockInfinityDimensions();

  BlackHoles.updatePhases(blackHoleDiff);

  // Code to auto-unlock dilation; 16617 is the cost for buying literally all time studies and unlocking dilation
  if (Ra.has(RA_UNLOCKS.INSTANT_AUTOEC) &&
    player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost()).gte(16617)) {
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

  if (!EnslavedProgress.hintsUnlocked.hasProgress && Enslaved.has(ENSLAVED_UNLOCKS.RUN) && !Enslaved.isCompleted) {
    player.celestials.enslaved.hintUnlockProgress += Enslaved.isRunning ? realDiff : realDiff / 25;
    if (player.celestials.enslaved.hintUnlockProgress >= TimeSpan.fromHours(5).totalMilliseconds) {
      EnslavedProgress.hintsUnlocked.giveProgress();
      Enslaved.quotes.show(Enslaved.quotes.HINT_UNLOCK);
    }
  }

  laitelaRealityTick(realDiff);
  Achievements.autoAchieveUpdate(diff);
  V.checkForUnlocks();
  Ra.updateAlchemyFlow();
  AutomatorBackend.update(realDiff);
  Pelle.gameLoop(realDiff);

  EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  GameUI.update();
  player.lastUpdate = thisUpdate;
  PerformanceStats.end("Game Update");
}

function passivePrestigeGen() {
  let eternitiedGain = new Decimal(0);
  if (RealityUpgrade(14).isBought && !Pelle.isDisabled("eternityGain")) {
    eternitiedGain = Effects.product(
      RealityUpgrade(3),
      RealityUpgrade(14)
    );
    eternitiedGain = Decimal.times(eternitiedGain, getAdjustedGlyphEffect("timeetermult"));
    eternitiedGain = new Decimal(Time.deltaTime).times(
      Decimal.pow(eternitiedGain, AlchemyResource.eternity.effectValue));
    player.reality.partEternitied = player.reality.partEternitied.plus(eternitiedGain);
    player.eternities = player.eternities.plus(player.reality.partEternitied.floor());
    player.reality.partEternitied = player.reality.partEternitied.sub(player.reality.partEternitied.floor());
  }

  if (!EternityChallenge(4).isRunning) {
    let infGen = new Decimal(0);
    if (BreakInfinityUpgrade.infinitiedGen.isBought) {
      // Multipliers are done this way to explicitly exclude ach87 and TS32
      infGen = infGen.plus(0.2 * Time.deltaTimeMs / player.records.bestInfinity.time);
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
    if (EffarigUnlock.eternity.canBeApplied) {
      // We consider half of the eternities we gained above this tick
      // to have been gained before the infinities, and thus not to
      // count here. This gives us the desirable behavior that
      // infinities and eternities gained overall will be the same
      // for two ticks as for one tick of twice the length.
      infGen = infGen.plus(gainedInfinities().times(
        player.eternities.minus(eternitiedGain.div(2).floor())).times(Time.deltaTime));
    }
    infGen = infGen.plus(player.partInfinitied);
    player.infinitied = player.infinitied.plus(infGen.floor());
    player.partInfinitied = infGen.minus(infGen.floor()).toNumber();
  }

  const uncountabilityGain = AlchemyResource.uncountability.effectValue * Time.unscaledDeltaTime.totalSeconds;
  player.realities += uncountabilityGain;
  player.reality.perkPoints += uncountabilityGain;
}

function laitelaRealityTick(realDiff) {
  const laitelaInfo = player.celestials.laitela;
  if (!Laitela.isRunning) return;
  if (laitelaInfo.entropy >= 0) {
    laitelaInfo.entropy += (realDiff / 1000) * Laitela.entropyGainPerSecond;
  }

  // Setting entropy to -1 on completion prevents the modal from showing up repeatedly
  if (laitelaInfo.entropy >= 1) {
    let completionText = `Lai'tela's Reality has been destabilized after ${Time.thisRealityRealTime.toStringShort()}.`;
    laitelaInfo.entropy = -1;
    laitelaInfo.thisCompletion = Time.thisRealityRealTime.totalSeconds;
    laitelaInfo.fastestCompletion = Math.min(laitelaInfo.thisCompletion, laitelaInfo.fastestCompletion);
    clearCelestialRuns();
    if (Time.thisRealityRealTime.totalSeconds < 30) {
      laitelaInfo.difficultyTier++;
      laitelaInfo.fastestCompletion = 300;
      // This causes display oddities at 3 or lower but I don't expect the player to get that far legitimately (?)
      completionText += `<br><br>Lai'tela's Reality will now disable production from all
        ${Laitela.maxAllowedDimension + 1}th Dimensions during future runs, but the reward will be
        ${formatInt(100)} times stronger than before.`;
    }
    Modal.message.show(completionText);
  }
  if (laitelaInfo.entropy < 0) Currency.antimatter.value = new Decimal(0);
}

// This gives IP/EP/RM from the respective upgrades that reward the prestige currencies continuously
function applyAutoprestige(diff) {
  player.infinityPoints = player.infinityPoints.plusEffectOf(TimeStudy(181));

  if (Teresa.has(TERESA_UNLOCKS.EPGEN) && !Pelle.isDisabled("EPgen")) {
    player.eternityPoints = player.eternityPoints.plus(player.records.thisEternity.bestEPmin.times(0.01)
      .times(getGameSpeedupFactor() * diff / 1000).times(RA_UNLOCKS.TT_BOOST.effect.autoPrestige()));
  }

  if (InfinityUpgrade.ipGen.isCharged) {
    const addedRM = gainedRealityMachines()
      .timesEffectsOf(InfinityUpgrade.ipGen.chargedEffect)
      .times(diff / 1000);
    player.reality.realityMachines = player.reality.realityMachines.add(addedRM);
  }

  if (player.records.bestReality.bestEP.lt(player.eternityPoints)) {
    player.records.bestReality.bestEP = new Decimal(player.eternityPoints);
    player.records.bestReality.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
  }
}

function updateTachyonGalaxies() {
  const tachyonGalaxyMult = Effects.max(1, DilationUpgrade.doubleGalaxies);
  const tachyonGalaxyThreshold = 1000;
  const thresholdMult = getTachyonGalaxyMult();
  player.dilation.baseTachyonGalaxies = Math.max(player.dilation.baseTachyonGalaxies,
    1 + Math.floor(Decimal.log(player.dilation.dilatedTime.dividedBy(1000), thresholdMult)));
  player.dilation.nextThreshold = new Decimal(1000).times(new Decimal(thresholdMult)
    .pow(player.dilation.baseTachyonGalaxies));
  player.dilation.totalTachyonGalaxies =
    Math.min(player.dilation.baseTachyonGalaxies * tachyonGalaxyMult, tachyonGalaxyThreshold) +
    Math.max(player.dilation.baseTachyonGalaxies * tachyonGalaxyMult - tachyonGalaxyThreshold, 0) / tachyonGalaxyMult;
}

function getTTPerSecond() {
  // All TT multipliers (note that this is equal to 1 pre-Ra)
  let ttMult = RA_UNLOCKS.TT_BOOST.effect.ttGen();
  ttMult *= Achievement(137).effectOrDefault(1);
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

  // Lai'tela TT power
  let finalTT = dilationTT.add(glyphTT);
  if (SingularityMilestone.theoremPowerFromSingularities.isUnlocked && finalTT.gt(1)) {
    finalTT = finalTT.pow(SingularityMilestone.theoremPowerFromSingularities.effectValue);
  }

  return finalTT;
}

function recursiveTimeOut(fn, iterations, endFn) {
  fn(iterations);
  if (iterations === 0) endFn();
  else setTimeout(() => recursiveTimeOut(fn, iterations - 1, endFn), 0);
}

function afterSimulation(seconds, playerBefore) {
  if (seconds > 600) {
    const playerAfter = deepmerge.all([{}, player]);
    Modal.awayProgress.show({ playerBefore, playerAfter, seconds });
  }

  GameUI.notify.showBlackHoles = true;
}

function simulateTime(seconds, real, fast) {
  // The game is simulated at a base 50ms update rate, with a max of
  // player.options.offlineTicks ticks. additional ticks are converted
  // into a higher diff per tick
  // warning: do not call this function with real unless you know what you're doing
  // calling it with fast will only simulate it with a max of 50 ticks
  let ticks = Math.floor(seconds * 20);
  GameUI.notify.showBlackHoles = false;

  // Limit the tick count (this also applies if the black hole is unlocked)
  if (ticks > player.options.offlineTicks && !real && !fast) {
    ticks = player.options.offlineTicks;
  } else if (ticks > 50 && fast) {
    ticks = 50;
  }
  // 1000 * seconds is milliseconds so 1000 * seconds / ticks is milliseconds per tick.
  const largeDiff = 1000 * seconds / ticks;

  const playerStart = deepmerge.all([{}, player]);

  let totalGameTime;

  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    totalGameTime = BlackHoles.calculateGameTimeFromRealTime(seconds, BlackHoles.calculateSpeedups());
  } else {
    totalGameTime = getGameSpeedupFactor() * seconds;
  }

  const infinitiedMilestone = getInfinitiedMilestoneReward(totalGameTime * 1000);
  const eternitiedMilestone = getEternitiedMilestoneReward(totalGameTime * 1000);

  if (eternitiedMilestone.gt(0)) {
    player.eternities = player.eternities.plus(eternitiedMilestone);
  } else if (infinitiedMilestone.gt(0)) {
    player.infinitied = player.infinitied.plus(infinitiedMilestone);
  } else {
    player.eternityPoints = player.eternityPoints.plus(getOfflineEPGain(totalGameTime * 1000));
  }

  if (InfinityUpgrade.ipOffline.isBought) {
    player.infinityPoints = player.infinityPoints
      .plus(player.records.thisEternity.bestIPMsWithoutMaxAll
        .times(seconds * 1000 / 2)
      );
  }

  let loopFn = () => gameLoop(largeDiff);
  let remainingRealSeconds = seconds;
  // Simulation code with black hole (doesn't use diff since it splits up based on real time instead)
  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    loopFn = i => {
      const [realTickTime, blackHoleSpeedup] = BlackHoles.calculateOfflineTick(remainingRealSeconds,
        i, 0.0001);
      remainingRealSeconds -= realTickTime;
      gameLoop(1000 * realTickTime, { blackHoleSpeedup });
    };
  }

  // We don't show the offline modal here or bother with async if doing a fast simulation
  if (fast) {
    GameIntervals.stop();
    for (let i = 0; i < 50; i++) {
      loopFn();
    }
    GameStorage.postLoadStuff();
    afterSimulation(seconds, playerStart);
  } else {
    ui.view.modal.progressBar = {};
    ui.view.modal.progressBar.label = "Simulating offline time...";
    Async.run(loopFn,
      ticks,
      {
        batchSize: 1,
        maxTime: 60,
        sleepTime: 1,
        asyncEntry: doneSoFar => {
          GameIntervals.stop();
          ui.$viewModel.modal.progressBar = {
            label: "Simulating offline time...",
            current: doneSoFar,
            max: ticks,
            startTime: Date.now()
          };
        },
        asyncProgress: doneSoFar => {
          ui.$viewModel.modal.progressBar.current = doneSoFar;
        },
        asyncExit: () => {
          ui.$viewModel.modal.progressBar = undefined;
          // .postLoadStuff will restart GameIntervals
          GameStorage.postLoadStuff();
        },
        then: () => {
          afterSimulation(seconds, playerStart);
        }
      });
  }
}

function autoBuyDilationUpgrades(extraFactor) {
  if (Perk.autobuyerDilation.isBought) {
    const upgrades = [DilationUpgrade.dtGain, DilationUpgrade.galaxyThreshold, DilationUpgrade.tachyonGain].filter(
      upgrade => upgrade.isAutobuyerOn);
    for (const upgrade of upgrades) {
      upgrade.purchase(true, extraFactor);
    }
  }
}

function autoBuyInfDims() {
  if (EternityMilestone.autobuyerID(1).isReached && !EternityChallenge(8).isRunning) {
    for (let i = 1; i <= player.eternities.sub(10).clampMax(8).toNumber(); i++) {
      if (player.infDimBuyers[i - 1]) {
        buyMaxInfDims(i);
        buyManyInfinityDimension(i);
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
  const ampDiff = realDiff * PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  player.auto.infDimTimer += ampDiff;
  const infDimPeriod = 1000 * Perk.autobuyerFasterID.effectOrDefault(1);
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
    if (RealityUpgrade(13).isBought) {
      maxAllTimeDimensions(true);
    }
  }
  player.auto.repUpgradeTimer += ampDiff;
  const repUpgradePeriod = 1000 * Perk.autobuyerFasterReplicanti.effectOrDefault(1);
  if (player.auto.repUpgradeTimer >= repUpgradePeriod) {
    player.auto.repUpgradeTimer = Math.min(player.auto.repUpgradeTimer - repUpgradePeriod, repUpgradePeriod);
    autoBuyReplicantiUpgrades();
  }
  player.auto.dilUpgradeTimer += ampDiff;
  const dilUpgradePeriod = 1000 * Perk.autobuyerFasterDilation.effectOrDefault(1);
  if (player.auto.dilUpgradeTimer >= dilUpgradePeriod) {
    // Because the dilation upgrade autobuyers naturally buy singles, it helps to
    // be able to trigger them multiple times in one long-enough tick, which is
    // what we do here. (This is why this code looks a bit different from that for
    // the other autobuyers, which buy max.)
    autoBuyDilationUpgrades(Math.floor(player.auto.dilUpgradeTimer / dilUpgradePeriod));
    player.auto.dilUpgradeTimer %= dilUpgradePeriod;
  }

  TimeTheorems.autoBuyMaxTheorems(ampDiff);
  Tutorial.tutorialLoop();

  if (Ra.has(RA_UNLOCKS.AUTO_BLACK_HOLE_POWER)) {
    for (let i = 1; i <= 2; i++) {
      if (BlackHole(i).powerUpgrade.isAutobuyerOn) {
        BlackHole(i).powerUpgrade.purchase();
      }
    }
  }

  if (Ra.has(RA_UNLOCKS.AUTO_REALITY_UPGRADES)) {
    for (let i = 1; i <= 5; i++) {
      if (RealityUpgrade(i).isAutobuyerOn) {
        RealityUpgrade(i).purchase();
      }
    }
  }
}

window.onload = function() {
  GameUI.initialized = true;
  ui.view.initialized = true;
  setTimeout(() => {
    if (kong.enabled) {
      playFabLogin();
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

function setHoldingR(x) {
  Replicanti.galaxies.isPlayerHoldingR = x;
}

function init() {
  // eslint-disable-next-line no-console
  console.log("🌌 Antimatter Dimensions: Reality Update 🌌");
  Tab.dimensions.antimatter.show();
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
