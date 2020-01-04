"use strict";

/**
 * @abstract
 */
class Currency {
  /**
   * @abstract
   */
  get value() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set value(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  add(amount) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  integrate(perSecond, deltaTime) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  subtract(amount) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  isAffordable(cost) { throw new NotImplementedError(); }
}

/**
 * @abstract
 */
class NumberCurrency extends Currency {
  add(amount) {
    this.value += amount;
  }

  integrate(perSecond, deltaTime) {
    this.add(perSecond * deltaTime);
  }

  subtract(amount) {
    this.value -= amount;
  }

  isAffordable(cost) {
    return this.value >= cost;
  }
}

/**
 * @abstract
 */
class DecimalCurrency extends Currency {
  add(amount) {
    this.value = this.value.plus(amount);
  }

  integrate(perSecond, deltaTime) {
    this.add(perSecond.times(deltaTime));
  }

  subtract(amount) {
    this.value = this.value.minus(amount);
  }

  isAffordable(cost) {
    return this.value.gte(cost);
  }
}

Currency.antimatter = new class extends DecimalCurrency {
  get value() { return player.antimatter; }
  set value(value) { player.antimatter = value; }
}();

Currency.infinityPower = new class extends DecimalCurrency {
  get value() { return player.infinityPower; }
  set value(value) { player.infinityPower = value; }
}();

Currency.infinityPoints = new class extends DecimalCurrency {
  get value() { return player.infinityPoints; }
  set value(value) { player.infinityPoints = value; }
}();

Currency.timeShards = new class extends DecimalCurrency {
  get value() { return player.timeShards; }
  set value(value) { player.timeShards = value; }
}();

Currency.eternityPoints = new class extends DecimalCurrency {
  get value() { return player.eternityPoints; }
  set value(value) { player.eternityPoints = value; }
}();

Currency.dilatedTime = new class extends DecimalCurrency {
  get value() { return player.dilation.dilatedTime; }
  set value(value) { player.dilation.dilatedTime = value; }
}();

Currency.realityMachines = new class extends DecimalCurrency {
  get value() { return player.reality.realityMachines; }
  set value(value) { player.reality.realityMachines = value; }
}();

Currency.perkPoints = new class extends NumberCurrency {
  get value() { return player.reality.pp; }
  set value(value) { player.reality.pp = value; }
}();

Currency.entanglement = new class extends NumberCurrency {
  get value() { return player.celestials.ra.compression.entanglement; }
  set value(value) { player.celestials.ra.compression.entanglement = value; }
}();
