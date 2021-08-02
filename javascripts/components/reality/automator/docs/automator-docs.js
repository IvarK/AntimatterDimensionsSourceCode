"use strict";

Vue.component("automator-docs", {
  data() {
    return {
      commandID: -1,
      isBlockAutomator: false,
      errorCount: 0,
    };
  },
  computed: {
    command() {
      return GameDatabase.reality.automator.commands[this.commandID];
    },
    fullScreen: {
      get() {
        return this.$viewModel.tabs.reality.automator.fullScreen;
      },
      set(value) {
        this.$viewModel.tabs.reality.automator.fullScreen = value;
      }
    },
    fullScreenIconClass() {
      return this.fullScreen ? "fa-compress-arrows-alt" : "fa-expand-arrows-alt";
    },
    fullScreenTooltip() {
      return this.fullScreen ? "Exit full screen" : "Expand to full screen";
    },
    errorTooltip() {
      return `Your script has ${this.errorCount} ${pluralize("error", this.errorCount)}`;
    }
  },
  methods: {
    changeCommand(event) {
      this.commandID = event;
    },
    update() {
      this.isBlockAutomator = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
      const currentScript = player.reality.automator.scripts[player.reality.automator.state.editorScript].content;
      this.errorCount = AutomatorGrammar.compile(currentScript).errors.length;
    },
    exportScript() {
      copyToClipboard(btoa(AutomatorData.currentScriptText()));
      GameUI.notify.info("Exported current Automator script to your clipboard");
    },
    importScript() {
      Modal.importScript.show();
    }
  },
  template: `
    <div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls" >
        <automator-button
          class="fa-list"
          @click="commandID = -1"
          v-tooltip="'Command list'"
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
        <automator-button
          v-if="errorCount !== 0"
          style="color: red;"
          class="fa-exclamation-triangle"
          @click="commandID = -2"
          v-tooltip="errorTooltip"
        />
        <automator-button
          :class="fullScreenIconClass"
          class="l-automator__button--corner"
          @click="fullScreen = !fullScreen"
          v-tooltip="fullScreenTooltip"
        />
      </div>
      <automator-blocks v-if="isBlockAutomator" />
      <div class="c-automator-docs l-automator-pane__content">
        <automator-docs-main-page
          v-if="commandID === -1"
          @select="changeCommand"
        />
        <automator-error-page v-else-if="commandID === -2" />
        <automator-man-page v-else :command="command" />
      </div>
    </div>`
});

Vue.component("automator-script-import", {
  data() {
    return {
      input: ""
    };
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    importSave() {
      AutomatorData.createNewScript(atob(this.input));
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-import l-modal-content--centered">
      <modal-close-button @click="emitClose" />
      <h3>Import Automator Script</h3>
      Note: This will create a new automator script at the end of your list of scripts named "Imported Script"
      <input
        v-model="input"
        ref="input"
        type="text"
        class="c-modal-input c-modal-import__input"
        @keyup.enter="importSave"
        @keyup.esc="emitClose"
      />
      <primary-button
        class="o-primary-btn--width-medium c-modal-import__import-btn c-modal__confirm-btn"
        @click="importSave"
      >
        Import
      </primary-button>
    </div>`
});
