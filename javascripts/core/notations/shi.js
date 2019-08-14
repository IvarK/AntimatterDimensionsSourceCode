"use strict";

Notation.shi = new class ShiNotation extends Notation {
  constructor() {
    super("Shi");
    this._shiChars = "世使侍勢十史嗜士始室實屍市恃拭拾施是時氏濕獅矢石視試詩誓識逝適釋食";
  }

  get isPainful() {
    return true;
  }

  formatInfinite() {
    return this.shi(Decimal.MAX_NUMBER);
  }

  formatUnder1000(value) {
    return this.shi(value.toDecimal());
  }

  formatDecimal(value) {
    return this.shi(value);
  }

  getShiCharacter(x) {
    return this._shiChars[Math.floor(x) % this._shiChars.length];
  }

  /**
   * @param {Decimal} value
   * @return {string}
   */
  shi(value) {
    const scaled = Math.pow(value.plus(1).log10() * 1000, 0.08);
    return Array.range(0, 4).map(i => this.getShiCharacter(scaled * Math.pow(this._shiChars.length, i))).join("");
  }
}();