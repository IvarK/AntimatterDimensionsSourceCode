"use strict";

Autobuyer.sacrifice = new class SacrificeAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autoSacrifice);
  }

  initialize() {
    player.autoSacrifice = new Autobuyer(100);
    this.limit = new Decimal(5);
  }

  get challenge() {
    return InfinityChallenge(2);
  }

  /**
   * @returns {Decimal}
   */
  get limit() {
    return this.autobuyer.priority;
  }

  /**
   * @param {Decimal} value
   */
  set limit(value) {
    this.autobuyer.priority = value;
  }

  tick() {
    if (!this.canTick()) return;
    if (!Sacrifice.nextBoost.gte(this.limit)) return;
    sacrificeReset(true);
    this.resetTicks();
  }
}();
