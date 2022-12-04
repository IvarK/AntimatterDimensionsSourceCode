<script>
import draggable from "vuedraggable";

import AutomatorBlockSingleInput from "./AutomatorBlockSingleInput";

export default {
  name: "AutomatorBlockSingleRow",
  components: {
    draggable,
    AutomatorBlockSingleInput
  },
  props: {
    block: {
      type: Object,
      required: true
    },
    updateBlock: {
      type: Function,
      required: true
    },
    deleteBlock: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      b: {},
      activeLine: -1,
      eventLine: -1,
      errorLine: -1,
    };
  },
  computed: {
    lineNumber() {
      return BlockAutomator.lineNumberFromBlockID(this.b.id);
    },
    isActiveLine() {
      return this.lineNumber === this.activeLine;
    },
    isEventLine() {
      return this.lineNumber === this.eventLine;
    },
    isErrorLine() {
      return this.lineNumber === this.errorLine;
    },
  },
  created() {
    this.recalculateErrorCount();
  },
  destroyed() {
    this.recalculateErrorCount();
  },
  mounted() {
    this.b = this.block;
  },
  methods: {
    update() {
      const lines = AutomatorHighlighter.lines;
      this.activeLine = lines.active;
      this.eventLine = lines.event;
      this.errorLine = lines.error;
    },
    parseRequest() {
      BlockAutomator.parseTextFromBlocks();
    },
    deleteBlockFromNest(id) {
      const idx = this.b.nest.findIndex(x => x.id === id);
      this.b.nest.splice(idx, 1);
    },
    updateBlockFromNest(block, id) {
      this.$set(this.b.nest, this.b.nest.findIndex(x => x.id === id), block);
      this.parseRequest();
    },

    // Not entirely sure why, but updating error count only seems to work if it's done exactly here in the execution
    // stack; moving it to the definition of updateBlock seems to stop it from working
    removeBlock(block, id) {
      this.deleteBlock(block, id);
      this.recalculateErrorCount();
    },

    // This gets called whenever blocks are changed, but we also need to halt execution if the currently visible script
    // is also the one being run
    recalculateErrorCount() {
      AutomatorData.recalculateErrors();
      if (AutomatorBackend.currentEditingScript.id === AutomatorBackend.currentRunningScript.id) {
        AutomatorBackend.stop();
      }
    },

    highlightClass() {
      return {
        "c-automator-block-row-active": this.isActiveLine,
        "c-automator-block-row-event": this.isEventLine,
        "c-automator-block-row-error": this.isErrorLine
      };
    },
    // The target value is either a String or some kind of a number - we need to force it to be a String for the
    // component type-checking (Numbers are implicitly cast, but Decimals are not)
    nextSelection() {
      const val = this.b.targets ? this.b[this.b.targets[0]] : "";
      return val;
    }
  }
};
</script>

<template>
  <div class="c-automator-block-row--container">
    <div
      class="c-automator-block-row"
      :class="highlightClass()"
    >
      <AutomatorBlockSingleInput
        :constant="b.alias ? b.alias : b.cmd"
        :block="b"
        :update-function="updateBlock"
      />
      <AutomatorBlockSingleInput
        v-if="b.canWait"
        :block="b"
        block-target="nowait"
        :initial-selection="b.nowait ? 'NOWAIT' : ''"
        :update-function="updateBlock"
      />
      <AutomatorBlockSingleInput
        v-if="b.canRespec"
        :block="b"
        block-target="respec"
        :initial-selection="b.respec ? 'RESPEC' : ''"
        :update-function="updateBlock"
      />
      <AutomatorBlockSingleInput
        v-if="b.allowedPatterns"
        :block="b"
        :block-target="b.targets[0]"
        :patterns="b.allowedPatterns"
        :initial-selection="nextSelection()"
        :update-function="updateBlock"
        :recursive="true"
      />
      <div
        class="o-automator-block-delete"
        @click="removeBlock(b.id)"
      >
        X
      </div>
    </div>
    <draggable
      v-if="block.nested"
      v-model="block.nest"
      class="l-automator-nested-block"
      group="code-blocks"
    >
      <AutomatorBlockSingleRow
        v-for="subblock in block.nest"
        :key="subblock.id"
        :block="subblock"
        :update-block="updateBlockFromNest"
        :delete-block="deleteBlockFromNest"
      />
    </draggable>
  </div>
</template>

<style scoped>
.c-automator-block-row--container {
  margin: -0.002rem;
  /* The only purpose of this is to prevent margin overlapping so the nested blocks can fit nicer */
  padding: 0.002rem;
}

.l-automator-nested-block {
  width: fit-content;
  min-width: 30rem;
  min-height: 3.65rem;
  border: 0.1rem dotted #55ff55;
  margin: -0.1rem 0 -0.1rem 3rem;
  padding: 0 0.5rem;
}
</style>
