"use strict";

Autobuyer.bigCrunch = new class BigCrunchAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.bigCrunch;
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

  get xLast() {
    return this.data.xLast;
  }

  set xLast(value) {
    this.data.xLast = value;
  }

  autoInfinitiesAvailable(considerMilestoneReached) {
    return (considerMilestoneReached || EternityMilestone.autoInfinities.isReached) &&
      !EternityChallenge(4).isRunning && !EternityChallenge(12).isRunning &&
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
    if (this.isUnlocked) {
      this.amount = this.amount.times(mult);
    }
  }

  tick() {
    if (Player.canCrunch) super.tick();
    if (Currency.antimatter.lt(Decimal.NUMBER_MAX_VALUE)) return;
    let proc = !player.break || NormalChallenge.isRunning || InfinityChallenge.isRunning;
    if (!proc) {
      switch (this.mode) {
        case AUTO_CRUNCH_MODE.AMOUNT:
          proc = gainedInfinityPoints().gte(this.amount);
          break;
        case AUTO_CRUNCH_MODE.TIME:
          proc = Time.thisInfinityRealTime.totalSeconds > this.time;
          break;
        case AUTO_CRUNCH_MODE.X_LAST:
          proc = gainedInfinityPoints().gte(player.records.lastTenInfinities[0][1].times(this.xLast));
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
