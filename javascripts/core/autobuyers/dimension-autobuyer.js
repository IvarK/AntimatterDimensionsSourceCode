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

  get isBought() {
    return this.data.isBought;
  }

  get antimatterCost() {
    return Decimal.pow(1e10, this._tier - 1).times(1e40);
  }

  get canBeBought() {
    return true;
  }

  get bulk() {
    // Use 1e100 to avoid issues with Infinity.
    return this.hasUnlimitedBulk ? 1e100 : this.data.bulk;
  }
  
  get hasUnlimitedBulk() {
    return Achievement(61).isUnlocked;
  }

  get hasMaxedBulk() {
    return this.bulk >= 1e10;
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
      AUTOBUYER_MODE.BUY_SINGLE,
      AUTOBUYER_MODE.BUY_10
    ]
      .nextSibling(this.mode);
  }

  tick() {
    const tier = this._tier;
    if (!AntimatterDimension(tier).isAvailableForPurchase) return;
    super.tick();
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        buyOneDimension(tier);
        break;
      case AUTOBUYER_MODE.BUY_10:
        buyMaxDimension(tier, player.options.bulkOn ? this.bulk : 1, true);
        break;
    }
  }

  upgradeBulk() {
    if (this.hasMaxedBulk) return;
    if (!Currency.infinityPoints.purchase(this.cost)) return;
    this.data.bulk = Math.clampMax(this.bulk * 2, 1e10);
    this.data.cost = Math.ceil(2.4 * this.cost);
    Achievement(61).tryUnlock();
    GameUI.update();
  }

  purchase() {
    if (player.totalAntimatter.lt(this.antimatterCost)) return;
    this.data.isBought = true;
  }

  reset() {
    super.reset();
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.isUnlocked = false;
    this.data.isBought = false;
    this.data.bulk = 1;
  }
}

DimensionAutobuyerState.index = Array.range(1, 8).map(tier => new DimensionAutobuyerState(tier));

Autobuyer.dimension = tier => DimensionAutobuyerState.index[tier - 1];
