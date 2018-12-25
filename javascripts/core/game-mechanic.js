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
      applyFn(this.effectValue);
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
    return this._currency.value.gte(this.cost);
  }

  get isBought() {
    return this.collection.includes(this.id);
  }

  purchase() {
    if (this.isBought || !this.isAffordable) return false;
    this.collection.push(this.id);
    this._currency.value = this._currency.value.minus(this.cost);
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

Currency.eternityPoints = new Currency(
  () => player.eternityPoints,
  ep => player.eternityPoints = ep
);

Currency.dilatedTime = new Currency(
  () => player.dilation.dilatedTime,
  dt => player.dilation.dilatedTime = dt
);