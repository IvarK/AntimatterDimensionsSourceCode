/**
 * @abstract
 */
export class AutobuyerState {
  /**
   * @abstract
   */
  get data() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get isUnlocked() { throw new NotImplementedError(); }

  get canTick() {
    return this.isActive && player.auto.autobuyersOn && (this.isUnlocked || this.isBought);
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
export class IntervaledAutobuyerState extends AutobuyerState {
  get interval() {
    return this.data.interval;
  }

  get canTick() {
    return super.canTick && this.timeSinceLastTick >= this.interval;
  }

  get timeSinceLastTick() {
    return player.records.realTimePlayed - this.data.lastTick;
  }

  tick() {
    this.data.lastTick = player.records.realTimePlayed;
  }

  /**
   * @abstract
   */
  get resetTickOn() { throw new NotImplementedError(); }

  resetTick(prestigeEvent) {
    if (prestigeEvent >= this.resetTickOn) this.data.lastTick = 0;
  }

  // eslint-disable-next-line no-empty-function
  reset() { }
}


/**
 * @abstract
 */
export class UpgradeableAutobuyerState extends IntervaledAutobuyerState {
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

  upgradeInterval(free) {
    if (this.hasMaxedInterval) return;
    if (!free && !Currency.infinityPoints.purchase(this.cost)) return;
    this.data.cost *= 2;
    this.data.interval = Math.clampMin(this.data.interval * 0.6, 100);
    Achievement(52).tryUnlock();
    Achievement(53).tryUnlock();
    GameUI.update();
  }

  maxIntervalForFree() {
    while (!this.hasMaxedInterval) {
      this.upgradeInterval(true);
    }
  }

  reset() {
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.interval = this.baseInterval;
    this.data.cost = 1;
  }
}

export const Autobuyer = {};
window.Autobuyer = Autobuyer;
