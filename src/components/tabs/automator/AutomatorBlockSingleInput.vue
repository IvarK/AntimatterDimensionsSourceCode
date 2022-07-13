<script>
import { AutomatorData } from "../../../../javascripts/core/globals";

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
      suppressTooltip: false,
      errors: [],
      hasError: false,

      isTextInput: false,
      dropdownOptions: [],
      dropdownSelection: "",
      textContents: "",
      pathRef: {},
      currentNodeOnPath: "",
      unknownNext: false,
      nextNodeCount: false,
      lineNumber: 0,
    };
  },
  computed: {
    displayedConstant() {
      if (this.constant) return this.constant;
      return (this.dropdownOptions.length === 1 && !this.isBoolTarget && !this.isTextInput)
        ? this.dropdownOptions[0]
        : "";
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
    this.b = this.block;
    this.lineNumber = BlockAutomator.lineNumber(BlockAutomator._idArray.indexOf(this.block.id) + 1);
    BlockAutomator.updateIdArray();
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
    if (this.dropdownOptions.length === 1 && this.dropdownOptions[0].startsWith("*")) {
      this.isTextInput = true;
      this.textContents = this.initialSelection;
    }

    // This forces errors to show up immediately when the block is created instead of requiring user interaction
    this.recalculateErrorCount();
  },
  // Destroying single inputs need to be handled carefully because there are three situations under which they will
  // be removed, and they all require different behavior:
  // * An earlier input in the command chain makes this input unnecessary (eg. changing "unlock ec 8" to
  //   "unlock dilation" makes the 8 unnecessary) - in that case we also need to blank out the block prop
  // * Blocks are dragged and reordered, causing a parent component to key-swap and force a rerender on this
  //   component - in that case we need to remove the errors corresponding to the old line number
  // * The player changes to the text editor or switches tabs, wiping the entire block editor - we do nothing here
  destroyed() {
    if (player.reality.automator.type === AUTOMATOR_TYPE.TEXT || Tabs.current._currentSubtab.key !== "automator") {
      return;
    }

    this.recalculateErrorCount();
    const newLineNum = BlockAutomator.lineNumber(BlockAutomator._idArray.indexOf(this.block.id) + 1);
    if (this.lineNumber !== newLineNum) {
      const newErrors = [];
      for (const error of AutomatorData.cachedErrors) {
        if (error.startLine !== this.lineNumber) newErrors.push(error);
      }
      newErrors.sort((a, b) => a.startLine - b.startLine);
      AutomatorData.cachedErrors = newErrors;
      return;
    }

    if (this.blockTarget) {
      // eslint-disable-next-line vue/no-mutating-props
      this.block[this.blockTarget] = undefined;
      this.recalculateErrorCount();
    }
    BlockAutomator.parseTextFromBlocks();
  },
  methods: {
    update() {
      this.errors = AutomatorData.cachedErrors;
      this.hasError = this.errors.some(e => e.startLine === this.lineNumber);
      if (this.dropdownSelection.startsWith("*")) this.isTextInput = true;
      this.calculatePath();
    },
    calculatePath() {
      this.currentNodeOnPath = " ";
      for (const node of Object.keys(this.pathRef)) {
        const isValidText = this.pathRef[node].some(o => o.startsWith("*")) && this.isTextInput;
        if (this.pathRef[node].includes(this.dropdownSelection) || isValidText) {
          this.currentNodeOnPath = node;
        }
      }
      const fullPath = this.currentPath + this.currentNodeOnPath;
      this.nextNodeCount = this.patterns.filter(p => p.length > fullPath.length && p.startsWith(fullPath)).length;
      this.unknownNext = this.nextNodeCount > 1 || (this.dropdownSelection === "" && !this.isTextInput);
    },
    validateInput() {
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

      // Yes, the odd structure of this check is intentional. Something odd happens within parseLines under certain
      // conditions which seem hard to pin down, which causes this evaluate to an array with the string "undefined"
      // being its only element. These cases all seem to be false positives
      if (lines[0] === "undefined") return;

      // We're actually validating only this single line, so we reconstruct the error list by removing everything on
      // this line and adding anything new that was found. We only take the first error from this line (if there are
      // any) because multiple errors on the same line are generally redundant
      const newErrors = [];
      for (const error of AutomatorData.cachedErrors) {
        if (error.startLine !== this.lineNumber) newErrors.push(error);
      }
      if (validator.errors.length > 0) {
        const error = validator.errors[0];
        error.startLine = this.lineNumber;
        newErrors.push(error);
      }
      newErrors.sort((a, b) => a.startLine - b.startLine);
      AutomatorData.cachedErrors = newErrors;
    },
    handleFocus(focusState) {
      this.suppressTooltip = !focusState;
      this.changeBlock();
      this.recalculateErrorCount();
    },
    changeBlock() {
      this.updateFunction(this.block, this.block.id);
      if (this.textContents === "*") {
        this.isTextInput = false;
        this.dropdownSelection = "";
        this.textContents = "";
      }
      if (this.blockTarget) {
        let newValue;
        if (this.isBoolTarget) newValue = this.dropdownSelection !== "";
        else if (this.isTextInput) newValue = this.textContents;
        else newValue = this.dropdownSelection;

        // eslint-disable-next-line vue/no-mutating-props
        this.block[this.blockTarget] = newValue;
      }
      this.recalculateErrorCount();
    },

    // This gets called whenever blocks are changed, but we also need to halt execution if the currently visible script
    // is also the one being run
    recalculateErrorCount() {
      this.validateInput();
      if (AutomatorBackend.currentEditingScript.id === AutomatorBackend.currentRunningScript.id) {
        AutomatorBackend.stop();
      }
      BlockAutomator.parseTextFromBlocks();
    },
    errorTooltip() {
      if (!this.hasError || this.suppressTooltip) return undefined;
      return {
        content:
          `<div class="c-block-automator-error">
          <div>${this.errors.find(e => e.startLine === this.lineNumber).info}</div>
        </div>`,
        html: true,
        trigger: "manual",
        show: true,
        classes: ["c-block-automator-error-container", "general-tooltip"]
      };
    },
    textInputClassObject() {
      return {
        "o-automator-block-input": true,
        "l-error-textbox": this.hasError,
        "c-automator-input-required": !this.hasError,
      };
    },
    dropdownClassObject() {
      return {
        "o-automator-block-input": true,
        "c-automator-input-required": !this.isBoolTarget,
        "c-automator-input-optional": this.isBoolTarget,
      };
    }
  }
};
</script>

<template>
  <div class="c-automator-single-block">
    <div
      v-if="displayedConstant"
      class="o-automator-command c-automator-input-required c-automator-single-block-constant"
    >
      {{ displayedConstant }}
    </div>
    <input
      v-else-if="isTextInput"
      v-model="textContents"
      v-tooltip="errorTooltip()"
      :class="textInputClassObject()"
      @keyup="validateInput()"
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
    <select
      v-else
      v-model="dropdownSelection"
      :class="dropdownClassObject()"
      @change="changeBlock()"
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

.c-automator-single-block-constant {
  display: inline-block;
}

.l-error-textbox {
  background: var(--color-automator-error-background);
}
</style>
