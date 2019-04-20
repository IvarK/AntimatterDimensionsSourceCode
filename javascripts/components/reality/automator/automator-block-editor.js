Vue.component("automator-block-editor", {
  data() {
    return {
      lines: []
    }
  },
  computed: {
    lineNumbersCount() {
      return Math.max(this.lines.length, 1);
    }
  },
  updated() {
    
  },
  methods: {
    updateBlock(block, id) {
      this.lines[this.lines.findIndex( x => x.id == id)] = block
      console.log(this.lines)
    },
    deleteBlock(id) {
      let idx = this.lines.findIndex( x => x.id == id)
      this.lines.splice(idx, 1)
    }
  },
  template:
    `<div class="c-automator-block-editor l-automator-editor">
      <draggable v-model="lines" group="code-blocks" class="c-automator-blocks">
        <automator-single-block 
          v-for="(block, index) in lines" 
          :key="block.id"
          :lineNumber="index"
          :block="block"
          :updateBlock="updateBlock"
          :deleteBlock="deleteBlock"></automator-single-block>
      </draggable>
    </div>`
});