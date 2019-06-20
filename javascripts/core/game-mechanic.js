"use strict";

class GameMechanicState {
  constructor(config) {
    if (!config) throw crash("Must specify config for GameMechanicState");
    this.config = config;
    if (typeof this.config.effect === "number" || this.config.effect instanceof Decimal) {
      Object.defineProperty(this, "effectValue", {
        configurable: false,
        writable: false,
        value: this.config.effect,
      });
    }
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
        const cap = typeof this.config.cap === "function" ?
         this.config.cap() :
         this.config.cap;
        if (cap !== undefined) {
          effectValue = typeof effectValue === "number" ?
            Math.min(effectValue, cap) :
            Decimal.min(effectValue, cap);
        }
      }
      applyFn(effectValue);
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
    return this._currency.isAffordable(this.cost);
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
    this._currency.subtract(this.cost);
    GameUI.update();
    return true;
  }

  get canBeApplied() {
    return this.isBought;
  }
}
