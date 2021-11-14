"use strict";

Vue.component("automator-docs", {
  data() {
    return {
      infoPaneID: -1,
      isBlockAutomator: false,
      errorCount: 0,
      editingName: false,
      scripts: [],
      runningScriptID: 0,
      isRunning: false,
      isPaused: false
    };
  },
  created() {
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.onGameLoad(), this);
    EventHub.ui.on(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad(), this);
    this.updateCurrentScriptID();
    this.updateScriptList();
  },
  destroyed() {
    this.fullScreen = false;
  },
  watch: {
    infoPaneID(newValue) {
      AutomatorData.currentInfoPane = newValue;
    }
  },
  computed: {
    command() {
      return GameDatabase.reality.automator.commands[this.infoPaneID];
    },
    fullScreen: {
      get() {
        return this.$viewModel.tabs.reality.automator.fullScreen;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.fullScreen = value;
        AutomatorData.isEditorFullscreen = value;
      }
    },
    fullScreenIconClass() {
      return this.fullScreen ? "fa-compress-arrows-alt" : "fa-expand-arrows-alt";
    },
    fullScreenTooltip() {
      return this.fullScreen ? "Exit full screen" : "Expand to full screen";
    },
    errorTooltip() {
      return `Your script has ${quantify("error", this.errorCount)}`;
    },
    currentScriptID: {
      get() {
        return this.$viewModel.tabs.reality.automator.editorScriptID;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.editorScriptID = value;
        EventHub.dispatch(GAME_EVENT.AUTOMATOR_SAVE_CHANGED);
        if (AutomatorTextUI.editor) AutomatorTextUI.editor.performLint();
      }
    },
    currentScriptContent() {
      return player.reality.automator.scripts[this.currentScriptID].content;
    },
    currentScript() {
      return CodeMirror.Doc(this.currentScriptContent, "automato").getValue();
    },
    docStyle() {
      return {
        "color": this.infoPaneID === -1 ? "green" : ""
      };
    },
    logStyle() {
      return {
        "color": this.infoPaneID === -3 ? "green" : ""
      };
    },
    errorStyle() {
      const errorlessColor = this.infoPaneID === -2 ? "green" : "";
      return {
        "color": this.errorCount === 0 ? errorlessColor : "red"
      };
    }
  },
  methods: {
    update() {
      this.infoPaneID = AutomatorData.currentInfoPane;
      this.isBlockAutomator = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
      this.errorCount = AutomatorData.currentErrors().length;
      this.runningScriptID = AutomatorBackend.state.topLevelScript;
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !AutomatorBackend.isRunning;
    },
    changeCommand(event) {
      this.infoPaneID = event;
    },
    exportScript() {
      // Cut off leading and trailing whitespace
      const trimmed = AutomatorData.currentScriptText().replace(/^\s*(.*?)\s*$/u, "$1");
      if (trimmed.length === 0) {
        GameUI.notify.error("Could not export blank Automator script!");
      } else {
        // Append the script name into the beginning of the string as "name_length||name||"
        const name = AutomatorData.currentScriptName();
        copyToClipboard(GameSaveSerializer.encodeText(
          `${name.length}||${name}||${trimmed}`, "automator script"));
        GameUI.notify.info("Exported current Automator script to your clipboard");
      }
    },
    importScript() {
      Modal.importScript.show();
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
      this.$nextTick(() => BlockAutomator.fromText(this.currentScript));
    },
    rename() {
      this.editingName = true;
      this.$nextTick(() => {
        this.$refs.renameInput.value = player.reality.automator.scripts[this.currentScriptID].name;
        this.$refs.renameInput.focus();
      });
    },
    selectedScriptAttribute(id) {
      return `${id}` === `${this.currentScriptID}` ? { selected: "selected" } : {};
    },
    createNewScript() {
      const newScript = AutomatorBackend.newScript();
      player.reality.automator.state.editorScript = newScript.id;
      this.updateCurrentScriptID();
      this.rename();
    },
    deleteScript() {
      Modal.automatorScriptDelete.show({ scriptID: this.currentScriptID });
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
      if (`${script.id}` === `${this.runningScriptID}`) {
        if (this.isRunning) label += " (Running)";
        else if (this.isPaused) label += " (Paused)";
      }
      return label;
    },
  },
  template: `
    <div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls" >
        <automator-button
          :style="docStyle"
          class="fa-list"
          @click="infoPaneID = -1"
          v-tooltip="'Command list'"
        />
        <automator-button
          v-if="isBlockAutomator"
          class="fa-cubes"
          @click="infoPaneID = -4"
          v-tooltip="'Command menu for Block editor mode'"
        />
        <automator-button
          :style="errorStyle"
          class="fa-exclamation-triangle"
          @click="infoPaneID = -2"
          v-tooltip="errorTooltip"
        />
        <automator-button
          :style="logStyle"
          class="fa-eye"
          @click="infoPaneID = -3"
          v-tooltip="'View recently executed commands'"
        />
        <automator-button
          class="fa-file-export"
          @click="exportScript"
          v-tooltip="'Export automator script'"
        />
        <automator-button
          class="fa-file-import"
          @click="importScript"
          v-tooltip="'Import automator script'"
        />
        <div class="l-automator__script-names">
          <template v-if="!editingName">
            <select
              class="l-automator__scripts-dropdown"
              @input="onScriptDropdown"
            >
              <option
                v-for="script in scripts"
                v-bind="selectedScriptAttribute(script.id)"
                :value="script.id"
              >
                {{ dropdownLabel(script) }}
              </option>
              <option value="createNewScript">Create new...</option>
            </select>
            <automator-button
              class="far fa-edit"
              @click="rename"
              v-tooltip="'Rename script'"
            />
          </template>
          <input
            v-else
            ref="renameInput"
            class="l-automator__rename-input"
            @blur="nameEdited"
            @keyup.enter="$refs.renameInput.blur()"
          />
        </div>
        <automator-button
          class="fas fa-trash"
          @click="deleteScript"
          v-tooltip="'Delete this script'"
        />
        <automator-button
          :class="fullScreenIconClass"
          @click="fullScreen = !fullScreen"
          v-tooltip="fullScreenTooltip"
        />
      </div>
      <div class="c-automator-docs l-automator-pane__content">
        <automator-docs-main-page
          v-if="infoPaneID === -1"
          @select="changeCommand"
        />
        <automator-error-page v-else-if="infoPaneID === -2" />
        <automator-event-log v-else-if="infoPaneID === -3" />
        <automator-blocks v-else-if="infoPaneID === -4" />
        <automator-man-page v-else :command="command" />
      </div>
    </div>`
});
