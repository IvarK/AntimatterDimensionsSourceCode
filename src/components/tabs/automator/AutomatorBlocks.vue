<script>
import draggable from "vuedraggable";

export default {
  name: "AutomatorBlocks",
  components: {
    draggable
  },
  data() {
    return {
      allBlocks: automatorBlocks.filter(b => !AUTOMATOR_BLOCKS_BLACKLIST.includes(b.cmd)),
      blocks: []
    };
  },
  methods: {
    update() {
      this.blocks = this.allBlocks.filter(b => (b.isUnlocked?.() ?? true));
    },
    clone(block) {
      const b = {
        ...block,
        id: UIID.next()
      };

      if (block.nested && !block.nest) b.nest = [];
      if (block.targets) b.target = "";
      if (block.compOperators) b.compOperator = "";
      return b;
    },
  }
};

const AUTOMATOR_BLOCKS_COMPARISON_OPERATORS = ["<", ">", ">=", "<="];
const AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES = [
  "AM", "IP", "EP", "RM", "INFINITIES", "BANKED INFINITIES", "ETERNITIES", "REALITIES",
  "PENDING IP", "PENDING EP", "PENDING TP", "PENDING RM", "PENDING GLYPH LEVEL",
  "DT", "TP", "RG", "REP", "TT", "TOTAL TT", "TOTAL COMPLETIONS", "PENDING COMPLETIONS",
  "EC1 COMPLETIONS", "EC2 COMPLETIONS", "EC3 COMPLETIONS", "EC4 COMPLETIONS",
  "EC5 COMPLETIONS", "EC6 COMPLETIONS", "EC7 COMPLETIONS", "EC8 COMPLETIONS",
  "EC9 COMPLETIONS", "EC10 COMPLETIONS", "EC11 COMPLETIONS", "EC12 COMPLETIONS",
];

const AUTOMATOR_BLOCKS_RESETS = ["INFINITY", "ETERNITY", "REALITY"];

/**
 *  @property {String} cmd          Name of automator command
 *  @property {Array: String} allowedPatterns   Allowed patterns for input types, specified single-capital-letter props
 *  @property {Array: String} [A-Z]             Classes of allowed inputs, to be used in allowedPatterns
 *  @property {Array: String} targets           List of keys to be used for assigning inputs to props of automator
 *    commands. Each entry is associated with the index of the character in allowedPatterns
 *  @property {Boolean} nested      Whether or not the command is the header of a loop in the automator
 *  @property {Boolean} canWait     Whether or not the command can be run in a non-blocking way
 *  @property {Boolean} canRespec   Whether or not the command has an associated respec option
 *  @property {Function @return Boolean} isUnlocked    Function returning the unlock state of the command; if false,
 *    the command will not appear. Assumed to be true if prop is not present
 */
export const automatorBlocks = [
  {
    cmd: "WAIT",
    allowedPatterns: ["A", "BCB"],
    A: AUTOMATOR_BLOCKS_RESETS,
    B: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "input"],
    C: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targets: ["genericInput1", "compOperator", "genericInput2"]
  }, {
    cmd: "IF",
    allowedPatterns: ["ABA"],
    A: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "input"],
    B: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targets: ["genericInput1", "compOperator", "genericInput2"],
    nested: true
  }, {
    cmd: "WHILE",
    allowedPatterns: ["ABA"],
    A: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "input"],
    B: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targets: ["genericInput1", "compOperator", "genericInput2"],
    nested: true
  }, {
    cmd: "UNTIL",
    allowedPatterns: ["A", "BCB"],
    A: AUTOMATOR_BLOCKS_RESETS,
    B: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, "input"],
    C: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targets: ["genericInput1", "compOperator", "genericInput2"],
    nested: true
  }, {
    cmd: "STUDIES PURCHASE",
    allowedPatterns: ["A"],
    A: ["input"],
    targets: ["singleTextInput"],
    canWait: true
  }, {
    cmd: "UNLOCK",
    allowedPatterns: ["AB", "C"],
    A: ["EC"],
    B: ["input"],
    C: ["DILATION"],
    targets: ["singleSelectionInput", "singleTextInput"],
    canWait: true
  }, {
    cmd: "START",
    allowedPatterns: ["AB", "C"],
    A: ["EC"],
    B: ["input"],
    C: ["DILATION"],
    targets: ["singleSelectionInput", "singleTextInput"],
  }, {
    cmd: "AUTO",
    allowedPatterns: ["AB"],
    A: AUTOMATOR_BLOCKS_RESETS,
    B: ["ON", "OFF", "input"],
    targets: ["singleSelectionInput", "singleTextInput"],
  }, {
    cmd: "BLACK HOLE",
    allowedPatterns: ["A"],
    A: ["ON", "OFF"],
    targets: ["singleSelectionInput"],
    isUnlocked: () => BlackHole(1).isUnlocked
  }, {
    cmd: "STORE GAME TIME",
    allowedPatterns: ["A"],
    A: ["ON", "OFF", "USE"],
    targets: ["singleSelectionInput"],
    isUnlocked: () => Enslaved.isUnlocked
  }, {
    cmd: "PAUSE",
    allowedPatterns: ["A"],
    A: ["input"],
    targets: ["singleTextInput"],
  }, {
    cmd: "STUDIES RESPEC",
  }, {
    cmd: "INFINITY",
    canWait: true
  }, {
    cmd: "ETERNITY",
    canRespec: true,
    canWait: true
  }, {
    cmd: "REALITY",
    canRespec: true,
    canWait: true,
    isUnlocked: () => RealityUpgrade(25).isBought
  }, {
    cmd: "STUDIES LOAD",
    allowedPatterns: ["AB"],
    A: ["ID", "NAME"],
    B: ["input"],
    targets: ["singleSelectionInput", "singleTextInput"],
    canWait: true
  }, {
    cmd: "NOTIFY",
    allowedPatterns: ["A"],
    A: ["input"],
    targets: ["singleTextInput"],
  }, {
    cmd: "COMMENT",
    allowedPatterns: ["A"],
    A: ["input"],
    targets: ["singleTextInput"],
  }, {
    cmd: "DEFINE",
    allowedPatterns: ["ABA"],
    A: ["input"],
    B: ["="],
    targets: ["genericInput1", "compOperator", "genericInput2"],
  }, {
    cmd: "BLOB"
  }
];
const AUTOMATOR_BLOCKS_BLACKLIST = ["BLOB"];

export const automatorBlocksMap = automatorBlocks.mapToObject(b => b.cmd, b => b);
</script>

<template>
  <draggable
    class="o-drag-cancel-region"
    group="code-blocks"
    ghost-class="null-block"
    draggable=".draggable-blocks"
  >
    <p>
      Drag and drop these blocks to the area on the left!
    </p>
    <draggable
      class="block-container"
      :list="blocks"
      :group="{ name: 'code-blocks', pull: 'clone', put: false }"
      :sort="false"
      :clone="clone"
    >
      <div
        v-for="block in blocks"
        :key="block.id"
        class="o-automator-command o-automator-block-list draggable-blocks"
      >
        {{ block.cmd }}
      </div>
    </draggable>
    <p>
      Note: For technical reasons, blocks and their contents count towards the character limits as if the
      command was typed in text mode.
    </p>
  </draggable>
</template>

<style scoped>
.block-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 1rem 0;
}

.o-automator-block-list {
  display: flex;
  width: 8.7rem;
  text-align: center;
  height: 5.5rem;
  justify-content: center;
  align-items: center;
}

.o-drag-cancel-region {
  width: 100%;
  height: 100%;
}

.null-block {
  display: none;
  visibility: hidden;
}
</style>
