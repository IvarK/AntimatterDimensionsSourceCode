"use strict";

Autobuyer.tickspeed = new class TickspeedAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.tickspeed;
  }

  get isUnlocked() {
    return NormalChallenge(9).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.tickspeed.interval;
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
      AutobuyerMode.BUY_MAX
    ]
      .nextSibling(this.mode);
  }

  tick() {
    super.tick();
    switch (this.mode) {
      case AutobuyerMode.BUY_SINGLE:
        buyTickSpeed();
        break;
      case AutobuyerMode.BUY_MAX:
        buyMaxTickSpeed();
        break;
    }
  }

  reset() {
    super.reset();
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.isUnlocked = false;
  }
}();
