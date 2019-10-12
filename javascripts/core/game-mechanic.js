"use strict";

/**
 * @abstract
 */
class GameMechanicState {
  constructor(config) {
    if (!config) throw new Error("Must specify config for GameMechanicState");
    this.config = config;
    if (typeof this.config.effect === "number" || this.config.effect instanceof Decimal) {
      Object.defineProperty(this, "effectValue", {
        configurable: false,
        writable: false,
        value: this.config.effect,
      });
      if (this.config.cap === undefined) {
        Object.defineProperty(this, "cappedEffectValue", {
          configurable: false,
          writable: false,
          value: this.config.effect,
        });
      }
    }
  }

  get id() {
    return this.config.id;
  }

  get effectValue() {
    return this.config.effect();
  }

  get cappedEffectValue() {
    const effectValue = this.effectValue;
    if (this.config.cap === undefined) return effectValue;
    const cap = typeof this.config.cap === "function"
      ? this.config.cap()
      : this.config.cap;
    if (cap === undefined) return effectValue;
    return typeof effectValue === "number"
      ? Math.min(effectValue, cap)
      : Decimal.min(effectValue, cap);
  }

  effectOrDefault(defaultValue) {
    return this.canBeApplied ? this.cappedEffectValue : defaultValue;
  }

  get canBeApplied() {
    return false;
  }

  applyEffect(applyFn) {
    if (this.canBeApplied) applyFn(this.cappedEffectValue);
  }

  static createIndex(gameData) {
    this.index = mapGameData(gameData, config => new this(config));
  }
}

/**
 * @abstract
 */
class PurchasableMechanicState extends GameMechanicState {
  /**
   * @abstract
   */
  get currency() { throw new NotImplementedError(); }

  get isAffordable() {
    return this.currency.isAffordable(this.cost);
  }

  get isAvailable() {
    return true;
  }

  get isRebuyable() {
    return false;
  }

  get cost() {
    return this.config.cost;
  }

  /**
   * @abstract
   */
  get isBought() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set isBought(value) { throw new NotImplementedError(); }

  get canBeBought() {
    return !this.isBought && this.isAffordable && this.isAvailable;
  }

  purchase() {
    if (!this.canBeBought) return false;
    this.currency.subtract(this.cost);
    this.isBought = true;
    GameUI.update();
    return true;
  }

  get canBeApplied() {
    return this.isBought;
  }
}

/**
 * @abstract
 */
class SetPurchasableMechanicState extends PurchasableMechanicState {
  /**
   * @abstract
   */
  get set() { throw new NotImplementedError(); }

  get isBought() {
    return this.set.has(this.id);
  }

  set isBought(value) {
    if (value) {
      this.set.add(this.id);
    } else {
      this.set.delete(this.id);
    }
  }
}

/**
 * @abstract
 */
class BitPurchasableMechanicState extends PurchasableMechanicState {
  /**
   * @abstract
   */
  get bits() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set bits(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get bitIndex() { throw new NotImplementedError(); }

  get isBought() {
    // eslint-disable-next-line no-bitwise
    return (this.bits & (1 << this.bitIndex)) !== 0;
  }

  set isBought(value) {
    if (value) {
      // eslint-disable-next-line no-bitwise
      this.bits |= (1 << this.bitIndex);
    } else {
      // eslint-disable-next-line no-bitwise
      this.bits &= ~(1 << this.bitIndex);
    }
  }
}

/**
 * @abstract
 */
class RebuyableMechanicState extends GameMechanicState {
  /**
   * @abstract
   */
  get currency() { throw new NotImplementedError(); }

  get isAffordable() {
    return this.currency.isAffordable(this.cost);
  }

  get cost() {
    return this.config.cost();
  }

  get isAvailable() {
    return true;
  }

  get isCapped() {
    return false;
  }

  get isRebuyable() {
    return true;
  }

  /**
   * @abstract
   */
  get boughtAmount() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set boughtAmount(value) { throw new NotImplementedError(); }

  get canBeApplied() {
    return this.boughtAmount > 0;
  }

  get canBeBought() {
    return this.isAffordable && this.isAvailable && !this.isCapped;
  }

  purchase() {
    if (!this.canBeBought) return false;
    this.currency.subtract(this.cost);
    this.boughtAmount++;
    GameUI.update();
    return true;
  }
}
