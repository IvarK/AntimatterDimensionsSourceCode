"use strict";

Autobuyer.galaxy = new class GalaxyAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[10]);
  }

  initialize() {
    player.autobuyers[10] = new Autobuyer(150000);
  }

  get challenge() {
    return NormalChallenge(11);
  }

  /**
   * @returns {number}
   */
  get limit() {
    return this.priority;
  }

  /**
   * @param {number} value
   */
  set limit(value) {
    this.priority = value;
  }

  /**
   * @returns {boolean}
   */
  get isBuyMaxUnlocked() {
    return EternityMilestone.autobuyMaxGalaxies.isReached;
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
    if (!this.canTick()) return;
    if (!Galaxy.requirement.isSatisfied) return;
    if (this.limit <= player.galaxies) return;
    if (this.isBuyMaxUnlocked && this.buyMaxInterval > 0) {
      this.buyMax();
    }
    else {
      this.buySingle();
      this.resetTicks();
    }
  }

  buyMax() {
    if (Autobuyer.intervalTimer - Autobuyer.lastGalaxy >= this.buyMaxInterval) {
      Autobuyer.lastGalaxy = Autobuyer.intervalTimer;
      maxBuyGalaxies();
    }
  }

  buySingle() {
    galaxyResetBtnClick();
  }
}();
