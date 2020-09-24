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


  get isBought() {
    return this.data.isBought;
  }

  get antimatterCost() {
    return new Decimal(1e140);
  }

  get canBeBought() {
    return true;
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

  purchase() {
    if (player.totalAntimatter.lt(this.antimatterCost)) return;
    this.data.isBought = true;
  }

  reset() {
    super.reset();
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.mode = AUTOBUYER_MODE.BUY_SINGLE;
    this.data.isUnlocked = false;
    this.data.isBought = false;
  }
}();
