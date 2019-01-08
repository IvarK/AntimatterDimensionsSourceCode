class GameMechanicState {
  constructor(config) {
    this.config = config;
  }

  get id() {
    return this.config.id;
  }

  get cost() {
    return this.config.cost;
  }

  get effectValue() {
    return this.config.effect();
  }

  get canBeApplied() {
    return false;
  }

  applyEffect(applyFn) {
    if (this.canBeApplied) {
      let effectValue = this.effectValue;
      if (this.config.cap !== undefined) {
        effectValue = typeof effectValue === "number" ?
          Math.min(effectValue, this.config.cap) :
          Decimal.min(effectValue, this.config.cap);
      }
      applyFn(effectValue);
    }
  }
}

class PurchasableMechanicState extends GameMechanicState {
  constructor(config, currency, getCollection, event) {
    super(config);
    this._currency = currency;
    this._getCollection = getCollection;
    this._event = event;
  }

  get collection() {
    return this._getCollection();
  }

  get isAffordable() {
    const currency = this._currency.value;
    return typeof currency === "number" ? currency >= (this.cost) : currency.gte(this.cost);
  }

  get isAvailable() {
    return true;
  }

  get isBought() {
    return this.collection.includes(this.id);
  }

  get canBeBought() {
    return this.isAffordable && this.isAvailable;
  }

  purchase() {
    if (this.isBought || !this.canBeBought) return false;
    this.collection.push(this.id);
    const currency = this._currency.value;
    if (typeof currency === "number") {
      this._currency.value = currency - this.cost;
    } else {
      this._currency.value = currency.minus(this.cost);
    }
    GameUI.update();
    return true;
  }

  get canBeApplied() {
    return this.isBought;
  }
}

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
}

Currency.infinityPoints = new Currency(
  () => player.infinityPoints,
  ep => player.infinityPoints = ep
);

Currency.eternityPoints = new Currency(
  () => player.eternityPoints,
  ep => player.eternityPoints = ep
);

Currency.dilatedTime = new Currency(
  () => player.dilation.dilatedTime,
  dt => player.dilation.dilatedTime = dt
);