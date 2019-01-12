// There is a little too much stuff about glyph effects to put in constants.

const GLYPH_TYPES = ["time", "dilation", "replication", "infinity", "power"]
const GLYPH_SYMBOLS = {time:"Δ", dilation:"Ψ", replication:"Ξ", infinity:"∞", power:"Ω"}

// See GlyphEffectList, below, for explanation of setup
function GlyphEffectInfo(setup) {
  setup.glyphTypes.forEach(e => {
    if (!GLYPH_TYPES.includes(e)) {
      console.error("Glyph effect " + setup.name + " references unknown glyphType '" + e + "'");
    }
  })
  var splitOnFormat = str => {
    if (str.indexOf("{format}") == -1) {
      console.error("Glyph description '" + str + "' does not include {format}")
      return [str, ""];
    } else {
      return str.split("{format}");
    }
  }
  if (setup.totalDesc === undefined) {
    setup.totalDesc = setup.singleDesc;
  }
  if (setup.genericDesc === undefined) {
    setup.genericDesc = setup.singleDesc.replace("{format}", "x");
  }
  if (setup.format === undefined) {
    setup.format = x => x.toFixed(3);
  }
  return Object.freeze(Object.assign(setup, {
    singleDescSplit: splitOnFormat(setup.singleDesc),
    totalDescSplit: splitOnFormat(setup.totalDesc),
  }));
}

/*
  name: a short, unique name for the effect, used when storing glyphs in player, indexing, etc
  glyphTypes: an array of glyph type names on which the glyph effect can occur
  singleDesc: a description of the effect as given by a single glyph (e.g. for glyph tooltip)
  genericDesc: a description of the effect without a particular strength/level
  totalDesc: a description of the cumulative effect across all glyphs (e.g. for glyph effect panel)
  You can leave genericDesc and totalDesc set to undefined, in which case, singleDesc will be
  used.  
  The single and totalDesc use a replaceable tag, {format}, which should be replaced by a calculated
  value. In order to support that, you also have to specify a format attribute.
  If you do not specify a format attribute, toFixed() will be used with a default precision
 */
const GlyphEffectList = [
  GlyphEffectInfo({
    name: "timepow",
    glyphTypes: ["time"],
    singleDesc: "Time Dimension multipliers ^{format}",
  }), GlyphEffectInfo({
    name: "timespeed",
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {format}",
    totalDesc: "Game runs × {format} faster ",
  }), GlyphEffectInfo({
    name: "timefreeTickMult",
    glyphTypes: ["time"],
    singleDesc: "Free tickspeed threshold multiplier ×{format}",
    // accurately represent what the multiplier actually does in code, assuming TS171
    format: x => (x + (1-x)/TS171_MULTIPLIER).toFixed(3),
  }), GlyphEffectInfo({
    name: "timeeternity",
    glyphTypes: ["time"],
    singleDesc: "Multiply EP gain by {format}",
    totalDesc: "EP gain ×{format}",
    format: shortenDimensions,
  }), GlyphEffectInfo({
    name: "dilationdilationMult",
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {format}",
    totalDesc: "DT gain ×{format}",
    format: shortenDimensions,
  }), GlyphEffectInfo({
    name: "dilationgalaxyThreshold",
    glyphTypes: ["dilation"],
    singleDesc: "Free galaxy threshold multiplier ×{format}",
  }), GlyphEffectInfo({
    name: "dilationTTgen",
    glyphTypes: ["dilation"],
    singleDesc: "Generates {format} TT per hour",
    totalDesc: "Generating {format} TT per hour",
    format: x => (3600 * x).toFixed(2),
  }), GlyphEffectInfo({
    name: "dilationpow",
    glyphTypes: ["dilation"],
    // FIXME, <br> is a little weird to have here
    singleDesc: "Normal Dimension multipliers <br>^{format} while dilated",
    totalDesc:  "Normal Dimension multipliers ^{format} while dilated",
  }), GlyphEffectInfo({
    name: "replicationspeed",
    glyphTypes: ["replication"],
    singleDesc: "Multiply replication speed by {format}",
    totalDesc: "Replication speed ×{format}",
    format: shortenDimensions,
  }), GlyphEffectInfo({
    name: "replicationpow",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier ^{format}",
  }), GlyphEffectInfo({
    name: "replicationdtgain",
    glyphTypes: ["replication"],
    singleDesc: "Multiply DT gain by <br>log₁₀(replicanti) ×{format}",
    totalDesc: "DT gain from log₁₀(replicanti) ×{format}",
    format: x => x.toFixed(5),
  }), GlyphEffectInfo({
    name: "replicationglyphlevel",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti scaling for next glyph level: <br>^0.4 ➜ ^(0.4 + {format})",
    totalDesc: "Replicanti scaling for next glyph level: ^0.4 ➜ ^(0.4 + {format})",
  }), GlyphEffectInfo({
    name: "infinitypow",
    glyphTypes: ["infinity"],
    singleDesc: "Infinity Dimension multipliers ^{format}",
  }), GlyphEffectInfo({
    name: "infinityrate",
    glyphTypes: ["infinity"],
    singleDesc: "Infinity power conversion rate: <br>^7 -> ^(7 + {format})",
    totalDesc: "Infinity power conversion rate: ^7 -> ^(7 + {format})",
    format: x => x.toFixed(2),
  }), GlyphEffectInfo({
    name: "infinityipgain",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply IP gain by {format}",
    totalDesc: "IP gain ×{format}",
    genericDesc: "Multiply IP gain",
    format: shortenDimensions
  }), GlyphEffectInfo({
    name: "infinityinfmult",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply infinitied stat gain by {format}",
    totalDesc: "Infinitied stat gain ×{format}",
    genericDesc: "Multiply infinitied stat gain",
    format: shortenDimensions
  }), GlyphEffectInfo({
    name: "powerpow",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ^{format}",
  }), GlyphEffectInfo({
    name: "powermult",
    glyphTypes: ["power"],
    singleDesc: "Normal Dimension multipliers ×{format}",
    format: shortenDimensions
  }), GlyphEffectInfo({
    name: "powerdimboost",
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{format}",
    genericDesc: "Dimension Boost multiplier",
    format: x => x.toFixed(2),
  }), GlyphEffectInfo({
    name: "powerbuy10",
    glyphTypes: ["power"],
    singleDesc: "Multiplies the bonus gained from buying 10 Dimensions by {format}",
    totalDesc: "Multiplier from \"Buy 10\" ×{format}",
    genericDesc: "Multiply the bonus gained from buying 10 Dimensions",
    format: x => x.toFixed(2),
  })
];

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