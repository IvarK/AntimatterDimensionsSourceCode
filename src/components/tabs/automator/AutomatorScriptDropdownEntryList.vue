<script>
export default {
  name: "AutomatorScriptDropdownEntryList",
  data() {
    return {
      currentScriptID: 0,
      runningScriptID: 0,
      isRunning: false,
      isPaused: false
    };
  },
  computed: {
    scripts() {
      return Object.values(player.reality.automator.scripts).map(script => ({
        id: script.id,
        name: script.name,
      }));
    },
    currentScriptContent() {
      return player.reality.automator.scripts[this.currentScriptID].content;
    },
    currentScript() {
      return CodeMirror.Doc(this.currentScriptContent, "automato").getValue();
    },
  },
  created() {
    this.currentScriptID = player.reality.automator.state.editorScript;
  },
  methods: {
    update() {
      this.runningScriptID = AutomatorBackend.state.topLevelScript;
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !AutomatorBackend.isRunning;
    },
    changeScriptID(newID) {
      this.currentScriptID = newID;
      player.reality.automator.state.editorScript = newID;
      this.updateCurrentScriptID();
    },
    createNewScript() {
      // This does nothing right now, will be fixed during rebase after automato branch is merged
      // this.$parent.rename();
      this.$parent.openRequest = false;
    },
    updateCurrentScriptID() {
      const storedScripts = player.reality.automator.scripts;
      this.currentScriptID = player.reality.automator.state.editorScript;
      // This shouldn't happen if things are loaded in the right order, but might as well be sure.
      if (storedScripts[this.currentScriptID] === undefined) {
        this.currentScriptID = Number(Object.keys(storedScripts)[0]);
        player.reality.automator.state.editorScript = this.currentScriptID;
      }
      if (this.isBlock && !AutomatorGrammar.blockifyTextAutomator(this.currentScript)) {
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
        Modal.message.show("Automator script has errors, cannot view in blocks.");
      }
      this.$nextTick(() => BlockAutomator.fromText(this.currentScript));
      this.$parent.openRequest = false;
    },
    dropdownLabel(script) {
      let label = script.name;
      if (script.id === this.runningScriptID) {
        if (this.isRunning) label += " (Running)";
        else if (this.isPaused) label += " (Paused)";
      }
      return label;
    },
    labelClassObject(id) {
      const highlightRunning = this.isRunning || this.isPaused;
      return {
        "c-automator-docs-script-select": true,
        "l-active-script": id === this.runningScriptID && highlightRunning,
        "l-selected-script": id === this.currentScriptID && (id !== this.runningScriptID || !highlightRunning),
      };
    }
  }
};
</script>

<template>
  <div>
    <div
      v-for="script in scripts"
      :key="script.id"
      :class="labelClassObject(script.id)"
      @click="changeScriptID(script.id)"
    >
      {{ dropdownLabel(script) }}
    </div>
    <div
      class="c-automator-docs-script-select"
      @click="createNewScript()"
    >
      New Script
    </div>
  </div>
</template>

<style scoped>
.l-active-script {
  background-color: var(--color-automator-controls-active);
}

.l-selected-script {
  background-color: var(--color-automator-active-line-background);
}
</style>
