<script>
import SplitPane from "vue-splitpane";

import AutomatorDocs from "./AutomatorDocs";
import AutomatorEditor from "./AutomatorEditor";
import AutomatorPointsList from "./AutomatorPointsList";

export default {
  name: "AutomatorTab",
  components: {
    SplitPane,
    AutomatorEditor,
    AutomatorPointsList,
    AutomatorDocs
  },
  data() {
    return {
      automatorUnlocked: false,
      interval: 0,
      currentChars: 0,
      totalChars: 0,
      withinLimit: false,
    };
  },
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
    tabClass() {
      if (!this.fullScreen) return undefined;
      return "c-automator-tab--full-screen";
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
    },
    maxScriptChars() {
      return AutomatorData.MAX_ALLOWED_SCRIPT_CHARACTERS;
    },
    maxTotalChars() {
      return AutomatorData.MAX_ALLOWED_TOTAL_CHARACTERS;
    },
  },
  methods: {
    update() {
      this.automatorUnlocked = Player.automatorUnlocked;
      this.interval = AutomatorBackend.currentInterval;
      this.currentChars = AutomatorData.singleScriptCharacters();
      this.totalChars = AutomatorData.totalScriptCharacters();
      this.withinLimit = AutomatorData.isWithinLimit();
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
      <br>
      There are two character limits to reduce lag. If either is exceeded,
      <span :class="{ 'c-overlimit': !withinLimit }">
        changes to your scripts will not be saved!
      </span>
      <br>
      <span :class="{ 'c-overlimit': currentChars > maxScriptChars }">
        This script: {{ formatInt(currentChars) }} / {{ formatInt(maxScriptChars) }}
      </span>
      |
      <span :class="{ 'c-overlimit': totalChars > maxTotalChars }">
        Across all scripts: {{ formatInt(totalChars) }} / {{ formatInt(maxTotalChars) }}
      </span>
      <div class="c-automator-split-pane">
        <SplitPane
          :min-percent="40"
          :default-percent="50"
          split="vertical"
        >
          <template #paneL>
            <AutomatorEditor />
          </template>
          <template #paneR>
            <AutomatorDocs />
          </template>
        </SplitPane>
      </div>
    </div>
    <AutomatorPointsList v-else />
  </div>
</template>

<style scoped>
.c-overlimit {
  color: var(--color-bad);
}
</style>
