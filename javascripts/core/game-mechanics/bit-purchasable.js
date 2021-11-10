import { PurchasableMechanicState } from "./puchasable.js";

/**
 * @abstract
 */
export class BitPurchasableMechanicState extends PurchasableMechanicState {
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
