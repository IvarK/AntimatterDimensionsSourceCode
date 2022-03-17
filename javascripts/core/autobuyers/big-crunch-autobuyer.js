import { Autobuyer, UpgradeableAutobuyerState } from "./autobuyer.js";

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

  get willInfinity() {
    if (!player.break || Player.isInAntimatterChallenge) return true;

    switch (this.mode) {
      case AUTO_CRUNCH_MODE.AMOUNT:
        return gainedInfinityPoints().gte(this.amount);
      case AUTO_CRUNCH_MODE.TIME:
        return Time.thisInfinityRealTime.totalSeconds > this.time;
      case AUTO_CRUNCH_MODE.X_HIGHEST:
      default:
        return gainedInfinityPoints().gte(player.records.thisEternity.maxIP.times(this.xHighest));
    }
  }

  tick() {
    super.tick();
    if (willInfinity) bigCrunchResetRequest(true);
  }

  reset() {
    super.reset();
    if (EternityMilestone.bigCrunchModes.isReached) return;
    this.mode = AUTO_CRUNCH_MODE.AMOUNT;
  }
}();
