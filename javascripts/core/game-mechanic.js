class GameMechanicState {
  constructor(config) {
    if (!config) throw crash("Must specify config for GameMechanicState");
    this.config = config;
    this._id = this.config.id;
    this._effectIsConstant = false;
    if (typeof this.config.effect === "number" || this.config.effect instanceof Decimal) {
      this._effectIsConstant = true;
      const copy = this.config.effect;
      Object.defineProperty(this, "effectValue", {
        configurable: false,
        writable: false,
        value: copy,
      });
    }
  }

  get id() {
    return this._id;
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
    // The first time this gets called, we figure stuff out about our effects
    // and make a specialized version. This method gets replaced as part of that.
    this.compileApplyEffect();
    this.applyEffect(applyFn);
  }

  compileApplyEffect() {
    // We can now safely call the effect function, and figure out the data type
    // even for non constant effects:
    const sampleEffect = this.effectValue;
    if (this.config.cap === undefined) {
      this.applyEffect = applyFn => {
        if (this.canBeApplied) {
          applyFn(this.effectValue);
        }
      };
      return;
    }
    let capIsNumber = typeof this.config.cap === "number";
    const capIsDecimal = this.config.cap instanceof Decimal;
    const capCopy = this.config.cap;
    if (capIsNumber && typeof sampleEffect === "number") {
      this.applyEffect = applyFn => {
        if (this.canBeApplied) {
          applyFn(Math.min(this.effectValue, capCopy));
        }
      };
      return;
    }
    if (capIsNumber || capIsDecimal) {
      this.applyEffect = applyFn => {
        if (this.canBeApplied) {
          applyFn(Decimal.min(this.effectValue, capCopy));
        }
      };
      return;
    }
    // There are some poorly specified caps (ones that return undefined
    // in some cases, for example). For now, we don't bother doing anything smart
    this.applyEffect = applyFn => {
      const cap = this.config.cap();
      const effect = this.effectValue;
      if (cap === undefined) return applyFn(effect);
      if (effect instanceof Decimal) return applyFn(Decimal.min(effect, cap));
      return applyFn(Math.min(effect, cap));
    }
  }
}

class PurchasableMechanicState extends GameMechanicState {
  constructor(config, currency, getCollection) {
    super(config);
    this._currency = currency;
    this._getCollection = getCollection;
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
    return this.collection.has(this.id);
  }

  set isBought(value) {
    if (value) {
      this.collection.add(this.id);
    } else {
      this.collection.delete(this.id);
    }
  }

  get canBeBought() {
    return !this.isBought && this.isAffordable && this.isAvailable;
  }

  purchase() {
    if (!this.canBeBought) return false;
    this.isBought = true;
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

Currency.perkPoints = new Currency(
  () => player.reality.pp,
  pp => player.reality.pp = pp
);