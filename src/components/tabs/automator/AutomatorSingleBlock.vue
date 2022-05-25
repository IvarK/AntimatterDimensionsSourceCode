<script>
import draggable from "vuedraggable";

export default {
  name: "AutomatorSingleBlock",
  components: {
    draggable
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
    hasError() {
      return this.validatorErrors.errors.length > 0;
    },
    errorTooltip() {
      if (!this.hasError) return undefined;
      const span = "<span class='o-automator-error-underline'>";
      const content = this.validatorErrors.line
        .splice(this.validatorErrors.errors[0].startOffset - this.idxOffset, 0, span)
        .splice(this.validatorErrors.errors[0].endOffset + span.length + 1 - this.idxOffset, 0, "</span>");
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
  mounted() {
    this.b = this.block;
  },
  methods: {
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
    update() {
      this.currentBlockId = BlockAutomator.currentBlockId;
    },
    validateInput(value) {
      let validator, lines;
      const defines = BlockAutomator.lines.filter(line => line.cmd === "DEFINE");
      if (this.b.nest) {
        const clone = Object.assign({}, this.b);
        clone.nest = [];
        lines = BlockAutomator.parseLines([...defines, clone]);
        validator = AutomatorGrammar.validateLine(lines.join("\n"));
      } else {
        lines = BlockAutomator.parseLines([...defines, this.b]);
        validator = AutomatorGrammar.validateLine(lines.join("\n"));
      }

      this.idxOffset = lines[0].indexOf(value);

      this.validatorErrors = {
        errors: validator.errors,
        line: value
      };
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
      <select
        v-if="b.canWait"
        v-model="b.wait"
        class="o-automator-block-input"
        @change="updateBlock(block, b.id)"
      >
        <option :value="true" />
        <option :value="false">
          NOWAIT
        </option>
      </select>
      <select
        v-if="b.canRespec"
        v-model="b.respec"
        class="o-automator-block-input"
        @change="updateBlock(block, b.id)"
      >
        <option :value="false" />
        <option :value="true">
          RESPEC
        </option>
      </select>
      <select
        v-if="b.targets"
        v-model="b.target"
        class="o-automator-block-input"
        @change="updateBlock(block, b.id)"
      >
        <option
          v-for="target in b.targets"
          :key="target"
          :value="target"
        >
          {{ target }}
        </option>
      </select>
      <select
        v-if="hasSecondaryTargets"
        v-model="b.secondaryTarget"
        class="o-automator-block-input"
        @change="updateBlock(block, b.id)"
      >
        <option
          v-for="target in b.secondaryTargets"
          :key="target"
          :value="target"
        >
          {{ target }}
        </option>
      </select>
      <input
        v-if="hasInput"
        v-model="b.inputValue"
        v-tooltip="errorTooltip"
        class="o-automator-block-input"
        @change="updateBlock(b, b.id)"
        @keyup="validateInput(b.inputValue)"
      >
      <div
        class="o-automator-block-delete"
        @click="deleteBlock(b.id)"
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
      <AutomatorSingleBlock
        v-for="(subblock, index) in block.nest"
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
  border: 0.1rem dotted #55ff55;
  margin: -0.1rem 0 -0.1rem 3rem;
  padding: 0 0.5rem;
}
</style>
