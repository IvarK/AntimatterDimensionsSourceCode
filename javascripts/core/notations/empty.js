"use strict";

Notation.blind = new class BlindNotation extends Notation {
  constructor() {
    super("Blind");
  }

  get isPainful() {
    return true;
  }

  formatUnder1000() {
    return " ";
  }

  formatDecimal() {
    return " ";
  }
}();
