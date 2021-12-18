import { PrestigeMechanic } from "./prestige-reset.js";
import { DC } from "../constants.js";

class BigCrunchReset extends PrestigeMechanic {
  get goal() {
    return Player.isInAntimatterChallenge ? Player.antimatterChallenge.goal : Decimal.NUMBER_MAX_VALUE;
  }

  get currencyRequired() {
    return player.records.thisInfinity.maxAM;
  }

  get eventBefore() {
    return GAME_EVENT.BIG_CRUNCH_BEFORE;
  }

  get eventAfter() {
    return GAME_EVENT.BIG_CRUNCH_AFTER;
  }

  get animationOption() {
    return player.options.animations.bigCrunch;
  }

  set animationOption(value) {
    player.options.animations.bigCrunch = value;
  }

  animation() {
    document.body.style.animation = "implode 2s 1";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 2000);
  }

  tabChange() {
    if (!PlayerProgress.infinityUnlocked()) {
      Tab.infinity.upgrades.show();
    } else if (this.isEarlyGame) {
      Tab.dimensions.antimatter.show();
    }
  }

  statistics() {
    player.records.bestInfinity.bestIPminEternity =
      player.records.bestInfinity.bestIPminEternity.clampMin(player.records.thisInfinity.bestIPmin);
    player.records.thisInfinity.bestIPmin = DC.D0;

    player.records.thisEternity.bestInfinitiesPerMs = player.records.thisEternity.bestInfinitiesPerMs.clampMin(
      gainedInfinities().round().dividedBy(Math.clampMin(33, player.records.thisInfinity.realTime))
    );

    addInfinityTime(
      player.records.thisInfinity.time,
      player.records.thisInfinity.realTime,
      gainedInfinityPoints(),
      gainedInfinities().round()
    );

    player.records.bestInfinity.time =
      Math.min(player.records.bestInfinity.time, player.records.thisInfinity.time);
    player.records.bestInfinity.realTime =
      Math.min(player.records.bestInfinity.realTime, player.records.thisInfinity.realTime);

    player.requirementChecks.reality.noInfinities = false;

    if (!player.requirementChecks.infinity.maxAll) {
      const bestIpPerMsWithoutMaxAll = gainedInfinityPoints().dividedBy(
        Math.clampMin(33, player.records.thisInfinity.realTime)
      );
      player.records.thisEternity.bestIPMsWithoutMaxAll =
        Decimal.max(bestIpPerMsWithoutMaxAll, player.records.thisEternity.bestIPMsWithoutMaxAll);
    }
    player.usedMaxAll = false;
  }

  gain() {
    this.statistics();
    Currency.infinityPoints.add(gainedInfinityPoints());
    Currency.infinities.add(gainedInfinities());
    this.challengeCompletion();
    this.unlock();
  }

  challengeCompletion() {
    const challenge = Player.antimatterChallenge;
    if (!challenge) {
      if (!NormalChallenge(1).isCompleted) NormalChallenge(1).complete();
      return;
    }
    challenge.complete();
    challenge.updateChallengeTime();
    if (!player.options.retryChallenge) {
      player.challenge.normal.current = 0;
      player.challenge.infinity.current = 0;
    }
  }

  unlock() {
    if (EternityChallenge(4).tryFail()) return;

    if (Effarig.isRunning && !EffarigUnlock.infinity.isUnlocked) {
      EffarigUnlock.infinity.unlock();
      beginProcessReality(getRealityProps(true));
    }
  }

  reset() {
    Currency.dimensionBoosts.reset();
    Currency.antimatterGalaxies.reset();
    player.records.thisInfinity.maxAM = DC.D0;
    Currency.antimatter.reset();
    Reset.dimensionBoost.reset(true);
    AntimatterDimensions.reset();
    player.sacrificed = DC.D0;
    resetTickspeed();
    InfinityDimensions.resetAmount();
    player.records.thisInfinity.time = 0;
    player.records.thisInfinity.lastBuyTime = 0;
    player.records.thisInfinity.realTime = 0;
    Player.resetRequirements("infinity");
    AchievementTimers.marathon2.reset();

    let remainingGalaxies = 0;
    if (Achievement(95).isUnlocked) {
      remainingGalaxies = Math.min(player.replicanti.galaxies, 1);
    } else {
      Replicanti.amount = DC.D0;
    }
    if (TimeStudy(33).isBought) {
      remainingGalaxies = Math.floor(player.replicanti.galaxies / 2);
    }
    // I don't think this Math.clampMax is technically needed, but if we add another source
    // of keeping Replicanti Galaxies then it might be.
    player.replicanti.galaxies = Math.clampMax(remainingGalaxies, player.replicanti.galaxies);
  }

  get canBePerformed() {
    return super.canBePerformed || Player.isInBrokenChallenge;
  }

  get isEarlyGame() {
    return !player.break && !Achievement(55).isUnlocked;
  }
}

Reset.bigCrunch = new BigCrunchReset();
