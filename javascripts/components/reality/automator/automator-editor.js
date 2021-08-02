"use strict";

Vue.component("automator-editor", {
  data() {
    return {
      activeLineRaw: 0,
      automatorType: 0,
      runningScriptID: 0,
      activeLineInfo: {
        lineNumber: 0,
        scriptID: 0,
      },
    };
  },
  created() {
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.onGameLoad(), this);
    EventHub.ui.on(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad(), this);
    this.updateCurrentScriptID();
  },
  beforeDestroy() {
    EventHub.ui.offAll(this);
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
    currentScriptContent() {
      return player.reality.automator.scripts[this.currentScriptID].content;
    },
    currentScript() {
      return CodeMirror.Doc(this.currentScriptContent, "automato").getValue();
    },
    modeIconClass() { 
      return this.automatorType === AUTOMATOR_TYPE.BLOCK ? "fa-cubes" : "fa-code";
    },
    isTextAutomator() {
      return this.automatorType === AUTOMATOR_TYPE.TEXT;
    },
    isBlockAutomator() {
      return this.automatorType === AUTOMATOR_TYPE.BLOCK;
    },
    activeLine() {
      return AutomatorBackend.state.topLevelScript === this.currentScriptID ? this.activeLineRaw : 0;
    },
    automatorModeTooltip() {
      if (this.automatorType === AUTOMATOR_TYPE.BLOCK) return "Switch to the text editor";
      return "Switch to the block editor";
    },
  },
  methods: {
    update() {
      this.runningScriptID = AutomatorBackend.state.topLevelScript;
      this.automatorType = player.reality.automator.type;
      if (AutomatorBackend.isOn) {
        this.activeLineInfo = {
          lineNumber: AutomatorBackend.stack.top.lineNumber,
          scriptID: AutomatorBackend.state.topLevelScript,
        };
      } else {
        this.activeLineInfo = {
          lineNumber: 0,
          scriptID: "0",
        };
      }
    },
    onGameLoad() {
      this.updateCurrentScriptID();
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
    toggleAutomatorMode() {
      if (this.automatorType === AUTOMATOR_TYPE.BLOCK) {
        BlockAutomator.parseTextFromBlocks();
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
      } else if (BlockAutomator.fromText(this.currentScriptContent)) {
        player.reality.automator.type = AUTOMATOR_TYPE.BLOCK;
      } else {
        Modal.message.show("Automator script has errors, cannot convert to blocks.");
      }
      this.$recompute("currentScriptContent");
    }
  },
  template: `
    <div class="l-automator-pane">
      <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
        <automator-controls />
        <automator-button
          :class="modeIconClass"
          @click="toggleAutomatorMode()"
          v-tooltip="automatorModeTooltip"
        />
      </div>
      <automator-text-editor
        :currentScriptID="currentScriptID"
        :activeLineInfo="activeLineInfo"
        :runningScriptID="runningScriptID"
        v-if="isTextAutomator"
      />
      <automator-block-editor v-if="isBlockAutomator" />
    </div>`
});
