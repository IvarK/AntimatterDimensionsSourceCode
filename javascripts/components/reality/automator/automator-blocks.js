Vue.component("automator-blocks", {
  computed: {
    getBlocks() {
      return ['WAIT', 'BUY', 'IF'] // TODO
    }
  },
  template:
    `<div class="c-automator-docs">
      <draggable 
        :list="getBlocks"
        :sort="false"
        :group="{ name: 'blocks', pull: 'clone', put: false }">
        <div v-for="block in getBlocks" :key="block"> {{ block }}</div>
      </draggable>
    </div>`
});