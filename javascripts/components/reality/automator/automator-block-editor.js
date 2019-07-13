"use strict";

let block_automator_lines = []

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

function blockAutomatorParseFromText(text) {
  debugger
  const lines = text.split("\n")
  let ret = []
  for (let i = 0; i < lines.length; i++) {

    let line = lines[i].replace("\t", "")
    const words = line.split(" ")
    const keyword = words[0].toLowerCase()
    const block = automator_blocks.find((b) => b.cmd.toLowerCase() == keyword)

    let wordIdx = 1
    if (block.targets) block.target = words[wordIdx]; wordIdx++;
    if (block.secondaryTargets) block.secondaryTarget = words[wordIdx]; wordIdx++;
    if (block.hasInput && 
        (!block.targetsWithoutInput ||
        !block.targetsWithoutInput.includes(keyword.toUpperCase()))
       ) block.inputValue = words[wordIdx]

    if (block.nested) {
      let nest = []
      let bracketCounter = 1
      while(bracketCounter > 0) {
        i++;
        line = lines[i]
        if (line.includes("{")) bracketCounter++;
        else if (line.includes("}")) bracketCounter--;
        nest.push(line)
      }
      i++;
      line = lines[i]
      nest.pop()
      block.nest = blockAutomatorParseFromText(nest.join("\n"))
    }

    ret.push(block)
  }
  console.log(ret)
  return ret
}

function parseTextAutomator() {
  let b = new Blockifier()
  let tokens = AutomatorLexer.lexer.tokenize(AutomatorUI.documents[1].getValue()).tokens
  AutomatorGrammar.parser.input = tokens;
  let blocks = b.visit(AutomatorGrammar.parser.script())
  console.log(blocks)
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
      this.lines[this.lines.findIndex( x => x.id == id)] = block
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
          :move="onUpdate()"></automator-single-block>
      </draggable>
    </div>`
});