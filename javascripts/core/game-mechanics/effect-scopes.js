"use strict";

class EffectScope {

  /**
   * Intialization callback for an Effect Scope
   * @callback initializationCallback
   * @return {void}
   */
  /**
   * @param {String} name - The name of the created Effect Scope
   * @param {initializationCallback} initFn - Callback used to initialize the Effects within an Effect scope
   */

  constructor(name, initFn) {
    this._name = name;
    this._initFn = initFn || (() => this);
    this._effects = {};
    this._dependency = 0;
    this._eval = [];
    this._value = 0;
    this._base = new Decimal(1);
    EffectScopes.add(this);
  }

  set base(value) {
    this._base = value;
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }

  /**
   * @param {EFFECT_TYPE} type
   * @param {Effect[]} effects
   */

  _addEffects(type, effects) {
    if (!this._initFn) return this;
    const ApplyFn = {
      overides: (val, eff) => Effects.last(val, ...eff.reverse()),
      addends: (val, eff) => val.plusEffectOf(...eff),
      subtrahends: (val, eff) => val.minusEffectOf(...eff),
      dividends: (val, eff) => val.dividedByEffectOf(...eff),
      multipliers: (val, eff) => val.timesEffectOf(...eff),
      powers: (val, eff) => val.powEffectOf(...eff),
    };

    this._eval.push(val => ApplyFn[type](val, effects));

    if (this._effects[type]) {
      this._effects[type].push(...effects);
      return this;
    }

    this._effects[type] = effects;
    return this;
  }

  addOverides(...effects) {
    return this._addEffects(EFFECT_TYPE.overides, effects);
  }

  addAddends(...effects) {
    return this._addEffects(EFFECT_TYPE.addends, effects);
  }

  addSubtrahends(...effects) {
    return this._addEffects(EFFECT_TYPE.subtrahends, effects);
  }

  addDividends(...effects) {
    return this._addEffects(EFFECT_TYPE.dividends, effects);
  }

  addMultipliers(...effects) {
    return this._addEffects(EFFECT_TYPE.multipliers, effects);
  }

  addPowers(...effects) {
    return this._addEffects(EFFECT_TYPE.powers, effects);
  }

  _init() {
    if (!this._initFn) return this;
    this._initFn(this);
    for (const name in this._effects) {
      this._effects[name].forEach(effect => {
        if (effect instanceof EffectScope) {
          effect._init();
          this._dependency = Math.max(this._dependency, effect._dependency + 1);
        }
      });
    }
    delete this._initFn;

    return this;
  }

  update() {
    if (this._initEffects) return this;
    this._value = this._eval.reduce((val, applyFn) => applyFn(val), this._base).clampMin(this._base);
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
  overides: "overides",
  addends: "addends",
  subtrahends: "subtrahends",
  dividends: "dividends",
  multipliers: "multipliers",
  powers: "powers",
};