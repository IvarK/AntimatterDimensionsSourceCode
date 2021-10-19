"use strict";

class EffectScope extends CustomEffect{

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
    super(name, () => this.value, () => this.initialized && this.condition())
    this._initFn = initFn || (() => this);
    this._effectOrder = [];
    this._effects = {};
    this._dependency = 0;
    this._eval = [];
    this._overrides = [];
    this._base = new Decimal(1);
    this._conditional = () => true;
    EffectScopes.add(this);
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

    if (this._overrides.length > 0) {
      this._eval.push(...this._overrides);
    }
    delete this._overrides

    Object.defineProperty(this, "effects", {
        configurable: false,
        writable: false,
        value: this._effects
    });
    delete this._effects;

    Object.defineProperty(this, "effectOrder", {
      configurable: false,
      writable: false,
      value: this._effectOrder
    });

    delete this._effectOrder;

    Object.defineProperty(this, "base", {
      configurable: false,
      writable: false,
      enumerable: true,
      value: this._base,
    });
    this.cachedValue = this._base;

    delete this._base;

    Object.defineProperty(this, "eval", {
      configurable: false,
      writable: false,
      value: this._eval,
    })

    delete this._eval;

    Object.defineProperty(this, "condition", {
      configurable: false,
      writable: false,
      value: this._conditional,
    });

    delete this._conditional;

    Object.defineProperty(this, "value", {
      configurable: false,
      get: () => this.cachedValue
    })

    Object.defineProperty(this, "initialized", {
      configurable: false,
      writable: false,
      value: true
    })

    delete this._initFn;

    return this;
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

  get validEffects() {
    let override = this.effects[EFFECT_TYPE.OVERRIDES].find(effect => effect.canBeApplied)
    if (override)
      return Object.fromEntries([[EFFECT_TYPE.OVERRIDES, [override]]]);
    return Object.fromEntries(
      Object.entries(this.effects).map(([operation, effects]) =>
        [operation, effects.filter(effect =>
          effect.canBeApplied &&
          (!new Decimal(effect.effectValue).eq(1) && !new Decimal(effect.effectValue).eq(0))
        )]
      ).filter(([, effects]) => effects.length > 0)
    );
  }

  /**
   * @param {EFFECT_TYPE} type
   * @param {Effect[]} effects
   */

  _addEffects(type, effects) {
    if (this.initialized) return this;
    const ApplyFn = {
      OVERRIDES: (val, eff) => Effects.last(val, ...eff.reverse()),
      ADDENDS: (val, eff) => val.plusEffectsOf(...eff),
      SUBTRAHENDS: (val, eff) => val.minusEffectsOf(...eff),
      DIVISORS: (val, eff) => val.dividedByEffectsOf(...eff),
      MULTIPLIERS: (val, eff) => val.timesEffectsOf(...eff),
      POWERS: (val, eff) => val.powEffectsOf(...eff),
      DILATIONS: (val, eff) => val.dilateByEffectsOf(...eff)
    };
    if (type == EFFECT_TYPE.OVERRIDES)
      this._overrides.push(val => ApplyFn[type](val, effects));
    else
      this._eval.push(val => ApplyFn[type](val, effects));

    this._effectOrder.push(...effects.map((effect, idx) => {
      return {
        effect,
        type,
        id: this._effectOrder.length + idx,
      }
    }, this));

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

  update() {
    if (!this.initialized) return this;
    this.cachedValue = this.eval.reduce((val, applyFn) => applyFn(val), this.base).clampMin(this.base);
    return this;
  }

  effectInScope(effect) {
    return this.effectOrder.some(oEff => oEff === effect)
  }

  applyEffectsUntil(effect) {
    if (!this.effectInScope(effect))
      return this.base;
     const ApplyFn =  {
        OVERRIDES: (val, eff) => Effects.last(val, eff),
        ADDENDS: (val, eff) => val.plusEffectsOf(eff),
        SUBTRAHENDS: (val, eff) => val.minusEffectsOf(eff),
        DIVISORS: (val, eff) => val.dividedByEffectsOf(eff),
        MULTIPLIERS: (val, eff) => val.timesEffectsOf(eff),
        POWERS: (val, eff) => val.powEffectsOf(eff),
        DILATIONS: (val, eff) => val.dilateByEffectsOf(eff)
     }
    let lastId = effect.id;
    return this.effectOrder.reduce((val, effect) =>
      effect.id <= lastId ? ApplyFn[effect.type](val, effect.effect) : val, this.base
    );
  }
}

const EffectScopes = (function() {
  const scopeList = [];
  let compiled = [];
  let init = false;
  const _init = () => {
    scopeList.forEach(scope => scope._init());
    compiled = scopeList.sort((a, b) => a._dependency - b._dependency);
    scopeList.forEach(scope => delete scope._dependency)
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
