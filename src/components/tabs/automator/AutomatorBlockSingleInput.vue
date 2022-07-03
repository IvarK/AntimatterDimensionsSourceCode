<script>
export default {
  name: "AutomatorBlockSingleInput",
  props: {
    constant: {
      type: String,
      required: false,
      default: ""
    },
    block: {
      type: Object,
      required: true
    },
    blockTarget: {
      type: String,
      required: false,
      default: ""
    },
    updateFunction: {
      type: Function,
      required: true
    },
    initialSelection: {
      type: String,
      required: false,
      default: ""
    },
    patterns: {
      type: Array,
      required: false,
      default: () => []
    },
    recursive: {
      type: Boolean,
      required: false,
      default: false
    },
    currentPath: {
      type: String,
      required: false,
      default: ""
    }
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
      dropdownOptions: [],
      dropdownSelection: "",
      textContents: "",
      pathRef: {},
      currentNodeOnPath: "",
      unknownNext: false,
      nextNodeCount: false,
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
    isBoolTarget() {
      return this.blockTarget === "nowait" || this.blockTarget === "respec";
    },
    nextInputKey() {
      return this.block.targets[this.currentPath.length + 1];
    },
    nextInputValue() {
      const targetList = this.block.targets;
      const value = targetList ? this.block[this.nextInputKey] : "";
      // Sometimes the target might be a Number or undefined but the prop type-checks for it to be a String
      return value ? `${value}` : "";
    }
  },
  created() {
    if (this.constant) return;
    if (this.isBoolTarget) {
      this.dropdownOptions = [this.blockTarget.toUpperCase()];
      this.dropdownSelection = this.block[this.blockTarget] ? this.blockTarget.toUpperCase() : "";
      return;
    }

    // This is used for sequences of inputs, which are traversed by recursion
    if (this.recursive) {
      const availableOptions = this.patterns
        .filter(s => s.startsWith(this.currentPath) && s.length > this.currentPath.length)
        .map(s => s.charAt(this.currentPath.length));
      for (const node of availableOptions) {
        if (this.pathRef[node]) continue;
        const entries = this.block[node];
        this.pathRef[node] = entries;
        this.dropdownOptions.push(...entries);
      }
      this.calculatePath();
    }

    // Set the initial display state properly
    if (this.dropdownOptions.includes(this.initialSelection)) {
      this.dropdownSelection = this.initialSelection;
    } else if (this.initialSelection) {
      this.isTextInput = true;
      this.textContents = this.initialSelection;
    }

    // Special handling for text-input-only fields, which will have single-element array specifications
    if (this.dropdownOptions[0] === "input" && this.dropdownOptions.length === 1) {
      this.isTextInput = true;
      this.textContents = this.initialSelection;
    } else {
      this.dropdownOptions = this.dropdownOptions.map(o => (o === "input" ? "USER INPUT..." : o));
    }
  },
  mounted() {
    this.b = this.block;
  },
  methods: {
    update() {
      this.currentBlockId = BlockAutomator.currentBlockId;
      if (this.dropdownSelection === "USER INPUT...") this.isTextInput = true;
      this.calculatePath();
    },
    calculatePath() {
      this.currentNodeOnPath = " ";
      for (const node of Object.keys(this.pathRef)) {
        const isValidText = this.dropdownSelection === "input" && this.isTextInput;
        if (this.pathRef[node].includes(this.dropdownSelection) || isValidText) {
          this.currentNodeOnPath = node;
        }
      }
      const fullPath = this.currentPath + this.currentNodeOnPath;
      this.nextNodeCount = this.patterns.filter(p => p.length > fullPath.length && p.startsWith(fullPath)).length;
      this.unknownNext = this.nextNodeCount > 1 || (this.dropdownSelection === "" && !this.isTextInput);
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
    <div
      v-if="constant"
      class="o-automator-command"
    >
      {{ constant }}
    </div>
    <input
      v-else-if="isTextInput"
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
        v-for="target in ['', ...dropdownOptions]"
        :key="target"
        :value="target"
      >
        {{ target }}
      </option>
    </select>
    <AutomatorBlockSingleInput
      v-if="recursive && nextNodeCount > 0"
      :key="currentNodeOnPath"
      :constant="unknownNext ? '...' : ''"
      :block="block"
      :block-target="nextInputKey"
      :patterns="patterns"
      :initial-selection="nextInputValue"
      :update-function="updateFunction"
      :recursive="true"
      :current-path="currentPath + currentNodeOnPath"
    />
  </div>
</template>

<style scoped>
.c-automator-single-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0.1rem;
  height: 2.8rem;
}
</style>
