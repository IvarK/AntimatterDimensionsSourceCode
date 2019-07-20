"use strict";

const Autobuyer = function Autobuyer(interval) {
    this.target = 1;
    this.cost = 1;
    this.interval = interval;
    this.priority = 1;
    this.ticks = 0;
    this.isOn = false;
    this.bulk = 1;
};

Autobuyer.tickTimer = 0;
Autobuyer.intervalTimer = 0;
Autobuyer.lastDimBoost = 0;
Autobuyer.lastGalaxy = 0;

/**
 * @abstract
 */
class AutobuyerState {
  constructor(getAutobuyer) {
    this._getAutobuyer = getAutobuyer;
  }

  /**
   * @abstract
   */
  get data() { throw NotImplementedCrash(); }

  /**
   * @returns {Autobuyer|undefined}
   */
  get autobuyer() {
    // What
    const autobuyer = this._getAutobuyer();
    return autobuyer % 1 !== 0 ? autobuyer : undefined;
  }

  /**
   * @returns {boolean}
   */
  get isUnlocked() {
    return this.autobuyer !== undefined;
  }

  tryUnlock() {
    if (!this.isUnlocked && this.challenge.isCompleted) {
      this.initialize();
    }
  }

  /**
   * @returns {NormalChallengeState|InfinityChallengeState}
   */
  get challenge() {
    throw "This method should be overridden in inheriting class";
  }

  initialize() {
    throw "This method should be overridden in inheriting class";
  }

  /**
   * @returns {boolean}
   */
  get isOn() {
    return this.autobuyer.isOn;
  }

  /**
   * @param {boolean} value
   */
  set isOn(value) {
    this.autobuyer.isOn = value;
  }

  /**
   * @returns {number}
   */
  get cost() {
    return this.autobuyer.cost;
  }

  /**
   * @param {number} value
   */
  set cost(value) {
    this.autobuyer.cost = value;
  }

  /**
   * @returns {number}
   */
  get ticks() {
    return this.autobuyer.ticks;
  }

  /**
   * @param {number} value
   */
  set ticks(value) {
    this.autobuyer.ticks = value;
  }

  /**
   * @returns {boolean}
   */
  canTick() {
    if (!this.isUnlocked) return false;
    if (this.ticks * 100 < this.interval) {
      this.ticks++;
      return false;
    }
    return this.isOn;
  }

  resetTicks() {
    this.ticks = 1;
  }

  /**
   * @returns {number}
   */
  get priority() {
    return this.autobuyer.priority;
  }

  /**
   * @param {number} value
   */
  set priority(value) {
    this.autobuyer.priority = value;
  }

  /**
   * @returns {number}
   */
  get interval() {
    return this.autobuyer.interval;
  }

  /**
   * @param {number} value
   */
  set interval(value) {
    this.autobuyer.interval = value;
  }

  /**
   * @returns {boolean}
   */
  get hasMaxedInterval() {
    return this.isUnlocked && this.interval <= 100;
  }

  /**
   * @returns {number}
   */
  get bulk() {
    return this.autobuyer.bulk;
  }

  /**
   * @param {number} value
   */
  set bulk(value) {
    this.autobuyer.bulk = value;
  }

  /**
   * @returns {boolean}
   */
  get isActive() {
    return this.isUnlocked && this.autobuyer.isOn;
  }

  toggle() {
    this.isOn = !this.isOn;
  }

  upgradeInterval() {
    if (this.hasMaxedInterval) return;
    if (player.infinityPoints.lt(this.cost)) return;
    player.infinityPoints = player.infinityPoints.minus(this.cost);
    this.interval = Math.max(this.interval * 0.6, 100);
    if (this.interval > 120) {
      // if your last purchase wont be very strong, dont double the cost
      this.cost *= 2;
    }
    Autobuyer.checkIntervalAchievements();
    GameUI.update();
  }

  get hasInterval() {
    return true;
  }
}

/**
 * @abstract
 */
class IntervaledAutobuyerState extends AutobuyerState {

  get hasInterval() {
    return true;
  }
}
