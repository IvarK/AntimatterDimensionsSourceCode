"use strict";

Vue.component("automator-tab", {
  data() {
    return {
      automatorUnlocked: false,
      interval: 0
    };
  },
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
    },
    intervalText() {
      return this.interval === 1 
        ? `The automator is running ${(1000 / this.interval).toFixed(2)} 
          commands per second, each reality makes it run 0.6% faster`
        : `The automator is running ${(1000 / this.interval).toFixed(2)} commands per second`;
    }
  },
  methods: {
    update() {
      this.automatorUnlocked = player.realities > 4;
      this.interval = AutomatorBackend.currentInterval;
    }
  },
  template: `
    <div :class="tabClass" class="c-automator-tab l-automator-tab" >
      <div v-if="automatorUnlocked">
        <div class="c-automator-tab__interval-info">{{ intervalText }}</div>
        <split-pane 
          :min-percent="20" 
          :default-percent="50" 
          split="vertical" 
          class="_-automator-split-pane-fix" >
          <automator-editor slot="paneL" />
          <automator-docs slot="paneR" />
        </split-pane>
      </div>
      <div v-else>You need 5 Realities to unlock the Automator.</div>
    </div>`
});
