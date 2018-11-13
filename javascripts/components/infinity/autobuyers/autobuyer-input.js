Vue.component("autobuyer-input", {
  props: {
    setup: Object
  },
  data: function() {
    return {
      isValid: true,
      actualValue: undefined,
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
      return this.setup.setValue(value);
    },
    handleInput: function(event) {
      const input = event.target.value;
      this.displayValue = input;
      if (input.length === 0) {
        this.isValid = false;
        return;
      }
      const isValid = this.validate(input);
      this.isValid = isValid;
      if (isValid) {
        this.setValue(this.actualValue);
      }
    },
    handleBlur: function() {
      if (this.displayValue === "69") {
        giveAchievement("Nice.");
      }
      this.displayValue = this.formatActualValue();
      this.isValid = true;
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
        if (isNaN(decimal)) return false;
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