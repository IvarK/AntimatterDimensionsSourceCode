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
    updateBlock(block, idx) {
      this.lines[idx] = block
      console.log(this.lines)
    }
  },
  template:
    `<div class="c-automator-block-editor l-automator-editor">
      <div class="l-automator-editor__line-numbers" aria-hidden="true">
        <div class="o-automator-line-number--sizer">999</div>
      </div>
      <draggable :list="lines" group="code-blocks" class="c-automator-blocks" :sortable="true">
        <automator-single-block 
          v-for="(block, index) in lines" 
          :key="index" 
          :idx="index"
          :block="block"
          :updateBlock="updateBlock"></automator-single-block>
      </draggable>
    </div>`
});