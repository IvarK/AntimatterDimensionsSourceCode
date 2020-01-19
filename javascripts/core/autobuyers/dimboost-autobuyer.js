"use strict";

Autobuyer.dimboost = new class DimBoostAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.dimBoost;
  }

  get isUnlocked() {
    return NormalChallenge(10).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.dimBoost.interval;
  }

  get maxDimBoosts() {
    return this.data.maxDimBoosts;
  }

  set maxDimBoosts(value) {
    this.data.maxDimBoosts = value;
  }

  get galaxies() {
    return this.data.galaxies;
  }

  set galaxies(value) {
    this.data.galaxies = value;
  }

  get bulk() {
    return this.data.bulk;
  }

  set bulk(value) {
    this.data.bulk = value;
  }

  get isBulkBuyUnlocked() {
    return BreakInfinityUpgrade.bulkDimBoost.isBought;
  }

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxDimboosts.isReached;
  }

  get interval() {
    return this.isBuyMaxUnlocked
      ? TimeSpan.fromSeconds(this.buyMaxInterval).totalMilliseconds
      : super.interval;
  }

  get canTick() {
    return !Ra.isRunning && super.canTick;
  }

  tick() {
    if (this.isBuyMaxUnlocked) {
      maxBuyDimBoosts();
      super.tick();
      return;
    }

    const bulk = (this.isBulkBuyUnlocked && !DimBoost.isShift) ? Math.clampMin(this.bulk, 1) : 1;
    const isConditionSatisfied = DimBoost.purchasedBoosts + bulk <= this.maxDimBoosts ||
      player.galaxies >= this.galaxies;
    if (!isConditionSatisfied || !DimBoost.bulkRequirement(bulk).isSatisfied) return;
    softReset(bulk);
    super.tick();
  }
}();
