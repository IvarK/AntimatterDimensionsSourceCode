import { GameMechanicState } from "./game-mechanic";

/**
 * @abstract
 */
export class PurchasableMechanicState extends GameMechanicState {
  /**
   * @abstract
   */
  get currency() { throw new NotImplementedError(); }

  get isAffordable() {
    return this.currency.gte(this.cost);
  }

  get isAvailableForPurchase() {
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
    return !this.isBought && this.isAffordable && this.isAvailableForPurchase;
  }

  purchase() {
    if (!this.canBeBought) return false;
    this.currency.subtract(this.cost);
    this.isBought = true;
    this.onPurchased();
    GameUI.update();
    return true;
  }

  // eslint-disable-next-line no-empty-function
  onPurchased() { }

  get isEffectActive() {
    return this.isBought;
  }
}
