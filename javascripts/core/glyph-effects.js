"use strict";

// There is a little too much stuff about glyph effects to put in constants.

// The last glyph type you can only get if you got effarig reality
const GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "power", "effarig", "reality", "cursed"];
const BASIC_GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "power"];
const GLYPH_SYMBOLS = { time: "Δ", dilation: "Ψ", replication: "Ξ", infinity: "∞", power: "Ω",
  effarig: "Ϙ", reality: "Ϟ", cursed: "⸸" };
const CANCER_GLYPH_SYMBOLS = { time: "🕟", dilation: "☎", replication: "⚤", infinity: "8", power: "⚡",
  effarig: "🦒", reality: "⛧", cursed: "☠" };

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
        throw new Error(`The combine function for glyph effect "${setup.id}" has invalid return type`);
      }
      if (setup.softcap) {
        throw new Error(`The combine function for glyph effect "${setup.id}" gives capped information, ` +
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

const realityGlyphEffectLevelThresholds = [0, 9000, 15000, 22000];

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
    singleDesc: "Multiply eternitied stat gain by {value}",
    totalDesc: "Eternitied stat gain ×{value}",
    genericDesc: "Eternitied stat gain multiplier",
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
      ? "EP gain ×{value} [and ^]{value2}"
      : "Multiply EP gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("time")
      ? "EP gain ×{value} and ^{value2}"
      : "EP gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("time")
      ? "EP gain multiplier and power"
      : "EP gain multiplier"),
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
    totalDesc: "DT gain ×{value}",
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
    singleDesc: "Free galaxy threshold multiplier ×{value}",
    genericDesc: "Free galaxy cost multiplier",
    effect: (level, strength) => 1 - Math.pow(level, 0.17) * Math.pow(strength, 0.35) / 100 -
      GlyphAlteration.sacrificeBoost("dilation") / 50,
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("dilation"),
    alterationType: ALTERATION_TYPE.BOOST
  }, {
    // TTgen slowly generates TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    bitmaskIndex: 6,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generates {value} TT/hour [and\nmultiplies TT generation by] {value2}"
      : "Generates {value} TT per hour"),
    totalDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generating {value} TT/hour and TT generation x{value2}"
      : "Generating {value} TT per hour"),
    genericDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "TT generation and multiplier"
      : "TT generation"),
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
    singleDesc: "Normal Dimension power +{value} while dilated",
    totalDesc: "Normal Dimension multipliers ^{value} while dilated",
    genericDesc: "Normal Dimensions ^x while dilated",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.7) * Math.pow(strength, 0.7) / 25,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "replicationspeed",
    bitmaskIndex: 8,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Multiply replication speed by {value}",
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
      ? "Multiply DT [and replicanti speed] by \nlog₁₀(replicanti)×{value}"
      : "Multiply DT gain by \nlog₁₀(replicanti)×{value}"),
    totalDesc: () => (GlyphAlteration.isAdded("replication")
      ? "DT gain and replication speed ×(log₁₀(replicanti)×{value})"
      : "DT gain ×(log₁₀(replicanti)×{value})"),
    genericDesc: () => (GlyphAlteration.isAdded("replication")
      ? "DT+replicanti mult (log₁₀(replicanti))"
      : "DT gain multiplier (log₁₀(replicanti))"),
    effect: (level, strength) => 0.0003 * Math.pow(level, 0.3) * Math.pow(strength, 0.65),
    formatEffect: x => format(x, 2, 3),
    formatSingleEffect: x => format(x, 5, 5),
    // It's bad to stack this one additively (N glyphs acts as a DT mult of N) or multiplicatively (the raw number is
    // less than 1), so instead we do a multiplicative stacking relative to the "base" effect of a level 1, 0% glyph.
    // This is still just a flat DT mult when stacking multiple glyphs, but at least it's bigger than 2 or 3.
    combine: effects => ({
      value: effects.length === 0 ? 0 : effects.reduce(Number.prodReducer, Math.pow(0.0003, 1 - effects.length)),
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
    singleDesc: () => `Replicanti scaling for next glyph level: \n^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    totalDesc: () => `Replicanti scaling for next glyph level: ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    genericDesc: "Replicanti scaling for glyph level",
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
    singleDesc: () => `Infinity power conversion rate: \n^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    totalDesc: () => `Infinity power conversion rate: ^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    genericDesc: "Infinity power conversion rate",
    effect: (level, strength) => Math.pow(level, 0.2) * Math.pow(strength, 0.4) * 0.04,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
  }, {
    id: "infinityIP",
    bitmaskIndex: 14,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "IP gain ×{value} [and ^]{value2}"
      : "Multiply IP gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "IP gain ×{value} and ^{value2}"
      : "IP gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "IP gain multiplier and power"
      : "IP gain multiplier"),
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
    singleDesc: "Multiply infinitied stat gain by {value}",
    totalDesc: "Infinitied stat gain ×{value}",
    genericDesc: "Infinitied stat gain multiplier",
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
      ? "Normal Dimension power +{value}\n[and Dark Matter dimensions x]{value2}"
      : "Normal Dimension power +{value}"),
    totalDesc: () => (GlyphAlteration.isAdded("power")
      ? "ND multipliers ^{value} and Dark Matter dimensions x{value2}"
      : "Normal Dimension multipliers ^{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("power")
      ? "ND multipliers ^x and Dark matter multiplier"
      : "Normal Dimension multipliers ^x"),
    effect: (level, strength) => 1.015 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    conversion: x => Math.pow(x, 1.2),
    formatSecondaryEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getAdditionColor("power"),
    alterationType: ALTERATION_TYPE.ADDITION
  }, {
    id: "powermult",
    bitmaskIndex: 17,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("power")
      ? Decimal.pow(11111, level * 220)
      : Decimal.pow(level * strength * 10, level * strength * 10)),
    formatEffect: x => format(x, 2, 0),
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
    singleDesc: () => `Increase the bonus from buying ${formatInt(10)} dimensions by {value}`,
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
    singleDesc: "Glyph instability starting level +{value}",
    genericDesc: "Glyph instability delay",
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
      ? `Multiplier from "Buy ${formatInt(10)}" ^{value} and dimboosts ^{value2}`
      : `Multiplier from "Buy ${formatInt(10)}" ^{value}`),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" and dimboost multipliers ^x`
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
    singleDesc: () => `Antimatter production: ${formatInt(10)}^x -> ${formatInt(10)}^(x^{value})`,
    genericDesc: "Antimatter production exponent",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 5000,
    formatEffect: x => format(x, 4, 4),
    combine: GlyphCombiner.multiply,
  }, {
    id: "cursedgalaxies",
    bitmaskIndex: 0,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: `Galaxies are {value} weaker`,
    totalDesc: "Galaxy strength -{value}",
    // Multiplies by 0.839 per glyph
    effect: (level, strength) => Math.pow((strength / 3.5) * level, -0.02),
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
    singleDesc: "Multiply free tickspeed threshold increase by ×{value}",
    totalDesc: "Free tickspeed threshold ×{value}",
    // Additive 3.82 per glyph
    effect: (level, strength) => Math.log10(level) * (strength / 3.5),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.add,
  }, {
    id: "cursedEP",
    bitmaskIndex: 3,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Divide EP gain by {value}",
    totalDesc: "EP gain / {value}",
    // Divides e666.6 per glyph
    effect: (level, strength) => Decimal.pow10(-level / 10 * (strength / 3.5)),
    formatEffect: x => format(x.reciprocal()),
    combine: GlyphCombiner.multiplyDecimal,
  }, {
    id: "realityglyphlevel",
    bitmaskIndex: 4,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Increase the effective level of equipped basic glyphs by {value}",
    totalDesc: "Equipped basic glyph level +{value}",
    effect: (level, strength) => Math.floor(Math.sqrt(25 * level * strength)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  }, {
    id: "realitygalaxies",
    bitmaskIndex: 5,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Galaxies are {value} stronger",
    totalDesc: "Galaxy strength +{value}",
    effect: (level, strength) => Math.pow(1 + level * strength / 200000, 1.6),
    formatEffect: x => formatPercents(x, 2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "realitydimboost",
    bitmaskIndex: 6,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Dimension Boost count +{value}",
    totalDesc: "{value} more Dimension Boosts",
    effect: (level, strength) => Math.pow(1 + level * strength / 150000, 1.2),
    formatEffect: x => formatPercents(x, 2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "realitycopy",
    bitmaskIndex: 7,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Copies adjacent glyphs at {value} of their original level",
    totalDesc: " ",
    effect: (level, strength) => Math.clampMax(Math.pow(level * strength / 200000, 2), 1),
    formatEffect: x => formatPercents(x, 2),
    combine: GlyphCombiner.add,
  }
].mapToObject(effect => effect.id, effect => new GlyphEffectConfig(effect));

function findGlyphTypeEffects(glyphType) {
  return Object.values(GameDatabase.reality.glyphEffects).filter(e => e.glyphTypes.includes(glyphType));
}

function makeGlyphEffectBitmask(effectList) {
  // eslint-disable-next-line no-bitwise
  return effectList.reduce((mask, eff) => mask + (1 << GameDatabase.reality.glyphEffects[eff].bitmaskIndex), 0);
}

const glyphEffectsFromBitmask = (function() {
  const table = Object.values(GameDatabase.reality.glyphEffects)
    .mapToObject(effect => effect.bitmaskIndex, effect => effect);
  return mask => Array.fromBitmask(mask).map(id => table[id]);
}());

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
    alchemyResource: ALCHEMY_RESOURCE.CURSED
  }),
  /**
    * @param {function(): number} rng Random number source (0..1)
    * @param {string} [blacklisted] Do not return the specified type
    * @returns {string | null}
    */
  random(rng, blacklisted = "") {
    const types = ["time", "dilation", "replication", "infinity", "power", "effarig"];
    if (!blacklisted) {
      const available = EffarigUnlock.reality.isUnlocked ? types.length : types.length - 1;
      return types[Math.floor(rng.uniform() * available)];
    }
    const available = EffarigUnlock.reality.isUnlocked ? types.length - 1 : types.length - 2;
    const typeIndex = Math.floor(rng.uniform() * available);
    if (typeIndex >= types.indexOf(blacklisted)) return types[typeIndex + 1];
    return types[typeIndex];
  },
  get list() {
    return GLYPH_TYPES.map(e => GlyphTypes[e]);
  },
  get locked() {
    return this.list.filter(e => !e.isUnlocked);
  }
};
