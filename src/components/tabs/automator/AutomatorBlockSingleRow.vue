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
      currentBlockId: -1,
      validatorErrors: {
        errors: [],
        line: ""
      },
      // For errors
      idxOffset: 0,
    };
  },
  computed: {
    hasInput() {
      return this.b.hasInput &&
        (this.b.targetsWithoutInput ? !this.b.targetsWithoutInput.includes(this.b.target) : true);
    },
    hasSecondaryTargets() {
      return this.b.secondaryTargets &&
        (this.b.targetsWithoutInput ? !this.b.targetsWithoutInput.includes(this.b.target) : true);
    },
    isCurrentLine() {
      return this.b.id === this.currentBlockId;
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
      this.currentBlockId = BlockAutomator.currentBlockId;
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
  <div class="c-automator-block-row--container">
    <div
      class="c-automator-block-row"
      :class="{ 'c-automator-block-row-active' : isCurrentLine }"
    >
      <div class="o-automator-command">
        {{ b.cmd }}
      </div>
      <AutomatorBlockSingleInput
        v-if="b.canWait"
        :block="b"
        block-target="nowait"
        :is-bool-target="true"
        :options="['NOWAIT']"
        :initial-selection="b.nowait ? 'NOWAIT' : ''"
        :update-function="updateBlock"
      />
      <AutomatorBlockSingleInput
        v-if="b.canRespec"
        :block="b"
        block-target="respec"
        :is-bool-target="true"
        :options="['RESPEC']"
        :initial-selection="b.respec ? 'RESPEC' : ''"
        :update-function="updateBlock"
      />
      <AutomatorBlockSingleInput
        v-if="b.targets"
        :block="b"
        block-target="target"
        :is-bool-target="false"
        :options="b.targets"
        :initial-selection="b.target"
        :update-function="updateBlock"
      />
      <AutomatorBlockSingleInput
        v-if="hasSecondaryTargets"
        :block="b"
        block-target="secondaryTarget"
        :is-bool-target="false"
        :options="b.secondaryTargets"
        :initial-selection="b.secondaryTarget"
        :update-function="updateBlock"
      />
      <AutomatorBlockSingleInput
        v-if="hasInput"
        :block="b"
        block-target="inputValue"
        :is-bool-target="false"
        :options="b.targets"
        :initial-selection="b.inputValue"
        :update-function="updateBlock"
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

.l-error-textbox {
  background: var(--color-automator-error-background);
}
</style>
