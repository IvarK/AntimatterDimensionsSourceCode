import { GameDatabase } from "./secret-formula/game-database";

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
    /** @member {string} genericDesc description of the effect without a specific value  */
    /** @member {string} shortDesc shortened description for use in glyph choice info modal */
    this.totalDesc = setup.totalDesc ?? setup.singleDesc;
    this.genericDesc = setup.genericDesc ?? setup.singleDesc.replace("{value}", "x");
    this.shortDesc = setup.shortDesc;
    /**
    * @member {(function(number, number): number) | function(number, number): Decimal} effect Calculate effect
    *  value from level and strength
    */
    this.effect = setup.effect;
    /**
    * @member {NumericToString<number | Decimal>} formatEffect formatting function for the effect
    * (just the number conversion). Combined with the description strings to make descriptions
    */
    /** @member{NumericToString<number | Decimal>} See info about setup, above*/
    this.formatEffect = setup.formatEffect ?? (x => format(x, 3, 3));
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
      "formatSingleSecondaryEffect", "alteredColor", "alterationType", "isGenerated", "shortDesc"];
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

export const realityGlyphEffectLevelThresholds = [0, 9000, 15000, 25000];

export const GlyphEffects = mapGameDataToObject(
  GameDatabase.reality.glyphEffects,
  config => new GlyphEffectConfig(config)
);

export function findGlyphTypeEffects(glyphType) {
  return GlyphEffects.all.filter(e => e.glyphTypes.includes(glyphType));
}

export function makeGlyphEffectBitmask(effectList) {
  // eslint-disable-next-line no-bitwise
  return effectList.reduce((mask, eff) => mask + (1 << GlyphEffects[eff].bitmaskIndex), 0);
}

export function getGlyphEffectsFromBitmask(bitmask) {
  return orderedEffectList
    .map(effectName => GlyphEffects[effectName])
    // eslint-disable-next-line no-bitwise
    .filter(effect => (bitmask & (1 << effect.bitmaskIndex)) !== 0);
}

export function getGlyphIDsFromBitmask(bitmask) {
  return getGlyphEffectsFromBitmask(bitmask).map(x => x.id);
}

export function hasAtLeastGlyphEffects(needleBitmask, haystackBitmask) {
  const needle = getGlyphIDsFromBitmask(needleBitmask);
  const haystack = getGlyphIDsFromBitmask(haystackBitmask);
  return haystack.every(x => needle.includes(x));
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
   * @param {boolean} setup.hasRarity If the glyph can have rarity or not
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
    /** @private @member {function(string):boolean?} effectUnlockedFn */
    this._isUnlocked = setup.isUnlocked;
    this.alchemyResource = setup.alchemyResource;
    this.hasRarity = setup.hasRarity;
    if (!GLYPH_TYPES.includes(this.id)) {
      throw new Error(`Id ${this.id} not found in GLYPH_TYPES`);
    }
  }

  /** @property {boolean} */
  get isUnlocked() {
    return this._isUnlocked?.() ?? true;
  }
}

const allGlyphTypes = mapGameDataToObject(
  GameDatabase.reality.glyphTypes,
  config => new GlyphType(config)
);

export const GlyphTypes = {
  ...allGlyphTypes,
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
