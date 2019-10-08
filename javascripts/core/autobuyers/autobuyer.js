"use strict";

/**
 * @abstract
 */
class AutobuyerState {
  /**
   * @abstract
   */
  get data() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get isUnlocked() { throw new NotImplementedError(); }

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
  tick() { throw new NotImplementedError(); }

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
  get baseInterval() { throw new NotImplementedError(); }

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
    const realTimePlayed = player.realTimePlayed;
    const interval = this.interval;
    // Don't allow more than one interval worth of time to accumulate (at most one autobuyer tick)
    this.data.lastTick = Math.max(
      Math.min(this.data.lastTick + interval, realTimePlayed),
      realTimePlayed - interval);
  }

  upgradeInterval() {
    if (this.hasMaxedInterval) return;
    if (!Currency.infinityPoints.isAffordable(this.cost)) return;
    Currency.infinityPoints.subtract(this.cost);
    this.data.cost *= 2;
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
