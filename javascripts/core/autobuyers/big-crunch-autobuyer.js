"use strict";

Autobuyer.bigCrunch = new class BigCrunchAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[11]);
  }

  initialize() {
    player.autobuyers[11] = new Autobuyer(300000);
    this.limit = new Decimal(1);
  }

  get challenge() {
    return NormalChallenge(12);
  }

  /**
   * @returns {AutoCrunchMode}
   */
  get mode() {
    return player.autoCrunchMode;
  }

  /**
   * @param {AutoCrunchMode} value
   */
  set mode(value) {
    player.autoCrunchMode = value;
  }

  /**
   * @returns {boolean}
   */
  get hasAdditionalModes() {
    return EternityMilestone.bigCrunchModes.isReached;
  }

  /**
   * @returns {Decimal}
   */
  get limit() {
    return this.autobuyer.priority;
  }

  /**
   * @param {Decimal} value
   */
  set limit(value) {
    this.autobuyer.priority = value;
  }

  bumpLimit(mult) {
    if (this.isUnlocked && this.mode === AutoCrunchMode.AMOUNT) {
      this.limit = this.limit.times(mult);
    }
  }

  toggleMode() {
    this.mode = Object.values(AutoCrunchMode).nextSibling(this.mode);
  }

  tick() {
    if (!this.canTick()) return;
    if (!player.antimatter.gte(Decimal.MAX_NUMBER)) return;
    let proc = !player.break || NormalChallenge.isRunning || InfinityChallenge.isRunning;
    if (!proc) {
      switch (this.mode) {
        case AutoCrunchMode.AMOUNT:
          proc = gainedInfinityPoints().gte(this.limit);
          break;
        case AutoCrunchMode.TIME:
          proc = Decimal.gt(Time.thisInfinityRealTime.totalSeconds, this.limit);
          break;
        case AutoCrunchMode.RELATIVE:
          proc = gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(this.limit));
          break;
      }
    }
    if (proc) {
      bigCrunchResetRequest();
    }
    this.resetTicks();
  }
}();
