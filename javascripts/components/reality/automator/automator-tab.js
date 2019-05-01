"use strict";

Vue.component("automator-tab", {
  template:
    `<div class="c-automator l-automator l-automator-tab__automator">
      <split-pane :min-percent="20" :default-percent="40" split="vertical" class="_-automator-split-pane-fix" v-if="true">
        <automator-editor slot="paneL" />
        <automator-docs slot="paneR" />
      </split-pane>

      <automator-block-tab v-else />
    </div>`
});