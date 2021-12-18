import { Autobuyer, AutobuyerState } from "./autobuyer.js";

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

  get xHighest() {
    return this.data.xHighest;
  }

  set xHighest(value) {
    this.data.xHighest = value;
  }

  get hasAdditionalModes() {
    return RealityUpgrade(13).isBought;
  }

  autoEternitiesAvailable(considerMilestoneReached) {
    return (considerMilestoneReached || EternityMilestone.autoEternities.isReached) &&
      !Player.isInAnyChallenge && !player.dilation.active &&
      player.auto.autobuyersOn && this.data.isActive &&
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
      case AUTO_ETERNITY_MODE.X_HIGHEST:
        proc = gainedEternityPoints().gte(player.records.thisReality.maxEP.times(this.xHighest));
        break;
    }
    if (proc) eternityResetRequest(true);
  }

  reset() {
    if (!EternityMilestone.autobuyerEternity.isReached) {
      this.isActive = false;
    }
  }
}();
