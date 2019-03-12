Vue.component("automator-tab", {
  template:
    `<div class="c-automator l-automator l-automator-tab__automator">
      <split-pane :min-percent="20" :default-percent="40" split="vertical" class="_-automator-split-pane-fix">
        <automator-editor slot="paneL" />
        <automator-docs slot="paneR" />
      </split-pane>
    </div>`
});