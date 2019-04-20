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
    log() {
      console.log(this.lines)
    }
  },
  template:
    `<div class="c-automator-editor l-automator-editor">
      <div class="l-automator-editor__line-numbers" aria-hidden="true">
        <div class="o-automator-line-number--sizer">999</div>
      </div>
      <draggable :list="lines" group="blocks" class="c-automator-blocks">
        <div v-for="block in lines"> {{ block.cmd }}</div>
        <button slot="header" style="height: 30px" @click="log">You have {{ lines.length }} lines</button>
      </draggable>
    </div>`
});