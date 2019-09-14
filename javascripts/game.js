"use strict";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

let kongIPMult = 1
let kongDimMult = 1
let kongAllDimMult = 1
let kongEPMult = 1

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
  player.break = !player.break;
  EventHub.dispatch(player.break ? GameEvent.BREAK_INFINITY : GameEvent.FIX_INFINITY);
  GameUI.update();
}

function gainedInfinityPoints() {
  const div = Effects.min(
    308,
    Achievement(103),
    TimeStudy(111)
  );
  let ip = player.break
    ? Decimal.pow10(player.antimatter.e / div - 0.75)
    : new Decimal(308 / div);
  ip = ip.times(GameCache.totalIPMult.value);
  if (Teresa.isRunning) {
    ip = ip.pow(0.55);
  } else if (V.isRunning) {
    ip = ip.pow(0.5);
  }
  if (GlyphAlteration.isAdded("infinity")) {
    ip = ip.pow(getSecondaryGlyphEffect("infinityipgain"));
  }
  return ip.floor();
}

function gainedEternityPoints() {
  const ip = player.infinityPoints.plus(gainedInfinityPoints());
  let ep = Decimal.pow(5, ip.e / 308 - 0.7)
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

  if (Teresa.isRunning) {
    ep = ep.pow(0.55);
  } else if (V.isRunning) {
    ep = ep.pow(0.5);
  }
  if (GlyphAlteration.isAdded("time")) {
    ep = ep.pow(getSecondaryGlyphEffect("timeeternity"));
  }
  return ep.floor();
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
    rawLevel: rawLevel,
    actualLevel: actualLevel
  };
}

function resetChallengeStuff() {
    player.chall2Pow = 1;
    player.chall3Pow = new Decimal(0.01);
    player.matter = new Decimal(1);
    player.chall11Pow = new Decimal(1);
    player.postC4Tier = 1;
}

function resetAntimatter() {
    player.antimatter = Effects.max(
      10,
      Perk.startAM1,
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78).secondaryEffect,
      Perk.startAM2
    ).toDecimal();
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

function getInfinitiedMilestoneReward(ms) {
  // Player gains 50% of (timeOffline / average gain of
  // infinitied stat per second for last 10 infinities) infinitied stat
  // if he has 1000 infinities milestone and turned on infinity autobuyer with 1 minute or less per crunch

  const autoInfinitiesAvailable = Autobuyer.bigCrunch.autoInfinitiesAvailable;

  let infinitiedTotal = 0;
  if (autoInfinitiesAvailable) {
    infinitiedTotal = Decimal.floor(player.bestInfinitiesPerMs.times(ms).dividedBy(2));
  }
  return infinitiedTotal;
}

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

function getEternitiedMilestoneReward(ms) {
  // Player gains 50% of (timeOffline / average of last 10 eternity times) eternities
  // If he has 100 eternities milestone and turned on eternity autobuyer with 0 EP

  let eternitiedTotal = 0;
  if (Autobuyer.eternity.autoEternitiesAvailable) {
    eternitiedTotal = Decimal.floor(player.bestEternitiesPerMs.times(ms).dividedBy(2));
  }
  return eternitiedTotal;
}

function getOfflineEPGain(ms) {
  if (!EternityMilestone.autoEP.isReached) return new Decimal(0);
  return player.bestEPminThisReality.times(TimeSpan.fromMilliseconds(ms).totalMinutes / 4);
}

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

setInterval(function() {
  if (isLocalEnvironment()) return;
    $.getJSON('version.txt', function(data){
        //data is actual content of version.txt, so
        //do whatever you need with it
        //I'd compare it with last result and if it's different
        //show the message received and nag for attention
        //like this:
        if (data.version > player.version) {
            player.version = data.version
            Modal.message.show(data.message, updateRefresh);
            //or some more resilient method
            //like forced news bar with message running over and over
        }
    })
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
  kong.submitStats('Log10 of total antimatter', player.totalAntimatter.e);
  kong.submitStats('Log10 of Infinity Points', player.infinityPoints.e);
  kong.submitStats('Log10 of Eternity Points', player.eternityPoints.e);
}

setInterval(kongLog10StatSubmission, 10000)

function randomStuffThatShouldBeRefactored() {
  // document.getElementById("kongip").textContent = "Double your IP gain from all sources (additive). Forever. Currently: x"+kongIPMult+", next: x"+(kongIPMult==1? 2: kongIPMult+2)
  // document.getElementById("kongep").textContent = "Triple your EP gain from all sources (additive). Forever. Currently: x"+kongEPMult+", next: x"+(kongEPMult==1? 3: kongEPMult+3)
  // document.getElementById("kongdim").textContent = "Double all your normal dimension multipliers (multiplicative). Forever. Currently: x"+kongDimMult+", next: x"+(kongDimMult*2)
  // document.getElementById("kongalldim").textContent = "Double ALL the dimension multipliers (Normal, Infinity, Time) (multiplicative until 32x). Forever. Currently: x"+kongAllDimMult+", next: x"+((kongAllDimMult < 32) ? kongAllDimMult * 2 : kongAllDimMult + 32)

  if (!Teresa.has(TERESA_UNLOCKS.EFFARIG)) player.celestials.teresa.rmStore *= Math.pow(0.98, 1/60) // Teresa container leak, 2% every minute, only works online.
}

setInterval(randomStuffThatShouldBeRefactored, 1000);

var postC2Count = 0;
var replicantiTicks = 0

const GameSpeedEffect = { FIXEDSPEED: 1, TIMEGLYPH: 2, BLACKHOLE: 3, TIMESTORAGE: 4, MOMENTUM: 5 };

/**
  * @param {number[]} effectsToConsider A list of various game speed changing effects to apply when calculating
  *   the game speed.  If left undefined, all effects will be applied.
  * @param {number} blackHoleOverride A numerical value that, if supplied, will replace the multiplier that would
  *   have been applied for black holes.
  * @param {number} blackHolesActiveOverride A numerical value which forces all black holes up to its specified index
  *   to be active for the purposes of game speed calculation.
  */
function getGameSpeedupFactor(effectsToConsider, blackHoleOverride, blackHolesActiveOverride) {
  let effects;
  if (effectsToConsider === undefined) {
    effects = [GameSpeedEffect.FIXEDSPEED, GameSpeedEffect.TIMEGLYPH, GameSpeedEffect.BLACKHOLE,
      GameSpeedEffect.TIMESTORAGE, GameSpeedEffect.MOMENTUM];
  } else {
    effects = effectsToConsider;
  }

  if (effects.includes(GameSpeedEffect.FIXEDSPEED)) {
    if (TimeCompression.isActive) {
      return 1e-100;
    }
    if (EternityChallenge(12).isRunning) {
      return 1 / 1000;
    }
  }

  let factor = 1;
  if (effects.includes(GameSpeedEffect.BLACKHOLE)) {
    if (blackHoleOverride !== undefined) {
      factor *= blackHoleOverride;
    } else if (!BlackHoles.arePaused) {
      for (const blackHole of BlackHoles.list) {
        if (!blackHole.isUnlocked) break;
        const isActive = blackHolesActiveOverride === undefined
          ? blackHole.isActive
          : blackHole.id <= blackHolesActiveOverride;
        if (!isActive) break;
        factor *= blackHole.power;
        if (V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1])) {
          factor *= V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1].effect();
        }
      }
    }
  }

  if (effects.includes(GameSpeedEffect.TIMEGLYPH)) {
    factor *= getAdjustedGlyphEffect("timespeed");
    factor = Math.pow(factor, getAdjustedGlyphEffect("effarigblackhole"));
  }

  if (effects.includes(GameSpeedEffect.MOMENTUM)) {
    const cappedTime = Math.min(Time.thisRealityRealTime.totalMinutes, 7 * 24 * 60);
    factor *= Math.pow(AlchemyResource.momentum.effectValue, cappedTime);
  }

  // Time storage is linearly scaled because exponential scaling is pretty useless in practice
  if (player.celestials.enslaved.isStoring && effects.includes(GameSpeedEffect.TIMESTORAGE)) {
    const storedTimeWeight = player.celestials.enslaved.storedFraction;
    factor = factor * (1 - storedTimeWeight) + storedTimeWeight;
  }

  // Effarig nerf and dev.goFast() will always be applied
  if (Effarig.isRunning) {
    factor = Effarig.multiplier(factor).toNumber();
  }
  if (tempSpeedupToggle) {
    factor *= tempSpeedupFactor;
  }
  return factor;
}

function getGameSpeedupForDisplay() {
  const speedFactor = getGameSpeedupFactor();
  if (Enslaved.isAutoReleasing && !(EternityChallenge(12).isRunning || TimeCompression.isActive)) {
    return Math.max(Enslaved.autoReleaseSpeed, speedFactor);
  }
  return speedFactor;
}

let autobuyerOnGameLoop = true;

// "diff" is in ms.  It is only unspecified when it's being called normally and not due to simulating time, in which
// case it uses the gap between now and the last time the function was called.  This is on average equal to the update
// rate.
function gameLoop(diff, options = {}) {
  PerformanceStats.start("Frame Time");
  PerformanceStats.start("Game Update");
  EventHub.dispatch(GameEvent.GAME_TICK_BEFORE);
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
  if (autobuyerOnGameLoop) {
      Autobuyers.tick();
  }

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
        // This is only called from simulateTime(), apply all effects but override black hole speed
        speedFactor = getGameSpeedupFactor(undefined, options.blackHoleSpeedup);
      }

      if (player.celestials.enslaved.isStoring && !fixedSpeedActive) {
        // These variables are the actual game speed used and the game speed unaffected by time storage, respectively
        const reducedTimeFactor = getGameSpeedupFactor();
        const totalTimeFactor = getGameSpeedupFactor([GameSpeedEffect.FIXEDSPEED, GameSpeedEffect.TIMEGLYPH,
          GameSpeedEffect.BLACKHOLE, GameSpeedEffect.MOMENTUM]);
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
  player.thisEternity += diff;
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
      player.reality.partEternitied = player.reality.partEternitied.plus(
        new Decimal(Time.deltaTime)
          .times(Effects.product(
            RealityUpgrade(3),
            RealityUpgrade(14)
            )
          )
        );
      player.eternities = player.eternities.plus(player.reality.partEternitied.floor());
      player.reality.partEternitied = player.reality.partEternitied.sub(player.reality.partEternitied.floor());
    }

  applyAutoprestige(realDiff);

    const uncountabilityGain = AlchemyResource.uncountability.effectValue * Time.unscaledDeltaTime.totalSeconds;
    player.realities += uncountabilityGain;
    player.reality.pp += uncountabilityGain;

    const challenge = NormalChallenge.current || InfinityChallenge.current;
    if (player.antimatter.lte(Decimal.MAX_NUMBER) ||
        (player.break && !challenge) || (challenge && player.antimatter.lte(challenge.goal))) {

        let maxTierProduced = 7;
        if (NormalChallenge(12).isRunning) {
          maxTierProduced = Math.min(maxTierProduced, 6);
        }
        if (EternityChallenge(3).isRunning) {
          maxTierProduced = Math.min(maxTierProduced, 3);
        }
        if (NormalChallenge(12).isRunning) {
          for (let tier = maxTierProduced; tier >= 1; --tier) {
            const dimension = NormalDimension(tier);
            dimension.amount = dimension.amount.plus(getDimensionProductionPerSecond(tier + 2).times(diff / 10000));
          }
        } else {
          for (let tier = maxTierProduced; tier >= 1; --tier) {
            const dimension = NormalDimension(tier);
            dimension.amount = dimension.amount.plus(getDimensionProductionPerSecond(tier + 1).times(diff / 10000));
          }
        }

        if (NormalChallenge(3).isRunning) {
            player.antimatter = player.antimatter.plus(getDimensionProductionPerSecond(1).times(diff/1000).times(player.chall3Pow));
            player.totalAntimatter = player.totalAntimatter.plus(getDimensionProductionPerSecond(1).times(diff/1000).times(player.chall3Pow));
        } else {
            player.antimatter = player.antimatter.plus(getDimensionProductionPerSecond(1).times(diff/1000));
            player.totalAntimatter = player.totalAntimatter.plus(getDimensionProductionPerSecond(1).times(diff/1000));
        }
        if (NormalChallenge(12).isRunning) {
            player.antimatter = player.antimatter.plus(getDimensionProductionPerSecond(2).times(diff/1000));
            player.totalAntimatter = player.totalAntimatter.plus(getDimensionProductionPerSecond(2).times(diff/1000))
        }
    }

    if (Perk.autocompleteEC1.isBought && player.reality.autoEC) player.reality.lastAutoEC += realDiff;

    EternityChallenge(12).tryFail();

    GameCache.achievementPower.invalidate();

    for (let tier = 1; tier < 9; tier++) {
      if (tier !== 8 && (InfinityDimension(tier).isUnlocked || EternityChallenge(7).completions > 0)) {
        const dimension = InfinityDimension(tier);
        dimension.amount = dimension.amount.plus(InfinityDimension(tier + 1).productionPerSecond.times(diff / 10000));
      }
      if (tier < 8) {
        const dimension = TimeDimension(tier);
        dimension.amount = dimension.amount.plus(TimeDimension(tier + 1).productionPerSecond.times(diff / 10000))
      }
    }

    const ID1ProductionThisTick = InfinityDimension(1).productionPerSecond.times(diff / 1000);
    if (EternityChallenge(7).isRunning) {
      if (!NormalChallenge(10).isRunning) {
        NormalDimension(7).amount = NormalDimension(7).amount.plus(ID1ProductionThisTick)
      }
    }
    else {
      player.infinityPower = player.infinityPower.plus(ID1ProductionThisTick);
    }

    const TD1Production = TimeDimension(1).productionPerSecond;
    const TD1ProductionThisTick = TD1Production.times(diff/1000);
    if (EternityChallenge(7).isRunning) {
      InfinityDimension(8).amount = InfinityDimension(8).amount.plus(TD1ProductionThisTick);
    }
    else {
      player.timeShards = player.timeShards.plus(TD1ProductionThisTick)
    }

    if (TD1Production.gt(0)) {
      const id8 = InfinityDimension(8);
      EternityChallenge(7).reward.applyEffect(v => id8.amount = id8.amount.plus(v.times(diff/10)));
    }

  const freeTickspeed = FreeTickspeed.fromShards(player.timeShards);
  let gain = Math.max(0, freeTickspeed.newAmount - player.totalTickGained);
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

  if (TimeStudy.dilation.isBought) {
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

  Achievements.autoAchieveUpdate(diff);
  V.checkForUnlocks();
  AutomatorBackend.update(realDiff);

  EventHub.dispatch(GameEvent.GAME_TICK_AFTER);
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
  if (Enslaved.isRunning) ttMult *= 1e-3;
  if (Ra.has(RA_UNLOCKS.TT_ACHIEVEMENT)) ttMult *= RA_UNLOCKS.TT_ACHIEVEMENT.effect();
  if (GlyphAlteration.isAdded("dilation")) ttMult *= getSecondaryGlyphEffect("dilationTTgen");

  // Glyph TT generation
  const glyphTT = Teresa.isRunning
    ? 0
    : getAdjustedGlyphEffect("dilationTTgen") * ttMult;

  // Dilation TT generation
  const dilationTT = DilationUpgrade.ttGenerator.isBought
    ? DilationUpgrade.ttGenerator.effectValue.times(ttMult)
    : new Decimal(0);

  return dilationTT.add(glyphTT);
}

function gameLoopWithAutobuyers(seconds, ticks, real) {
  for (let ticksDone = 0; ticksDone < ticks; ticksDone++) {
    gameLoop(1000 * seconds);
    Autobuyers.tick();
    if (real) {
      console.log(ticksDone);
    }
  }
}

function simulateTime(seconds, real, fast) {
  // The game is simulated at a base 50ms update rate, with a max of 1000 ticks. additional ticks are converted
  // into a higher diff per tick
  // warning: do not call this function with real unless you know what you're doing
  // calling it with fast will only simulate it with a max of 50 ticks
  let ticks = seconds * 20;
  autobuyerOnGameLoop = false;
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
  player.eternities = player.eternities.plus(getEternitiedMilestoneReward(seconds *1000));
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
      Autobuyers.tick();
    }
  } else {
    gameLoopWithAutobuyers(largeDiff / 1000, ticks, real);
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
        `${shorten(oomIncrease, 2, 2)} orders of magnitude`);
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
        `${shorten(player[varName], 2, 0)} more ${linearResourceNames[i]}`);
    } else if (!Decimal.eq(player[varName], playerStart[varName])) {
      offlineIncreases.push(`you generated ${shorten(linearIncrease, 2, 0)} ${linearResourceNames[i]}`);
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
  autobuyerOnGameLoop = true;
  GameUI.notify.showBlackHoles = true;
}

function updateChart(first) {
    if (first !== true && (player.infinitied.gte(1) || player.eternities.gte(1)) && player.options.chart.on === true) {
        if (NormalChallenge(3).isRunning) {
            addChartData(getDimensionProductionPerSecond(1).times(player.chall3Pow));
        } else {
            addChartData(getDimensionProductionPerSecond(1));
        }
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
  player.auto.infDimTimer += realDiff;
  const infDimPeriod = 1000 * Effects.product(Perk.autobuyerFasterID);
  if (player.auto.infDimTimer >= infDimPeriod) {
    // Note: we need to reset to a low number here, because we don't want a pile of these accumulating during offline
    // time and then releasing normally.
    player.auto.infDimTimer = Math.min(player.auto.infDimTimer - infDimPeriod, infDimPeriod);
    autoBuyInfDims();
  }
  player.auto.timeDimTimer += realDiff;
  const timeDimPeriod = 1000;
  if (player.auto.timeDimTimer >= timeDimPeriod) {
    player.auto.timeDimTimer = Math.min(player.auto.timeDimTimer - timeDimPeriod, timeDimPeriod);
    autoBuyTimeDims();
  }
  player.auto.repUpgradeTimer += realDiff;
  const repUpgradePeriod = 1000 * Effects.product(Perk.autobuyerFasterReplicanti);
  if (player.auto.repUpgradeTimer >= repUpgradePeriod) {
    player.auto.repUpgradeTimer = Math.min(player.auto.repUpgradeTimer - repUpgradePeriod, repUpgradePeriod);
    autoBuyReplicantiUpgrades();
  }
  player.auto.dilUpgradeTimer += realDiff;
  const dilUpgradePeriod = 1000 * Effects.product(Perk.autobuyerFasterDilation);
  if (player.auto.dilUpgradeTimer >= dilUpgradePeriod) {
    player.auto.dilUpgradeTimer = Math.min(player.auto.dilUpgradeTimer - dilUpgradePeriod, dilUpgradePeriod);
    autoBuyDilationUpgrades();
  }
  autoBuyMaxTheorems(realDiff);
}

setInterval(function () {
    if (playFabId != -1 && player.options.cloud) playFabSaveCheck();
}, 1000*60*5)

window.onload = function() {
    GameIntervals.start();
    setTimeout(() => {
        if (kong.enabled) {
            playFabLogin();
            kong.updatePurchases();
        }
        document.getElementById("loading").style.display = "none";
    }, 1000);
};

window.onfocus = function() {
    setShiftKey(false);
};

window.onblur = function() {
  GameKeyboard.stopSpins();
};

function setShiftKey(isDown) {
  shiftDown = isDown;
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
