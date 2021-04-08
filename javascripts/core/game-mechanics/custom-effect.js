"use strict";
class CustomEffect extends Effect {
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

  get name() {
    throw new Error("Name is undefined.");
  }
}