"use strict";

Autobuyer.eternity = new class EternityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.eternity;
  }

  get isUnlocked() {
    return EternityMilestone.autobuyerEternity.isReached;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
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

  get hasAdditionalModes() {
    return RealityUpgrade(13).isBought;
  }

  get autoEternitiesAvailable() {
    return EternityMilestone.autoEternities.isReached &&
      this.data.isActive &&
      this.amount.equals(0);
  }

  bumpAmount(mult) {
    if (this.isUnlocked) {
      this.amount = this.amount.times(mult);
    }
  }

  tick() {
    let proc = false;
    switch (this.mode) {
      case AUTO_ETERNITY_MODE.AMOUNT:
        proc = EternityChallenge.isRunning || gainedEternityPoints().gte(this.amount);
        break;
      case AUTO_ETERNITY_MODE.TIME:
        proc = Time.thisEternityRealTime.totalSeconds > this.time;
        break;
      case AUTO_ETERNITY_MODE.X_LAST:
        proc = gainedEternityPoints().gte(player.lastTenEternities[0][1].times(this.xLast));
        break;
    }
    if (proc) eternity(false, true);
  }

  reset() {
    if (!EternityMilestone.autobuyerEternity.isReached) {
      this.isActive = false;
    }
  }
}();
