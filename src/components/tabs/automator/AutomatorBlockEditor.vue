<script>
import draggable from "vuedraggable";

import AutomatorSingleBlock from "./AutomatorSingleBlock";

export default {
  name: "AutomatorBlockEditor",
  components: {
    AutomatorSingleBlock,
    draggable
  },
  computed: {
    lines: {
      get() {
        return this.$viewModel.tabs.reality.automator.lines;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.lines = value;
      }
    },
    numberOfLines() {
      return this.lines.reduce((a, l) => a + BlockAutomator.numberOfLinesInBlock(l), 0);
    },
  },
  mounted() {
    this.$refs.blockEditorElement.scrollTo(0, BlockAutomator.previousScrollPosition);
    // We want to set it here directly instead of through v-bind because it's slightly faster and less jittery
    this.$refs.editorGutter.style.bottom = `${this.$refs.blockEditorElement.scrollTop}px`;
  },
  methods: {
    setPreviousScroll() {
      BlockAutomator.previousScrollPosition = this.$refs.blockEditorElement.scrollTop;
      // We want to set it here directly instead of through v-bind because it's slightly faster and less jittery
      this.$refs.editorGutter.style.bottom = `${this.$refs.blockEditorElement.scrollTop}px`;
    },
    parseRequest() {
      BlockAutomator.parseTextFromBlocks();
    },
    updateBlock(block, id) {
      this.lines[this.lines.findIndex(x => x.id === id)] = block;
      this.parseRequest();
    },
    deleteBlock(id) {
      const idx = this.lines.findIndex(x => x.id === id);
      this.lines.splice(idx, 1);
      this.parseRequest();
    },
  }
};

export const BlockAutomator = {
  _idArray: [],

  get lines() {
    return ui.view.tabs.reality.automator.lines;
  },

  set lines(arr) {
    ui.view.tabs.reality.automator.lines = arr;
    this.updateIdArray();
  },

  get currentBlockId() {
    if (AutomatorBackend.stack.isEmpty) return false;
    return this._idArray[AutomatorBackend.stack.top.lineNumber - 1];
  },

  // _idArray contains a mapping from all text lines to block IDs in the blockmato, where only lines with
  // actual commands have defined values. This means that every time a closing curly brace } occurs, all further
  // line numbers between on block will be one less than the corresponding text line number
  lineNumber(textLine) {
    const skipLines = this._idArray.map((id, index) => (id ? -1 : index + 1)).filter(v => v !== -1);
    return textLine - skipLines.countWhere(line => line <= textLine);
  },

  parseTextFromBlocks() {
    const content = this.parseLines(BlockAutomator.lines).join("\n");
    const automatorID = ui.view.tabs.reality.automator.editorScriptID;
    AutomatorBackend.saveScript(automatorID, content);
  },

  fromText(scriptText) {
    const lines = AutomatorGrammar.blockifyTextAutomator(scriptText);
    if (lines) {
      this.lines = lines;
    }
    return lines;
  },

  generateText(block, indentation = 0) {
    let parsed = "\t".repeat(indentation) + block.cmd;

    parsed = parsed
      .replace("COMMENT", "//")
      .replace("BLOB", "blob  ");

    if (block.canWait && block.wait === false) {
      parsed = parsed.replace(/(\S+)/u, "$1 NOWAIT");
    }
    if (block.respec) parsed += ` RESPEC`;
    if (block.target) parsed += ` ${block.target}`;
    if (block.secondaryTarget) parsed += ` ${block.secondaryTarget}`;
    if (block.inputValue) parsed += ` ${block.inputValue}`;
    if (block.cmd === "IF" || block.cmd === "WHILE" || block.cmd === "UNTIL") parsed += " {";

    return parsed;
  },

  parseLines(l, indentation = 0) {
    const lines = [];
    for (let i = 0; i < l.length; i++) {
      lines.push(this.generateText(l[i], indentation));
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
    this._idArray = this.blockIdArray(this.lines);
  },

  numberOfLinesInBlock(block) {
    return block.nested ? Math.max(block.nest.reduce((v, b) => v + this.numberOfLinesInBlock(b), 1), 2) : 1;
  },

  previousScrollPosition: 0
};
</script>

<template>
  <div class="c-automator-block-editor--container">
    <div
      ref="editorGutter"
      class="c-automator-block-editor--gutter"
    >
      <div
        v-for="i in numberOfLines"
        :key="i"
        class="c-automator-block-line-number"
        :style="{
          top: `${(i - 1) * 3.45}rem`
        }"
      >
        {{ i }}
      </div>
    </div>
    <div
      ref="blockEditorElement"
      class="c-automator-block-editor"
      @scroll="setPreviousScroll()"
    >
      <draggable
        v-model="lines"
        group="code-blocks"
        class="c-automator-blocks"
        ghost-class="c-automator-block-row-ghost"
        @end="parseRequest"
      >
        <AutomatorSingleBlock
          v-for="block in lines"
          :key="block.id"
          :block="block"
          :update-block="updateBlock"
          :delete-block="deleteBlock"
        />
      </draggable>
    </div>
  </div>
</template>

<style scoped>
.c-automator-block-editor {
  display: flex;
  overflow-y: auto;
  tab-size: 1.5rem;
  width: 100%;
  background-color: var(--color-blockmator-editor-background);
  box-sizing: content-box;
}

.c-automator-block-editor--container {
  display: flex;
  overflow-y: hidden;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.c-automator-blocks {
  width: 100%;
  height: max-content;
  padding: 0.3rem 0.6rem 5rem;
}

.c-automator-block-editor--gutter {
  height: max-content;
  min-height: 100%;
  position: relative;
  background-color: var(--color-automator-controls-background);
  border-right: 0.1rem solid #505050;
  /* left and right paddings are 1 to make space for text, bottom padding is 20 to make for a buffer */
  padding: 0.3rem 1rem 20rem;
}

.c-automator-block-line-number {
  display: flex;
  height: 3.45rem;
  justify-content: flex-end;
  align-items: center;
  font-size: 1.4rem;
  color: var(--color-automator-docs-font);
}

.null-block {
  display: none;
  visibility: hidden;
}
</style>
