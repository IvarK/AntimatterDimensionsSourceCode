Vue.component("autobuyer-input", {
  props: {
    setup: Object
  },
  data: function() {
    return {
      isValid: true,
      actualValue: undefined,
      isFocused: false,
      displayValue: "0"
    };
  },
  computed: {
    type: function() {
      return this.setup.type;
    },
    classObject: function() {
      return {
        "o-autobuyer-input": true,
        "o-autobuyer-input--invalid": !this.isValid,
      };
    },
    inputType: function() {
      return this.type === AutobuyerInputType.INT ? "number" : "text";
    }
  },
  methods: {
    update() {
      if (this.isFocused) return;
      this.fetchActualValue();
    },
    fetchActualValue() {
      const actualValue = this.getValue();
      if (!this.areEqual(this.actualValue, actualValue)) {
        this.actualValue = actualValue;
        this.displayValue = this.formatActualValue();
      }
    },
    areEqual(value, other) {
      if (other === undefined || value === undefined) return false;
      switch (this.type) {
        case AutobuyerInputType.DECIMAL: return Decimal.eq(value, other);
        case AutobuyerInputType.FLOAT:
        case AutobuyerInputType.INT: return value === other;
      }
      throw "Unknown input type";
    },
    getValue() {
      return this.setup.getValue();
    },
    setValue(value) {
      this.setup.setValue(value);
      this.displayValue = this.formatActualValue();
    },
    handleInput: function(event) {
      const input = event.target.value;
      this.displayValue = input;
      if (input.length === 0) {
        this.isValid = false;
        return;
      }
      this.isValid = this.validate(input);
    },
    handleFocus: function() {
      this.isFocused = true;
    },
    handleBlur: function() {
      if (this.displayValue === "69") {
        giveAchievement("Nice.");
      }
      if (this.isValid) {
        this.setValue(this.actualValue);
      }
      else {
        this.fetchActualValue();
      }
      this.isValid = true;
      this.isFocused = false;
    },
    formatActualValue() {
      return this.formatValue(this.getValue());
    },
    validate(input) {
      switch (this.type) {
        case AutobuyerInputType.DECIMAL: return this.validateDecimal(input);
        case AutobuyerInputType.FLOAT: return this.validateFloat(input);
        case AutobuyerInputType.INT: return this.validateInt(input);
      }
      throw "Unknown input type";
    },
    validateDecimal(input) {
      try {
        const decimal = Decimal.fromString(input);
        if (isNaN(decimal.mantissa) || isNaN(decimal.exponent)) return false;
        this.actualValue = decimal;
      }
      catch (e) {
        return false;
      }
      return true;
    },
    validateFloat(input) {
      const float = parseFloat(input);
      if (isNaN(float)) return false;
      this.actualValue = float;
      return true;
    },
    validateInt(input) {
      const int = parseInt(input);
      if (isNaN(int) || !Number.isInteger(int)) return false;
      this.actualValue = int;
      return true;
    },
    formatValue(value) {
      switch (this.type) {
        case AutobuyerInputType.DECIMAL: return shortenAutobuyerInput(value);
        case AutobuyerInputType.FLOAT:
        case AutobuyerInputType.INT: return value.toString();
      }
      throw "Unknown input type";
    }
  },
  template:
    `<input
      :value="displayValue"
      :class="classObject"
      :type="inputType"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />`
});

class AutobuyerInputSetup {
  /**
   * @param {AutobuyerInputType} type
   * @param {Function} getValue
   * @param {Function} setValue
   */
  constructor(type, getValue, setValue) {
    this.type = type;
    if (type === AutobuyerInputType.DECIMAL) {
      this.getValue = () => new Decimal(getValue());
      this.setValue = value => setValue(new Decimal(value));
    }
    else {
      this.getValue = getValue;
      this.setValue = setValue;
    }
  }
}

const AutobuyerInputType = {
  DECIMAL: 1,
  FLOAT: 2,
  INT: 3,
};
