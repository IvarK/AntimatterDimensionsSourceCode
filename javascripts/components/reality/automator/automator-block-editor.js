"use strict";

const BlockAutomator = {
  _lines: [],
  _idArray: [],

  get lines() {
    return this._lines
  },

  set lines(arr) {
    this._lines = arr
    this.updateIdArray()
  },

  get currentBlockId() {
    if (AutomatorBackend.stack.isEmpty) return false
    return this._idArray[AutomatorBackend.currentLineNumber - 1]
  },

  parseBlock(block, indentation = 0) {
    let ret = "\t".repeat(indentation) + block.cmd
  
    ret = ret
      .replace("LOAD", "STUDIES LOAD PRESET")
      .replace("RESPEC", "STUDIES RESPEC")
  
    if (block.target) ret += " " + block.target
    if (block.secondaryTarget) ret += " " + block.secondaryTarget
    if (block.inputValue) ret += " " + block.inputValue
    if (block.cmd == "IF" || block.cmd == "WHILE" || block.cmd == "UNTIL") ret += " " + "{"
  
    return ret
  },

  parseLines(l, indentation = 0) {
    let lines = []
    for (let i = 0; i < l.length; i++) {
      lines.push(this.parseBlock(l[i], indentation))
      if (l[i].cmd == "IF" || l[i].cmd == "WHILE" || l[i].cmd == "UNTIL") {
        lines.push( ...this.parseLines(l[i].nest, indentation + 1) )
        lines.push("\t".repeat(indentation) + "}")
      }
    }
  
    return lines
  },

  blockIdArray(blocks) {
    let output = []
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i]
      output.push(b.id)
      if (b.nested) output.push(...this.blockIdArray(b.nest))
    }
    return output;
  },

  updateIdArray() {
    this._idArray = this.blockIdArray(this._lines)
  }
}

Vue.component("automator-block-editor", {
  data() {
    return {
      lines: []
    }
  },
  computed: {
    lineNumbersCount() {
      return Math.max(this.lines.length, 1);
    }
  },
  methods: {
    updateBlock(block, id) {
      this.$set(this.lines, this.lines.findIndex( x => x.id == id), block)
      BlockAutomator.lines = this.lines
    },
    deleteBlock(id) {
      let idx = this.lines.findIndex( x => x.id == id)
      this.lines.splice(idx, 1)
      BlockAutomator.lines = this.lines
    },
    parseLines() {
      $("#automator").val( BlockAutomator.parseLines(this.lines).join("\n") )
    },
    onUpdate() {
      BlockAutomator.lines = this.lines
    },
    update() {
      this.lines = BlockAutomator.lines
    },
  },
  template:
    `<div class="c-automator-block-editor">
      <draggable v-model="lines" group="code-blocks" class="c-automator-blocks" ghost-class="c-automaotr-block-row-ghost">
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