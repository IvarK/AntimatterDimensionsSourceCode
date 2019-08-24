"use strict";

// This is needed here, don't know where it should go
if (!String.prototype.splice) {
  /**
   * {JSDoc}
   *
   * The splice() method changes the content of a string by removing a range of
   * characters and/or adding new characters.
   *
   * @this {String}
   * @param {number} start Index at which to start changing the string.
   * @param {number} delCount An integer indicating the number of old chars to remove.
   * @param {string} newSubStr The String that is spliced in.
   * @return {string} A new string with the spliced substring.
   */
  String.prototype.splice = function(start, delCount, newSubStr) {
      return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
  };
}

Vue.component("automator-single-block", {
  data() {
    return {
      b: {},
      currentBlockId: -1,
      validatorErrors: {
        errors: [],
        line: ""
      }
    };
  },
  props: {
    block: Object,
    updateBlock: Function,
    deleteBlock: Function,
    lineNumber: Number,
  },
  mounted() {
    this.b = this.block;
  },
  methods: {
    deleteBlockFromNest(id) {
      const idx = this.b.nest.findIndex(x => x.id === id);
      this.b.nest.splice(idx, 1);
      this.$emit("automatorchanged");
    },
    updateBlockFromNest(block, id) {
      this.$set(this.b.nest, this.b.nest.findIndex(x => x.id === id), block);
      this.$emit("automatorchanged");
    },
    update() {
      this.currentBlockId = BlockAutomator.currentBlockId;
    },
    validateInput(value) {
      if (this.b.cmd !== "STUDIES") return;
      const validator = AutomatorGrammar.validateStudyList(value);
      this.validatorErrors = {
        errors: validator.errors,
        line: value
      };
    }
  },
  computed: {
    hasInput() {
      return this.b.hasInput && 
      (this.b.targetsWithoutInput ? !this.b.targetsWithoutInput.includes(this.b.target) : true)
    },
    hasSecondaryTargets() {
      return this.b.secondaryTargets && 
      (this.b.targetsWithoutInput ? !this.b.targetsWithoutInput.includes(this.b.target) : true)
    },
    isCurrentLine() {
      return this.b.id === this.currentBlockId;
    },
    hasError() {
      return this.validatorErrors.errors.length > 0;
    },
    errorTooltip() {
      if (!this.hasError) return undefined;
      const span = "<span class='o-automator-error-underline'>";
      const content = this.validatorErrors.line
        .splice(this.validatorErrors.errors[0].startOffset, 0, span)
        .splice(this.validatorErrors.errors[0].endOffset + span.length + 1, 0, "</span>");
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
    }
  },
  template:
    `<div>
      <div class="c-automator-block-row" :class="{ 'c-automator-block-row-active' : isCurrentLine }">
        <div class="o-automator-command">{{ b.cmd }}</div>
        <select v-if="b.targets" @change="updateBlock(block, b.id)" v-model="b.target" class="o-automator-block-input">
          <option v-for="target in b.targets" :value="target">{{ target }}</option>
        </select>
        <select 
          v-if="hasSecondaryTargets" 
          @change="updateBlock(block, b.id)" 
          v-model="b.secondaryTarget" 
          class="o-automator-block-input">
          <option v-for="target in b.secondaryTargets" :value="target">{{ target }}</option>
        </select>
        <input 
          v-if="hasInput" 
          v-model="b.inputValue" 
          @change="updateBlock(b, b.id)" 
          @keyup="validateInput(b.inputValue)" 
          class="o-automator-block-input"
          v-tooltip="errorTooltip"/>
        
        <div @click="deleteBlock(b.id)" class="o-automator-block-delete">X</div>
      </div>
      <draggable v-if="block.nested" class="l-automator-nested-block" v-model="block.nest" group="code-blocks">
          <automator-single-block
            v-for="(block, index) in block.nest" 
            :key="block.id"
            :lineNumber="index"
            :block="block"
            :updateBlock="updateBlockFromNest"
            :deleteBlock="deleteBlockFromNest"></automator-single-block>
        </draggable>
    </div>`
});