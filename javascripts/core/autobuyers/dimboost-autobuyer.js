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

  get limitUntilGalaxies() {
    return this.data.limitUntilGalaxies;
  }

  set limitUntilGalaxies(value) {
    this.data.limitUntilGalaxies = value;
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

  get buyMaxInterval() {
    return this.data.buyMaxInterval;
  }

  set buyMaxInterval(value) {
    this.data.buyMaxInterval = value;
  }

  get isBuyMaxUnlocked() {
    return BreakInfinityUpgrade.autobuyMaxDimboosts.isBought;
  }

  get interval() {
    return this.isBuyMaxUnlocked
      ? TimeSpan.fromSeconds(this.buyMaxInterval).totalMilliseconds
      : super.interval;
  }

  get canTick() {
    return DimBoost.canBeBought && DimBoost.requirement.isSatisfied && super.canTick;
  }

  get resetTickOn() {
    // Resetting on infinity seems slightly faster than resetting on galaxy before
    // "Yo dawg, I heard you liked reskins...", and about the same afterwards,
    // so we always reset on infinity rather than galaxy.
    return PRESTIGE_EVENT.INFINITY;
  }

  tick() {
    if (this.isBuyMaxUnlocked) {
      const galaxyCondition = !this.limitUntilGalaxies || player.galaxies >= this.galaxies;
      if (!DimBoost.canUnlockNewDimension && !galaxyCondition) return;
      requestDimensionBoost(true);
      super.tick();
      return;
    }

    const limitCondition = !this.limitDimBoosts || DimBoost.purchasedBoosts < this.maxDimBoosts;
    const galaxyCondition = this.limitUntilGalaxies && player.galaxies >= this.galaxies;
    if (limitCondition || galaxyCondition) {
      requestDimensionBoost(false);
      super.tick();
    }
  }
}();
