// @ts-check

"use strict";
// There is a little too much stuff about glyph effects to put in constants.

const GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "power"]
const GLYPH_SYMBOLS = {time:"Δ", dilation:"Ψ", replication:"Ξ", infinity:"∞", power:"Ω"}

/**
 * Multiple glyph effects are combined into a summary object of this type.
 * @typedef {Object} GlyphEffectInfo__combine_result
 * @property {number | Decimal} value The final effect value (boost to whatever)
 * @property {boolean} capped whether or not a cap or limit was applied (softcaps, etc)
 *
 * @typedef {Object} GlyphEffectInfo
 * @property {function(number[]): GlyphEffectInfo__combine_result} combine
 * @property {string} name unique key for the effect -- powerpow, etc
 * @property {string[]} glyphTypes the types of glyphs this effect can occur on
 * @property {NumericToString<number | Decimal>} format formatting function for the effect (just the number
 *  conversion). Combined with the below to make descriptions
 * @property {string[]} singleDescSplit two element array, prefix and suffix for formatted description of a
 *  single glyph's effect (the value goes in between)
 * @property {string[]} totalDescSplit like singleDescSplit, but for description of the total effect across
 *  multiple glyphs
 * @property {string} genericDesc description of the effect without a specific value
 *
 * @class
 * @name GlyphEffectInfo
 * @constructor
 * @param {Object} setup The fields here mostly match the properties of GlyphEffectInfo
 * @param {string} setup.name powerpow, etc
 * @param {string[]} setup.glyphTypes
 * @param {string} setup.singleDesc Specify how to show a single glyph's effect. Use a string with {format}
 *  somewhere in it; that will be replaced with a number.
 * @param {string} [setup.totalDesc] (Defaults to singleDesc) specify how to show the combined effect of many
 *  glyphs.
 * @param {string} [setup.genericDesc] (Defaults to singleDesc with {format} replaced with "x") Generic
 *  description of the glyph's effect
 * @param {NumericToString<number | Decimal>} [setup.format] Format the effect's value into a string. Defaults
 *  to toFixed(3)
 * @param {NumericFunction<number | Decimal>} [setup.softcap] An optional softcap to be applied after glyph
 *  effects are combined.
 * @param {((function(number[]): GlyphEffectInfo__combine_result) | string)} setup.combine Specification of how
 *  multiple glyphs combine. Can be "add" or "multiply" for most glyphs. Otherwise, should be a function that
 *  takes a potentially empty array of numbers (each glyph's effect value) and returns an object with the combined
 *  effect amd a capped indicator.
 *
 */
function GlyphEffectInfo(setup) {
  const KNOWN_KEYS = ["name", "glyphTypes", "singleDesc", "totalDesc", "genericDesc", "format", "combine", "softcap"]
  const KNOWN_COMBINERS = {
    add: x => x.reduce(Number.sumReducer, 0),
    multiply: x => x.reduce(Number.prodReducer, 1),
  };
  Object.keys(setup).forEach(k => {
    if (!KNOWN_KEYS.includes(k)) {
      console.error("Glyph effect " + setup.name + " includes unrecognized field '" + k + "'");
    }
  });
  setup.glyphTypes.forEach(e => {
    if (!GLYPH_TYPES.includes(e)) {
      console.error("Glyph effect " + setup.name + " references unknown glyphType '" + e + "'");
    }
  });
  /** @param {string} str
   * @returns {string[]} */
  var splitOnFormat = str => {
    if (str.indexOf("{format}") == -1) {
      console.error("Glyph description '" + str + "' does not include {format}")
      return [str, ""];
    } else {
      return str.split("{format}");
    }
  }
  this.name = setup.name;
  this.glyphTypes = setup.glyphTypes;
  this.singleDesc = setup.singleDesc;
  this.totalDesc = setup.totalDesc || setup.singleDesc;
  this.genericDesc = setup.genericDesc || setup.singleDesc.replace("{format}", "x");
  this.format = setup.format || (x => x.toFixed(3));
  if (typeof(setup.combine) === "string") {
    let combiner = KNOWN_COMBINERS[setup.combine];
    if (combiner === undefined) {
      console.error("Unrecognized combine value '" + setup.combine + "'");
    } else if (setup.softcap === undefined) {
      this.combine = effects => ({value: combiner(effects), capped: false});
    } else {
      let softcap = setup.softcap;
      delete setup.softcap;
      this.combine = effects => {
        let rawValue = combiner(effects);
        let cappedValue = softcap(rawValue);
        return {value: cappedValue, capped: rawValue !== cappedValue};
      }
    }
  } else {
    let nullValue = setup.combine([]);
    if (nullValue.value === undefined || nullValue.capped === undefined) {
      console.error("combine function for glyph effect '" + setup.name + "' has invalid return type")
    }
    if (setup.softcap !== undefined) {
      let neqTest = nullValue.value instanceof Decimal ? (a,b) => a.neq(b) : (a,b) => a !== b;
      let combiner = setup.combine;
      let softcap = setup.softcap;
      this.combine = effects => {
        let rawValue = combiner(effects);
        let cappedValue = softcap(rawValue.value);
        return {value: cappedValue, capped: rawValue.capped || neqTest(rawValue.value !== cappedValue)};
      }
    } else {
      this.combine = setup.combine;
    }
  }
  this.singleDescSplit = splitOnFormat(this.singleDesc);
  this.totalDescSplit = splitOnFormat(this.totalDesc);
}

/**
 * See GlyphEffectInfo documentation above
  @constant
  @type {GlyphEffectInfo[]}
 */
const GlyphEffectList = [
  new GlyphEffectInfo({
    name: "timepow",
    glyphTypes: ["time"],
    singleDesc: "Time Dimension multipliers ^{format}",
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "timespeed",
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {format}",
    totalDesc: "Game runs × {format} faster ",
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "timefreeTickMult",
    glyphTypes: ["time"],
    singleDesc: "Free tickspeed threshold multiplier ×{format}",
    // accurately represent what the multiplier actually does in code, assuming TS171
    /** @type{function(number): string} */
    format: x => (x + (1-x)/TS171_MULTIPLIER).toFixed(3),
    combine: "multiply",
    /** @type{function(number): number} */
    softcap: value => Math.max(1e-5, value), // Cap it at "effectively zero", but this effect only ever reduces the threshold by 20%
  }), new GlyphEffectInfo({
    name: "timeeternity",
    glyphTypes: ["time"],
    singleDesc: "Multiply EP gain by {format}",
    totalDesc: "EP gain ×{format}",
    format: shortenDimensions,
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "dilationdilationMult",
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {format}",
    totalDesc: "DT gain ×{format}",
    format: shortenDimensions,
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "dilationgalaxyThreshold",
    glyphTypes: ["dilation"],
    singleDesc: "Free galaxy threshold multiplier ×{format}",
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "dilationTTgen",
    glyphTypes: ["dilation"],
    singleDesc: "Generates {format} TT per hour",
    totalDesc: "Generating {format} TT per hour",
    /** @type {function(number): string} */
    format: x => (3600 * x).toFixed(2),
    combine: "add",
  }), new GlyphEffectInfo({
    name: "dilationpow",
    glyphTypes: ["dilation"],
    // FIXME, <br> is a little weird to have here
    singleDesc: "Normal Dimension multipliers <br>^{format} while dilated",
    totalDesc:  "Normal Dimension multipliers ^{format} while dilated",
    combine: "multiply",
    /** @type {function(number): number} */
    softcap: value => value > 10 ? 10 + Math.pow(value - 10, 0.5) : value,
  }), new GlyphEffectInfo({
    name: "replicationspeed",
    glyphTypes: ["replication"],
    singleDesc: "Multiply replication speed by {format}",
    totalDesc: "Replication speed ×{format}",
    format: shortenDimensions,
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "replicationpow",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier ^{format}",
    combine: effects => {
      // Combines things additively, while keeping a null value of 1.
      return {value: effects.reduce(Number.sumReducer, 1 - effects.length), capped: false};
    }
  }), new GlyphEffectInfo({
    name: "replicationdtgain",
    glyphTypes: ["replication"],
    singleDesc: "Multiply DT gain by <br>log₁₀(replicanti)×{format}",
    totalDesc: "DT gain from log₁₀(replicanti)×{format}",
    format: x => x.toFixed(5),
    combine: "add",
  }), new GlyphEffectInfo({
    name: "replicationglyphlevel",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti scaling for next glyph level: <br>^0.4 ➜ ^(0.4 + {format})",
    totalDesc: "Replicanti scaling for next glyph level: ^0.4 ➜ ^(0.4 + {format})",
    combine: effects => {
      let sum = effects.reduce(Number.sumReducer, 0);
      if (effects.length > 2) sum *= 6 / (effects.length + 4);
      return sum > 0.1 ? {value: 0.1 + 0.2*(sum - 0.1), capped: true} : {value: sum, capped: effects.length > 2};
    }
  }), new GlyphEffectInfo({
    name: "infinitypow",
    glyphTypes: ["infinity"],
    singleDesc: "Infinity Dimension multipliers ^{format}",
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "infinityrate",
    glyphTypes: ["infinity"],
    singleDesc: "Infinity power conversion rate: <br>^7 -> ^(7 + {format})",
    totalDesc: "Infinity power conversion rate: ^7 -> ^(7 + {format})",
    format: x => x.toFixed(2),
    combine: "add",
    /** @type {function(number):number} */
    softcap: value => value > 0.7 ? 0.7 + 0.2*(value - 0.7) : value,
  }), new GlyphEffectInfo({
    name: "infinityipgain",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply IP gain by {format}",
    totalDesc: "IP gain ×{format}",
    genericDesc: "Multiply IP gain",
    format: shortenDimensions,
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "infinityinfmult",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply infinitied stat gain by {format}",
    totalDesc: "Infinitied stat gain ×{format}",
    genericDesc: "Multiply infinitied stat gain",
    format: shortenDimensions,
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "powerpow",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ^{format}",
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "powermult",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ×{format}",
    format: shortenDimensions,
    combine: effects => ({value: effects.reduce(Decimal.prodReducer, new Decimal(1)), capped: false}),
  }), new GlyphEffectInfo({
    name: "powerdimboost",
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{format}",
    genericDesc: "Dimension Boost multiplier",
    format: x => x.toFixed(2),
    combine: "multiply",
  }), new GlyphEffectInfo({
    name: "powerbuy10",
    glyphTypes: ["power"],
    singleDesc: "Multiplies the bonus gained from buying 10 Dimensions by {format}",
    totalDesc: "Multiplier from \"Buy 10\" ×{format}",
    genericDesc: "Multiply the bonus gained from buying 10 Dimensions",
    format: x => x.toFixed(2),
    combine: "multiply",
  })
];

/**
 * @type {Object.<string, GlyphEffectInfo>}
 */
const GlyphEffects = Object.freeze(GlyphEffectList.reduce((out, eff) => {
  out[eff.name] = eff;
  return out;
}, {}))

function findGlyphTypeEffects(glyphType) {
  return GlyphEffectList.filter(e => e.glyphTypes.includes(glyphType)).map(e => e.name);
}

const timeEffects = ["pow", "speed", "freeTickMult", "eternity"]
const replicationEffects = ["speed", "pow", "dtgain", "glyphlevel"]
const dilationEffects = ["dilationMult", "galaxyThreshold", "TTgen", "pow"]
const infinityEffects = ["pow", "rate", "ipgain", "infmult"]
const powerEffects= ["pow", "mult", "dimboost", "buy10"]