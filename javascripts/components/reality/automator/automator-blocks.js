const automator_blocks = [
  { 
    cmd: 'WAIT',
    targets: ['IP', 'EP', 'AM', 'REPLICANTI', 'RG', 'TT', 'DT', 'COMPLETIONS', 'TP', 'INFINITY', 'ETERNITY', 'REALITY'],
    secondaryTargets: ['=', '<', '>', '>=', '<=', '!='],
    targetsWithoutInput: ['INFINITY', 'ETERNITY', 'REALITY'],
    hasInput: true
  }, {
    cmd: 'IF',
    targets: ['IP', 'EP', 'AM', 'REPLICANTI', 'RG', 'TT', 'DT', 'COMPLETIONS', 'TP'],
    secondaryTargets: ['=', '<', '>', '>=', '<=', '!='],
    hasInput: true,
    nested: true
  }, {
    cmd: 'WHILE',
    targets: ['IP', 'EP', 'AM', 'REPLICANTI', 'RG', 'TT', 'DT', 'COMPLETIONS', 'TP'],
    secondaryTargets: ['=', '<', '>', '>=', '<=', '!='],
    hasInput: true,
    nested: true
  }, {
    cmd: 'UNTIL',
    targets: ['IP', 'EP', 'AM', 'REPLICANTI', 'RG', 'TT', 'DT', 'COMPLETIONS', 'TP', 'INFINITY', 'ETERNITY', 'REALITY'],
    secondaryTargets: ['=', '<', '>', '>=', '<=', '!='],
    hasInput: true,
    targetsWithoutInput: ['INFINITY', 'ETERNITY', 'REALITY'],
    nested: true
  }, {
    cmd: "STUDIES",
    hasInput: true
  }, {
    cmd: 'UNLOCK',
    targets: ['EC', 'DILATION'],
    hasInput: true,
    targetsWithoutInput: ['DILATION']
  }, {
    cmd: 'START',
    targets: ['EC', 'DILATION'],
    hasInput: true,
    targetsWithoutInput: ['DILATION']
  }, {
    cmd: 'AUTO',
    targets: ['INFINITY', 'ETERNITY'],
    hasInput: true
  }, {
    cmd: 'TT',
    targets: ['AM', 'IP', 'EP', 'MAX'],
  }, {
    cmd: 'BLACK HOLE',
    targets: ['ON', 'OFF'],
  }, {
    cmd: 'STORE TIME',
    targets: ['ON', 'OFF', 'USE'],
  }, {
    cmd: 'PAUSE',
    hasInput: true
  }, {
    cmd: 'RESPEC'
  }, {
    cmd: 'INFINITY'
  }, {
    cmd: 'ETERNITY'
  }, {
    cmd: 'REALITY'
  }, {
    cmd: 'LOAD',
    hasInput: true
  }

]

function findAutomatorBlockByName(name) {
  return automator_blocks.find( b => b.cmd == name)
}


Vue.component("automator-blocks", {
  data() {
    return {
      blocks: automator_blocks
    }
  },
  methods: {
    clone(block) {
      let b = {
        ...block,
        id: UIID.next()
      }

      if (block.nested && !block.nest) b.nest = []
      if (block.targets) b.target = ""
      if (block.hasInput) b.inputValue = ""
      if (block.secondaryTargets) b.secondaryTarget = ""
      return b
    }
  },
  template:
    `<div class="c-automator-docs">
      <draggable 
        :list="blocks"
        :group="{ name: 'code-blocks', pull: 'clone', put: false }"
        :sort="false"
        :clone="clone"
        class="c-automator-command-list">
        <div v-for="block in blocks" :key="block.id" class="o-automator-command"> {{ block.cmd }}</div>
      </draggable>
    </div>`
});