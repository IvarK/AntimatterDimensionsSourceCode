"use strict";

let block_automator_lines = []

function parseBlock(block, indentation = 0) {
  let ret = "\t".repeat(indentation) + block.cmd

  ret = ret
    .replace("LOAD", "STUDIES LOAD PRESET")
    .replace("RESPEC", "STUDIES RESPEC")

  if (block.target) ret += " " + block.target
  if (block.secondaryTarget) ret += " " + block.secondaryTarget
  if (block.inputValue) ret += " " + block.inputValue
  if (block.cmd == "IF" || block.cmd == "WHILE" || block.cmd == "UNTIL") ret += " " + "{"

  return ret
}

function parseLines(l, indentation = 0) {
  let lines = []
  for (let i = 0; i < l.length; i++) {
    lines.push(parseBlock(l[i], indentation))
    if (l[i].cmd == "IF" || l[i].cmd == "WHILE" || l[i].cmd == "UNTIL") {
      lines.push( ...parseLines(l[i].nest, indentation + 1) )
      lines.push("\t".repeat(indentation) + "}")
    }
  }

  return lines
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
      block_automator_lines = this.lines
    },
    deleteBlock(id) {
      let idx = this.lines.findIndex( x => x.id == id)
      this.lines.splice(idx, 1)
    },
    parseLines() {
      $("#automator").val( parseLines(this.lines).join("\n") )
    },
    onUpdate() {
      block_automator_lines = this.lines
    },
    update() {
      this.lines = block_automator_lines
    },
  },
  template:
    `<div class="c-automator-block-editor l-automator-editor">
      <draggable v-model="lines" group="code-blocks" class="c-automator-blocks">
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