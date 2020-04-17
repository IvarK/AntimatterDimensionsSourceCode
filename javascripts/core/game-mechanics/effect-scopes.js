"use strict";

class EffectScope {

  /**
   * @param {String} name
   * @param {Number} base
   */

  constructor(name, base) {
    this._name = name;
    this._initEffects = {};
    this._effects = {
    };
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

  addEffects(type, effects) {
    if (this._initEffects[type]) {
      this._initEffects[type] = () => {
        this._initEffects[type]();
        effects();
      };
      return this;
    }

    this._initEffects[type] = effects;
    return this;
  }

  _init() {
    const ApplyFn = [
      (val, effects) => val.plusEffectsOf(...effects),
      (val, effects) => val.minusEffectsOf(...effects),
      (val, effects) => val.dividedByEffectsOf(...effects),
      (val, effects) => val.timesEffectsOf(...effects),
      (val, effects) => val.powEffectsOf(...effects),
    ];
    for (const id in this._initEffects) {
      const name = Object.keys(EFFECT_TYPE).find(key => EFFECT_TYPE[key] === parseInt(id, 10));
      this._effects[name] = this._initEffects[id]();
      this._eval.push(val => ApplyFn[id](val, this._effects[name]));
    }
    delete this._initEffects;
    return this;
  }

  update() {
    if (this._initEffects) this._init();
    this._value = this._eval.reduce((val, applyFn) => applyFn(val), this._base);
    return this;
  }

  applyEffect(applyFn) {
    if (!this._initEffects) applyFn(this.value);
  }
}

const EffectScopes = (function() {
  const ScopeList = [];
  return {
    find: name => ScopeList.find(scope => name === scope.name),
    all: ScopeList,
    add: scope => ScopeList.push(scope),
    update: () => ScopeList.forEach(scope => scope.update()),
  };
}());

const EFFECT_TYPE = {
  addends: 0,
  subtrahends: 1,
  dividends: 2,
  multipliers: 3,
  powers: 4,
};