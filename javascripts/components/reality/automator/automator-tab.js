"use strict";

Vue.component("automator-tab", {
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
    tabClass() {
      if (!this.fullScreen) return undefined;
      return ["c-automator-tab--full-screen", "l-automator-tab--full-screen"];
    },
    fullScreenIconClass() {
      return this.fullScreen ? "fa-compress-arrows-alt" : "fa-expand-arrows-alt";
    }
  },
  template: `
    <div :class="tabClass" class="c-automator-tab l-automator-tab" >
      <split-pane :min-percent="20" :default-percent="50" split="vertical" class="_-automator-split-pane-fix">
        <automator-editor slot="paneL" />
        <automator-docs slot="paneR" />
      </split-pane>
    </div>`
});
