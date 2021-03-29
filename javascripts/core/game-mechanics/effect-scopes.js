"use strict";

class EffectScope {

  /**
   * Intialization callback for an Effect Scope
   * @callback initializationCallback
   * @param {EffectScope} scope
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
    this._conditional = () => true;
    EffectScopes.add(this);
  }

  /**
   * Sets a base for the Effect Scope to be used in the initialization callback
   * @param {Decimal} value
   * @return {void}
   */

  set base(value) {
    this._base = new Decimal(value);
  }

  /**
   * @param {Function} callback
   * @return {void}
   */

  set condition(callback) {
    this._conditional = callback;
  }

  get base() {
    return this._base;
  }

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }

  get effects() {
    return this._effects;
  }

  get effectValue() {
    return this._value;
  }

  get canBeApplied() {
    return this._conditional();
  }


  /**
   * @param {EFFECT_TYPE} type
   * @param {Effect[]} effects
   */

  _addEffects(type, effects) {
    if (!this._initFn) return this;
    const ApplyFn = {
      overides: (val, eff) => Effects.last(val, ...eff.reverse()),
      addends: (val, eff) => val.plusEffectsOf(...eff),
      subtrahends: (val, eff) => val.minusEffectsOf(...eff),
      dividends: (val, eff) => val.dividedByEffectsOf(...eff),
      multipliers: (val, eff) => val.timesEffectsOf(...eff),
      powers: (val, eff) => val.powEffectsOf(...eff),
      dilations: (val, eff) => val.dilateByEffectsOf(...eff)
    };

    this._eval.push(val => ApplyFn[type](val, effects));

    if (this._effects[type]) {
      this._effects[type].push(...effects);
      return this;
    }

    this._effects[type] = Array.from(effects);
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

  addDilations(...effects) {
    return this._addEffects(EFFECT_TYPE.dilations, effects);
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
    if (this._initFn) return this;
    this._value = this._eval.reduce((val, applyFn) => applyFn(val), this._base).clampMin(this._base);
    return this;
  }

  applyEffect(applyFn) {
    if (!this.initFn && this._conditional())
      applyFn(this.value);
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
    get all() { return compiled; },
    find: name => compiled.find(scope => name === scope.name),
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
  dilations: "dilations"
};