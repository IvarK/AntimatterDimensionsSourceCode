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

  bumpAmount(mult) {
    if (this.isUnlocked) {
      this.amount = this.amount.times(mult);
    }
  }

  tick() {
    let proc = false;
    switch (this.mode) {
      case AutoEternityMode.AMOUNT:
        proc = EternityChallenge.isRunning || gainedEternityPoints().gte(this.amount);
        break;
      case AutoEternityMode.TIME:
        proc = Time.thisEternityRealTime.totalSeconds > this.time;
        break;
      case AutoEternityMode.X_LAST:
        proc = gainedEternityPoints().gte(player.lastTenEternities[0][1].times(this.xLast));
        break;
    }
    if (proc) eternity(false, true);
  }

  reset() {
    if (!RealityUpgrade(10).isBought && player.eternities < 100) {
      this.isActive = false;
    }
  }
}();
