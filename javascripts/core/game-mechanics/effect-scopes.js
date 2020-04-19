"use strict";

class EffectScope {

  /**
   * @param {String} name
   * @param {Number} base
   */

  constructor(name, base) {
    this._name = name;
    this._initEffects = {};
    this._effects = {};
    this._dependency = 0;
    this._eval = [];
    this._value = 0;
    this._base = new Decimal(base || 1);
    EffectScopes.add(this);
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }

  /**
   * @param {EFFECT_TYPE} type
   * @param {Function} effects
   */

  _addEffects(type, effects) {
    if (this._initEffects[type]) {
      this._initEffects[type].push(effects);
      return this;
    }

    this._initEffects[type] = [effects];
    return this;
  }

  addAddends(effects) {
    return this._addEffects(EFFECT_TYPE.addends, effects);
  }

  addSubtrahends(effects) {
    return this._addEffects(EFFECT_TYPE.subtrahends, effects);
  }

  addDividends(effects) {
    return this._addEffects(EFFECT_TYPE.dividends, effects);
  }

  addMultipliers(effects) {
    return this._addEffects(EFFECT_TYPE.multipliers, effects);
  }

  addPowers(effects) {
    return this._addEffects(EFFECT_TYPE.powers, effects);
  }

  _init() {
    if (!this._initEffects) return this;
    const ApplyFn = [
      (val, effects) => val.plusEffectsOf(...effects),
      (val, effects) => val.minusEffectsOf(...effects),
      (val, effects) => val.dividedByEffectsOf(...effects),
      (val, effects) => val.timesEffectsOf(...effects),
      (val, effects) => val.powEffectsOf(...effects),
    ];
    for (const id in this._initEffects) {
      const name = Object.keys(EFFECT_TYPE).find(key => EFFECT_TYPE[key] === parseInt(id, 10));
      this._effects[name] = this._initEffects[id].reduce((arr, fn) => arr.concat(fn()), []);
      this._effects[name].forEach(effect => {
        if (effect instanceof EffectScope) {
          effect._init();
          this._dependency = Math.max(this._dependency, effect._dependency + 1);
        }
      });
      this._eval.push(val => ApplyFn[id](val, this._effects[name]));
    }
    delete this._initEffects;
    return this;
  }

  update() {
    if (this._initEffects) return this;
    this._value = this._eval.reduce((val, applyFn) => applyFn(val), this._base);
    return this;
  }

  applyEffect(applyFn) {
    if (!this._initEffects) applyFn(this.value);
  }
}

const EffectScopes = (function() {
  const scopeList = [];
  let compiled = [];
  let init = false;
  const _init = () => {
    scopeList.forEach(scope => scope._init());
    compiled = scopeList.sort((a, b) => a._dependency - b._dependency);
    init = true;
  };
  const _update = () => {
    if (!init) _init();
    compiled.forEach(scope => scope.update());
  };
  const _add = scope => {
    if (init) return;
    scopeList.push(scope);
  };
  return {
    find: name => compiled.find(scope => name === scope.name),
    all: () => compiled,
    add: scope => _add(scope),
    update: () => _update(),
  };
}());

const EFFECT_TYPE = {
  addends: 0,
  subtrahends: 1,
  dividends: 2,
  multipliers: 3,
  powers: 4,
};