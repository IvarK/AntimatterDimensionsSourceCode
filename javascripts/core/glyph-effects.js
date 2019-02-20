
// There is a little too much stuff about glyph effects to put in constants.

// The last glyph type you can only get if you got effarig reality
const GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "power", "effarig"]
const GLYPH_SYMBOLS = { time: "Δ", dilation: "Ψ", replication: "Ξ", infinity: "∞", power: "Ω", effarig: "Ϙ" }

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
    /** @member {NumericToString<number | Decimal>} formatEffect formatting function for the effect
    *  (just the number conversion). Combined with the description strings to make descriptions */
    this.formatEffect = setup.formatEffect || (x => x.toFixed(3));
    /** @member {function(number[]): GlyphEffectConfig__combine_result} combine Function that combines
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
    const KNOWN_KEYS = ["id", "glyphTypes", "singleDesc", "totalDesc", "genericDesc", "formatEffect", "combine", "softcap"]
    const unknownField = Object.keys(setup).find(k => !KNOWN_KEYS.includes(k));
    if (unknownField !== undefined) {
      throw crash(`Glyph effect "${setup.id}" includes unrecognized field "${unknownField}"`);
    }

    const unknownGlyphType = setup.glyphTypes.find(e => !GLYPH_TYPES.includes(e));
    if (unknownGlyphType !== undefined) {
      throw crash(`Glyph effect "${setup.id}" references unknown glyphType "${unknownGlyphType}"`);
    }

    let emptyCombine = setup.combine([]);
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
    if (str.indexOf("{value}") == -1) {
      console.error(`Glyph description "${str}" does not include {value}`)
      return [str, ""];
    } else {
      return str.split("{value}");
    }
  }

  /**
   * @private
   */
  static setupCombine(setup) {
    let combine = setup.combine;
    let softcap = setup.softcap;
    let emptyCombine = combine([]);
    if (typeof (emptyCombine) === "number") {   // no supplied capped indicator
      if (softcap === undefined) {
        return effects => ({ value: combine(effects), capped: false });
      } else {
        return effects => {
          let rawValue = combine(effects);
          let cappedValue = softcap(rawValue);
          return { value: cappedValue, capped: rawValue !== cappedValue };
        }
      }
    } else {
      if (softcap !== undefined) {
        let neqTest = emptyCombine.value instanceof Decimal ? (a, b) => a.neq(b) : (a, b) => a !== b;
        return combine = effects => {
          let rawValue = combine(effects);
          let cappedValue = softcap(rawValue.value);
          return { value: cappedValue, capped: rawValue.capped || neqTest(rawValue.value, cappedValue) };
        }
      } else {
        return combine;
      }
    }
  }
}

GameDatabase.reality.glyphEffects = [
  {
    id: "timepow",
    glyphTypes: ["time"],
    singleDesc: "Time Dimension multipliers ^{value}",
    combine: GlyphCombiner.multiply,
  }, {
    id: "timespeed",
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {value}",
    totalDesc: "Game runs × {value} faster ",
    genericDesc: "Game speed multiplier",
    combine: GlyphCombiner.multiply,
  }, {
    id: "timefreeTickMult",
    glyphTypes: ["time"],
    singleDesc: "Free tickspeed threshold multiplier ×{value}",
    genericDesc: "Free tickspeed cost multiplier",
    // Accurately represent what the multiplier actually does in code, assuming TS171
    // The multiplier is applied only to the part of the multiplier > 1, which means it has less effect
    // than the description implies.
    /** @type{function(number): string} */
    formatEffect: x => (x + (1 - x) / TS171_MULTIPLIER).toFixed(3),
    combine: GlyphCombiner.multiply,
    /** @type{function(number): number} */
    softcap: value => Math.max(1e-5, value), // Cap it at "effectively zero", but this effect only ever reduces the threshold by 20%
  }, {
    id: "timeeternity",
    glyphTypes: ["time"],
    singleDesc: "Multiply EP gain by {value}",
    totalDesc: "EP gain ×{value}",
    genericDesc: "EP gain multiplier",
    formatEffect: x => shorten(x, 2, 0),
    combine: GlyphCombiner.multiply,
  }, {
    id: "dilationdilationMult",
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {value}",
    totalDesc: "DT gain ×{value}",
    formatEffect: x => shorten(x, 2, 0),
    combine: GlyphCombiner.multiply,
  }, {
    id: "dilationgalaxyThreshold",
    glyphTypes: ["dilation"],
    singleDesc: "Free galaxy threshold multiplier ×{value}",
    genericDesc: "Free galaxy cost multiplier",
    combine: GlyphCombiner.multiply,
  }, {  // TTgen generates slowly TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    glyphTypes: ["dilation"],
    singleDesc: "Generates {value} TT per hour",
    totalDesc: "Generating {value} TT per hour",
    genericDesc: "TT generation",
    /** @type {function(number): string} */
    formatEffect: x => (3600 * x).toFixed(2),
    combine: GlyphCombiner.add,
  }, {
    id: "dilationpow",
    glyphTypes: ["dilation"],
    // FIXME, <br> is a little weird to have here
    singleDesc: "Normal Dimension multipliers <br>^{value} while dilated",
    totalDesc: "Normal Dimension multipliers ^{value} while dilated",
    genericDesc: "Normal Dimensions ^x while dilated",
    combine: GlyphCombiner.addExponents,
  }, {
    id: "replicationspeed",
    glyphTypes: ["replication"],
    singleDesc: "Multiply replication speed by {value}",
    totalDesc: "Replication speed ×{value}",
    genericDesc: "Replication speed multiplier",
    formatEffect: x => shorten(x, 2, 0),
    combine: GlyphCombiner.multiply,
  }, {
    id: "replicationpow",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier ^{value}",
    combine: GlyphCombiner.addExponents,
  }, {
    id: "replicationdtgain",
    glyphTypes: ["replication"],
    singleDesc: "Multiply DT gain by \nlog₁₀(replicanti)×{value}",
    totalDesc: "DT gain from log₁₀(replicanti)×{value}",
    genericDesc: "DT gain multiplier (log₁₀(replicanti))",
    formatEffect: x => x.toFixed(5),
    combine: GlyphCombiner.add,
  }, {
    id: "replicationglyphlevel",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti scaling for next glyph level: <br>^0.4 ➜ ^(0.4 + {value})",
    totalDesc: "Replicanti scaling for next glyph level: ^0.4 ➜ ^(0.4 + {value})",
    genericDesc: "Replicanti scaling for glyph level",
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
    combine: GlyphCombiner.multiply,
  }, {
    id: "infinityrate",
    glyphTypes: ["infinity"],

    singleDesc: "Infinity power conversion rate: <br>^7 ➜ ^(7 + {value})",
    totalDesc: "Infinity power conversion rate: ^7 ➜ ^(7 + {value})",
    genericDesc: "Infinity power conversion rate",
    formatEffect: x => x.toFixed(2),
    combine: GlyphCombiner.add,
    /** @type {function(number):number} */
    softcap: value => value > 0.7 ? 0.7 + 0.2 * (value - 0.7) : value,
  }, {
    id: "infinityipgain",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply IP gain by {value}",
    totalDesc: "IP gain ×{value}",
    genericDesc: "IP gain multiplier",
    formatEffect: x => shorten(x, 2, 0),
    combine: GlyphCombiner.multiply,
    softcap: value => (Effarig.eternityCap !== undefined && value > Effarig.eternityCap)
      ? new Decimal(Effarig.eternityCap)
      : value,
  }, {
    id: "infinityinfmult",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply infinitied stat gain by {value}",
    totalDesc: "Infinitied stat gain ×{value}",
    genericDesc: "Infinitied stat gain multiplier",
    formatEffect: x => shorten(x, 2, 0),
    combine: GlyphCombiner.multiply,
  }, {  //  * pow is for exponent on time dim multiplier (^1.02) or something like that
    id: "powerpow",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ^{value}",
    combine: GlyphCombiner.multiply,
  }, {
    id: "powermult",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ×{value}",
    formatEffect: x => shorten(x, 2, 0),
    combine: effects => ({ value: effects.reduce(Decimal.prodReducer, new Decimal(1)), capped: false }),
  }, {
    id: "powerdimboost",
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{value}",
    genericDesc: "Dimension Boost multiplier",
    formatEffect: x => x.toFixed(2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "powerbuy10",
    glyphTypes: ["power"],
    singleDesc: "Multiplies the bonus gained from buying 10 Dimensions by {value}",
    totalDesc: "Multiplier from \"Buy 10\" ×{value}",
    genericDesc: "\"Buy 10\" bonus multiplier",
    formatEffect: x => x.toFixed(2),
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigblackhole",
    glyphTypes: ["effarig"],
    singleDesc: "Time modifier raised to the power of ^{value}",
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigrm",
    glyphTypes: ["effarig"],
    singleDesc: "Reality Machine multiplier x{value}",
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigglyph",
    glyphTypes: ["effarig"],
    singleDesc: "Instability starting glyph level +{value}",
    combine: GlyphCombiner.add,
  }, {
    id: "effarigachievement",
    glyphTypes: ["effarig"],
    singleDesc: "Raise all achievement related effects to a power of ^{value}",
    genericDesc: "Achievement effect increase",
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigforgotten",
    glyphTypes: ["effarig"],
    singleDesc: "Raise the bonus gained from buying 10 Dimensions to a power of ^{value}",
    totalDesc: "Multiplier from \"Buy 10\" ^{value}",
    genericDesc: "\"Buy 10\" bonus multiplier ^x",
    combine: GlyphCombiner.multiply,
  }, {
    id: "effarigdimensions",
    glyphTypes: ["effarig"],
    singleDesc: "Delay the dimension cost increase starting by 1e{value}",
    combine: GlyphCombiner.add,
  }, {
    id: "effarigantimatter",
    glyphTypes: ["effarig"],
    singleDesc: "Power to antimatter production exponent of ^{value}",
    combine: GlyphCombiner.multiply,
  }
].mapToObject(effect => effect.id, effect => new GlyphEffectConfig(effect));

function findGlyphTypeEffects(glyphType) {
  return Object.values(GameDatabase.reality.glyphEffects).filter(e => e.glyphTypes.includes(glyphType));
}

// These names are short; that's how we current store effect inside player
// The name is concatenated with the glyph type to make the full effect name
const timeEffects = ["pow", "speed", "freeTickMult", "eternity"]
const replicationEffects = ["speed", "pow", "dtgain", "glyphlevel"]
const dilationEffects = ["dilationMult", "galaxyThreshold", "TTgen", "pow"]
const infinityEffects = ["pow", "rate", "ipgain", "infmult"]
const powerEffects = ["pow", "mult", "dimboost", "buy10"]
const effarigEffects = ["blackhole", "rm", "glyph", "achievement", "forgotten", "dimensions", "antimatter"]

class GlyphType {
  /**
   * @param {Object} setup
   * @param {string} setup.id
   * @param {string} setup.symbol
   * @param {string} setup.color
   * @param {function} [setup.unlockedFn] If this glyph type is not available initially, this specifies
   * how to check to see if it is available
   * @param {function(string):boolean} [setup.effectUnlockedFn] If certain effects of this glyph are not
   * initially available, this is a function of the effect id that returns whether one is
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
    /** @private @member {function?} unlockedFn */
    this.unlockedFn = setup.unlockedFn;
    /** @private @member {function(string):boolean?} effectUnlockedFn */
    this.effectUnlockedFn = setup.effectUnlockedFn;
    if (!GLYPH_TYPES.includes(this.id)) {
      crash(`Id ${this.id} not found in GLYPH_TYPES`)
    }
  }
  /** @property {boolean} */
  get isUnlocked() {
    return this.unlockedFn !== undefined ? this.unlockedFn() : true;
  }

  /**
   * @param {string} id
   * @returns {boolean}
   */
  isEffectUnlocked(id) {
    return this.effectUnlockedFn !== undefined ? this.effectUnlockedFn(id) : true;
  }

  /**
   * @param {function(): number} rng Random number source (0..1)
   * @param {string[]} [blacklist] Do not return the specified effects
   * @returns {string | null}
   */
  randomEffect(rng, blacklist = []) {
    let available = this.effects
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
  }),
  dilation: new GlyphType({
    id: "dilation",
    symbol: GLYPH_SYMBOLS.dilation,
    effects: findGlyphTypeEffects("dilation"),
    color: "#64dd17",
  }),
  replication: new GlyphType({
    id: "replication",
    symbol: GLYPH_SYMBOLS.replication,
    effects: findGlyphTypeEffects("replication"),
    color: "#03a9f4",
  }),
  infinity: new GlyphType({
    id: "infinity",
    symbol: GLYPH_SYMBOLS.infinity,
    effects: findGlyphTypeEffects("infinity"),
    color: "#b67f33",
  }),
  power: new GlyphType({
    id: "power",
    symbol: GLYPH_SYMBOLS.power,
    effects: findGlyphTypeEffects("power"),
    color: "#22aa48",
  }),
  effarig: new GlyphType({
    id: "effarig",
    symbol: GLYPH_SYMBOLS.effarig,
    effects: findGlyphTypeEffects("effarig"),
    color: "#e21717",
    unlockedFn: () => EffarigUnlock.reality.isUnlocked,
  }),
  /**
    * @param {function(): number} rng Random number source (0..1)
    * @param {string[]} [blacklist] Do not return the specified types
    * @returns {string | null}
    */
  random(rng, blacklist = []) {
    let available = GLYPH_TYPES.filter(id => !blacklist.includes(id) && GlyphTypes[id].isUnlocked);
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
