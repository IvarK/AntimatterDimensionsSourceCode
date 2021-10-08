"use strict";

Autobuyer.dimboost = new class DimBoostAutobuyerState extends UpgradeableAutobuyerState {
  get data() {
    return player.auto.dimBoost;
  }

  get name() {
    return `Dimension Boost`;
  }

  get isUnlocked() {
    return NormalChallenge(10).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.dimBoost.interval;
  }

  get limitDimBoosts() {
    return this.data.limitDimBoosts;
  }

  set limitDimBoosts(value) {
    this.data.limitDimBoosts = value;
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
    return Reset.dimensionBoost.canBePerformed && super.canTick;
  }

  get resetTickOn() {
    return Achievement(143).isUnlocked ? PRESTIGE_EVENT.ANTIMATTER_GALAXY : PRESTIGE_EVENT.INFINITY;
  }

  tick() {
    if (this.isBuyMaxUnlocked) {
      Reset.dimensionBoost.request({ gain: { bulk: true } });
      super.tick();
      return;
    }

    const limit = this.limitDimBoosts ? this.maxDimBoosts : Number.MAX_VALUE;
    const bulk = (this.isBulkBuyUnlocked && !DimBoost.canUnlockNewDimension) ? Math.clampMin(this.bulk, 1) : 1;
    const isConditionSatisfied = DimBoost.purchasedBoosts + bulk <= limit ||
      player.galaxies >= this.galaxies;
    if (!isConditionSatisfied || !DimBoost.bulkRequirement(bulk).isSatisfied) return;
    // While this is bad code, this specific code has already been changed on main, and so when next main is merged
    // into this branch, this will be removed and thus fixed.
    Reset.dimensionBoost.request({ gain: { bulk: bulk !== 1 } });
    super.tick();
  }
}();
