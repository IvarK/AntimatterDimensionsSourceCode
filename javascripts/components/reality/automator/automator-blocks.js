const automator_blocks = [
  { 
    cmd: 'WAIT',
    targets: ['IP', 'EP', 'AM', 'TIME', 'REPLICANTI', 'RG', 'TT'],
    hasInput: true
  } , { 
    cmd: 'BUY',
    targets: ['STUDY', 'STUDYUNTIL', 'TTIP', 'TTEP', 'TTAM', 'TTMAX'],
    hasInput: true,
    targetsWithoutInput: ['TTMAX']
  }, {
    cmd: 'IF',
    targets: ['IP', 'EP', 'AM', 'REPLICANTI', 'RG', 'TT'],
    secondaryTargets: ['=', '<', '>', '>=', '<=', '!='],
    hasInput: true,
    nested: true
  }, {
    cmd: 'WHILE',
    targets: ['IP', 'EP', 'AM', 'REPLICANTI', 'RG', 'TT'],
    secondaryTargets: ['=', '<', '>', '>=', '<=', '!='],
    hasInput: true,
    nested: true
  }, {
    cmd: 'GOTO',
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
    cmd: 'CHANGE',
    targets: ['IP-autobuyer', 'EP-autobuyer'],
    hasInput: true
  }, {
    cmd: 'RESPEC'
  }, {
    cmd: 'ETERNITY'
  }, {
    cmd: 'STOP'
  }, {
    cmd: 'LOAD',
    hasInput: true
  }, {
    cmd: 'BLOCK',
    getTargets: () => [], // TODO
    targets: []
  },

]


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

      if (block.nested) b.nest = []
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