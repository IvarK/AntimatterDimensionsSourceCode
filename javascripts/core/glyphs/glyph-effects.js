class GlyphEffectState {
  constructor(id, props) {
    this._id = id;
    this._adjustApply = props.adjustApply;
  }

  applyEffect(applyFn) {
    let effectValue = getAdjustedGlyphEffect(this._id);
    if (this._adjustApply !== undefined) {
      effectValue = this._adjustApply(effectValue);
    }
    applyFn(effectValue);
  }
}

export const GlyphEffect = {
  dimBoostPower: new GlyphEffectState("powerdimboost", {
    adjustApply: value => Math.max(1, value)
  }),
  ipMult: new GlyphEffectState("infinityIP", {
    adjustApply: value => Decimal.max(1, value)
  }),
  epMult: new GlyphEffectState("timeEP", {
    adjustApply: value => Decimal.max(1, value)
  })
};

/**
 * This returns just the value, unlike getTotalEffect(), which outputs the softcap status as well
 * This variant is used by GameCache
 * @param {string} effectKey
 * @return {number | Decimal}
 */
export function getAdjustedGlyphEffectUncached(effectKey) {
  return getTotalEffect(effectKey).value;
}

/**
 * This returns just the value, unlike getTotalEffect(), which outputs the softcap status as well
 * @param {string} effectKey
 * @return {number | Decimal}
 */
export function getAdjustedGlyphEffect(effectKey) {
  return GameCache.glyphEffects.value[effectKey];
}

/**
 * Takes the glyph effect value and feeds it through the conversion function that gives the value of the secondary
 * effect from glyph alteration.
 * @param {string} effectKey
 * @return {number | Decimal}
 */
export function getSecondaryGlyphEffect(effectKey) {
  return GameDatabase.reality.glyphEffects[effectKey].conversion(getAdjustedGlyphEffect(effectKey));
}

/**
 * Finds all equipped glyphs with the specified effect and returns an array of effect values.
 * @param {string} effectKey
 * @returns {number[]}
 */
export function getGlyphEffectValues(effectKey) {
  if (orderedEffectList.filter(effect => effect === effectKey).length === 0) {
    throw new Error(`Unknown glyph effect requested "${effectKey}"'`);
  }
  return player.reality.glyphs.active
  // eslint-disable-next-line no-bitwise
    .filter(glyph => ((1 << GameDatabase.reality.glyphEffects[effectKey].bitmaskIndex) & glyph.effects) !== 0)
    .filter(glyph => generatedTypes.includes(glyph.type) === GameDatabase.reality.glyphEffects[effectKey].isGenerated)
    .map(glyph => getSingleGlyphEffectFromBitmask(effectKey, glyph));
}

// Combines all specified glyph effects, reduces some boilerplate
function getTotalEffect(effectKey) {
  return GameDatabase.reality.glyphEffects[effectKey].combine(getGlyphEffectValues(effectKey));
}

/**
 * Key is type+effect
 */
export function separateEffectKey(effectKey) {
  let type = "";
  let effect = "";
  for (let i = 0; i < GLYPH_TYPES.length; i++) {
    if (effectKey.substring(0, GLYPH_TYPES[i].length) === GLYPH_TYPES[i]) {
      type = GLYPH_TYPES[i];
      effect = effectKey.substring(GLYPH_TYPES[i].length);
      break;
    }
  }
  return [type, effect];
}

// Turns a glyph effect bitmask into an effect list and corresponding values. This also picks up non-generated effects,
// since there is some id overlap. Those should be filtered out as needed after calling this function.
export function getGlyphEffectValuesFromBitmask(bitmask, level, strength) {
  return getGlyphEffectsFromBitmask(bitmask)
    .map(effect => ({
      id: effect.id,
      value: effect.effect(level, strength)
    }));
}

// Pulls out a single effect value from a glyph's bitmask, returning just the value (nothing for missing effects)
export function getSingleGlyphEffectFromBitmask(effectName, glyph) {
  const glyphEffect = GameDatabase.reality.glyphEffects[effectName];
  // eslint-disable-next-line no-bitwise
  if ((glyph.effects & (1 << glyphEffect.bitmaskIndex)) === 0) {
    return undefined;
  }
  return glyphEffect.effect(getAdjustedGlyphLevel(glyph), glyph.strength);
}

// Note this function is used for glyph bitmasks, news ticker bitmasks, and offline achievements
export function countValuesFromBitmask(bitmask) {
  let numEffects = 0;
  let bits = bitmask;
  while (bits !== 0) {
    // eslint-disable-next-line no-bitwise
    numEffects += bits & 1;
    // eslint-disable-next-line no-bitwise
    bits >>= 1;
  }
  return numEffects;
}

// Returns both effect value and softcap status
export function getActiveGlyphEffects() {
  let effectValues = orderedEffectList
    .map(effect => ({ effect, values: getGlyphEffectValues(effect) }))
    .filter(ev => ev.values.length > 0)
    .map(ev => ({
      id: ev.effect,
      value: GameDatabase.reality.glyphEffects[ev.effect].combine(ev.values),
    }));
  const effectNames = effectValues.map(e => e.id);

  // Numerically combine cursed effects with other glyph effects which directly conflict with them
  const cursedEffects = ["cursedgalaxies", "curseddimensions", "cursedEP"];
  const conflictingEffects = ["realitygalaxies", "effarigdimensions", "timeEP"];
  const combineFunction = [GlyphCombiner.multiply, GlyphCombiner.multiply, GlyphCombiner.multiplyDecimal];
  for (let i = 0; i < cursedEffects.length; i++) {
    if (effectNames.includes(cursedEffects[i]) && effectNames.includes(conflictingEffects[i])) {
      const combined = combineFunction[i]([getAdjustedGlyphEffect(cursedEffects[i]),
        getAdjustedGlyphEffect(conflictingEffects[i])]);
      if (Decimal.lt(combined, 1)) {
        effectValues = effectValues.filter(e => e.id !== conflictingEffects[i]);
        effectValues.filter(e => e.id === cursedEffects[i])[0].value.value = combined;
      } else {
        effectValues = effectValues.filter(e => e.id !== cursedEffects[i]);
        effectValues.filter(e => e.id === conflictingEffects[i])[0].value.value = combined;
      }
    }
  }

  return effectValues;
}
