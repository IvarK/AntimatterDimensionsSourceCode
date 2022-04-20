<script>
import AutomatorBlockEditor from "./AutomatorBlockEditor";
import AutomatorTextEditor from "./AutomatorTextEditor";
import AutomatorControls from "./AutomatorControls";

export default {
  name: "AutomatorEditor",
  components: {
    AutomatorBlockEditor,
    AutomatorTextEditor,
    AutomatorControls,
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
      isBlock: false
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
    isTextAutomator: {
      get() {
        return this.automatorType === AUTOMATOR_TYPE.TEXT;
      },
      set() {
        this.toggleAutomatorMode();
      }
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
    tutorialClass() {
      return {
        "tutorial--glow": ui.view.tutorialState === TUTORIAL_STATE.AUTOMATOR && ui.view.tutorialActive
      };
    }
  },
  created() {
    EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.onGameLoad(), this);
    EventHub.ui.on(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad(), this);
    this.isBlock = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
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
      Tutorial.moveOn(TUTORIAL_STATE.AUTOMATOR);
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
      // Need this to remove focus from checkbox
      document.activeElement.blur();
    }
  }
};
</script>

<template>
  <div class="l-automator-pane">
    <div class="c-automator__controls l-automator__controls l-automator-pane__controls">
      <AutomatorControls />
      <div
        v-tooltip="automatorModeTooltip"
        class="slider-toggle-button"
        :class="tutorialClass"
      >
        <div class="toggle-button-cover">
          <input
            v-model="isTextAutomator"
            type="checkbox"
            class="checkbox"
          >
          <div class="knobs">
            <span class="fas fa-cubes" />
          </div>
        </div>
      </div>
    </div>
    <AutomatorTextEditor
      v-if="isTextAutomator"
      :current-script-id="currentScriptID"
    />
    <AutomatorBlockEditor v-if="isBlockAutomator" />
  </div>
</template>

<style scoped>
.slider-toggle-button {
  width: 6.4rem;
  height: 2.33rem;
  background-color: #626262;
  border: 0.2rem solid #767676;
  border-radius: 0.2rem;
  margin: 0.4rem;
}

.toggle-button-cover {
  display: table-cell;
  position: relative;
  top: 0;
  width: 6rem;
  height: 1.94rem;
  margin: 0;
  overflow: hidden;
}

.button-cover,
.knobs {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.checkbox {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.knobs {
  z-index: 2;
}

.toggle-button-cover .knobs:before,
.toggle-button-cover .knobs:after,
.toggle-button-cover .knobs span {
  position: absolute;
  top: 0;
  width: 2rem;
  height: 1.32rem;
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1;
  margin-top: 0;
  margin-left: -0.4rem;
  padding: 0.3rem 0.2rem 0.3rem 0.7rem;
  border-radius: 2px;
  transition: 0.3s ease all;
}

.toggle-button-cover .knobs:before {
  content: "";
  left: 0.4rem;
  background-color: white;
}

.toggle-button-cover .knobs:after {
  content: "\f121";
  top: -0.16rem;
  left: 3.2rem;
  width: 2rem;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 100;
  color: black;
}

.toggle-button-cover .knobs span {
  display: inline-block;
  left: 0.4rem;
  color: black;
  z-index: 1;
}

.toggle-button-cover .checkbox:checked + .knobs span {
  color: black;
}

.toggle-button-cover .checkbox:checked + .knobs:before {
  left: 3.5rem;
  background-color: white;
}

.toggle-button-cover .checkbox:checked + .knobs:after {
  color: black;
}

.tutorial--glow:after {
  z-index: 2;
}
</style>
