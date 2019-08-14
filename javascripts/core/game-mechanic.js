"use strict";

/**
 * @abstract
 */
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
        const cap = typeof this.config.cap === "function"
         ? this.config.cap()
         : this.config.cap;
        if (cap !== undefined) {
          effectValue = typeof effectValue === "number"
            ? Math.min(effectValue, cap)
            : Decimal.min(effectValue, cap);
        }
      }
      applyFn(effectValue);
    }
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
  get currency() { throw NotImplementedCrash(); }

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
  get isBought() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  set isBought(value) { throw NotImplementedCrash(); }

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
  get set() { throw NotImplementedCrash(); }

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
  get bits() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  set bits(value) { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  get bitIndex() { throw NotImplementedCrash(); }

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
  get currency() { throw NotImplementedCrash(); }

  get isAffordable() {
    return this.currency.isAffordable(this.cost);
  }

  get cost() {
    return this.config.cost();
  }

  get isAvailable() {
    return true;
  }

  get isRebuyable() {
    return true;
  }

  /**
   * @abstract
   */
  get boughtAmount() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  set boughtAmount(value) { throw NotImplementedCrash(); }

  get canBeApplied() {
    return this.boughtAmount > 0;
  }

  get canBeBought() {
    return this.isAffordable && this.isAvailable;
  }

  purchase() {
    if (!this.canBeBought) return false;
    this.currency.subtract(this.cost);
    this.boughtAmount++;
    GameUI.update();
    return true;
  }
}
