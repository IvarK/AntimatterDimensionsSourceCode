"use strict";

Autobuyer.eternity = new class EternityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.eternity;
  }

  get name() {
    return `Eternity`;
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

  get increaseWithMult() {
    return this.data.increaseWithMult;
  }

  set increaseWithMult(value) {
    this.data.increaseWithMult = value;
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

  get hasAdditionalModes() {
    return RealityUpgrade(13).isBought;
  }

  autoEternitiesAvailable(considerMilestoneReached) {
    return (considerMilestoneReached || EternityMilestone.autoEternities.isReached) &&
      !Player.isInAnyChallenge && !player.dilation.active &&
      this.data.isActive &&
      this.amount.equals(0);
  }

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
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
      case AUTO_ETERNITY_MODE.X_CURRENT:
        proc = gainedEternityPoints().gte(Currency.eternityPoints.value.times(this.xCurrent));
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
