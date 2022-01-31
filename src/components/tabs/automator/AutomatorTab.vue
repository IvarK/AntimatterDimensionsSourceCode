<script>
import AutomatorEditor from "./AutomatorEditor";
import AutomatorPointsList from "./AutomatorPointsList";
import AutomatorDocs from "./AutomatorDocs";

export default {
  name: "AutomatorTab",
  components: {
    AutomatorEditor,
    AutomatorPointsList,
    AutomatorDocs
  },
  data() {
    return {
      automatorUnlocked: false,
      interval: 0,
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
        ? `The Automator is running at max speed (${formatInt(1000)} commands per real-time second).`
        : `The Automator is running ${quantify("command", 1000 / this.interval, 2, 2)} per real-time second.
          ${speedupText}`;
    }
  },
  methods: {
    update() {
      this.automatorUnlocked = Player.automatorUnlocked;
      this.interval = AutomatorBackend.currentInterval;
    }
  }
};
</script>

<template>
  <div
    :class="tabClass"
    class="c-automator-tab l-automator-tab"
  >
    <div v-if="automatorUnlocked">
      <div class="c-automator-tab__interval-info">
        {{ intervalText }}
      </div>
      At higher speeds, certain commands may take too long to execute while still maintaining this speed,
      <br>
      in which case the next command will be immediately processed after the slower command is run.
      <br>
      The Automator autosaves with every change, but is not stored in the save file until the game is saved normally.
      <split-pane
        :min-percent="40"
        :default-percent="50"
        split="vertical"
        class="_-automator-split-pane-fix"
      >
        <AutomatorEditor slot="paneL" />
        <AutomatorDocs slot="paneR" />
      </split-pane>
    </div>
    <AutomatorPointsList v-else />
  </div>
</template>

<style scoped>

</style>
