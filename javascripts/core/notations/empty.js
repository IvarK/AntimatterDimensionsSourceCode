"use strict";

Notation.empty = new class EmptyNotation extends Notation {
  constructor() {
    super("Empty");
    this.EMPTY = [" ", " ", " ", " ", " ", " ", " ", " "];
    this.LOG8 = Math.log(8);
  }

  get isPainful() {
    return true;
  }
  formatUnder1000(value) {
    return " "
  }

  formatDecimal(value) {
    const log8 = Math.LN10 / this.LOG8 * value.log10();
    let wholeLog = Math.floor(log8);
    const decimalLog = log8 - wholeLog;
    const decimalLog64 = Math.floor(decimalLog * 64);
    const parts = [
      this.EMPTY[decimalLog64 % 8],
      this.EMPTY[Math.floor(decimalLog64 / 8)],
    ];
    while (wholeLog >= 8) {
      const remainder = wholeLog % 8;
      wholeLog = (wholeLog - remainder) / 8;
      parts.push(this.EMPTY[remainder]);
    }
    parts.push(this.EMPTY[wholeLog]);
    return (" ");
  }
}();
