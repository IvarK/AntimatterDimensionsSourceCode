<script>
import { AUTOMATOR_TYPE } from "@/core/automator/automator-backend";
import AutomatorBlocks from "./AutomatorBlocks";
import AutomatorButton from "./AutomatorButton";
import AutomatorDataTransferPage from "./AutomatorDataTransferPage";
import AutomatorDefinePage from "./AutomatorDefinePage";
import AutomatorDocsCommandList from "./AutomatorDocsCommandList";
import AutomatorDocsIntroPage from "./AutomatorDocsIntroPage";
import AutomatorDocsTemplateList from "./AutomatorDocsTemplateList";
import AutomatorErrorPage from "./AutomatorErrorPage";
import AutomatorEventLog from "./AutomatorEventLog";
import AutomatorScriptDropdownEntryList from "./AutomatorScriptDropdownEntryList";
import ExpandingControlBox from "@/components/ExpandingControlBox";

export const AutomatorPanels = {
  INTRO_PAGE: 0,
  COMMANDS: 1,
  ERRORS: 2,
  EVENTS: 3,
  DATA_TRANSFER: 4,
  CONSTANTS: 5,
  TEMPLATES: 6,
  BLOCKS: 7
};

export default {
  name: "AutomatorDocs",
  components: {
    AutomatorButton,
    AutomatorDocsCommandList,
    AutomatorErrorPage,
    AutomatorEventLog,
    AutomatorDataTransferPage,
    AutomatorBlocks,
    AutomatorDocsIntroPage,
    AutomatorDocsTemplateList,
    AutomatorDefinePage,
    AutomatorScriptDropdownEntryList,
    ExpandingControlBox,
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
      totalChars: 0,
      scriptCount: 0,
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
      return this.canMakeNewScript
        ? "Import single automator script or data"
        : "You have too many scripts to import another!";
    },
    currentEditorScriptName() {
      return this.scripts.find(s => s.id === this.currentScriptID).name;
    },
  },
  watch: {
    infoPaneID(newValue) {
      player.reality.automator.currentInfoPane = newValue;
    }
  },
  created() {
    this.on$(GAME_EVENT.GAME_LOAD, () => this.onGameLoad());
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad());
    this.on$(GAME_EVENT.AUTOMATOR_TYPE_CHANGED, () => this.openMatchingAutomatorTypeDocs());
    this.onGameLoad();
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
      this.totalChars = AutomatorData.totalScriptCharacters();
      this.scriptCount = Object.keys(player.reality.automator.scripts).length;
      this.canMakeNewScript = this.scriptCount < this.maxScriptCount;
      this.currentScriptID = player.reality.automator.state.editorScript;
    },
    exportScript() {
      const toExport = AutomatorBackend.exportCurrentScriptContents();
      if (toExport) {
        copyToClipboard(toExport);
        GameUI.notify.automator("Exported current Automator script to your clipboard");
      } else {
        GameUI.notify.error("Could not export blank Automator script!");
      }
    },
    importScript() {
      if (!this.canMakeNewScript) return;
      Modal.importScriptData.show();
    },
    onGameLoad() {
      this.updateCurrentScriptID();
      this.updateScriptList();
      this.fixAutomatorTypeDocs();
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
        AutomatorData.clearUndoData();
      }

      // This gets checked whenever the editor pane is foricibly changed to a different script, which may or may not
      // have block-parsable commands. It additionally also gets checked on new script creation, where we need to
      // suppress the error modal instead
      if (this.isBlock && BlockAutomator.hasUnparsableCommands(this.currentScript) && this.currentScript !== "") {
        AutomatorBackend.changeModes(this.currentScriptID);
        Modal.message.show("Some script commands were unrecognizable - defaulting to text editor.");
      }

      this.$nextTick(() => {
        BlockAutomator.updateEditor(this.currentScript);
        if (!this.isBlock && AutomatorTextUI.editor) AutomatorTextUI.editor.performLint();
      });
    },
    fixAutomatorTypeDocs() {
      const automator = player.reality.automator;
      if (automator.currentInfoPane === AutomatorPanels.COMMANDS && automator.type === AUTOMATOR_TYPE.BLOCK) {
        this.openMatchingAutomatorTypeDocs();
      }
      if (automator.currentInfoPane === AutomatorPanels.BLOCKS && automator.type === AUTOMATOR_TYPE.TEXT) {
        this.openMatchingAutomatorTypeDocs();
      }
    },
    openMatchingAutomatorTypeDocs() {
      const automator = player.reality.automator;
      automator.currentInfoPane = automator.type === AUTOMATOR_TYPE.BLOCK
        ? AutomatorPanels.BLOCKS
        : AutomatorPanels.COMMANDS;
    },
    rename() {
      this.editingName = true;
      this.$nextTick(() => {
        this.updateCurrentScriptID();
        this.$refs.renameInput.value = player.reality.automator.scripts[this.currentScriptID].name;
        this.$refs.renameInput.focus();
      });
    },
    deleteScript() {
      Modal.automatorScriptDelete.show({ scriptID: this.currentScriptID });
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
          v-tooltip="'Automator Introduction'"
          class="fa-circle-info"
          :class="activePanelClass(panelEnum.INTRO_PAGE)"
          @click="infoPaneID = panelEnum.INTRO_PAGE"
        />
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
          v-tooltip="'Extended Data Transfer'"
          class="fa-window-restore"
          :class="activePanelClass(panelEnum.DATA_TRANSFER)"
          @click="infoPaneID = panelEnum.DATA_TRANSFER"
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
          v-tooltip="'Export single automator script'"
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
            <ExpandingControlBox
              class="l-automator__scripts-dropdown"
              :auto-close="true"
            >
              <template #header>
                <div class="c-automator-docs-script-select">
                  ▼ Current Script: {{ currentEditorScriptName }}
                </div>
              </template>
              <template #dropdown>
                <AutomatorScriptDropdownEntryList :key="scriptCount" />
              </template>
            </ExpandingControlBox>
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
      <AutomatorDocsIntroPage v-if="infoPaneID === panelEnum.INTRO_PAGE" />
      <AutomatorDocsCommandList v-else-if="infoPaneID === panelEnum.COMMANDS" />
      <AutomatorErrorPage v-else-if="infoPaneID === panelEnum.ERRORS" />
      <AutomatorEventLog v-else-if="infoPaneID === panelEnum.EVENTS" />
      <AutomatorDataTransferPage v-else-if="infoPaneID === panelEnum.DATA_TRANSFER" />
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
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.l-automator__scripts-dropdown {
  width: 100%;
  margin: 0.4rem;
  user-select: none;
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
  font-family: Typewriter;
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
  cursor: auto;
}

.c-long-name-box {
  background-color: var(--color-automator-error-background);
  border-color: var(--color-automator-error-outline);
}
</style>
