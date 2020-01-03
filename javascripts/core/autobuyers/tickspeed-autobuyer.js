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
      AUTOBUYER_MODE.BUY_MAX
    ]
      .nextSibling(this.mode);
  }

  tick() {
    super.tick();
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        buyTickSpeed();
        break;
      case AUTOBUYER_MODE.BUY_MAX:
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
