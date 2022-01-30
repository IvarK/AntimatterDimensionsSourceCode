<script>
import AutomatorBlockEditor from "./AutomatorBlockEditor";
import AutomatorTextEditor from "./AutomatorTextEditor";
import AutomatorControls from "./AutomatorControls";
import AutomatorButton from "./AutomatorButton";

export default {
  name: "AutomatorEditor",
  components: {
    AutomatorBlockEditor,
    AutomatorTextEditor,
    AutomatorControls,
    AutomatorButton
  },
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
  created() {
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.onGameLoad(), this);
    EventHub.ui.on(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad(), this);
    this.updateCurrentScriptID();
  },
  beforeDestroy() {
    EventHub.ui.offAll(this);
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
        if (AutomatorTextUI.editor) AutomatorTextUI.editor.performLint();
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
      if (AutomatorData.currentErrors().length !== 0 && player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) {
        Modal.message.show(`Switched to text editor mode; this script has errors
          which cannot be converted to block mode.`);
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
      }
      this.$nextTick(() => BlockAutomator.fromText(this.currentScript));
    },
    toggleAutomatorMode() {
      const scriptID = ui.view.tabs.reality.automator.editorScriptID;
      if (this.automatorType === AUTOMATOR_TYPE.BLOCK) {
        // This saves the script after converting it.
        BlockAutomator.parseTextFromBlocks();
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
      } else if (BlockAutomator.fromText(this.currentScriptContent)) {
        AutomatorBackend.saveScript(scriptID, AutomatorTextUI.editor.getDoc().getValue());
        player.reality.automator.type = AUTOMATOR_TYPE.BLOCK;
      } else {
        Modal.message.show("Automator script has errors, cannot convert to blocks.");
      }
      this.$recompute("currentScriptContent");
    }
  }
};
</script>

<template>
  <div class="l-automator-pane">
    <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
      <AutomatorControls />
      <AutomatorButton
        v-tooltip="automatorModeTooltip"
        :class="modeIconClass"
        @click="toggleAutomatorMode()"
      />
    </div>
    <AutomatorTextEditor
      v-if="isTextAutomator"
      :current-script-id="currentScriptID"
    />
    <AutomatorBlockEditor v-if="isBlockAutomator" />
  </div>
</template>

<style scoped>

</style>
