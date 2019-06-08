"use strict";

/**
 * @abstract
 */
class Currency {
  /**
   * @abstract
   */
  get value() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  set value(value) { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  add(amount) { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  integrate(perSecond, deltaTime) { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  subtract(amount) { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  isAffordable(cost) { throw NotImplementedCrash(); }
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

Currency.infinityPoints = new class extends DecimalCurrency {
  get value() { return player.infinityPoints; }
  set value(value) { player.infinityPoints = value; }
}();

Currency.eternityPoints = new class extends DecimalCurrency {
  get value() { return player.eternityPoints; }
  set value(value) { player.eternityPoints = value; }
}();

Currency.dilatedTime = new class extends DecimalCurrency {
  get value() { return player.dilation.dilatedTime; }
  set value(value) { player.dilation.dilatedTime = value; }
}();

Currency.perkPoints = new class extends NumberCurrency {
  get value() { return player.reality.pp; }
  set value(value) { player.reality.pp = value; }
}();
