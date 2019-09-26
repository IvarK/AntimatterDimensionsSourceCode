"use strict";

Vue.component("autobuyer-input", {
  props: {
    autobuyer: Object,
    property: String,
    type: String
  },
  data() {
    return {
      isValid: true,
      isFocused: false,
      displayValue: "0"
    };
  },
  computed: {
    inputType() {
      return this.type === "int" ? "number" : "text";
    },
    typeFunctions() {
      const functions = AutobuyerInputFunctions[this.type];
      if (functions === undefined) {
        throw new Error("Unknown autobuyer input type");
      }
      return functions;
    },
    validityClass() {
      return this.isValid ? undefined : "o-autobuyer-input--invalid";
    }
  },
  methods: {
    update() {
      if (this.isFocused) return;
      this.updateActualValue();
    },
    updateActualValue() {
      const actualValue = this.autobuyer[this.property];
      if (this.areEqual(this.actualValue, actualValue)) return;
      this.actualValue = this.typeFunctions.copyValue(actualValue);
      this.updateDisplayValue();
    },
    areEqual(value, other) {
      if (other === undefined || value === undefined) return false;
      return this.typeFunctions.areEqual(value, other);
    },
    updateDisplayValue() {
      this.displayValue = this.typeFunctions.formatValue(this.actualValue);
    },
    handleInput(event) {
      const input = event.target.value;
      this.displayValue = input;
      if (input.length === 0) {
        this.isValid = false;
        return;
      }
      const parsedValue = this.typeFunctions.tryParse(input);
      this.isValid = parsedValue !== undefined;
      this.actualValue = this.typeFunctions.copyValue(parsedValue);
    },
    handleFocus() {
      this.isFocused = true;
    },
    handleBlur() {
      if (this.displayValue === "69") {
        SecretAchievement(28).unlock();
      }
      if (this.isValid) {
        this.autobuyer[this.property] = this.typeFunctions.copyValue(this.actualValue);
      } else {
        this.updateActualValue();
      }
      this.updateDisplayValue();
      this.isValid = true;
      this.isFocused = false;
    }
  },
  template:
    `<input
      :value="displayValue"
      :class="validityClass"
      :type="inputType"
      class="o-autobuyer-input"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />`
});

const AutobuyerInputFunctions = {
  decimal: {
    areEqual: (value, other) => Decimal.eq(value, other),
    formatValue: value => Notation.scientific.format(value, 2, 2),
    copyValue: value => new Decimal(value),
    tryParse: input => {
      try {
        const decimal = Decimal.fromString(input.replace(",", ""));
        return isNaN(decimal.mantissa) || isNaN(decimal.exponent) ? undefined : decimal;
      } catch (e) {
        return undefined;
      }
    }
  },
  float: {
    areEqual: (value, other) => value === other,
    formatValue: value => value.toString(),
    copyValue: value => value,
    tryParse: input => {
      const float = parseFloat(input);
      return isNaN(float) ? undefined : float;
    }
  },
  int: {
    areEqual: (value, other) => value === other,
    formatValue: value => value.toString(),
    copyValue: value => value,
    tryParse: input => {
      const int = parseInt(input, 10);
      return isNaN(int) || !Number.isInteger(int) ? undefined : int;
    }
  }
};
