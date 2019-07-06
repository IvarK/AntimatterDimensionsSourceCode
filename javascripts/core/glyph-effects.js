"use strict";

// There is a little too much stuff about glyph effects to put in constants.

// The last glyph type you can only get if you got effarig reality
const GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "power", "effarig"]
const GLYPH_SYMBOLS = { time: "Δ", dilation: "Ψ", replication: "Ξ", infinity: "∞", power: "Ω", effarig: "Ϙ" }
const CANCER_GLYPH_SYMBOLS = { time: "🕟", dilation: "☎", replication: "⚤", infinity: "8", power: "⚡", effarig: "🦒" }

const GlyphCombiner = Object.freeze({
  add: x => x.reduce(Number.sumReducer, 0),
  multiply: x => x.reduce(Number.prodReducer, 1),
  // For exponents, the base value is 1, so when we add two exponents a and b we want to get a + b - 1,
  // so that if a and b are both close to 1 so is their sum. In general, when we add a list x of exponents,
  // we have to add 1 - x.length to the actual sum, so that if all the exponents are close to 1 the result
  // is also close to 1 rather than close to x.length.
  addExponents: x => x.reduce(Number.sumReducer, 1 - x.length),
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
  *  to toFixed(3)
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
    this.formatEffect = setup.formatEffect || (x => x.toFixed(3));
    /**
    *  @member {function(number[]): GlyphEffectConfig__combine_result} combine Function that combines
    * multiple glyph effects into one value (adds up, applies softcaps, etc)
    */
    this.combine = GlyphEffectConfig.setupCombine(setup);
    /** @member {string[]} Split up single effect description (prefix and suffix to formatted value)*/
    this.singleDescSplit = GlyphEffectConfig.splitOnFormat(this.singleDesc);
    /** @member {string[]} Split up total effect description (prefix and suffix to formatted value)*/
    this.totalDescSplit = GlyphEffectConfig.splitOnFormat(this.totalDesc);
  }

  /** @private */
  static checkInputs(setup) {
    const KNOWN_KEYS = ["id", "glyphTypes", "singleDesc", "totalDesc", "genericDesc",
      "effect", "formatEffect", "combine", "softcap"];
    const unknownField = Object.keys(setup).find(k => !KNOWN_KEYS.includes(k));
    if (unknownField !== undefined) {
      throw crash(`Glyph effect "${setup.id}" includes unrecognized field "${unknownField}"`);
    }

    const unknownGlyphType = setup.glyphTypes.find(e => !GLYPH_TYPES.includes(e));
    if (unknownGlyphType !== undefined) {
      throw crash(`Glyph effect "${setup.id}" references unknown glyphType "${unknownGlyphType}"`);
    }

    const emptyCombine = setup.combine([]);
    if (typeof emptyCombine !== "number") {
      if (emptyCombine.value === undefined || emptyCombine.capped === undefined) {
        throw crash(`combine function for glyph effect "${setup.id}" has invalid return type`);
      }
    }
  }

  /**
   * @param {string} str
   * @returns {string[]}
   * @private
   */
  static splitOnFormat(str) {
    if (str.indexOf("{value}") === -1) {
      // eslint-disable-next-line no-console
      console.error(`Glyph description "${str}" does not include {value}`)
      return [str, ""];
    }
    return str.split("{value}");
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
    if (softcap === undefined) return combine;
    const neqTest = emptyCombine.value instanceof Decimal ? (a, b) => a.neq(b) : (a, b) => a !== b;
    return combine = effects => {
      const rawValue = combine(effects);
      const cappedValue = softcap(rawValue.value);
      return { value: cappedValue, capped: rawValue.capped || neqTest(rawValue.value, cappedValue) };
    };
  }
}

GameDatabase.reality.glyphEffects = [
  {
    id: "timepow",
    glyphTypes: ["time"],
    singleDesc: "Time Dimension multipliers ^{value}",
    effect: (level, strength) => 1.01 + Math.pow(level, 0.32) * Math.pow(strength, 0.45) / 75,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "timespeed",
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {value}",
    totalDesc: "Game runs × {value} faster ",
    genericDesc: "Game speed multiplier",
    effect: (level, strength) => 1 + Math.pow(level, 0.3) * Math.pow(strength, 0.65) * 5 / 100,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "timefreeTickMult",
    glyphTypes: ["time"],
    singleDesc: "Free tickspeed threshold multiplier ×{value}",
    genericDesc: "Free tickspeed cost multiplier",
    effect: (level, strength) => 1 - Math.pow(level, 0.35) * Math.pow(strength, 0.7) / 200,
    // Accurately represent what the multiplier actually does in code, assuming TS171
    // The multiplier is applied only to the part of the multiplier > 1, which means it has less effect
    // than the description implies.
    /** @type{function(number): string} */
    formatEffect: x => shorten(x + (1 - x) / TS171_MULTIPLIER, 3, 3),
    combine: GlyphCombiner.multiply,
    /** @type{function(number): number} */
    // Cap it at "effectively zero", but this effect only ever reduces the threshold by 20%
    softcap: value => Math.max(1e-5, value),
  }, {
    id: "timeeternity",
    glyphTypes: ["time"],
    singleDesc: "Multiply EP gain by {value}",
    totalDesc: "EP gain ×{value}",
    genericDesc: "EP gain multiplier",
    effect: (level, strength) => Math.pow(level * strength, 3) * 100,
    formatEffect: x => shorten(x, 2, 0),
    combine: GlyphCombiner.multiply,
  }, {
    id: "dilationdilationMult",
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {value}",
    totalDesc: "DT gain ×{value}",
    effect: (level, strength) => Math.pow(level * strength, 1.5) * 2,
    formatEffect: x => shorten(x, 2, 1),
    combine: GlyphCombiner.multiply,
  }, {
    id: "dilationgalaxyThreshold",
    glyphTypes: ["dilation"],
    singleDesc: "Free galaxy threshold multiplier ×{value}",
    genericDesc: "Free galaxy cost multiplier",
    effect: (level, strength) => 1 - Math.pow(level, 0.17) * Math.pow(strength, 0.35) / 100,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    // TTgen generates slowly TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    glyphTypes: ["dilation"],
    singleDesc: "Generates {value} TT per hour",
    totalDesc: "Generating {value} TT per hour",
    genericDesc: "TT generation",
    effect: (level, strength) => Math.pow(level * strength, 0.5) / 10000,
    /** @type {function(number): string} */
    formatEffect: x => shorten(3600 * x, 2, 2),
    combine: GlyphCombiner.add,
  }, {
    id: "dilationpow",
    glyphTypes: ["dilation"],
    // FIXME, <br> is a little weird to have here
    singleDesc: "Normal Dimension multipliers <br>^{value} while dilated",
    totalDesc: "Normal Dimension multipliers ^{value} while dilated",
    genericDesc: "Normal Dimensions ^x while dilated",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.7) * Math.pow(strength, 0.7) / 25,
    formatEffect: x => shorten(x, 2, 1),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "replicationspeed",
    glyphTypes: ["replication"],
    singleDesc: "Multiply replication speed by {value}",
    totalDesc: "Replication speed ×{value}",
    genericDesc: "Replication speed multiplier",
    effect: (level, strength) => level * strength * 3,
    formatEffect: x => shorten(x, 2, 1),
    combine: GlyphCombiner.multiply,
  }, {
    id: "replicationpow",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier ^{value}",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.5) * strength / 25,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "replicationdtgain",
    glyphTypes: ["replication"],
    singleDesc: "Multiply DT gain by \nlog₁₀(replicanti)×{value}",
    totalDesc: "DT gain from log₁₀(replicanti)×{value}",
    genericDesc: "DT gain multiplier (log₁₀(replicanti))",
    effect: (level, strength) => 0.0003 * Math.pow(level, 0.3) * Math.pow(strength, 0.65),
    formatEffect: x => shorten(x, 5, 5),
    combine: GlyphCombiner.add,
  }, {
    id: "replicationglyphlevel",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti scaling for next glyph level: \n^0.4 ➜ ^(0.4 + {value})",
    totalDesc: "Replicanti scaling for next glyph level: ^0.4 ➜ ^(0.4 + {value})",
    genericDesc: "Replicanti scaling for glyph level",
    effect: (level, strength) => Math.pow(Math.pow(level, 0.25) * Math.pow(strength, 0.4), 0.5) / 50,
    formatEffect: x => shorten(x, 3, 3),
    combine: effects => {
      let sum = effects.reduce(Number.sumReducer, 0);
      if (effects.length > 2) sum *= 6 / (effects.length + 4);
      return sum > 0.1
        ? { value: 0.1 + 0.2 * (sum - 0.1), capped: true }
        : { value: sum, capped: effects.length > 2 };
    }
  }, {
    id: "infinitypow",
    glyphTypes: ["infinity"],
    singleDesc: "Infinity Dimension multipliers ^{value}",
    effect: (level, strength) => 1.007 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "infinityrate",
    glyphTypes: ["infinity"],
    singleDesc: "Infinity power conversion rate: \n^7 ➜ ^(7 + {value})",
    totalDesc: "Infinity power conversion rate: ^7 ➜ ^(7 + {value})",
    genericDesc: "Infinity power conversion rate",
    effect: (level, strength) => Math.pow(level, 0.2) * Math.pow(strength, 0.4) * 0.1,
    formatEffect: x => shorten(x, 2, 2),
    combine: GlyphCombiner.add,
    /** @type {function(number):number} */
    softcap: value => (value > 0.7 ? 0.7 + 0.2 * (value - 0.7) : value),
  }, {
    id: "infinityipgain",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply IP gain by {value}",
    totalDesc: "IP gain ×{value}",
    genericDesc: "IP gain multiplier",
    effect: (level, strength) => Math.pow(level * strength, 5) * 100,
    formatEffect: x => shorten(x, 2, 0),
    combine: GlyphCombiner.multiply,
    // eslint-disable-next-line no-negated-condition
    softcap: value => ((Effarig.eternityCap !== undefined) ? Math.min(value, Effarig.eternityCap.toNumber()) : value)
  }, {
    id: "infinityinfmult",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply infinitied stat gain by {value}",
    totalDesc: "Infinitied stat gain ×{value}",
    genericDesc: "Infinitied stat gain multiplier",
    effect: (level, strength) => Math.pow(level * strength, 1.5) * 2,
    formatEffect: x => shorten(x, 2, 1),
    combine: GlyphCombiner.multiply,
  }, {
    id: "powerpow",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ^{value}",
    effect: (level, strength) => 1.015 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "powermult",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ×{value}",
    effect: (level, strength) => Decimal.pow(level * strength * 10, level * strength * 9.5),
    formatEffect: x => shorten(x, 2, 0),
    combine: effects => ({ value: effects.reduce(Decimal.prodReducer, new Decimal(1)), capped: false }),
  }, {
    id: "powerdimboost",
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{value}",
    genericDesc: "Dimension Boost multiplier",
    effect: (level, strength) => Math.pow(level * strength, 0.5),
    formatEffect: x => shorten(x, 2, 2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "powerbuy10",
    glyphTypes: ["power"],
    singleDesc: "Increase the bonus from buying 10 dimensions by ×{value}",
    totalDesc: "Multiplier from \"Buy 10\" ×{value}",
    genericDesc: "\"Buy 10\" bonus increase",
    effect: (level, strength) => 1 + level * strength / 12,
    formatEffect: x => shorten(x, 2, 2),
    combine: GlyphCombiner.addExponents,
  }, {
    id: "effarigblackhole",
    glyphTypes: ["effarig"],
    singleDesc: "Game speed ^{value}",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 75,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigrm",
    glyphTypes: ["effarig"],
    singleDesc: "Reality Machine multiplier x{value}",
    effect: (level, strength) => Math.pow(level, 0.6) * strength,
    formatEffect: x => shorten(x, 2, 2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigglyph",
    glyphTypes: ["effarig"],
    singleDesc: "Instability starting glyph level +{value}",
    effect: (level, strength) => Math.floor(10 * Math.pow(level * strength, 0.5)),
    formatEffect: x => shortenSmallInteger(x),
    combine: GlyphCombiner.add,
  }, {
    id: "effarigachievement",
    glyphTypes: ["effarig"],
    singleDesc: "All achievement related effects ^{value}",
    genericDesc: "Achievement effects power",
    effect: (level, strength) => 1 + Math.pow(level, 0.4) * Math.pow(strength, 0.6) / 50,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigforgotten",
    glyphTypes: ["effarig"],
    singleDesc: "Raise the bonus gained from buying 10 Dimensions to a power of ^{value}",
    totalDesc: "Multiplier from \"Buy 10\" ^{value}",
    genericDesc: "\"Buy 10\" bonus multiplier ^x",
    effect: (level, strength) => 1 + 2 * Math.pow(level, 0.25) * Math.pow(strength, 0.4),
    formatEffect: x => shorten(x, 2, 2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigdimensions",
    glyphTypes: ["effarig"],
    singleDesc: "All dimension multipliers ^{value}",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 500,
    formatEffect: x => shorten(x, 3, 3),
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigantimatter",
    glyphTypes: ["effarig"],
    singleDesc: "Antimatter production: 10^x -> 10^(x^{value})",
    genericDesc: "Antimatter production exponent",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 5000,
    formatEffect: x => shorten(x, 4, 4),
    combine: GlyphCombiner.multiply,
  }
].mapToObject(effect => effect.id, effect => new GlyphEffectConfig(effect));

function findGlyphTypeEffects(glyphType) {
  return Object.values(GameDatabase.reality.glyphEffects).filter(e => e.glyphTypes.includes(glyphType));
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
      crash(`Id ${this.id} not found in GLYPH_TYPES`)
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
      .filter(id => !blacklist.includes(id) && this.isEffectUnlocked(id))
    if (available.length === 0) return null;
    return available[Math.floor(rng() * available.length)];
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
    // Effarig glyphs have no primary effect; all are equially likely
  }),
  /**
    * @param {function(): number} rng Random number source (0..1)
    * @param {string[]} [blacklist] Do not return the specified types
    * @returns {string | null}
    */
  random(rng, blacklist = []) {
    const available = GLYPH_TYPES.filter(id => !blacklist.includes(id) && GlyphTypes[id].isUnlocked);
    if (available.length === 0) return null;
    return available[Math.floor(rng() * available.length)];
  },
  get list() {
    return GLYPH_TYPES.map(e => GlyphTypes[e]);
  },
  get locked() {
    return this.list.filter(e => !e.isUnlocked);
  }
};
