"use strict";

class DimensionAutobuyerState extends IntervaledAutobuyerState {
  constructor(tier) {
    super(() => player.autobuyers[tier - 1]);
    this._tier = tier;
  }

  get data() {
    return player.auto.dimensions[this._tier - 1];
  }

  initialize() {
    const baseIntervals = [
      null,
      1500,
      2000,
      2500,
      3000,
      4000,
      5000,
      6000,
      7500,
    ];
    player.autobuyers[this._tier - 1] = new Autobuyer(baseIntervals[this._tier]);
  }

  get challenge() {
    return NormalChallenge(this._tier);
  }

  /**
   * @returns {boolean}
   */
  get hasMaxedBulk() {
    return this.isUnlocked && this.bulk >= 1e100;
  }

  /**
   * @returns {AutobuyerMode}
   */
  get mode() {
    return this.autobuyer.target;
  }

  /**
   * @param {AutobuyerMode} value
   */
  set mode(value) {
    this.autobuyer.target = value;
  }

  toggleMode() {
    this.mode = this.mode === AutobuyerMode.BUY_SINGLE ? AutobuyerMode.BUY_10 : AutobuyerMode.BUY_SINGLE;
  }

  tick() {
    if (!this.canTick()) return;
    const tier = this._tier;
    if (!NormalDimension(tier).isAvailable) return;
    if (this.mode === AutobuyerMode.BUY_SINGLE) {
      buyOneDimension(tier);
    }
    else {
      const bulk = player.options.bulkOn ? this.bulk : 1;
      buyManyDimensionAutobuyer(tier, bulk);
    }
    this.resetTicks();
  }

  upgradeBulk() {
    if (this.hasMaxedBulk) return;
    if (player.infinityPoints.lt(this.cost)) return;
    player.infinityPoints = player.infinityPoints.minus(this.cost);
    this.bulk = Math.min(this.bulk * 2, 1e100);
    this.cost = Math.ceil(2.4 * this.cost);
    Autobuyer.checkBulkAchievements();
    GameUI.update();
  }
}

DimensionAutobuyerState.index = Array.range(1, 8).map(tier => new DimensionAutobuyerState(tier));

Autobuyer.dimension = tier => DimensionAutobuyerState.index[tier - 1];
