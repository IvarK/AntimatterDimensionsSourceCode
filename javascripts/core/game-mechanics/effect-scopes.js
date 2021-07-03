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
    this._value = new Decimal(0);
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

  get validEffects() {
    return Object.fromEntries(
      Object.entries(this.effects).map(([operation, effects]) =>
        [operation, effects.filter(effect =>
          effect.canBeApplied &&
          (!new Decimal(effect.effectValue).eq(1) || !new Decimal(effect.effectValue).eq(0))
        )]
      ).filter(([, effects]) => effects.length > 0)
    );
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
      OVERRIDES: (val, eff) => Effects.last(val, ...eff.reverse()),
      ADDENDS: (val, eff) => val.plusEffectsOf(...eff),
      SUBTRAHENDS: (val, eff) => val.minusEffectsOf(...eff),
      DIVISORS: (val, eff) => val.dividedByEffectsOf(...eff),
      MULTIPLIERS: (val, eff) => val.timesEffectsOf(...eff),
      POWERS: (val, eff) => val.powEffectsOf(...eff),
      DILATIONS: (val, eff) => val.dilateByEffectsOf(...eff)
    };

    this._eval.push(val => ApplyFn[type](val, effects));

    if (this._effects[type]) {
      this._effects[type].push(...effects);
      return this;
    }

    this._effects[type] = Array.from(effects);
    return this;
  }

  addOverrides(...effects) {
    return this._addEffects(EFFECT_TYPE.OVERRIDES, effects);
  }

  addAddends(...effects) {
    return this._addEffects(EFFECT_TYPE.ADDENDS, effects);
  }

  addSubtrahends(...effects) {
    return this._addEffects(EFFECT_TYPE.SUBTRAHENDS, effects);
  }

  addDivisors(...effects) {
    return this._addEffects(EFFECT_TYPE.DIVISORS, effects);
  }

  addMultipliers(...effects) {
    return this._addEffects(EFFECT_TYPE.MULTIPLIERS, effects);
  }

  addPowers(...effects) {
    return this._addEffects(EFFECT_TYPE.POWERS, effects);
  }

  addDilations(...effects) {
    return this._addEffects(EFFECT_TYPE.DILATIONS, effects);
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
