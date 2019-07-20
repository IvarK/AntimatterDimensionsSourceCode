"use strict";

Notation.empty = new class EmptyNotation extends Notation {
  constructor() {
    super("Empty");
    this.EMPTY = [" "];
  }

  get isPainful() {
    return true;
  }

  formatUnder1000() {
    return " ";
  }

  formatDecimal() {
    return (" ");
  }
}();
