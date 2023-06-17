import { UpgradeableAutobuyerState } from "./autobuyer";

export class BigCrunchAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.bigCrunch;
  }

  get name() {
    return `Infinity`;
  }

  get isUnlocked() {
    return Pelle.isDoomed
      ? PelleStrikes.infinity.hasStrike
      : this.canBeUpgraded;
  }

  get canBeUpgraded() {
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

  // This is unused mechanically, but should be zero to suppress the "Current bulk:" text
  get bulk() {
    return 0;
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

  autoInfinitiesAvailable(considerMilestoneReached) {
    return (considerMilestoneReached || EternityMilestone.autoInfinities.isReached) &&
      !EternityChallenge(4).isRunning && !EternityChallenge(12).isRunning && !Player.isInAntimatterChallenge &&
      player.auto.autobuyersOn && this.data.isActive &&
      !Autobuyer.eternity.isActive && this.mode === AUTO_CRUNCH_MODE.TIME && this.time < 60 &&
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

  get canTick() {
    return Player.canCrunch && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  get highestPrevPrestige() {
    return player.records.thisEternity.maxIP;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisInfinityRealTime.totalSeconds, 0);
  }

  get willInfinity() {
    if (!player.break || Player.isInAntimatterChallenge) return true;

    switch (this.mode) {
      case AUTO_CRUNCH_MODE.AMOUNT:
        return gainedInfinityPoints().gte(this.amount);
      case AUTO_CRUNCH_MODE.TIME:
        return Time.thisInfinityRealTime.totalSeconds > this.time;
      case AUTO_CRUNCH_MODE.X_HIGHEST:
      default:
        return gainedInfinityPoints().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    super.tick();
    if (this.willInfinity) bigCrunchResetRequest(true);
  }

  reset() {
    super.reset();
    if (EternityMilestone.bigCrunchModes.isReached) return;
    this.mode = AUTO_CRUNCH_MODE.AMOUNT;
  }
}
