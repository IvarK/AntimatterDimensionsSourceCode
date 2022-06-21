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
      if (block.hasInput) b.inputValue = "";
      if (block.secondaryTargets) b.secondaryTarget = "";
      return b;
    }
  }
};

const AUTOMATOR_BLOCKS_COMPARISON_OPERATORS = ["<", ">", ">=", "<=", "!="];
const AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES = [
  "AM", "IP", "EP", "RM", "INFINITIES", "BANKED INFINITIES", "ETERNITIES", "REALITIES",
  "PENDING IP", "PENDING EP", "PENDING TP", "PENDING RM", "PENDING GLYPH LEVEL",
  "DT", "TP", "RG", "REP", "TT", "TOTAL TT", "TOTAL COMPLETIONS", "PENDING COMPLETIONS",
  "EC1 COMPLETIONS", "EC2 COMPLETIONS", "EC3 COMPLETIONS", "EC4 COMPLETIONS",
  "EC5 COMPLETIONS", "EC6 COMPLETIONS", "EC7 COMPLETIONS", "EC8 COMPLETIONS",
  "EC9 COMPLETIONS", "EC10 COMPLETIONS", "EC11 COMPLETIONS", "EC12 COMPLETIONS",
];

const AUTOMATOR_BLOCKS_RESETS = ["INFINITY", "ETERNITY", "REALITY"];

export const automatorBlocks = [
  {
    cmd: "WAIT",
    targets: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, ...AUTOMATOR_BLOCKS_RESETS],
    secondaryTargets: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    targetsWithoutInput: AUTOMATOR_BLOCKS_RESETS,
    hasInput: true
  }, {
    cmd: "IF",
    targets: AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES,
    secondaryTargets: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    hasInput: true,
    nested: true
  }, {
    cmd: "WHILE",
    targets: AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES,
    secondaryTargets: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    hasInput: true,
    nested: true
  }, {
    cmd: "UNTIL",
    targets: [...AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES, ...AUTOMATOR_BLOCKS_RESETS],
    secondaryTargets: AUTOMATOR_BLOCKS_COMPARISON_OPERATORS,
    hasInput: true,
    targetsWithoutInput: AUTOMATOR_BLOCKS_RESETS,
    nested: true
  }, {
    cmd: "STUDIES PURCHASE",
    hasInput: true,
    canWait: true
  }, {
    cmd: "UNLOCK",
    targets: ["EC", "DILATION"],
    hasInput: true,
    targetsWithoutInput: ["DILATION"],
    canWait: true
  }, {
    cmd: "START",
    targets: ["EC", "DILATION"],
    hasInput: true,
    targetsWithoutInput: ["DILATION"]
  }, {
    cmd: "AUTO",
    targets: AUTOMATOR_BLOCKS_RESETS,
    hasInput: true
  }, {
    cmd: "BLACK HOLE",
    targets: ["ON", "OFF"],
    isUnlocked: () => BlackHole(1).isUnlocked
  }, {
    cmd: "STORE GAME TIME",
    targets: ["ON", "OFF", "USE"],
    isUnlocked: () => Enslaved.isUnlocked
  }, {
    cmd: "TT",
    targets: ["AM", "IP", "EP", "ALL"],
  }, {
    cmd: "PAUSE",
    hasInput: true
  }, {
    cmd: "STUDIES RESPEC"
  }, {
    cmd: "INFINITY",
    canRespec: true,
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
    targets: ["ID", "NAME"],
    hasInput: true,
    canWait: true
  }, {
    cmd: "NOTIFY",
    hasInput: true
  }, {
    cmd: "COMMENT",
    hasInput: true
  }, {
    cmd: "DEFINE",
    hasInput: true
  }, {
    cmd: "BLOB"
  }
];
const AUTOMATOR_BLOCKS_BLACKLIST = ["DEFINE", "BLOB"];

export const automatorBlocksMap = automatorBlocks.mapToObject(b => b.cmd, b => b);
</script>

<template>
  <draggable
    class="o-drag-cancel-region"
    group="code-blocks"
    ghost-class="null-block"
  >
    <p>Drag and drop these blocks to the area on the left!</p>
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
        class="o-automator-command o-automator-block-list"
      >
        {{ block.cmd }}
      </div>
    </draggable>
    <p>Note: For technical reasons, blocks and their contents count towards the character limits.</p>
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
