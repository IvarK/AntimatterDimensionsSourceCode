<script>
import AutomatorBlocks from "./AutomatorBlocks";
import AutomatorButton from "./AutomatorButton";
import AutomatorDefinePage from "./AutomatorDefinePage";
import AutomatorDocsCommandList from "./AutomatorDocsCommandList";
import AutomatorDocsTemplateList from "./AutomatorDocsTemplateList";
import AutomatorErrorPage from "./AutomatorErrorPage";
import AutomatorEventLog from "./AutomatorEventLog";

export const AutomatorPanels = {
  COMMANDS: 1,
  ERRORS: 2,
  EVENTS: 3,
  CONSTANTS: 4,
  TEMPLATES: 5,
  BLOCKS: 6
};

export default {
  name: "AutomatorDocs",
  components: {
    AutomatorButton,
    AutomatorDocsCommandList,
    AutomatorErrorPage,
    AutomatorEventLog,
    AutomatorBlocks,
    AutomatorDocsTemplateList,
    AutomatorDefinePage,
  },
  data() {
    return {
      isBlock: false,
      infoPaneID: 1,
      errorCount: 0,
      editingName: false,
      isNameTooLong: false,
      scripts: [],
      runningScriptID: 0,
      isRunning: false,
      isPaused: false,
      totalChars: 0,
      canMakeNewScript: true
    };
  },
  computed: {
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
    nameTooltip() {
      return this.isNameTooLong
        ? `Names cannot be longer than ${formatInt(AutomatorData.MAX_ALLOWED_SCRIPT_NAME_LENGTH)} characters!`
        : "";
    },
    currentScriptID: {
      get() {
        return this.$viewModel.tabs.reality.automator.editorScriptID;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.editorScriptID = value;
        if (AutomatorTextUI.editor) AutomatorTextUI.editor.performLint();
      }
    },
    currentScriptContent() {
      return player.reality.automator.scripts[this.currentScriptID].content;
    },
    currentScript() {
      return CodeMirror.Doc(this.currentScriptContent, "automato").getValue();
    },
    errorStyle() {
      return {
        "background-color": this.errorCount === 0 ? "" : "red"
      };
    },
    maxTotalChars() {
      return AutomatorData.MAX_ALLOWED_TOTAL_CHARACTERS;
    },
    maxScriptCount() {
      return AutomatorData.MAX_ALLOWED_SCRIPT_COUNT;
    },
    panelEnum() {
      return AutomatorPanels;
    },
    importTooltip() {
      return this.canMakeNewScript ? "Import automator script" : "You have too many scripts to import another!";
    }
  },
  watch: {
    infoPaneID(newValue) {
      player.reality.automator.currentInfoPane = newValue;
    }
  },
  created() {
    this.on$(GAME_EVENT.GAME_LOAD, () => this.onGameLoad());
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad());
    this.updateCurrentScriptID();
    this.updateScriptList();
  },
  destroyed() {
    this.fullScreen = false;
  },
  methods: {
    update() {
      this.isBlock = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
      this.infoPaneID = player.reality.automator.currentInfoPane;
      this.errorCount = AutomatorData.currentErrors().length;
      this.runningScriptID = AutomatorBackend.state.topLevelScript;
      this.isRunning = AutomatorBackend.isRunning;
      this.isPaused = AutomatorBackend.isOn && !AutomatorBackend.isRunning;
      this.totalChars = AutomatorData.totalScriptCharacters();
      this.canMakeNewScript = Object.keys(player.reality.automator.scripts).length < this.maxScriptCount;
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
      if (!this.canMakeNewScript) return;
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
      AutomatorData.recalculateErrors();
      const storedScripts = player.reality.automator.scripts;
      this.currentScriptID = player.reality.automator.state.editorScript;
      // This shouldn't happen if things are loaded in the right order, but might as well be sure.
      if (storedScripts[this.currentScriptID] === undefined) {
        this.currentScriptID = Number(Object.keys(storedScripts)[0]);
        player.reality.automator.state.editorScript = this.currentScriptID;
      }

      // This gets checked whenever the editor pane is foricibly changed to a different script, which may or may not
      // have block-parsable commands. It additionally also gets checked on new script creation, where we need to
      // suppress the error modal instead
      if (this.isBlock && BlockAutomator.hasUnparsableCommands(this.currentScript) && this.currentScript !== "") {
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
        Modal.message.show("Some script commands were unrecognizable - defaulting to text editor.");
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
      if (menu.selectedIndex === menu.length - 1 && this.canMakeNewScript) this.createNewScript();
      else player.reality.automator.state.editorScript = this.scripts[menu.selectedIndex].id;
      this.updateCurrentScriptID();
    },
    nameEdited() {
      // Trim off leading and trailing whitespace
      const trimmed = this.$refs.renameInput.value.match(/^\s*(.*?)\s*$/u);
      let newName = "";
      if (trimmed.length === 2 && trimmed[1].length > 0) newName = trimmed[1];

      if (newName.length > AutomatorData.MAX_ALLOWED_SCRIPT_NAME_LENGTH) {
        this.isNameTooLong = true;
        return;
      }
      this.isNameTooLong = false;
      player.reality.automator.scripts[this.currentScriptID].name = newName;
      this.updateScriptList();
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
    activePanelClass(id) {
      return {
        "c-automator__button--active": this.infoPaneID === id,
      };
    }
  }
};
</script>

<template>
  <div class="l-automator-pane">
    <div class="c-automator__controls l-automator__controls">
      <div class="l-automator-button-row">
        <AutomatorButton
          v-tooltip="'Scripting Information'"
          class="fa-list"
          :class="activePanelClass(panelEnum.COMMANDS)"
          @click="infoPaneID = panelEnum.COMMANDS"
        />
        <AutomatorButton
          v-tooltip="errorTooltip"
          :style="errorStyle"
          class="fa-exclamation-triangle"
          :class="activePanelClass(panelEnum.ERRORS)"
          @click="infoPaneID = panelEnum.ERRORS"
        />
        <AutomatorButton
          v-tooltip="'View recently executed commands'"
          class="fa-eye"
          :class="activePanelClass(panelEnum.EVENTS)"
          @click="infoPaneID = panelEnum.EVENTS"
        />
        <AutomatorButton
          v-tooltip="'Modify defined constants'"
          class="fa-book"
          :class="activePanelClass(panelEnum.CONSTANTS)"
          @click="infoPaneID = panelEnum.CONSTANTS"
        />
        <AutomatorButton
          v-tooltip="'Template Creator List'"
          class="fa-file-code"
          :class="activePanelClass(panelEnum.TEMPLATES)"
          @click="infoPaneID = panelEnum.TEMPLATES"
        />
        <AutomatorButton
          v-if="isBlock"
          v-tooltip="'Command menu for Block editor mode'"
          class="fa-cubes"
          :class="activePanelClass(panelEnum.BLOCKS)"
          @click="infoPaneID = panelEnum.BLOCKS"
        />
        <span
          v-if="fullScreen"
          class="c-automator__status-text c-automator__status-text--small"
          :class="{ 'c-automator__status-text--error' : totalChars > maxTotalChars }"
        >
          Across all scripts: {{ formatInt(totalChars) }}/{{ formatInt(maxTotalChars) }}
        </span>
        <AutomatorButton
          v-tooltip="fullScreenTooltip"
          :class="fullScreenIconClass"
          class="l-automator__expand-corner"
          @click="fullScreen = !fullScreen"
        />
      </div>
      <div class="l-automator-button-row">
        <AutomatorButton
          v-tooltip="'Export automator script'"
          class="fa-file-export"
          @click="exportScript"
        />
        <AutomatorButton
          v-tooltip="importTooltip"
          class="fa-file-import"
          :class="{ 'c-automator__status-text--error' : !canMakeNewScript }"
          @click="importScript"
        />
        <div class="l-automator__script-names">
          <template v-if="!editingName">
            <select
              class="l-automator__scripts-dropdown c-automator__scripts-dropdown"
              @input="onScriptDropdown"
            >
              <option
                v-for="script in scripts"
                :key="script.id"
                v-bind="selectedScriptAttribute(script.id)"
                :value="script.id"
              >
                {{ dropdownLabel(script) }}
              </option>
              <option
                value="createNewScript"
                :disabled="!canMakeNewScript"
              >
                {{ canMakeNewScript
                  ? "Create new script..."
                  : `You cannot have more than ${maxScriptCount} scripts!`
                }}
              </option>
            </select>
            <AutomatorButton
              v-tooltip="'Rename script'"
              class="far fa-edit"
              @click="rename"
            />
          </template>
          <input
            v-else
            ref="renameInput"
            v-tooltip="nameTooltip"
            class="l-automator__rename-input c-automator__rename-input"
            :class="{ 'c-long-name-box' : isNameTooLong }"
            @blur="nameEdited"
            @keyup.enter="$refs.renameInput.blur()"
          >
        </div>
        <AutomatorButton
          v-tooltip="'Delete this script'"
          class="fas fa-trash"
          @click="deleteScript"
        />
      </div>
    </div>
    <div class="c-automator-docs l-automator-pane__content">
      <AutomatorDocsCommandList v-if="infoPaneID === panelEnum.COMMANDS" />
      <AutomatorErrorPage v-else-if="infoPaneID === panelEnum.ERRORS" />
      <AutomatorEventLog v-else-if="infoPaneID === panelEnum.EVENTS" />
      <AutomatorDefinePage v-else-if="infoPaneID === panelEnum.CONSTANTS" />
      <AutomatorDocsTemplateList v-else-if="infoPaneID === panelEnum.TEMPLATES" />
      <AutomatorBlocks v-else-if="infoPaneID === panelEnum.BLOCKS" />
    </div>
  </div>
</template>

<style scoped>
.l-automator__expand-corner {
  position: absolute;
  right: 0;
}

.l-automator__script-names {
  display: flex;
  flex-direction: row;
  width: 50%;
  justify-content: space-evenly;
  align-items: center;
}

.l-automator__scripts-dropdown {
  width: 90%;
  height: calc(2rem + 1rem / 3 - var(--var-border-width, 0rem) * 2);
  border: var(--var-border-width, 0.2rem) solid var(--color-automator-controls-border);
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0.4rem;
}

.c-automator__scripts-dropdown {
  font-size: 1.2rem;
  color: var(--color-automator-docs-font);
  background-color: var(--color-automator-controls-inactive);
  cursor: pointer;
}

.l-automator__rename-input {
  width: 100%;
  height: calc(2rem + 1rem / 3 - var(--var-border-width, 0rem) * 2);
  border: var(--var-border-width, 0.2rem) solid var(--color-reality-light);
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0.4rem;
  padding: 0.4rem;
}

.c-automator__rename-input {
  font-size: 1.2rem;
  color: var(--color-automator-docs-font);
  background-color: var(--color-automator-controls-active);
}

.c-automator__button--active {
  background-color: var(--color-automator-controls-active);
  border-color: var(--color-reality-light);
}

.c-automator__status-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-reality);
  padding: 0 0.5rem;
}

.c-automator__status-text--small {
  font-size: 1.1rem;
}

.c-automator__status-text--error {
  color: var(--color-bad);
}

.c-long-name-box {
  background-color: var(--color-automator-error-background);
  border-color: var(--color-automator-error-outline);
}
</style>
