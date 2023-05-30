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
  * @param {string} [setup.shortDesc] Short and condensed version of the glyph's effect for use in the Modal
  * @param {(function(number, number): number) | function(number, number): Decimal} [setup.effect] Calculate effect
  *  value from level and strength
  * @param {function(number | Decimal): string} [setup.formatEffect] Format the effect's value into a string. Defaults
  *  to format(x, 3, 3)
  * @param {function(number | Decimal): string} [setup.formatSingleEffect] Format the effect's value into a string, used
  *  for effects which need to display different values in single values versus combined values (eg. power effects)
  * @param {function(number | Decimal): number | Decimal} [setup.softcap] An optional softcap to be applied after glyph
  *  effects are combined.
  * @param {((function(number[]): GlyphEffectConfig__combine_result) | function(number[]): number)} setup.combine
  *  Specification of how multiple glyphs combine. Can be GlyphCombiner.add or GlyphCombiner.multiply for most glyphs.
  *  Otherwise, should be a function that takes a potentially empty array of numbers (each glyph's effect value)
  *  and returns a combined effect or an object with the combined effect amd a capped indicator.
  * @param {boolean} [setup.enabledInDoomed] Determines if this effect is enabled while doomed. Defaults to false
  */
  constructor(setup) {
    GlyphEffectConfig.checkInputs(setup);
    /** @type {string} unique key for the effect -- powerpow, etc */
    this.id = setup.id;
    /** @type {number} bit position for the effect in the effect bitmask */
    this.bitmaskIndex = setup.bitmaskIndex;
    /** @type {boolean} flag to separate "basic"/effarig glyphs from cursed/reality glyphs */
    this.isGenerated = setup.isGenerated;
    /** @type {string[]} the types of glyphs this effect can occur on */
    this.glyphTypes = setup.glyphTypes;
    /** @type {string} See info about setup, above */
    this._singleDesc = setup.singleDesc;
    /** @type {string} See info about setup, above */
    this._totalDesc = setup.totalDesc ?? setup.singleDesc;
    /** @type {string} description of the effect without a specific value */
    this._genericDesc = setup.genericDesc ?? setup.singleDesc.replace("{value}", "x");
    /** @type {string} shortened description for use in glyph choice info modal */
    this._shortDesc = setup.shortDesc;
    /**
    * @type {(function(number, number): number) | function(number, number): Decimal} Calculate effect
    *  value from level and strength
    */
    this.effect = setup.effect;
    /**
    * @type {function(number | Decimal): string} formatting function for the effect
    * (just the number conversion). Combined with the description strings to make descriptions
    */
    this.formatEffect = setup.formatEffect ?? (x => format(x, 3, 3));
    /** @type {function(number | Decimal): string} See info about setup, above */
    this.formatSingleEffect = setup.formatSingleEffect || this.formatEffect;
    /**
    *  @type {function(number[]): GlyphEffectConfig__combine_result} combine Function that combines
    * multiple glyph effects into one value (adds up, applies softcaps, etc)
    */
    this.combine = GlyphEffectConfig.setupCombine(setup);
    /** @type {function(number)} conversion function to produce altered glyph effect */
    this.conversion = setup.conversion;
    /**
    * @type {function(number | Decimal): string} formatSecondaryEffect formatting function for
    * the secondary effect (if there is one)
    */
    this.formatSecondaryEffect = setup.formatSecondaryEffect || (x => format(x, 3, 3));
    /** @type {function(number | Decimal): string} See info about setup, above */
    this.formatSingleSecondaryEffect = setup.formatSingleSecondaryEffect || this.formatSecondaryEffect;
    /** @type {string} color to show numbers in glyph tooltips if boosted */
    this.alteredColor = setup.alteredColor;
    /** @type {number} string passed along to tooltip code to ensure proper formatting */
    this.alterationType = setup.alterationType;
    /** @type {boolean} Indicates whether the effect grows with level or shrinks */
    this._biggerIsBetter = undefined;
    /** @type {boolean} Determines if effect is disabled while in doomed */
    this._enabledInDoomed = setup.enabledInDoomed ?? false;
  }

  /**
   * @returns {boolean}
   */
  get biggerIsBetter() {
    if (this._biggerIsBetter === undefined) this._biggerIsBetter = this.checkBiggerIsBetter();
    return this._biggerIsBetter;
  }

  get singleDesc() {
    const singleDesc = this._singleDesc;
    return typeof singleDesc === "function" ? singleDesc() : singleDesc;
  }

  get totalDesc() {
    const totalDesc = this._totalDesc;
    return typeof totalDesc === "function" ? totalDesc() : totalDesc;
  }

  get genericDesc() {
    const genericDesc = this._genericDesc;
    return typeof genericDesc === "function" ? genericDesc() : genericDesc;
  }

  get shortDesc() {
    const shortDesc = this._shortDesc;
    return typeof shortDesc === "function" ? shortDesc() : shortDesc;
  }

  get isDisabledByDoomed() {
    return Pelle.isDoomed && !this._enabledInDoomed;
  }

  /** @returns {number} */
  compareValues(effectValueA, effectValueB) {
    const result = Decimal.compare(effectValueA, effectValueB);
    return this.biggerIsBetter ? result : -result;
  }

  /**
   * @private
   * @returns {boolean}
   */
  checkBiggerIsBetter() {
    const baseEffect = new Decimal(this.effect(1, 1.01));
    const biggerEffect = new Decimal(this.effect(100, 2));
    return biggerEffect.gt(baseEffect);
  }

  /** @private */
  static checkInputs(setup) {
    const KNOWN_KEYS = ["id", "bitmaskIndex", "glyphTypes", "singleDesc", "totalDesc", "genericDesc", "effect",
      "formatEffect", "formatSingleEffect", "combine", "softcap", "conversion", "formatSecondaryEffect",
      "formatSingleSecondaryEffect", "alteredColor", "alterationType", "isGenerated", "shortDesc", "enabledInDoomed"];
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

  /** @private */
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
  return effectList.reduce((mask, eff) => mask + (1 << GlyphEffects[eff].bitmaskIndex), 0);
}

export function getGlyphEffectsFromBitmask(bitmask) {
  return orderedEffectList
    .map(effectName => GlyphEffects[effectName])
    .filter(effect => (bitmask & (1 << effect.bitmaskIndex)) !== 0);
}

export function getGlyphIDsFromBitmask(bitmask) {
  return getGlyphEffectsFromBitmask(bitmask).map(x => x.id);
}

class FunctionalGlyphType {
  /**
   * @param {Object} setup
   * @param {string} setup.id
   * @param {function(): string} [setup.primaryEffect] All glyphs generated will have this effect, if specified
   * @param {function(): boolean} [setup.isUnlocked] If this glyph type is not available initially, this specifies
   * how to check to see if it is available
   * @param {number} setup.alchemyResource Alchemy resource generated by sacrificing this glyph
   * @param {boolean} setup.hasRarity If the glyph can have rarity or not
   */
  constructor(setup) {
    /** @type {string} identifier for this type (time, power, etc)*/
    this.id = setup.id;
    /** @type {GlyphEffectConfig[]} list of effects that this glyph can have */
    this.effects = findGlyphTypeEffects(setup.id);
    /** @type {string?} all glyphs generated will have at least this effect */
    this.primaryEffect = setup.primaryEffect;
    /** @type {undefined | function(): boolean} */
    this._isUnlocked = setup.isUnlocked;
    /** @type {number} */
    this.alchemyResource = setup.alchemyResource;
    /** @type {boolean} */
    this.hasRarity = setup.hasRarity;
    if (!GLYPH_TYPES.includes(this.id)) {
      throw new Error(`Id ${this.id} not found in GLYPH_TYPES`);
    }
  }

  /** @returns {boolean} */
  get isUnlocked() {
    return this._isUnlocked?.() ?? true;
  }
}

const functionalGlyphTypes = mapGameDataToObject(
  GameDatabase.reality.glyphTypes,
  config => new FunctionalGlyphType(config)
);

export const GlyphTypes = {
  ...functionalGlyphTypes,
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
