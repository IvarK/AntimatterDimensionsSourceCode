"use strict";

class CustomEffect extends Effect {
  // eslint-disable-next-line max-params
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
