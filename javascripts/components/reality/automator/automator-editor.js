"use strict";

Vue.component("automator-editor", {
  data() {
    return {
      activeLine: 0,
      isRunning: false,
      isPaused: false,
      editingName: false,
      runningScriptID: 0,
      scripts: [],
    };
  },
  computed: {
    fullScreen() {
      return this.$viewModel.tabs.reality.automator.fullScreen;
    },
    currentScriptID: {
      get() {
        return this.$viewModel.tabs.reality.automator.editorScriptID;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.editorScriptID = value;
      }
    },
    mode: {
      get() {
        return this.$viewModel.tabs.reality.automator.mode;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.mode = value;
      }
    },
    playTooltip() {
      if (this.isRunning) return undefined;
      if (this.isPaused) return "Resume automator execution";
      return "Start automator";
    },
    modeIconClass() { return this.mode ? "fa-cubes" : "fa-code"; },
  },
  methods: {
    update() {
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !this.isRunning;
      this.runningScriptID = AutomatorBackend.state.topLevelScript;
      if (AutomatorBackend.state.topLevelScript !== this.currentScriptID || !AutomatorBackend.isOn) {
        this.activeLine = 0;
        return;
      }
      this.activeLine = AutomatorBackend.stack.top.lineNumber;
    },
    onGameLoad() {
      this.updateCurrentScriptID();
      this.updateScriptList();
    },
    updateScriptList() {
      this.scripts = Object.values(player.reality.automator.scripts).map(script => ({
        id: script.id,
        name: script.name,
      }));
    },
    updateCurrentScriptID() {
      const storedScripts = player.reality.automator.scripts;
      this.currentScriptID = player.reality.automator.state.editorScript;
      // This shouldn't happen if things are loaded in the right order, but might as well be sure.
      if (storedScripts[this.currentScriptID] === undefined) {
        this.currentScriptID = Object.keys(storedScripts)[0];
        player.reality.automator.state.editorScript = this.currentScriptID;
      }
    },
    rename() {
      this.editingName = true;
      this.$nextTick(() => {
        this.$refs.renameInput.value = player.reality.automator.scripts[this.currentScriptID].name;
        this.$refs.renameInput.focus();
      });
    },
    selectedScriptAttribute(id) {
      return id === this.currentScriptID ? { selected: "selected" } : {};
    },
    createNewScript() {
      AutomatorBackend.newScript();
      this.rename();
    },
    deleteScript() {
      if (!confirm("Permanently and irrevocably delete script?")) return;
      const scriptID = this.currentScriptID;
      AutomatorBackend.deleteScript(scriptID);
      this.updateScriptList();
      // If a script is running, select that one
      if (AutomatorBackend.isOn && this.runningScriptID !== scriptID) {
        player.reality.automator.state.editorScript = this.runningScriptID;
      } else {
        // AutomatorBackend.deleteScript will create an empty script if necessary
        player.reality.automator.state.editorScript = this.scripts[0].id;
      }
      this.updateCurrentScriptID();
    },
    onScriptDropdown(event) {
      const menu = event.target;
      if (menu.selectedIndex === menu.length - 1) this.createNewScript();
      else player.reality.automator.state.editorScript = this.scripts[menu.selectedIndex].id;
      this.updateCurrentScriptID();
    },
    nameEdited() {
      // Trim off leading and trailing whitespace
      const trimmed = this.$refs.renameInput.value.match(/^\s*(.*?)\s*$/u);
      if (trimmed.length === 2 && trimmed[1].length > 0) {
        player.reality.automator.scripts[this.currentScriptID].name = trimmed[1];
        this.updateScriptList();
      }
      this.$nextTick(() => this.editingName = false);
    },
    dropdownLabel(script) {
      let label = script.name;
      if (script.id === this.runningScriptID) {
        if (this.isRunning) label += " (Running)";
        else if (this.isPaused) label += " (Paused)";
      }
      return label;
    },
    parseTextFromBlocks() {
      const content = BlockAutomator.parseLines(BlockAutomator.lines).join("\n");
      const automatorID = ui.view.tabs.reality.automator.editorScriptID;
      AutomatorBackend.saveScript(automatorID, content);
      AutomatorTextUI.documents[automatorID].setValue(content);
      setTimeout(() => AutomatorTextUI.editor.refresh(), 10);
    },
    toggleAutomatorMode() {
      this.mode = !this.mode;
      // Switched to text
      if (this.mode) { 
        this.parseTextFromBlocks();
      } else if (!AutomatorGrammar.blockifyTextAutomator()) {
        this.mode = !this.mode;
        alert("Automator script has errors, cannot convert to blocks.");
      }
    }
  },
  created() {
    EventHub.ui.on(GameEvent.GAME_LOAD, () => this.onGameLoad(), this);
    this.updateCurrentScriptID();
    this.updateScriptList();
  },
  beforeDestroy() {
    EventHub.ui.offAll(this);
  },
  template:
    `<div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
        <automator-controls @automatorplay="parseTextFromBlocks()"/>
        <div class="l-automator__script-names">
          <template v-if="!editingName">
            <select class="l-automator__scripts-dropdown"
                    @input="onScriptDropdown">
              <option v-for="script in scripts"
                      v-bind="selectedScriptAttribute(script.id)"
                      :value="script.id">{{dropdownLabel(script)}}</option>
              <option value="createNewScript">Create new...</option>
            </select>
            <automator-button class="far fa-edit" @click="rename"
                      v-tooltip="'Rename script'"/>
          </template>
          <input v-else ref="renameInput"
                        class="l-automator__rename-input"
                        @blur="nameEdited"
                        @keyup.enter="$refs.renameInput.blur()"/>
        </div>
          <automator-button class="fas fa-trash"
          @click="deleteScript"
          v-tooltip="'Delete this script'"/>

          <automator-button
          :class="modeIconClass"
          @click="toggleAutomatorMode()"
          />
      </div>
      <automator-text-editor :currentScriptID="currentScriptID"
                             :activeLine="activeLine"
                             v-show="mode"/>
      <automator-block-editor v-show="!mode"/>
    </div>`
});
