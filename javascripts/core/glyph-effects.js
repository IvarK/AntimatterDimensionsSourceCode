"use strict";

// There is a little too much stuff about glyph effects to put in constants.

// The last glyph type you can only get if you got effarig reality
const GLYPH_TYPES = ["power", "infinity", "replication", "time", "dilation", "effarig",
  "reality", "cursed", "companion"];
const BASIC_GLYPH_TYPES = ["power", "infinity", "replication", "time", "dilation"];
const ALCHEMY_BASIC_GLYPH_TYPES = ["power", "infinity", "replication", "time", "dilation", "effarig"];
const GLYPH_SYMBOLS = { power: "Ω", infinity: "∞", replication: "Ξ", time: "Δ", dilation: "Ψ",
  effarig: "Ϙ", reality: "Ϟ", cursed: "⸸", companion: "♥" };
const CANCER_GLYPH_SYMBOLS = { power: "⚡", infinity: "8", replication: "⚤", time: "🕟", dilation: "☎",
  effarig: "🦒", reality: "⛧", cursed: "☠", companion: "³" };

const GlyphCombiner = Object.freeze({
  add: x => x.reduce(Number.sumReducer, 0),
  multiply: x => x.reduce(Number.prodReducer, 1),
  // For exponents, the base value is 1, so when we add two exponents a and b we want to get a + b - 1,
  // so that if a and b are both close to 1 so is their sum. In general, when we add a list x of exponents,
  // we have to add 1 - x.length to the actual sum, so that if all the exponents are close to 1 the result
  // is also close to 1 rather than close to x.length.
  addExponents: x => x.reduce(Number.sumReducer, 1 - x.length),
  multiplyDecimal: x => x.reduce(Decimal.prodReducer, new Decimal(1))
});

/**
 * Multiple glyph effects are combined into a summary object of this type.
 * @typedef {Object} GlyphEffectConfig__combine_result
 * @property {number | Decimal} value The final effect value (boost to whatever)
 * @property {boolean} capped whether or not a cap or limit was applied (softcaps, etc)
*/
class GlyphEffectConfig {
  /**
  * @param {Object} setup The fields here mostly match the properties of GlyphEffectConfig
  * @param {string} setup.id powerpow, etc
  * @param {string[]} setup.glyphTypes
  * @param {string} setup.singleDesc Specify how to show a single glyph's effect. Use a string with {value}
  *  somewhere in it; that will be replaced with a number.
  * @param {string} [setup.totalDesc] (Defaults to singleDesc) specify how to show the combined effect of many
  *  glyphs.
  * @param {string} [setup.genericDesc] (Defaults to singleDesc with {value} replaced with "x") Generic
  *  description of the glyph's effect
  * @param {(function(number, number): number) | function(number, number): Decimal} [setup.effect] Calculate effect
  *  value from level and strength
  * @param {NumericToString<number | Decimal>} [setup.formatEffect] Format the effect's value into a string. Defaults
  *  to format(x, 3, 3)
  * @param {NumericToString<number | Decimal>} [setup.formatSingleEffect] Format the effect's value into a string, used
  *  for effects which need to display different values in single values versus combined values (eg. power effects)
  * @param {NumericFunction<number | Decimal>} [setup.softcap] An optional softcap to be applied after glyph
  *  effects are combined.
  * @param {((function(number[]): GlyphEffectConfig__combine_result) | function(number[]): number)} setup.combine
  *  Specification of how multiple glyphs combine. Can be GlyphCombiner.add or GlyphCombiner.multiply for most glyphs.
  *  Otherwise, should be a function that takes a potentially empty array of numbers (each glyph's effect value)
  *  and returns a combined effect or an object with the combined effect amd a capped indicator.
  *
  */
  constructor(setup) {
    GlyphEffectConfig.checkInputs(setup);
    /** @member{string}   unique key for the effect -- powerpow, etc */
    this.id = setup.id;
    /** @member{number}   bit position for the effect in the effect bitmask */
    this.bitmaskIndex = setup.bitmaskIndex;
    /** @member{boolean}  flag to separate "basic"/effarig glyphs from cursed/reality glyphs */
    this.isGenerated = setup.isGenerated;
    /** @member{string[]} the types of glyphs this effect can occur on */
    this.glyphTypes = setup.glyphTypes;
    /** @member{string} See info about setup, above*/
    this.singleDesc = setup.singleDesc;
    /** @member{string} See info about setup, above*/
    this.totalDesc = setup.totalDesc || setup.singleDesc;
    /** @member {string} genericDesc description of the effect without a specific value  */
    this.genericDesc = setup.genericDesc || setup.singleDesc.replace("{value}", "x");
    /**
    * @member {(function(number, number): number) | function(number, number): Decimal} effect Calculate effect
    *  value from level and strength
    */
    this.effect = setup.effect;
    /**
    * @member {NumericToString<number | Decimal>} formatEffect formatting function for the effect
    * (just the number conversion). Combined with the description strings to make descriptions
    */
    this.formatEffect = setup.formatEffect || (x => format(x, 3, 3));
    /** @member{NumericToString<number | Decimal>} See info about setup, above*/
    this.formatSingleEffect = setup.formatSingleEffect || this.formatEffect;
    /**
    *  @member {function(number[]): GlyphEffectConfig__combine_result} combine Function that combines
    * multiple glyph effects into one value (adds up, applies softcaps, etc)
    */
    this.combine = GlyphEffectConfig.setupCombine(setup);
    /** @member{function(number)} conversion function to produce altered glyph effect */
    this.conversion = setup.conversion;
    /**
    * @member {NumericToString<number | Decimal>} formatSecondaryEffect formatting function for
    * the secondary effect (if there is one)
    */
    this.formatSecondaryEffect = setup.formatSecondaryEffect || (x => format(x, 3, 3));
    /** @member{NumericToString<number | Decimal>} See info about setup, above*/
    this.formatSingleSecondaryEffect = setup.formatSingleSecondaryEffect || this.formatSecondaryEffect;
    /** @member{string} color to show numbers in glyph tooltips if boosted */
    this.alteredColor = setup.alteredColor;
    /** @member{number} string passed along to tooltip code to ensure proper formatting */
    this.alterationType = setup.alterationType;
    /** @member{Boolean} Indicates whether the effect grows with level or shrinks */
    this._biggerIsBetter = undefined;
  }

  /**
   * @returns{Boolean}
   */
  get biggerIsBetter() {
    if (this._biggerIsBetter === undefined) this._biggerIsBetter = this.checkBiggerIsBetter();
    return this._biggerIsBetter;
  }

  /**
   * @returns{Number}
   */
  compareValues(effectValueA, effectValueB) {
    const result = Decimal.compare(effectValueA, effectValueB);
    return this.biggerIsBetter ? result : -result;
  }

  /** @private */
  checkBiggerIsBetter() {
    const baseEffect = new Decimal(this.effect(1, 1.01));
    const biggerEffect = new Decimal(this.effect(100, 2));
    return biggerEffect.gt(baseEffect);
  }

  /** @private */
  static checkInputs(setup) {
    const KNOWN_KEYS = ["id", "bitmaskIndex", "glyphTypes", "singleDesc", "totalDesc", "genericDesc", "effect",
      "formatEffect", "formatSingleEffect", "combine", "softcap", "conversion", "formatSecondaryEffect",
      "formatSingleSecondaryEffect", "alteredColor", "alterationType", "isGenerated"];
    const unknownField = Object.keys(setup).find(k => !KNOWN_KEYS.includes(k));
    if (unknownField !== undefined) {
      throw new Error(`Glyph effect "${setup.id}" includes unrecognized field "${unknownField}"`);
    }

    const unknownGlyphType = setup.glyphTypes.find(e => !GLYPH_TYPES.includes(e));
    if (unknownGlyphType !== undefined) {
      throw new Error(`Glyph effect "${setup.id}" references unknown glyphType "${unknownGlyphType}"`);
    }

    const emptyCombine = setup.combine([]);
    if (typeof emptyCombine !== "number" && !(emptyCombine instanceof Decimal)) {
      if (emptyCombine.value === undefined || emptyCombine.capped === undefined) {
        throw new Error(`The combine function for Glyph effect "${setup.id}" has invalid return type`);
      }
      if (setup.softcap) {
        throw new Error(`The combine function for Glyph effect "${setup.id}" gives capped information, ` +
          `but there's also a softcap method`);
      }
    }
  }

  /**
   * @private
   */
  static setupCombine(setup) {
    let combine = setup.combine;
    const softcap = setup.softcap;
    const emptyCombine = combine([]);
    // No supplied capped indicator
    if (typeof (emptyCombine) === "number") {
      if (softcap === undefined) return effects => ({ value: combine(effects), capped: false });
      return effects => {
        const rawValue = combine(effects);
        const cappedValue = softcap(rawValue);
        return { value: cappedValue, capped: rawValue !== cappedValue };
      };
    }
    if (emptyCombine instanceof Decimal) {
      if (softcap === undefined) return effects => ({ value: combine(effects), capped: false });
      const neqTest = emptyCombine.value instanceof Decimal ? (a, b) => a.neq(b) : (a, b) => a !== b;
      return combine = effects => {
        const rawValue = combine(effects);
        const cappedValue = softcap(rawValue.value);
        return { value: cappedValue, capped: rawValue.capped || neqTest(rawValue.value, cappedValue) };
      };
    }
    // The result's an object, so it already has a capped propery, so we don't need to do anything.
    return combine;
  }
}

const ALTERATION_TYPE = {
  ADDITION: 1,
  EMPOWER: 2,
  BOOST: 3
};

const realityGlyphEffectLevelThresholds = [0, 9000, 15000, 25000];

GameDatabase.reality.glyphEffects = [
  {
    id: "timepow",
    bitmaskIndex: 0,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Time Dimension power +{value}",
    totalDesc: "Time Dimension multipliers ^{value}",
    effect: (level, strength) => 1.01 + Math.pow(level, 0.32) * Math.pow(strength, 0.45) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "timespeed",
    bitmaskIndex: 1,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {value}",
    totalDesc: "Game runs ×{value} faster",
    genericDesc: "Game speed multiplier",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("time")
      ? 1 + Math.pow(level, 0.55)
      : 1 + Math.pow(level, 0.3) * Math.pow(strength, 0.65) / 20),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("time"),
    alterationType: ALTERATION_TYPE.EMPOWER
  }, {
    id: "timeetermult",
    bitmaskIndex: 2,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Multiply Eternity gain by {value}",
    totalDesc: "Eternity gain ×{value}",
    genericDesc: "Eternity gain multiplier",
    effect: (level, strength) => Math.pow((strength + 3) * level, 0.9) *
     Math.pow(3, GlyphAlteration.sacrificeBoost("time")),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("time"),
    alterationType: ALTERATION_TYPE.BOOST
  }, {
    id: "timeEP",
    bitmaskIndex: 3,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain ×{value} [and ^]{value2}"
      : "Multiply Eternity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain ×{value} and ^{value2}"
      : "Eterinty Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain multiplier and power"
      : "Eternity Point gain multiplier"),
    effect: (level, strength) => Math.pow(level * strength, 3) * 100,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    conversion: x => 1 + Math.log10(x) / 1000,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("time"),
    alterationType: ALTERATION_TYPE.ADDITION
  }, {
    id: "dilationDT",
    bitmaskIndex: 4,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {value}",
    totalDesc: "Dilated Time gain ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("dilation")
      ? Decimal.pow(1.005, level).times(15)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("dilation"),
    alterationType: ALTERATION_TYPE.EMPOWER
  }, {
    id: "dilationgalaxyThreshold",
    bitmaskIndex: 5,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Tachyon Galaxy threshold multiplier ×{value}",
    genericDesc: "Tachyon Galaxy cost multiplier",
    effect: (level, strength) => 1 - Math.pow(level, 0.17) * Math.pow(strength, 0.35) / 100 -
      GlyphAlteration.sacrificeBoost("dilation") / 50,
    formatEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getBoostColor("dilation"),
    alterationType: ALTERATION_TYPE.BOOST,
    combine: effects => {
      const prod = effects.reduce(Number.prodReducer, 1);
      return prod < 0.4
        ? { value: 0.4 - Math.pow(0.4 - prod, 1.7), capped: true }
        : { value: prod, capped: false };
    },
  }, {
    // TTgen slowly generates TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    bitmaskIndex: 6,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generates {value} Time Theorems/hour [and\nmultiplies Time Theorem generation by] {value2}"
      : "Generates {value} Time Theorems per hour"),
    totalDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generating {value} Time Theorems/hour and Time Theorem generation x{value2}"
      : "Generating {value} Time Theorems per hour"),
    genericDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Time Theorem generation and multiplier"
      : "Time Theorem generation"),
    effect: (level, strength) => Math.pow(level * strength, 0.5) / 10000,
    /** @type {function(number): string} */
    formatEffect: x => format(3600 * x, 2, 2),
    combine: GlyphCombiner.add,
    conversion: x => Math.clampMin(Math.pow(10000 * x, 1.6), 1),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("dilation"),
    alterationType: ALTERATION_TYPE.ADDITION
  }, {
    id: "dilationpow",
    bitmaskIndex: 7,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Antimatter Dimension power +{value} while Dilated",
    totalDesc: "Antimatter Dimension multipliers ^{value} while Dilated",
    genericDesc: "Antimatter Dimensions ^x while Dilated",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.7) * Math.pow(strength, 0.7) / 25,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "replicationspeed",
    bitmaskIndex: 8,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Multiply Replication speed by {value}",
    totalDesc: "Replication speed ×{value}",
    genericDesc: "Replication speed multiplier",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("replication")
      ? Decimal.pow(1.007, level).times(10)
      : Decimal.times(level, strength).times(3)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("replication"),
    alterationType: ALTERATION_TYPE.EMPOWER
  }, {
    id: "replicationpow",
    bitmaskIndex: 9,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier power +{value}",
    totalDesc: "Replicanti multiplier ^{value}",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.5) * strength / 25 +
      GlyphAlteration.sacrificeBoost("replication") * 3,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("replication"),
    alterationType: ALTERATION_TYPE.BOOST
  }, {
    id: "replicationdtgain",
    bitmaskIndex: 10,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => (GlyphAlteration.isAdded("replication")
      ? "Multiply Dilated Time [and Replicanti speed] by \nlog₁₀(replicanti)×{value}"
      : "Multiply Dilated Time gain by \nlog₁₀(replicanti)×{value}"),
    totalDesc: () => (GlyphAlteration.isAdded("replication")
      ? "Dilated Time gain and Replication speed ×(log₁₀(replicanti)×{value})"
      : "Dilated Time gain ×(log₁₀(replicanti)×{value})"),
    genericDesc: () => (GlyphAlteration.isAdded("replication")
      ? "Dilated Time+Replicanti mult (log₁₀(replicanti))"
      : "Dilated Time gain multiplier (log₁₀(replicanti))"),
    effect: (level, strength) => 0.0003 * Math.pow(level, 0.3) * Math.pow(strength, 0.65),
    formatEffect: x => format(x, 5, 5),
    formatSingleEffect: x => format(x, 5, 5),
    // It's bad to stack this one additively (N glyphs acts as a DT mult of N) or multiplicatively (the raw number is
    // less than 1), so instead we do a multiplicative stacking relative to the "base" effect of a level 1, 0% glyph.
    // We also introduce a 3x mult per glyph after the first, so that stacking level 1, 0% glyphs still has an effect.
    // This is still just a flat DT mult when stacking multiple glyphs, but at least it's bigger than 2 or 3.
    combine: effects => ({
      value: effects.length === 0 ? 0 : effects.reduce(Number.prodReducer, Math.pow(0.0001, 1 - effects.length)),
      capped: false
    }),
    conversion: x => x,
    formatSecondaryEffect: x => format(x, 2, 3),
    formatSingleSecondaryEffect: x => format(x, 5, 5),
    alteredColor: () => GlyphAlteration.getAdditionColor("replication"),
    alterationType: ALTERATION_TYPE.ADDITION
  }, {
    id: "replicationglyphlevel",
    bitmaskIndex: 11,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => `Replicanti scaling for next Glyph level: \n^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    totalDesc: () => `Replicanti scaling for next Glyph level: ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    genericDesc: "Replicanti scaling for Glyph level",
    effect: (level, strength) => Math.pow(Math.pow(level, 0.25) * Math.pow(strength, 0.4), 0.5) / 50,
    formatEffect: x => format(x, 3, 3),
    combine: effects => {
      let sum = effects.reduce(Number.sumReducer, 0);
      if (effects.length > 2) sum *= 6 / (effects.length + 4);
      return sum > 0.1
        ? { value: 0.1 + 0.2 * (sum - 0.1), capped: true }
        : { value: sum, capped: effects.length > 2 };
    }
  }, {
    id: "infinitypow",
    bitmaskIndex: 12,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Infinity Dimension power +{value}",
    totalDesc: "Infinity Dimension multipliers ^{value}",
    effect: (level, strength) => 1.007 + Math.pow(level, 0.21) * Math.pow(strength, 0.4) / 75 +
      GlyphAlteration.sacrificeBoost("infinity") / 50,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("infinity"),
    alterationType: ALTERATION_TYPE.BOOST
  }, {
    id: "infinityrate",
    bitmaskIndex: 13,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => `Infinity Power conversion rate: \n^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    totalDesc: () => `Infinity Power conversion rate: ^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    genericDesc: "Infinity Power conversion rate",
    effect: (level, strength) => Math.pow(level, 0.2) * Math.pow(strength, 0.4) * 0.04,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
  }, {
    id: "infinityIP",
    bitmaskIndex: 14,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain ×{value} [and ^]{value2}"
      : "Multiply Infinity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain ×{value} and ^{value2}"
      : "Infinity Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain multiplier and power"
      : "Infinity Point gain multiplier"),
    effect: (level, strength) => Math.pow(level * (strength + 1), 6) * 10000,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    // eslint-disable-next-line no-negated-condition
    softcap: value => ((Effarig.eternityCap !== undefined) ? Math.min(value, Effarig.eternityCap.toNumber()) : value),
    conversion: x => 1 + Math.log10(x) / 1800,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("infinity"),
    alterationType: ALTERATION_TYPE.ADDITION
  }, {
    id: "infinityinfmult",
    bitmaskIndex: 15,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Multiply Infinity gain by {value}",
    totalDesc: "Infinity gain ×{value}",
    genericDesc: "Infinity gain multiplier",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("infinity")
      ? Decimal.pow(1.02, level)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("infinity"),
    alterationType: ALTERATION_TYPE.EMPOWER
  }, {
    id: "powerpow",
    bitmaskIndex: 16,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimension power +{value}\n[and Antimatter Galaxy cost ×]{value2}"
      : "Antimatter Dimension power +{value}"),
    totalDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimension multipliers ^{value} and Antimatter Galaxy cost x{value2}"
      : "Antimatter Dimension multipliers ^{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimensions multipliers ^x and Antimatter Galaxy cost multiplier"
      : "Antimatter Dimension multipliers ^x"),
    effect: (level, strength) => 1.015 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    conversion: x => 2 / (x + 1),
    formatSecondaryEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getAdditionColor("power"),
    alterationType: ALTERATION_TYPE.ADDITION
  }, {
    id: "powermult",
    bitmaskIndex: 17,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Antimatter Dimension multipliers ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("power")
      ? Decimal.pow(11111, level * 220)
      : Decimal.pow(level * strength * 10, level * strength * 10)),
    formatEffect: x => formatPostBreak(x, 2, 0),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("power"),
    alterationType: ALTERATION_TYPE.EMPOWER
  }, {
    id: "powerdimboost",
    bitmaskIndex: 18,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{value}",
    genericDesc: "Dimension Boost multiplier",
    effect: (level, strength) => Math.pow(level * strength, 0.5) *
      Math.pow(1 + GlyphAlteration.sacrificeBoost("power"), 3),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("power"),
    alterationType: ALTERATION_TYPE.BOOST
  }, {
    id: "powerbuy10",
    bitmaskIndex: 19,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => `Increase the bonus from buying ${formatInt(10)} Antimatter Dimensions by {value}`,
    totalDesc: () => `Multiplier from "Buy ${formatInt(10)}" ×{value}`,
    genericDesc: () => `"Buy ${formatInt(10)}" bonus increase`,
    effect: (level, strength) => 1 + level * strength / 12,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "effarigblackhole",
    bitmaskIndex: 20,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Game speed power +{value}",
    totalDesc: "Game speed ^{value}",
    genericDesc: "Game speed ^x",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "effarigrm",
    bitmaskIndex: 21,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Reality Machine multiplier ×{value}",
    genericDesc: "Reality Machine multiplier",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("effarig")
      ? Math.pow(level, 1.5)
      : Math.pow(level, 0.6) * strength),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("effarig"),
    alterationType: ALTERATION_TYPE.EMPOWER
  }, {
    id: "effarigglyph",
    bitmaskIndex: 22,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Glyph Instability starting level +{value}",
    genericDesc: "Glyph Instability delay",
    effect: (level, strength) => Math.floor(10 * Math.pow(level * strength, 0.5)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  }, {
    id: "effarigachievement",
    bitmaskIndex: 23,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Achievement multiplier power +{value}",
    totalDesc: "Achievement multiplier ^{value}",
    genericDesc: "Achievement multiplier ^x",
    effect: (level, strength) => 1 + Math.pow(level, 0.4) * Math.pow(strength, 0.6) / 60 +
      GlyphAlteration.sacrificeBoost("effarig") / 10,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("effarig"),
    alterationType: ALTERATION_TYPE.BOOST
  }, {
    id: "effarigforgotten",
    bitmaskIndex: 24,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Buy ${formatInt(10)} multiplier ^{value} [and\nDimension Boost multiplier ^]{value2}`
      : `Bonus from buying ${formatInt(10)} Dimensions ^{value}`),
    totalDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Multiplier from "Buy ${formatInt(10)}" ^{value} and Dimension Boost multiplier ^{value2}`
      : `Multiplier from "Buy ${formatInt(10)}" ^{value}`),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" and Dimension Boost multipliers ^x`
      : `"Buy ${formatInt(10)}" multiplier ^x`),
    effect: (level, strength) => 1 + 2 * Math.pow(level, 0.25) * Math.pow(strength, 0.4),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    conversion: x => Math.pow(x, 0.4),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("effarig"),
    alterationType: ALTERATION_TYPE.ADDITION
  }, {
    id: "effarigdimensions",
    bitmaskIndex: 25,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "All dimension power +{value}",
    totalDesc: "All dimension multipliers ^{value}",
    genericDesc: "All dimension multipliers ^x",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 500,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "effarigantimatter",
    bitmaskIndex: 26,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => `Antimatter production: ${formatInt(10)}^x ➜ ${formatInt(10)}^(x^{value})`,
    genericDesc: "Antimatter production exponent",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 5000,
    formatEffect: x => format(x, 4, 4),
    combine: GlyphCombiner.multiply,
  }, {
    id: "timeshardpow",
    bitmaskIndex: 27,
    isGenerated: true,
    // This gets explicitly added to time glyphs elsewhere (once unlocked)
    glyphTypes: [],
    singleDesc: () => `Time Shard power +{value}`,
    totalDesc: "Time Shard gain ^{value}",
    genericDesc: "Time Shards ^x",
    effect: (level, strength) => 1 + (strength / 3.5) * Math.pow(level, 0.35) / 400,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "cursedgalaxies",
    bitmaskIndex: 0,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: `All Galaxies are {value} weaker`,
    totalDesc: "All Galaxy strength -{value}",
    // Multiplies by 0.768 per glyph
    effect: (level, strength) => Math.pow((strength / 3.5) * level, -0.03),
    formatEffect: x => formatPercents(1 - x, 2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "curseddimensions",
    bitmaskIndex: 1,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "All dimension multipliers ^{value}",
    // Multiplies by 0.734 per glyph
    effect: (level, strength) => Math.pow((strength / 3.5) * level, -0.035),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "cursedtickspeed",
    bitmaskIndex: 2,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is multiplied by ×{value}",
    totalDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is increased by ×{value}",
    // Additive 3.82 per glyph
    effect: (level, strength) => Math.log10(level) * (strength / 3.5),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.add,
  }, {
    id: "cursedEP",
    bitmaskIndex: 3,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Divide Eternity Point gain by {value}",
    totalDesc: "Eternity Point gain / {value}",
    // Divides e666.6 per glyph
    effect: (level, strength) => Decimal.pow10(-level / 10 * (strength / 3.5)),
    formatEffect: x => format(x.reciprocal()),
    combine: GlyphCombiner.multiplyDecimal,
  }, {
    id: "realityglyphlevel",
    bitmaskIndex: 4,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Increase the effective level of equipped basic Glyphs by {value}",
    totalDesc: "Equipped basic Glyph level +{value}",
    effect: level => Math.floor(Math.sqrt(level * 90)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  }, {
    id: "realitygalaxies",
    bitmaskIndex: 5,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "All Galaxies are {value} stronger",
    totalDesc: "All Galaxy strength +{value}",
    effect: level => 1 + Math.pow(level / 100000, 0.5),
    formatEffect: x => formatPercents(x - 1, 2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "realityrow1pow",
    bitmaskIndex: 6,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Multiplier from Reality Upgrade Amplifiers ^{value}",
    totalDesc: "Reality Upgrade Amplifier multiplier ^{value}",
    effect: level => 1 + level / 125000,
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "realityDTglyph",
    bitmaskIndex: 7,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => `Dilated Time scaling for next Glyph level: \n^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    totalDesc: () => `Dilated Time scaling for next Glyph level: ^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    genericDesc: "Dilated Time scaling for Glyph level",
    // You can only get this effect on level 25000 reality glyphs anyway, might as well make it look nice
    effect: () => 0.15,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
  }, {
    id: "companiondescription",
    bitmaskIndex: 8,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "It does nothing but sit there and cutely smile at you, whisper into your dreams politely, " +
      "and plot the demise of all who stand against you. This one-of-a-kind Glyph will never leave you.",
    totalDesc: "+{value} happiness",
    effect: () => (Enslaved.isRunning ? 0 : (0.4 + 0.6 * Math.random())),
    formatEffect: x => formatPercents(x, 2, 2),
    combine: GlyphCombiner.add,
  }, {
    id: "companionEP",
    bitmaskIndex: 9,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "Thanks for your dedication for the game! You reached {value} Eternity Points on your first Reality.",
    totalDesc: () => (Enslaved.isRunning ? "Help me" : "Yay!"),
    // The EP value for this (and the next effect) are entirely encoded in rarity, but level needs to be present to
    // make sure the proper parameter is being used. The actual glyph level shouldn't do anything.
    // eslint-disable-next-line no-unused-vars
    effect: (level, strength) => Decimal.pow10(1e6 * strengthToRarity(strength)),
    formatEffect: x => formatPostBreak(x, 2),
    combine: GlyphCombiner.multiplyDecimal,
  }
].mapToObject(effect => effect.id, effect => new GlyphEffectConfig(effect));

function findGlyphTypeEffects(glyphType) {
  return Object.values(GameDatabase.reality.glyphEffects).filter(e => e.glyphTypes.includes(glyphType));
}

function makeGlyphEffectBitmask(effectList) {
  // eslint-disable-next-line no-bitwise
  return effectList.reduce((mask, eff) => mask + (1 << GameDatabase.reality.glyphEffects[eff].bitmaskIndex), 0);
}

function getGlyphEffectsFromBitmask(bitmask) {
  return orderedEffectList
    .map(effectName => GameDatabase.reality.glyphEffects[effectName])
    // eslint-disable-next-line no-bitwise
    .filter(effect => (bitmask & (1 << effect.bitmaskIndex)) !== 0);
}

class GlyphType {
  /**
   * @param {Object} setup
   * @param {string} setup.id
   * @param {string} setup.symbol
   * @param {string} setup.color
   * @param {function} [setup.primaryEffect] All glyphs generated will have this effect, if specified
   * @param {function} [setup.unlockedFn] If this glyph type is not available initially, this specifies
   * how to check to see if it is available
   * @param {function(string):boolean} [setup.effectUnlockedFn] If certain effects of this glyph are not
   * initially available, this is a function of the effect id that returns whether one is
   * @param {number} setup.alchemyResource Alchemy resource generated by sacrificing this glyph
   */
  constructor(setup) {
    /** @member {string} id identifier for this type (time, power, etc)*/
    this.id = setup.id;
    /** @member {string} symbol used to display glyphs of this type and as a UI shorthand */
    this.symbol = setup.symbol;
    /** @member {GlyphEffectConfig[]} effects list of effects that this glyph can have */
    this.effects = findGlyphTypeEffects(setup.id);
    /** @member {string} color used for glyph borders and other places where color coding is needed */
    this.color = setup.color;
    /** @member {string?} primaryEffect all glyphs generated will have at least this effect */
    this.primaryEffect = setup.primaryEffect;
    /** @private @member {function?} unlockedFn */
    this.unlockedFn = setup.unlockedFn;
    /** @private @member {function(string):boolean?} effectUnlockedFn */
    this.effectUnlockedFn = setup.effectUnlockedFn;
    this.alchemyResource = setup.alchemyResource;
    if (!GLYPH_TYPES.includes(this.id)) {
      throw new Error(`Id ${this.id} not found in GLYPH_TYPES`);
    }
  }

  /** @property {boolean} */
  get isUnlocked() {
    // eslint-disable-next-line no-negated-condition
    return this.unlockedFn !== undefined ? this.unlockedFn() : true;
  }

  /**
   * @param {string} id
   * @returns {boolean}
   */
  isEffectUnlocked(id) {
    // eslint-disable-next-line no-negated-condition
    return this.effectUnlockedFn !== undefined ? this.effectUnlockedFn(id) : true;
  }

  /**
   * @param {function(): number} rng Random number source (0..1)
   * @param {string[]} [blacklist] Do not return the specified effects
   * @returns {string | null}
   */
  randomEffect(rng, blacklist = []) {
    const available = this.effects
      .map(e => e.id)
      .filter(id => !blacklist.includes(id) && this.isEffectUnlocked(id));
    if (available.length === 0) return null;
    return available[Math.floor(rng.uniform() * available.length)];
  }
}

const GlyphTypes = {
  time: new GlyphType({
    id: "time",
    symbol: GLYPH_SYMBOLS.time,
    effects: findGlyphTypeEffects("time"),
    color: "#b241e3",
    primaryEffect: "timepow",
    alchemyResource: ALCHEMY_RESOURCE.TIME
  }),
  dilation: new GlyphType({
    id: "dilation",
    symbol: GLYPH_SYMBOLS.dilation,
    effects: findGlyphTypeEffects("dilation"),
    color: "#64dd17",
    alchemyResource: ALCHEMY_RESOURCE.DILATION
  }),
  replication: new GlyphType({
    id: "replication",
    symbol: GLYPH_SYMBOLS.replication,
    effects: findGlyphTypeEffects("replication"),
    color: "#03a9f4",
    alchemyResource: ALCHEMY_RESOURCE.REPLICATION
  }),
  infinity: new GlyphType({
    id: "infinity",
    symbol: GLYPH_SYMBOLS.infinity,
    effects: findGlyphTypeEffects("infinity"),
    color: "#b67f33",
    primaryEffect: "infinitypow",
    alchemyResource: ALCHEMY_RESOURCE.INFINITY
  }),
  power: new GlyphType({
    id: "power",
    symbol: GLYPH_SYMBOLS.power,
    effects: findGlyphTypeEffects("power"),
    color: "#22aa48",
    primaryEffect: "powerpow",
    alchemyResource: ALCHEMY_RESOURCE.POWER
  }),
  effarig: new GlyphType({
    id: "effarig",
    symbol: GLYPH_SYMBOLS.effarig,
    effects: findGlyphTypeEffects("effarig"),
    color: "#e21717",
    unlockedFn: () => EffarigUnlock.reality.isUnlocked,
    alchemyResource: ALCHEMY_RESOURCE.EFFARIG
    // Effarig glyphs have no primary effect; all are equally likely
  }),
  reality: new GlyphType({
    id: "reality",
    symbol: GLYPH_SYMBOLS.reality,
    effects: findGlyphTypeEffects("reality"),
    color: "#555555",
    unlockedFn: () => false,
    alchemyResource: ALCHEMY_RESOURCE.REALITY
    // Refining a reality glyph is pretty wasteful anyway, but might as well have this here
  }),
  cursed: new GlyphType({
    id: "cursed",
    symbol: GLYPH_SYMBOLS.cursed,
    effects: findGlyphTypeEffects("cursed"),
    color: "black",
    unlockedFn: () => false,
  }),
  companion: new GlyphType({
    id: "companion",
    symbol: GLYPH_SYMBOLS.companion,
    effects: findGlyphTypeEffects("companion"),
    color: "#feaec9",
    unlockedFn: () => false,
  }),
  /**
    * @param {function(): number} rng Random number source (0..1)
    * @param {string} [blacklisted] Do not return the specified type
    * @returns {string | null}
    */
  random(rng, blacklisted = []) {
    const types = generatedTypes.filter(
      x => (EffarigUnlock.reality.isUnlocked || x !== "effarig") && !blacklisted.includes(x));
    return types[Math.floor(rng.uniform() * types.length)];
  },
  get list() {
    return GLYPH_TYPES.map(e => GlyphTypes[e]);
  },
  get locked() {
    return this.list.filter(e => !e.isUnlocked);
  }
};
