"use strict";


class PrestigeMechanic {
  /**
   * @abstract
   * @returns {boolean}
   */
  get wasReached() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {boolean}
   */
  get wasReachedEver() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {Decimal}
   */
  get goal() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get currencyRequired() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {Currency}
   */
  get currencyGained() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {Currency}
   */
  get prestigeStat() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {GAME_EVENT}
   */
  get eventBefore() { throw new NotImplementedError(); }

  /**
   * @abstract
   * @returns {GAME_EVENT}
   */
  get eventAfter() { throw new NotImplementedError(); }

  /** @abstract */
  // eslint-disable-next-line no-empty-function
  animation() { }

  /** @abstract */
  // eslint-disable-next-line no-empty-function
  tabChange() { }

  /** @abstract */
  statistics() { throw new NotImplementedError(); }

  /** @abstract */
  reset() { throw new NotImplementedError(); }

  /** @abstract */
  gain() { throw new NotImplementedError(); }

  get canBePerformed() {
    return this.currencyRequired.gte(this.goal);
  }

  request() {
    if (!this.canBePerformed) return;
    EventHub.dispatch(this.eventBefore);
    this.animation();
    this.tabChange();
    this.performReset();
    EventHub.dispatch(this.eventAfter);
  }
}
