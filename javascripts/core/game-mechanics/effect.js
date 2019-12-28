"use strict";

class Effect {
  get effectValue() {
    throw new Error("Effect is undefined.");
  }

  get uncappedEffectValue() {
    throw new Error("Effect is undefined.");
  }

  get cap() {
    throw new Error("Cap is undefined.");
  }

  get isEffectConditionSatisfied() {
    return true;
  }

  get isEffectActive() {
    return true;
  }

  get canBeApplied() {
    return this.isEffectActive && this.isEffectConditionSatisfied;
  }

  effectOrDefault(defaultValue) {
    return this.canBeApplied ? this.effectValue : defaultValue;
  }

  applyEffect(applyFn) {
    if (this.canBeApplied) applyFn(this.effectValue);
  }

  // eslint-disable-next-line max-params
  defineEffect(value, cap, condition) {
    const isFunction = v => typeof v === "function";
    const isNumber = v => typeof v === "number";
    const isDecimal = v => v instanceof Decimal;
    const isConstant = v => isNumber(v) || isDecimal(v);
    if (!isFunction(value) && !isConstant(value)) {
      throw new Error("Unknown effect value type.");
    }
    const createProperty = () => ({
      configurable: false
    });
    const addGetter = (property, v) => {
      if (isConstant(v)) {
        property.writable = false;
        property.value = v;
      } else if (isFunction(v)) {
        property.get = v;
      } else {
        throw new Error("Unknown getter type.");
      }
    };
    if (condition !== undefined) {
      if (!isFunction(condition)) {
        throw new Error("Effect condition must be a function.");
      }
      const conditionProperty = createProperty();
      conditionProperty.get = condition;
      Object.defineProperty(this, "isEffectConditionSatisfied", conditionProperty);
    }
    const uncappedEffectValueProperty = createProperty();
    addGetter(uncappedEffectValueProperty, value);
    Object.defineProperty(this, "uncappedEffectValue", uncappedEffectValueProperty);
    if (cap !== undefined) {
      const capProperty = createProperty();
      addGetter(capProperty, cap);
      Object.defineProperty(this, "cap", capProperty);
    }
    const effectValueProperty = createProperty();
    addGetter(effectValueProperty, value);
    if (isConstant(cap)) {
      if (isNumber(value)) {
        effectValueProperty.get = () => Math.min(value, this.cap);
      } else if (isDecimal(value)) {
        effectValueProperty.get = () => Decimal.min(value, this.cap);
      } else if (isFunction(value)) {
        // Postpone effectValue specialization until the first call
        effectValueProperty.configurable = true;
        effectValueProperty.get = () => {
          const effectValue = value();
          const specializedProperty = createProperty();
          if (isNumber(effectValue)) {
            specializedProperty.get = () => Math.min(value(), this.cap);
          } else if (isDecimal(effectValue)) {
            effectValueProperty.get = () => Decimal.min(value(), this.cap);
          } else {
            throw new Error("Unknown effect value type.");
          }
          Object.defineProperty(this, "effectValue", specializedProperty);
          return specializedProperty.get();
        };
      }
    } else if (isFunction(cap)) {
      if (isNumber(value)) {
        effectValueProperty.get = () => {
          const capValue = this.cap;
          return capValue === undefined ? value : Math.min(value, capValue);
        };
      } else if (isDecimal(value)) {
        effectValueProperty.get = () => {
          const capValue = this.cap;
          return capValue === undefined ? value : Decimal.min(value, capValue);
        };
      } else if (isFunction(value)) {
        // Postpone effectValue specialization until the first call
        effectValueProperty.configurable = true;
        effectValueProperty.get = () => {
          const effectValue = value();
          const specializedProperty = createProperty();
          if (isNumber(effectValue)) {
            specializedProperty.get = () => {
              const capValue = this.cap;
              return capValue === undefined ? value() : Math.min(value(), capValue);
            };
          } else if (isDecimal(effectValue)) {
            specializedProperty.get = () => {
              const capValue = this.cap;
              return capValue === undefined ? value() : Decimal.min(value(), capValue);
            };
          } else {
            throw new Error("Unknown effect value type.");
          }
          Object.defineProperty(this, "effectValue", specializedProperty);
          return specializedProperty.get();
        };
      }
    }
    Object.defineProperty(this, "effectValue", effectValueProperty);
  }
}
