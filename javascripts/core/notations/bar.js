"use strict";

Notation.bar = new class BarNotation extends Notation {
  constructor() {
    super("Bar");
    this.BARS = ["", "", "", "", "", "", "", ""];
    this.LOG8 = Math.log(8);
  }

  get isPainful() {
    return false;
  }

  formatDecimal(value) {
    const log8 = Math.LN10 / this.LOG8 * value.log10();
    let wholeLog = Math.floor(log8);
    const decimalLog = log8 - wholeLog;
    const decimalLog64 = Math.floor(decimalLog * 64);
    const parts = [
      this.BARS[decimalLog64 % 8],
      this.BARS[Math.floor(decimalLog64 / 8)],
    ];
    while (wholeLog >= 8) {
      const remainder = wholeLog % 8;
      wholeLog = (wholeLog - remainder) / 8;
      parts.push(this.BARS[remainder]);
    }
    parts.push(this.BARS[wholeLog]);
    return parts.join("");
  }
}();
