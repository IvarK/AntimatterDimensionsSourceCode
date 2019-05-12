"use strict";

Notation.shi = new class ShiNotation extends Notation {
  constructor() {
    super("Shi");
    this._shiChars = "施氏食獅史石室詩士施氏嗜獅誓食十獅氏時時適市視獅十時適十獅適市是時適施氏適是市氏視是十獅恃矢勢使是十獅逝世氏拾是十獅屍適石室石室濕氏使侍拭石室石室拭氏始試食十獅屍食時始識十獅屍實十石獅屍試釋是";
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
    return this._shiChars[Math.round(x) % this._shiChars.length];
  }

  /**
   * @param {Decimal} value
   * @return {string}
   */
  shi(value) {
    const scaled = value.pLog10() * 10;
    return Array.range(0, 4).map(i => this.getShiCharacter(Math.pow(scaled, Math.pow(2, -i)))).join("");
  }
}();