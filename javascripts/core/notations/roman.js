"use strict";

Notation.roman = new class RomanNotation extends Notation {
  constructor() {
    super("Roman");
    this._romanNumbers = [
      [1000000, "M̄"],
      [900000, "C̄M̄"],
      [500000, "D̄"],
      [400000, "C̄D̄"],
      [100000, "C̄"],
      [90000, "X̄C̄"],
      [50000, "L̄"],
      [40000, "X̄L̄"],
      [10000, "X̄"],
      [9000, "ⅯX̄"],
      [5000, "V̄"],
      [4000, "ⅯV̄"],
      [1000, "Ⅿ"],
      [900, "ⅭⅯ"],
      [500, "Ⅾ"],
      [400, "ⅭⅮ"],
      [100, "Ⅽ"],
      [90, "ⅩⅭ"],
      [50, "Ⅼ"],
      [40, "ⅩⅬ"],
      [10, "Ⅹ"],
      [9, "ⅠⅩ"],
      [5, "Ⅴ"],
      [4, "ⅠⅤ"],
      [1, "Ⅰ"],
    ];
    this._romanFractions = ["", "·", ":", "∴", "∷", "⁙"];
    this.maximum = 4000000;
    this._maxLog10 = Math.log10(this.maximum);
  }

  get isPainful() {
    return true;
  }

  formatInfinite() {
    return "Infinitus";
  }

  formatUnder1000(value) {
    return this.romanize(value);
  }

  formatDecimal(value) {
    if (value.lt(this.maximum)) {
      return this.romanize(value.toNumber());
    }
    const log10 = value.log10();
    const maximums = log10 / this._maxLog10;
    const current = Math.pow(this.maximum, maximums - Math.floor(maximums));
    return `${this.romanize(current)}↑${this.formatDecimal(maximums.toDecimal())}`;
  }

  /**
   * @param {number} value
   * @return {string}
   * @private
   */
  romanize(value) {
    const romanNumbers = this._romanNumbers;
    let romanized = "";
    for (const numberPair of romanNumbers) {
      const decimal = numberPair[0];
      const roman = numberPair[1];
      while (decimal <= value) {
        romanized += roman;
        value -= decimal;
      }
    }
    let duodecimal = Math.round(Math.floor(value * 10) * 1.2);
    if (duodecimal === 0) {
      return romanized === "" ? "nulla" : romanized;
    }
    if (duodecimal > 5) {
      duodecimal -= 6;
      romanized += "Ｓ";
    }
    const romanFractions = this._romanFractions;
    romanized += romanFractions[duodecimal];
    return romanized;
  }
}("Roman");