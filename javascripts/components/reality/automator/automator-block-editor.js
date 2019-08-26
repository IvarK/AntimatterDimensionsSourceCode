"use strict";

const BlockAutomator = {
  _lines: [],
  _idArray: [],

  get lines() {
    return this._lines;
  },

  set lines(arr) {
    this._lines = arr;
    this.updateIdArray();
  },

  get currentBlockId() {
    if (AutomatorBackend.stack.isEmpty) return false;
    return this._idArray[AutomatorBackend.currentLineNumber - 1];
  },

  parseBlock(block, indentation = 0) {
    let parsed = "\t".repeat(indentation) + block.cmd;
  
    parsed = parsed
      .replace("LOAD", "STUDIES LOAD PRESET")
      .replace("RESPEC", "STUDIES RESPEC");
  
    if (block.target) parsed += ` ${block.target}`;
    if (block.secondaryTarget) parsed += ` ${block.secondaryTarget}`;
    if (block.inputValue) parsed += ` ${block.inputValue}`;
    if (block.cmd === "IF" || block.cmd === "WHILE" || block.cmd === "UNTIL") parsed += " {";
  
    return parsed;
  },

  parseLines(l, indentation = 0) {
    const lines = [];
    for (let i = 0; i < l.length; i++) {
      lines.push(this.parseBlock(l[i], indentation));
      if (l[i].cmd === "IF" || l[i].cmd === "WHILE" || l[i].cmd === "UNTIL") {
        lines.push(...this.parseLines(l[i].nest, indentation + 1));
        lines.push(`${"\t".repeat(indentation)}}`);
      }
    }
  
    return lines;
  },

  blockIdArray(blocks) {
    const output = [];
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      output.push(b.id);
      if (b.nested) output.push(...this.blockIdArray(b.nest), undefined);
    }
    return output;
  },

  updateIdArray() {
    this._idArray = this.blockIdArray(this._lines);
  }
};

Vue.component("automator-block-editor", {
  data() {
    return {
      lines: []
    };
  },
  computed: {
    lineNumbersCount() {
      return Math.max(this.lines.length, 1);
    }
  },
  methods: {
    updateBlock(block, id) {
      this.$set(this.lines, this.lines.findIndex(x => x.id === id), block);
      BlockAutomator.lines = this.lines;
    },
    deleteBlock(id) {
      const idx = this.lines.findIndex(x => x.id === id);
      this.lines.splice(idx, 1);
      BlockAutomator.lines = this.lines;
    },
    parseLines() {
      $("#automator").val(BlockAutomator.parseLines(this.lines).join("\n"));
    },
    onUpdate() {
      BlockAutomator.lines = this.lines;
    },
    update() {
      this.lines = BlockAutomator.lines;
    },
  },
  template:
    `<div class="c-automator-block-editor">
      <draggable 
        v-model="lines" 
        group="code-blocks" 
        class="c-automator-blocks" 
        ghost-class="c-automator-block-row-ghost">
        <automator-single-block 
          v-for="(block, index) in lines" 
          :key="block.id"
          :lineNumber="index"
          :block="block"
          :updateBlock="updateBlock"
          :deleteBlock="deleteBlock"
          :move="onUpdate()"
          ></automator-single-block>
      </draggable>
    </div>`
});