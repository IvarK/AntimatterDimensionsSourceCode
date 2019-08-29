"use strict";

/**
 * @abstract
 */
class AutobuyerState {
  /**
   * @abstract
   */
  get data() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  get isUnlocked() { throw NotImplementedCrash(); }

  get canTick() {
    return this.isActive && player.options.autobuyersOn && this.isUnlocked;
  }

  get isActive() {
    return this.data.isActive;
  }

  set isActive(value) {
    this.data.isActive = value;
  }

  toggle() {
    this.isActive = !this.isActive;
  }

  /**
   * @abstract
   */
  tick() { throw NotImplementedCrash(); }

  // eslint-disable-next-line no-empty-function
  reset() { }
}

/**
 * @abstract
 */
class IntervaledAutobuyerState extends AutobuyerState {
  /**
   * @abstract
   */
  get baseInterval() { throw NotImplementedCrash(); }

  get cost() {
    return this.data.cost;
  }

  get interval() {
    const interval = this.data.interval;
    return BreakInfinityUpgrade.autobuyerSpeed.isBought ? interval / 2 : interval;
  }

  get hasMaxedInterval() {
    return this.data.interval <= 100;
  }

  get canTick() {
    return super.canTick && this.timeSinceLastTick >= this.interval;
  }

  get timeSinceLastTick() {
    return player.realTimePlayed - this.data.lastTick;
  }

  tick() {
    this.data.lastTick = player.realTimePlayed;
  }

  upgradeInterval() {
    if (this.hasMaxedInterval) return;
    if (!Currency.infinityPoints.isAffordable(this.cost)) return;
    Currency.infinityPoints.subtract(this.cost);
    if (this.data.interval > 120) {
      // If your last purchase wont be very strong, dont double the cost
      this.data.cost *= 2;
    }
    this.data.interval = Math.clampMin(this.data.interval * 0.6, 100);
    Achievement(52).tryUnlock();
    Achievement(53).tryUnlock();
    GameUI.update();
  }

  reset() {
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.interval = this.baseInterval;
    this.data.cost = 1;
  }
}

const Autobuyer = {};
