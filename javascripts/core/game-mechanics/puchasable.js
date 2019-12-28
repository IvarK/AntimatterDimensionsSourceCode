"use strict";

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

  get isEffectActive() {
    return this.isBought;
  }
}
