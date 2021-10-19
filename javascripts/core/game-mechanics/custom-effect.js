"use strict";
class CustomEffect extends Effect {
  // eslint-disable-next-line max-params
   /**
   * @param {String} name - The name of the created Effect
   * @param {effectValueCallback, Number, Decimal} effect - Callback used to calculate the effect's value or constant numeric effect value
   * @param {effectValueCallback} condition - Callback used to check whether the effect can be applied
   * @param {effectValueCallback} cap - Callback used to calculate the effect's maximum value or constant numeric maximum value
   */
  constructor(name, effect, condition, cap) {
    super(effect, condition, cap);
    if (!name) {
      return;
    }
    Object.defineProperty(this, "name", {
      configurable: false,
      writable: false,
      value: name
    });
  }

  /**
   * @abstract
   */
  get name() { throw new NotImplementedError(); }
}
