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
      const speedupText = `Each Reality makes it run ${formatPercents(0.006, 1)} faster, up to a maximum of
        ${formatInt(1000)} per second.`;
      return this.interval === 1
        ? `The automator is running at max speed (${formatInt(1000)} commands per second).`
        : `The automator is running ${format(1000 / this.interval, 2, 2)} commands per second. ${speedupText}`;
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
          :min-percent="40"
          :default-percent="50"
          split="vertical"
          class="_-automator-split-pane-fix" >
          <automator-editor slot="paneL" />
          <automator-docs slot="paneR" />
        </split-pane>
      </div>
      <div style="font-size: 30px" v-else>You need {{formatInt(5)}} Realities to unlock the Automator.</div>
    </div>`
});
