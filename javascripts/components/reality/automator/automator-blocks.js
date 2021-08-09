"use strict";

const AUTOMATOR_BLOCKS_COMPARISON_OPERATORS = ["<", ">", ">=", "<=", "!="];
const AUTOMATOR_BLOCKS_COMPARISON_CURRENCIES = [
  "IP", "EP", "RM",
  "PENDING IP", "PENDING EP", "PENDING RM", "GLYPH LEVEL",
  "AM", "REPLICANTI", "RG", "TT", "DT", "PENDING COMPLETIONS", "TP"
];
const AUTOMATOR_BLOCKS_RESETS = ["INFINITY", "ETERNITY", "REALITY"];

const automatorBlocks = [
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
    cmd: "STUDIES",
    hasInput: true
  }, {
    cmd: "UNLOCK",
    targets: ["EC", "DILATION"],
    hasInput: true,
    targetsWithoutInput: ["DILATION"]
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
  }, {
    cmd: "STORE TIME",
    targets: ["ON", "OFF", "USE"],
  }, {
    cmd: "TT",
    targets: ["AM", "IP", "EP", "MAX"],
  }, {
    cmd: "PAUSE",
    hasInput: true
  }, {
    cmd: "RESPEC"
  }, {
    cmd: "INFINITY"
  }, {
    cmd: "ETERNITY"
  }, {
    cmd: "REALITY"
  }, {
    cmd: "LOAD",
    hasInput: true
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

const automatorBlocksMap = automatorBlocks.mapToObject(b => b.cmd, b => b);

function findAutomatorBlockByName(name) {
  return automatorBlocks.find(b => b.cmd === name);
}

Vue.component("automator-blocks", {
  data() {
    return {
      blocks: automatorBlocks.filter(b => !AUTOMATOR_BLOCKS_BLACKLIST.includes(b.cmd))
    };
  },
  methods: {
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
  },
  template: `
    <div class="c-automator-docs">
      <draggable
        :list="blocks"
        :group="{ name: 'code-blocks', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
        class="c-automator-command-list"
      >
        <div v-for="block in blocks" :key="block.id" class="o-automator-command">
          {{ block.cmd }}
        </div>
      </draggable>
    </div>`
});
