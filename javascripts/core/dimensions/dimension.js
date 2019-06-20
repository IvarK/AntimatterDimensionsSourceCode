"use strict";

class DimensionState {
  constructor(getData, tier) {
    this._tier = tier;
    this._getData = getData;
  }

  get tier() { return this._tier; }

  get data() { return this._getData()[this.tier - 1]; }

  /** @returns {Decimal} */
  get cost() { return this.data.cost; }
  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  /** @returns {Decimal} */
  get amount() { return this.data.amount; }
  /** @param {Decimal} value */
  set amount(value) { this.data.amount = value; }

  /** @returns {Decimal} */
  get power() { return this.data.power; }
  /** @param {Decimal} value */
  set power(value) { this.data.power = value; }

  /** @returns {number} */
  get bought() { return this.data.bought; }
  /** @param {number} value */
  set bought(value) { this.data.bought = value; }

  static createIndex($class) {
    const index = Array.range(1, 8).map(tier => new $class(tier));
    index.unshift(null);
    return index;
  }
}
