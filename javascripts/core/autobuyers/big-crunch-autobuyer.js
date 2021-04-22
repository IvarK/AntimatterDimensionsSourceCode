"use strict";

Autobuyer.bigCrunch = new class BigCrunchAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.bigCrunch;
  }

  get name() {
    return `Infinity`;
  }

  get isUnlocked() {
    return NormalChallenge(12).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.bigCrunch.interval;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasAdditionalModes() {
    return EternityMilestone.bigCrunchModes.isReached;
  }

  get increaseWithMult() {
    return this.data.increaseWithMult;
  }

  set increaseWithMult(value) {
    this.data.increaseWithMult = value;
  }

  get amount() {
    return this.data.amount;
  }

  set amount(value) {
    this.data.amount = value;
  }

  get time() {
    return this.data.time;
  }

  set time(value) {
    this.data.time = value;
  }

  get xCurrent() {
    return this.data.xCurrent;
  }

  set xCurrent(value) {
    this.data.xCurrent = value;
  }

  autoInfinitiesAvailable(considerMilestoneReached) {
    return (considerMilestoneReached || EternityMilestone.autoInfinities.isReached) &&
      !EternityChallenge(4).isRunning && !EternityChallenge(12).isRunning &&
      !Player.isInAntimatterChallenge &&
      this.data.isActive &&
      this.mode === AUTO_CRUNCH_MODE.TIME &&
      this.time < 60 &&
      !Autobuyer.eternity.autoEternitiesAvailable();
  }

  upgradeInterval(free) {
    super.upgradeInterval(free);
    TabNotification.breakInfinity.tryTrigger();
  }

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
      this.amount = this.amount.times(mult);
    }
  }

  tick() {
    if (Player.canCrunch) super.tick();
    if (Currency.antimatter.lt(Decimal.NUMBER_MAX_VALUE)) return;
    let proc = !player.break || Player.isInAntimatterChallenge;
    if (!proc) {
      switch (this.mode) {
        case AUTO_CRUNCH_MODE.AMOUNT:
          proc = gainedInfinityPoints().gte(this.amount);
          break;
        case AUTO_CRUNCH_MODE.TIME:
          proc = Time.thisInfinityRealTime.totalSeconds > this.time;
          break;
        case AUTO_CRUNCH_MODE.X_CURRENT:
          proc = gainedInfinityPoints().gte(Currency.infinityPoints.value.times(this.xCurrent));
          break;
      }
    }
    if (proc) {
      bigCrunchResetRequest(true);
    }
  }

  reset() {
    super.reset();
    if (EternityMilestone.bigCrunchModes.isReached) return;
    this.mode = AUTO_CRUNCH_MODE.AMOUNT;
  }
}();
