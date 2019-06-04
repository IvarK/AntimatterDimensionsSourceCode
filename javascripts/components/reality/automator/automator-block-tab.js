"use strict";

Vue.component("automator-block-tab", {
  data: function() {
    return {
      lines: []
    }
  },
  methods: {
    update() {
      //console.log(this.lines.length)
    },
    updateBlocks(lines) {
      this.lines = lines;
    }
  },
  template:
  // TODO: fix css classes - they were adjusted for text editor tab
    `<div class="c-automator l-automator l-automator-tab">
      <split-pane :min-percent="20" :default-percent="80" split="vertical" class="_-automator-split-pane-fix">
        <automator-block-editor slot="paneL"/>
        <automator-blocks slot="paneR"/>
      </split-pane>
    </div>`
});
