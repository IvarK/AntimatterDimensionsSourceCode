"use strict";

Autobuyer.eternity = {
  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return EternityMilestone.autobuyerEternity.isReached;
  },
  /**
   * @returns {boolean}
   */
  get hasAdditionalModes() {
    return RealityUpgrade(13).isBought;
  },
  /**
   * @returns {boolean}
   */
  get isOn() {
    return player.eternityBuyer.isOn;
  },
  /**
   * @param {boolean} value
   */
  set isOn(value) {
    player.eternityBuyer.isOn = value;
  },
  toggle() {
    this.isOn = !this.isOn;
  },
  /**
   * @returns {boolean}
   */
  get isActive() {
    return this.isUnlocked && this.isOn;
  },
  /**
   * @returns {Decimal}
   */
  get limit() {
    return player.eternityBuyer.limit;
  },
  /**
   * @param {Decimal} value
   */
  set limit(value) {
    player.eternityBuyer.limit = value;
  },
  bumpLimit(mult) {
    if (this.isUnlocked && this.mode === AutoEternityMode.AMOUNT) {
      this.limit = this.limit.times(mult);
    }
  },
  /**
   * @returns {AutoEternityMode}
   */
  get mode() {
    return player.autoEternityMode;
  },
  /**
   * @param {AutoEternityMode} value
   */
  set mode(value) {
    player.autoEternityMode = value;
  },
  toggleMode() {
    this.mode = Object.values(AutoEternityMode).nextSibling(this.mode);
  },
  tick() {
    if (!this.isActive) return;
    let proc = false;
    switch (this.mode) {
      case AutoEternityMode.AMOUNT:
        proc = EternityChallenge.isRunning || gainedEternityPoints().gte(this.limit);
        break;
      case AutoEternityMode.TIME:
        proc = Decimal.gt(Time.thisEternityRealTime.totalSeconds, this.limit)
        break;
      case AutoEternityMode.RELATIVE:
        proc = gainedEternityPoints().gte(player.lastTenEternities[0][1].times(this.limit));
        break;
    }
    if (proc) eternity(false, true);
  }
};
