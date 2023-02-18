import { PurchasableMechanicState } from "./puchasable";

/**
 * @abstract
 */
export class SetPurchasableMechanicState extends PurchasableMechanicState {
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
