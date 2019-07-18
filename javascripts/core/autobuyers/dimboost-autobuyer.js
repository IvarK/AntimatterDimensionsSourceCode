"use strict";

Autobuyer.dimboost = new class DimboostAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[9]);
  }

  initialize() {
    player.autobuyers[9] = new Autobuyer(8000);
  }

  get challenge() {
    return NormalChallenge(10);
  }

  /**
   * @returns {number}
   */
  get maxDimBoosts() {
    return this.priority;
  }

  /**
   * @param {number} value
   */
  set maxDimBoosts(value) {
    this.priority = value;
  }

  /**
   * @returns {boolean}
   */
  get isBulkBuyUnlocked() {
    return BreakInfinityUpgrade.bulkDimBoost.isBought || this.isBuyMaxUnlocked;
  }

  /**
   * @returns {boolean}
   */
  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxDimboosts.isReached;
  }

  /**
   * @returns {number}
   */
  get galaxies() {
    return player.overXGalaxies;
  }

  /**
   * @param {number} value
   */
  set galaxies(value) {
    player.overXGalaxies = value;
  }

  /**
   * @returns {number}
   */
  get buyMaxInterval() {
    return this.bulk;
  }

  /**
   * @param {number} value
   */
  set buyMaxInterval(value) {
    this.bulk = value;
  }

  tick() {
    if (Ra.isRunning) return;
    if (!this.canTick()) return;
    if (this.isBuyMaxUnlocked) {
      if (Autobuyer.intervalTimer - Autobuyer.lastDimBoost >= this.buyMaxInterval) {
        Autobuyer.lastDimBoost = Autobuyer.intervalTimer;
        maxBuyDimBoosts();
      }
      return;
    }
    if (this.maxDimBoosts <= player.resets && this.galaxies > player.galaxies) {
      return;
    }
    if (this.isBulkBuyUnlocked && !DimBoost.isShift) {
      var bulk = Math.max(this.bulk, 1);
      if (!DimBoost.bulkRequirement(bulk).isSatisfied) return;
      softReset(bulk);
    }
    else {
      if (!DimBoost.requirement.isSatisfied) return;
      softReset(1);
    }
    this.resetTicks();
  }
}();
