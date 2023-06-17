import { AutobuyerState } from "./autobuyer";

export class EternityAutobuyerState extends AutobuyerState {
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
      this.mode === AUTO_ETERNITY_MODE.AMOUNT &&
      this.amount.equals(0);
  }

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
      this.amount = this.amount.times(mult);
    }
  }

  get highestPrevPrestige() {
    return player.records.thisReality.maxEP;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisEternityRealTime.totalSeconds, 0);
  }

  get willEternity() {
    if (EternityChallenge.isRunning) {
      // We Eternity asap if we're in an Eternity Challenge and can't reach more completions.
      // Code elsewhere ensures this hasMoreCompletions evaluates to false when ready to complete the EC at all
      // without the ECB perk or when capped at max completions with it (and true otherwise)
      return !EternityChallenge.current?.gainedCompletionStatus.hasMoreCompletions;
    }

    switch (this.mode) {
      case AUTO_ETERNITY_MODE.AMOUNT:
        return gainedEternityPoints().gte(this.amount);
      case AUTO_ETERNITY_MODE.TIME:
        return Time.thisEternityRealTime.totalSeconds > this.time;
      case AUTO_ETERNITY_MODE.X_HIGHEST:
      default:
        return gainedEternityPoints().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    if (this.willEternity) eternity(false, true);
  }

  reset() {
    if (!EternityMilestone.autobuyerEternity.isReached) {
      this.isActive = false;
    }
  }
}
