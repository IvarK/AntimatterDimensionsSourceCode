"use strict";

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

  get isEffectActive() {
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
