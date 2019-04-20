Vue.component("automator-blocks", {
  data() {
    return {
      blocks: [
        { 
          cmd: 'WAIT' 
        } , { 
          cmd: 'BUY' 
        }, {
          cmd: 'IF' 
        }
      ]
    }
  },
  methods: {
    log() {
      console.log(this.blocks)
    }
  },
  template:
    `<div class="c-automator-docs">
      <draggable 
        v-model="blocks"
        :sort="false"
        :group="{ name: 'blocks', pull: 'clone', revertClone: true, put: false }"
        :move="log">
        <div v-for="(block, index) in blocks" :key="index"> {{ block.cmd }}</div>
      </draggable>
    </div>`
});