<script>
export default {
  name: "AutomatorBlockSingleInput",
  props: {
    block: {
      type: Object,
      required: true
    },
    updateFunction: {
      type: Function,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    blockTarget: {
      type: String,
      required: true
    },
    isBoolTarget: {
      type: Boolean,
      required: true
    },
    initialSelection: {
      type: String,
      required: false,
      default: ""
    },
  },
  data() {
    return {
      b: {},
      currentBlockId: -1,
      validatorErrors: {
        errors: [],
        line: ""
      },
      // For errors
      idxOffset: 0,
      suppressTooltip: false,

      isTextInput: false,
      dropdownSelection: "",
      textContents: "",
    };
  },
  computed: {
    hasError() {
      return this.validatorErrors.errors.length > 0;
    },
    errorTooltip() {
      if (!this.hasError || this.suppressTooltip) return undefined;
      const span = "<span class='o-automator-error-underline'>";
      const content = this.validatorErrors.line
        .splice(this.validatorErrors.errors[0].startOffset - this.idxOffset, 0, span)
        .splice(this.validatorErrors.errors[0].endOffset + span.length + 1 - this.idxOffset, 0, "</span>");
      return {
        content:
          `<div class="c-block-automator-error">
          <div>${content}</div>
          <div>${this.validatorErrors.errors[0].info}</div>
        </div>`,
        html: true,
        trigger: "manual",
        show: true,
        classes: ["c-block-automator-error-container", "general-tooltip"]
      };
    },
  },
  created() {
    if (this.options.includes(this.initialSelection)) this.dropdownSelection = this.initialSelection;
    else {
      this.dropdownSelection = "USER INPUT...";
      this.textContents = this.initialSelection;
    }
  },
  mounted() {
    this.b = this.block;
  },
  methods: {
    update() {
      this.currentBlockId = BlockAutomator.currentBlockId;
      this.isTextInput = this.dropdownSelection === "USER INPUT...";
    },
    validateInput(value) {
      let validator, lines;
      if (this.b.nest) {
        const clone = Object.assign({}, this.b);
        clone.nest = [];
        lines = BlockAutomator.parseLines([clone]);
        validator = AutomatorGrammar.validateLine(lines.join("\n"));
      } else {
        lines = BlockAutomator.parseLines([this.b]);
        validator = AutomatorGrammar.validateLine(lines[0]);
      }

      this.idxOffset = lines[0].indexOf(value);

      this.validatorErrors = {
        errors: validator.errors,
        line: value
      };
    },
    handleFocus(focusState) {
      this.suppressTooltip = !focusState;
      // Validate input only after unfocus
      if (!focusState) {
        this.updateFunction(this.block, this.block.id);
        // eslint-disable-next-line vue/no-mutating-props
        this.block[this.blockTarget] = this.textContents;
        this.recalculateErrorCount();
      }
    },

    // Not entirely sure why, but updating error count only seems to work if it's done exactly here in the execution
    // stack; moving it to the definition of updateBlock seems to stop it from working
    changeBlock(block, id) {
      this.updateFunction(this.block, id);
      if (this.blockTarget) {
        block[this.blockTarget] = this.isBoolTarget ? this.dropdownSelection !== "" : this.dropdownSelection;
      }
      this.recalculateErrorCount();
    },

    // This gets called whenever blocks are changed, but we also need to halt execution if the currently visible script
    // is also the one being run
    recalculateErrorCount() {
      AutomatorData.needsRecompile = true;
      AutomatorData.currentErrors();

      if (AutomatorBackend.currentEditingScript.id === AutomatorBackend.currentRunningScript.id) {
        AutomatorBackend.stop();
      }
    }
  }
};
</script>

<template>
  <div class="c-automator-single-block">
    <input
      v-if="isTextInput"
      v-model="textContents"
      v-tooltip="errorTooltip"
      class="o-automator-block-input"
      :class="{ 'l-error-textbox' : hasError }"
      @keyup="validateInput(textContents)"
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
    <select
      v-else
      v-model="dropdownSelection"
      class="o-automator-block-input"
      @change="changeBlock(block, block.id)"
    >
      <option
        v-for="target in ['', ...options]"
        :key="target"
        :value="target"
      >
        {{ target }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.c-automator-single-block {
  margin: 0.2rem;
}
</style>
