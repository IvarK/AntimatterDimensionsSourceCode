"use strict";

class BaseEternityReset extends PrestigeMechanic {
  get goal() {
    return Decimal.NUMBER_MAX_VALUE;
  }

  get currencyRequired() {
    return Decimal.max(Currency.infinityPoints.value.plus(gainedInfinityPoints()), player.records.thisEternity.maxIP);
  }

  get eventBefore() {
    return GAME_EVENT.ETERNITY_RESET_BEFORE;
  }

  get eventAfter() {
    return GAME_EVENT.ETERNITY_RESET_AFTER;
  }

  get confirmationOption() {
    return player.options.confirmations.eternity;
  }

  set confirmationOption(value) {
    player.options.confirmations.eternity = value;
  }

  confirmation(props) {
    Modal.eternity.show(props);
  }

  get animationOption() {
    return player.options.animations.eternity;
  }

  set animationOption(value) {
    player.options.animations.eternity = value;
  }

  animation() {
    document.body.style.animation = "eternify 3s 1";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 3000);
  }

  tabChange() {
    if (!this.isEarlyGame) return;
    Tab.dimensions.time.show();
  }

  statistics() {
    player.records.bestEternity.time = Math.min(player.records.thisEternity.time, player.records.bestEternity.time);

    addEternityTime(
      player.records.thisEternity.time,
      player.records.thisEternity.realTime,
      gainedEternityPoints(),
      gainedEternities().round()
    );

    player.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs.clampMin(
      gainedEternities().divide(Math.clampMin(33, player.records.thisEternity.realTime))
    );
    player.records.bestEternity.bestEPminReality =
      player.records.bestEternity.bestEPminReality.max(player.records.thisEternity.bestEPmin);
  }

  gain() {
    this.statistics();
    Currency.eternityPoints.add(gainedEternityPoints());
    Currency.eternities.add(gainedEternities());
    Currency.infinitiesBanked.add(gainedBankedInfinities());
    player.requirementChecks.reality.noEternities = false;
    this.unlock();
  }

  unlock() {
    if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.isBought) {
      for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
    }
    if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked) {
      EffarigUnlock.eternity.unlock();
      beginProcessReality(getRealityProps(true));
    }
  }

  reset(reality = false) {
    playerInfinityUpgradesOnReset();
    // Reset Normal and Infinity Challenges
    NormalChallenges.clearCompletions();
    InfinityChallenges.clearCompletions();
    if (!reality && EternityMilestone.keepAutobuyers.isReached) {
      NormalChallenges.completeAll();
    }
    if (Achievement(133).isUnlocked) {
      player.postChallUnlocked = 8;
      InfinityChallenges.completeAll();
    } else {
      player.postChallUnlocked = 0;
    }
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = 0;

    // Fix infinity because it can only break after big crunch autobuyer interval is maxed
    if (!EternityMilestone.keepAutobuyers.isReached) player.break = false;


    player.sacrificed = new Decimal(0);
    Currency.infinities.reset();
    player.records.bestInfinity.time = 999999999999;
    player.records.bestInfinity.realTime = 999999999999;
    player.records.thisInfinity.time = 0;
    player.records.thisInfinity.lastBuyTime = 0;
    player.records.thisInfinity.realTime = 0;
    Currency.dimensionBoosts.reset();
    Currency.antimatterGalaxies.reset();
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.replicanti.galaxies = 0;
    player.infMult = 0;
    Currency.infinityPower.reset();
    Currency.timeShards.reset();
    player.records.thisEternity.time = 0;
    player.records.thisEternity.realTime = 0;
    player.totalTickGained = 0;
    player.eterc8ids = 50;
    player.eterc8repl = 40;

    Player.resetRequirements("eternity");

    Currency.infinityPoints.reset();
    InfinityDimensions.resetAmount();
    player.records.thisInfinity.bestIPmin = new Decimal(0);
    player.records.bestInfinity.bestIPminEternity = new Decimal(0);
    player.records.thisEternity.bestEPmin = new Decimal(0);
    player.records.thisEternity.bestInfinitiesPerMs = new Decimal(0);
    player.records.thisEternity.bestIPMsWithoutMaxAll = new Decimal(0);
    resetTimeDimensions();
    resetTickspeed();
    AchievementTimers.marathon2.reset();
    player.records.thisInfinity.maxAM = new Decimal(0);
    player.records.thisEternity.maxAM = new Decimal(0);
    Currency.antimatter.reset();
    ECTimeStudyState.invalidateCachedRequirements();

    resetInfinityRuns();
    InfinityDimensions.fullReset();
    Replicanti.reset();
    resetChallengeStuff();
    AntimatterDimensions.reset();
  }

  get canBePerformed() {
    return super.canBePerformed && Player.canEternity;
  }
}

Reset.eternity = new class EternityResetWithRespec extends BaseEternityReset {
  reset(reality) {
    if (player.respec) {
      respecTimeStudies();
      player.respec = false;
    }
    super.reset(reality);
  }
}();
