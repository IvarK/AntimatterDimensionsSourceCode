"use strict";

Autobuyer.tickspeed = new class TickspeedAutobuyerState extends AutobuyerState {
  constructor() {
    super(() => player.autobuyers[8]);
  }

  initialize() {
    player.autobuyers[8] = new Autobuyer(5000);
  }

  get challenge() {
    return NormalChallenge(9);
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
    this.mode = this.mode === AutobuyerMode.BUY_SINGLE ? AutobuyerMode.BUY_MAX : AutobuyerMode.BUY_SINGLE;
  }

  tick() {
    if (!this.canTick()) return;
    if (this.mode === AutobuyerMode.BUY_SINGLE) {
      buyTickSpeed();
    }
    else {
      buyMaxTickSpeed();
    }
    this.resetTicks();
  }
}();
