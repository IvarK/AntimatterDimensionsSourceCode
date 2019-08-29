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
    if (DimBoost.purchasedBoosts >= this.maxDimBoosts && player.galaxies < this.galaxies) {
      return;
    }
    if (this.isBulkBuyUnlocked && !DimBoost.isShift) {
      const bulk = Math.clampMin(this.bulk, 1);
      if (!DimBoost.bulkRequirement(bulk).isSatisfied) return;
      softReset(bulk);
      super.tick();
      return;
    }
    if (!DimBoost.requirement.isSatisfied) return;
    softReset(1);
    super.tick();
  }
}();
