const Effects = {
  /**
   * @param effectSources
   * @return {Number}
   */
  sum(...effectSources) {
    let result = 0;
    applyEffectsOf(effectSources, v => result += v);
    return result;
  },
  /**
   * @param effectSources
   * @return {Number}
   */
  product(...effectSources) {
    let result = 1;
    applyEffectsOf(effectSources, v => result *= v);
    return result;
  },
  /**
   * @param {Number} defaultValue
   * @param effectSources
   * @return {Number}
   */
  last(defaultValue, ...effectSources) {
    let result = defaultValue;
    let foundLast = false;
    let reversedSources = effectSources
      .filter(s => s !== null && s !== undefined)
      .reverse();
    for (let effectSource of reversedSources) {
      effectSource.applyEffect(v => {
        result = v;
        foundLast = true;
      });
      if (foundLast) break;
    }
    return result;
  },
  /**
   * @param {Number} defaultValue
   * @param effectSources
   * @return {Number}
   */
  max(defaultValue, ...effectSources) {
    let result = defaultValue;
    applyEffectsOf(effectSources, v => result = Math.max(result, v));
    return result;
  },
  /**
   * @param {Number} defaultValue
   * @param effectSources
   * @return {Number}
   */
  min(defaultValue, ...effectSources) {
    let result = defaultValue;
    applyEffectsOf(effectSources, v => result = Math.min(result, v));
    return result;
  }
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.plusEffectOf = function(effectSource) {
  let result = this;
  effectSource.applyEffect(v => result = result.plus(v));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.plusEffectsOf = function(...effectSources) {
  let result = this;
  applyEffectsOf(effectSources, v => result = result.plus(v));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.timesEffectOf = function(effectSource) {
  let result = this;
  effectSource.applyEffect(v => result = result.times(v));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.timesEffectsOf = function(...effectSources) {
  let result = this;
  applyEffectsOf(effectSources, v => result = result.times(v));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.dividedByEffectOf = function(effectSource) {
  let result = this;
  effectSource.applyEffect(v => result = result.dividedBy(v));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.dividedByEffectsOf = function(...effectSources) {
  let result = this;
  applyEffectsOf(effectSources, v => result = result.dividedBy(v));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.powEffectOf = function(effectSource) {
  let result = this;
  effectSource.applyEffect(v => result = result.pow(v));
  return result;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.powEffectsOf = function(...effectSources) {
  let result = this;
  applyEffectsOf(effectSources, v => result = result.pow(v));
  return result;
};

function applyEffectsOf(effectSources, applyFn) {
  for (const effectSource of effectSources) {
    if (effectSource !== null && effectSource !== undefined) effectSource.applyEffect(applyFn);
  }
}
