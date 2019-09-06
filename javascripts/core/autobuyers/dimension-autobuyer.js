"use strict";

class DimensionAutobuyerState extends IntervaledAutobuyerState {
  constructor(tier) {
    super();
    this._tier = tier;
  }

  get data() {
    return player.auto.dimensions[this._tier - 1];
  }

  get baseInterval() {
    return Player.defaultStart.auto.dimensions[this._tier - 1].interval;
  }

  get isUnlocked() {
    return NormalChallenge(this._tier).isCompleted;
  }

  get bulk() {
    return this.data.bulk;
  }

  get hasMaxedBulk() {
    return this.bulk >= 1e100;
  }

  get priority() {
    return this.data.priority;
  }

  set priority(value) {
    this.data.priority = value;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  toggleMode() {
    this.mode = [
      AutobuyerMode.BUY_SINGLE,
      AutobuyerMode.BUY_10
    ]
      .nextSibling(this.mode);
  }

  tick() {
    const tier = this._tier;
    if (!NormalDimension(tier).isAvailable) return;
    super.tick();
    switch (this.mode) {
      case AutobuyerMode.BUY_SINGLE:
        buyOneDimension(tier);
        break;
      case AutobuyerMode.BUY_10:
        buyMaxDimension(tier, player.options.bulkOn ? this.bulk : 1, true);
        break;
    }
  }

  upgradeBulk() {
    if (this.hasMaxedBulk) return;
    if (!Currency.infinityPoints.isAffordable(this.cost)) return;
    Currency.infinityPoints.subtract(this.cost);
    this.data.bulk = Math.clampMax(this.bulk * 2, 1e100);
    this.data.cost = Math.ceil(2.4 * this.cost);
    Achievement(61).tryUnlock();
    SecretAchievement(38).tryUnlock();
    GameUI.update();
  }

  reset() {
    super.reset();
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.isUnlocked = false;
    this.data.bulk = 1;
  }
}

DimensionAutobuyerState.index = Array.range(1, 8).map(tier => new DimensionAutobuyerState(tier));

Autobuyer.dimension = tier => DimensionAutobuyerState.index[tier - 1];
