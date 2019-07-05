"use strict";

class Multiplier {
  constructor(name) {
    this.name = name;
    this.effects = {
      list: []
    };
    this.effects.find = value => this.effects.list.find(n => n.name === value);
    this.effects.add = value => this.effects.list.push(value);
  }

  /**
   * @param {String} name
   * @param {function} callback
   * @param {function} conditional
   * @param {String} type
   * @param {String} opperator
   * @return {Object}
   */

  // eslint-disable-next-line max-params
  breakdown(name, callback, conditional, type, opperator) {
    let display;
    if (type === "multiplier") display = () => formatX(callback(), 2, 2);
    if (type === "divisor") display = () => `/${shorten(callback(), 2, 2)}`;
    if (type === "power" || type === "exponent") display = () => formatPow(callback(), 2, 2);
    if (type === "percentage") {
      if (opperator === "add") display = () => `+${formatPercents(callback(), 2, 2)}`;
      else display = () => formatPercents(callback(), 2, 2);
    }
    if (type === "amount") {
      if (opperator === "add") display = () => `+${shorten(callback(), 2, 2)}`;
      else if (opperator === "subtract") display = () => `-${shorten(callback(), 2, 2)}`;
      else display = () => shorten(callback(), 2, 2);
    }

    return {
      name,
      value: callback,
      effect: display,
      show: conditional
    };
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

    this.effects.add(this.dim1());
    this.effects.add(this.dim2());
    this.effects.add(this.dim3());
    this.effects.add(this.dim4());
    this.effects.add(this.dim5());
    this.effects.add(this.dim6());
    this.effects.add(this.dim7());
    this.effects.add(this.dim8());
  }

  sharedDimBreakdown() {
    return [
      this.breakdown("Base",
        () => 1,
        () => true,
        "amount"),
      this.breakdown("Achievement Multiplier",
        () => Player.achievementPower,
        () => Player.achievementPower.gt(1),
        "multiplier"),
      this.breakdown("Kong Purchases Dimension Multiplier",
        () => kongDimMult * kongAllDimMult,
        () => kongDimMult * kongAllDimMult > 1,
        "multiplier"),
      this.breakdown("Infinity Power Multiplier",
        () => {
          let glyphConversionRate = 7 + getAdjustedGlyphEffect("infinityrate");
          if (Laitela.has(LAITELA_UNLOCKS.ID)) glyphConversionRate += Laitela.idConversionEffect;
          return player.infinityPower.pow(glyphConversionRate).max(1);
        },
        () => !EternityChallenge(9).isRunning && InfinityDimension(1).isUnlocked,
        "multiplier"),
      this.breakdown("Infinity Upgrade 11",
        () => InfinityUpgrade.totalTimeMult.effectValue,
        () => InfinityUpgrade.totalTimeMult.isBought,
        "multiplier"),
      this.breakdown("Infinity Upgrade 13",
        () => InfinityUpgrade.thisInfinityTimeMult.effectValue,
        () => InfinityUpgrade.thisInfinityTimeMult.isBought,
        "multiplier"),
      this.breakdown("Break Infinity Upgrade 11",
        () => BreakInfinityUpgrade.totalAMMult.effectValue,
        () => BreakInfinityUpgrade.totalAMMult.isBought,
        "multiplier"),
      this.breakdown("Break Infinity Upgrade 12",
        () => BreakInfinityUpgrade.currentAMMult.effectValue,
        () => BreakInfinityUpgrade.currentAMMult.isBought,
        "multiplier"),
      this.breakdown("Break Infinity Upgrade 21",
        () => new Decimal(BreakInfinityUpgrade.infinitiedMult.effectValue).pow(Effects.product(TimeStudy(31))),
        () => BreakInfinityUpgrade.infinitiedMult.isBought,
        "multiplier"),
      this.breakdown("Break Infinity Upgrade 22",
        () => BreakInfinityUpgrade.slowestChallengeMult.effectValue,
        () => BreakInfinityUpgrade.slowestChallengeMult.isBought,
        "multiplier"),
      this.breakdown("Achievement 48 — \"Antichallenged\"",
        () => Achievement(48).effectValue,
        () => Achievement(48).isEnabled && Achievement(48).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 56 — \"Many Deaths\"",
        () => Achievement(56).effectValue,
        () => Achievement(56).isEnabled && Achievement(56).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 65 — \"Not-so-challenging\"",
        () => Achievement(65).effectValue,
        () => Achievement(65).isEnabled && Achievement(65).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 72 — \"Can't hold these infinities\"",
        () => Achievement(72).effectValue,
        () => Achievement(72).isEnabled && Achievement(72).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 73 — \"This Achievement Doesn't Exist\"",
        () => Achievement(73).effectValue,
        () => Achievement(73).isEnabled && Achievement(73).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 74 — \"End me\"",
        () => Achievement(74).effectValue,
        () => Achievement(74).isEnabled && Achievement(74).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 76 — \"One for each dimension\"",
        () => Achievement(76).effectValue,
        () => Achievement(76).isEnabled && Achievement(76).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 78 — \"Blink of an eye\"",
        () => Achievement(78).effectValue,
        () => Achievement(78).isEnabled && Achievement(78).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 84 — \"I got a few spare\"",
        () => Achievement(84).effectValue,
        () => Achievement(84).isEnabled && Achievement(84).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 91 — \"Ludicrious Speed\"",
        () => Achievement(91).effectValue,
        () => Achievement(91).isEnabled && Achievement(91).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Achievement 92 — \"I brake for NOBODY!\"",
        () => Achievement(92).effectValue,
        () => Achievement(92).isEnabled && Achievement(92).isEffectConditionSatisfied,
        "multiplier"),
      this.breakdown("Time Study 91",
        () => TimeStudy(91).effectValue,
        () => TimeStudy(91).isBought,
        "multiplier"),
      this.breakdown("Time Study 101",
        () => TimeStudy(101).effectValue,
        () => TimeStudy(101).isBought,
        "multiplier"),
      this.breakdown("Time Study 161",
        () => TimeStudy(161).effectValue,
        () => TimeStudy(161).isBought,
        "multiplier"),
      this.breakdown("Time Study 193",
        () => TimeStudy(193).effectValue.clampMax(TimeStudy(193).config.cap),
        () => TimeStudy(193).isBought,
        "multiplier"),
      this.breakdown("Infinity Challenge 3 Effect",
        () => InfinityChallenge(3).effectValue,
        () => InfinityChallenge(3).isRunning,
        "multiplier"),
      this.breakdown("Infinity Challenge 3 Reward",
        () => InfinityChallenge(3).reward.effectValue,
        () => InfinityChallenge(3).isCompleted,
        "multiplier"),
      this.breakdown("Infinity Challenge 8 Effect",
        () => InfinityChallenge(8).effectValue,
        () => InfinityChallenge(8).isRunning,
        "multiplier"),
      this.breakdown("Infinity Challenge 6 Effect",
        () => InfinityChallenge(6).effectValue,
        () => InfinityChallenge(6).isRunning,
        "divisor"),
      this.breakdown("Eternity Challenge 10 Effect",
        () => InfinityChallenge(8).effectValue,
        () => InfinityChallenge(8).isRunning,
        "multiplier"),
      this.breakdown("Glyph Effect — Normal Dimension Multiplier",
        () => getAdjustedGlyphEffect("powermult"),
        () => getAdjustedGlyphEffect("powermult").gt(1),
        "multiplier"),
    ];
  }

  dim1() {
    const list = this.sharedDimBreakdown().concat([
      this.breakdown("Bought Dimension Power",
        () => dimension.power,
        () => getAdjustedGlyphEffect("powermult").gt(1),
        "multiplier"),
    ]);
    return {
      name: "First Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(1)),
      breakdown: list,
    };
  }

  dim2() {
    const list = this.sharedDimBreakdown();
    return {
      name: "Second Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(2)),
      breakdown: list,
    };
  }

  dim3() {
    const list = this.sharedDimBreakdown();
    return {
      name: "Third Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(3)),
      breakdown: list,
    };
  }

  dim4() {
    const list = this.sharedDimBreakdown();
    return {
      name: "Forth Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(4)),
      breakdown: list,
    };
  }

  dim5() {
    const list = this.sharedDimBreakdown();
    return {
      name: "Fith Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(5)),
      breakdown: list,
    };
  }

  dim6() {
    const list = this.sharedDimBreakdown();
    return {
      name: "Sixth Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(6)),
      breakdown: list,
    };
  }

  dim7() {
    const list = this.sharedDimBreakdown();
    return {
      name: "Seventh Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(7)),
      breakdown: list,
    };
  }

  dim8() {
    const list = this.sharedDimBreakdown();
    return {
      name: "Eight Dimension Multiplier",
      total: () => formatX(getDimensionFinalMultiplier(8)),
      breakdown: list,
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