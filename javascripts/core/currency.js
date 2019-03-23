class Currency {
  constructor(get, set) {
    this._get = get;
    this._set = set;
  }

  get value() {
    return this._get();
  }

  set value(value) {
    this._set(value);
  }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this, no-empty-function
  add(amount) { }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this, no-empty-function
  integrate(perSecond, deltaTime) { }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this, no-empty-function
  subtract(amount) { }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this, no-empty-function
  isAffordable(cost) { }
}

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

Currency.infinityPoints = new DecimalCurrency(
  () => player.infinityPoints,
  ep => player.infinityPoints = ep
);

Currency.eternityPoints = new DecimalCurrency(
  () => player.eternityPoints,
  ep => player.eternityPoints = ep
);

Currency.dilatedTime = new DecimalCurrency(
  () => player.dilation.dilatedTime,
  dt => player.dilation.dilatedTime = dt
);

Currency.perkPoints = new NumberCurrency(
  () => player.reality.pp,
  pp => player.reality.pp = pp
);