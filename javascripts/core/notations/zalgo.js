"use strict";

Notation.zalgo = new class ZalgoNotation extends Notation {
  constructor() {
    super("Zalgo");
    this._zalgoChars = [
      "\u030D", "\u0336", "\u0353", "\u033F", "\u0489",
      "\u0330", "\u031A", "\u0338", "\u035A", "\u0337"
    ];
    this._heComes = ["H", "E", " ", "C", "O", "M", "E", "S"];
  }

  get isPainful() {
    return true;
  }

  formatInfinite() {
    return this._heComes
      .map(char => char + this._zalgoChars.randomElement())
      .join("");
  }

  formatUnder1000(value) {
    return this.heComes(value.toDecimal());
  }

  formatDecimal(value) {
    return this.heComes(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   */
  heComes(value) {
    // Eternity seems to happen around e66666 antimatter, who would've thought? Scaled down to 1000.
    const scaled = value.plus(1).log10() / 66666 * 1000;
    const displayPart = scaled.toFixed(2);
    const zalgoPart = Math.floor(Math.abs(Math.pow(2, 30) * (scaled - displayPart)));

    const displayChars = Array.from(formatWithCommas(displayPart));
    const zalgoIndices = Array.from(zalgoPart.toString() + scaled.toFixed(0));

    for (let i = 0; i < zalgoIndices.length; i++) {
      const zalgoIndex = parseInt(zalgoIndices[i], 10);
      const displayIndex = 37 * i % displayChars.length;
      displayChars[displayIndex] += this._zalgoChars[zalgoIndex];
    }

    return displayChars.join("");
  }
}();