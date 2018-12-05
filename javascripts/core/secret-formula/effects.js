const Effects = {
  sum(...effectSources) {
    let result = 0;
    applyEffectsOf(effectSources, v => result += v);
    return result;
  },
  product(...effectSources) {
    let result = 1;
    applyEffectsOf(effectSources, v => result *= v);
    return result;
  },
  last(defaultValue, ...effectSources) {
    let result = defaultValue;
    applyEffectsOf(effectSources, v => result = v);
    return result;
  }
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.plusEffectOf = function(effectSource) {
  let result = this;
  effectSource.applyEffect(value => result = result.plus(value));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.plusEffectsOf = function(...effectSources) {
  let result = this;
  applyEffectsOf(effectSources, value => result = result.plus(value));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.timesEffectOf = function(effectSource) {
  let result = this;
  effectSource.applyEffect(value => result = result.times(value));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.timesEffectsOf = function(...effectSources) {
  let result = this;
  applyEffectsOf(effectSources, value => result = result.times(value));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.dividedByEffectOf = function(effectSource) {
  let result = this;
  effectSource.applyEffect(value => result = result.dividedBy(value));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.dividedByEffectsOf = function(...effectSources) {
  let result = this;
  applyEffectsOf(effectSources, value => result = result.dividedBy(value));
  return result;
};

function applyEffectsOf(effectSources, applyFn) {
  for (let effectSource of effectSources.filter(s => s !== null && s !== undefined)) {
    effectSource.applyEffect(applyFn);
  }
}