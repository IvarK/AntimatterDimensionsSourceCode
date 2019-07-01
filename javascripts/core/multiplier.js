"use strict";

class Multiplier {
  constructor(name) {
    this.name = name;
    this.effects = {};
  }

  /**
   * @param {String} name
   * @return {Multiplier}
   */
  static find(name) {
    const multiplier = Multipliers.list.find(n => n.name === name);
    return multiplier;
  }
}

Multiplier.Dimension = new class DimensionMultipliers extends Multiplier {
  constructor() {
    super("Dimension");

    this.infoText = "Normal Dimension Multipliers";

    this.effects.Buy10 = this.buy10();
    this.effects.Base = this.base();
  }

  buy10() {
    return {
      name: "Buy10 Multiplier",
      total: () => formatX(getBuyTenMultiplier()),
    };
  }

  base() {
    return {
      name: "Base Multiplier",
      total: () => "I don't Understand what Base means!",
    };
  }
}();

Multiplier.Infinity = new class InfinityMultipliers extends Multiplier {
  constructor() {
    super("Infinity");

    this.infoText = "Infinity Stuffz";

    this.effects.IPgain = this.ipGain();
    this.effects.InifnityDim = this.infinityDim();
  }

  ipGain() {
    return {
      name: "Infinity Point Gain",
      total: () => shorten(gainedInfinityPoints()),
    };
  }

  infinityDim() {
    return {
      name: "Infinity Dimension Multiplier",
      total: () => formatX(infinityDimensionCommonMultiplier()),
    };
  }
}();

const Multipliers = {
  list: [
    Multiplier.Dimension,
    Multiplier.Infinity,

  ]
};