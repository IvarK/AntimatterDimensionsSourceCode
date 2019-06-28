"use strict";

function parseBlock(block, indentation = 0) {
  let ret = "\t".repeat(indentation) + block.cmd

  if (block.target) ret += " " + block.target
  if (block.secondaryTarget) ret += " " + block.secondaryTarget
  if (block.inputValue) ret += " " + block.inputValue
  if (block.cmd == "IF" || block.cmd == "WHILE") ret += " " + "{"

  return ret
}

function parseLines(l, indentation = 0) {
  let lines = []
  for (let i = 0; i < l.length; i++) {
    lines.push(parseBlock(l[i], indentation))
    if (l[i].cmd == "IF" || l[i].cmd == "WHILE") {
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
  updated() {
    
  },
  methods: {
    updateBlock(block, id) {
      this.lines[this.lines.findIndex( x => x.id == id)] = block
      console.log(this.lines)
    },
    deleteBlock(id) {
      let idx = this.lines.findIndex( x => x.id == id)
      this.lines.splice(idx, 1)
    },
    parseLines() {
      $("#automator").val( parseLines(this.lines).join("\n") )
      updateState()
      console.log(parseLines(this.lines))
    }
  },
  template:
    `<div class="c-automator-block-editor l-automator-editor">
      <button @click="parseLines">Parse <br>into <br>automator</button>
      <draggable v-model="lines" group="code-blocks" class="c-automator-blocks">
        <automator-single-block 
          v-for="(block, index) in lines" 
          :key="block.id"
          :lineNumber="index"
          :block="block"
          :updateBlock="updateBlock"
          :deleteBlock="deleteBlock"></automator-single-block>
      </draggable>
    </div>`
});