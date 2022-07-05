<script>
export default {
  name: "AutomatorDefineSingleEntry",
  props: {
    constant: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      oldAlias: "",
      aliasString: "",
      valueString: "",
    };
  },
  created() {
    this.aliasString = this.constant;
    this.oldAlias = this.aliasString;
    this.valueString = player.reality.automator.constants[this.aliasString];
  },
  methods: {
    // We combine error checking from both input fields together and only show one of them because showing multiple
    // errors at once is unnecessary and results in some bad UI overlapping
    currentError() {
      if (!this.aliasString) return null;

      const isValidName = this.aliasString.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/u);
      const alreadyExists = Object.keys(player.reality.automator.constants).includes(this.aliasString) &&
        this.aliasString !== this.oldAlias;
      const hasCommandConflict = allowedConstantPatterns.some(p => {
        // A bit of a workaround here - the patterns need to do check global match but cannot be modified
        const matchObj = this.aliasString.match(p);
        return matchObj ? matchObj[0] === this.aliasString : false;
      });

      if (!isValidName) return "Constant name must be alphanumeric and cannot start with a number";
      if (alreadyExists) return "You have already defined a constant with this name";
      if (hasCommandConflict) return "Constant name conflicts with a command key word";

      if (!this.valueString) return "Constant value cannot be empty";

      const isNumber = this.valueString.match(/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/u);
      // Note: Does not do validation for studies existing
      const isStudyString = this.valueString.match(/^\d{2,3}(,\d{2,3})*(\|\d\d?)?$/u);

      if (!isNumber && !isStudyString) return "Constant value must either be a number or Time Study string";
      return null;
    },
    errorTooltip() {
      const error = this.currentError();
      if (!error) return undefined;
      return {
        content:
          `<div class="c-block-automator-error">
          <div>${error}</div>
        </div>`,
        html: true,
        trigger: "manual",
        show: true,
        classes: ["general-tooltip"]
      };
    },
    handleFocus(focus) {
      if (focus) return;
      if (this.oldAlias && !this.currentError()) delete player.reality.automator.constants[this.oldAlias];
      if (this.currentError()) return;
      if (this.aliasString) player.reality.automator.constants[this.aliasString] = this.valueString;
      this.oldAlias = this.aliasString;
    }
  }
};
</script>

<template>
  <div class="l-single-definition-container">
    <input
      v-model="aliasString"
      class="c-define-textbox c-alias"
      placeholder="New constant..."
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
    <span
      v-if="aliasString"
      v-tooltip="errorTooltip()"
      class="o-arrow-padding"
    >
      🠈
    </span>
    <input
      v-if="aliasString"
      v-model="valueString"
      class="c-define-textbox c-value"
      placeholder="Value for constant..."
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
  </div>
</template>

<style scoped>
.l-single-definition-container {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
}

.o-arrow-padding {
  padding: 0 1rem;
}

.c-define-textbox {
  display: inline-block;
  font-family: Typewriter, serif;
  font-size: 1.1rem;
  background: var(--color-blockmator-block-background);
  border: 0.1rem solid var(--color-blockmator-block-border);
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 0.5rem;
  color: #00ac00;
}

.l-error-textbox {
  background: var(--color-automator-error-background);
}

.c-alias {
  width: 12rem;
}

.c-value {
  width: 30rem;
}
</style>
