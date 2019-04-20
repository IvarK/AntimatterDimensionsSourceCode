const automator_blocks = [
  { 
    id: 0,
    cmd: 'WAIT',
    targets: ['IP', 'EP', 'AM', 'TIME'],
    hasInput: true
  } , { 
    id: 1,
    cmd: 'BUY' 
  }, {
    id: 2,
    cmd: 'IF' 
  }
]


Vue.component("automator-blocks", {
  data() {
    return {
      blocks: automator_blocks
    }
  },
  template:
    `<div class="c-automator-docs">
      <draggable 
        :list="blocks"
        :group="{ name: 'code-blocks', pull: 'clone', put: false }"
        :sort="false"
        class="c-automator-command-list">
        <div v-for="block in blocks" :key="block.id" class="o-automator-command"> {{ block.cmd }}</div>
      </draggable>
    </div>`
});