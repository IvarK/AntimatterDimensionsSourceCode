<script>
export default {
  name: "AutomatorModeSwitch",
  data() {
    return {
      automatorType: 0,
    };
  },
  computed: {
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
    isTextAutomator() {
      return this.automatorType === AUTOMATOR_TYPE.TEXT;
    },
    automatorModeTooltip() {
      if (this.automatorType === AUTOMATOR_TYPE.BLOCK) return "Switch to the text editor";
      return "Switch to the block editor";
    },
    tutorialClass() {
      return {
        "tutorial--glow": ui.view.tutorialState === TUTORIAL_STATE.AUTOMATOR && ui.view.tutorialActive
      };
    },
  },
  created() {
    this.on$(GAME_EVENT.GAME_LOAD, () => this.onGameLoad());
    this.on$(GAME_EVENT.AUTOMATOR_SAVE_CHANGED, () => this.onGameLoad());
    this.updateCurrentScriptID();
  },
  methods: {
    update() {
      this.automatorType = player.reality.automator.type;
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
      if (BlockAutomator.hasUnparsableCommands(this.currentScript) &&
        player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) {
        Modal.message.show(`Some script commands were unrecognizable - defaulting to text editor.`);
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
      }
      this.$nextTick(() => BlockAutomator.fromText(this.currentScript));
    },
    toggleAutomatorMode() {
      const currScript = player.reality.automator.scripts[this.currentScriptID].content;
      const hasInvalidCommands = BlockAutomator.hasUnparsableCommands(currScript);

      if (player.options.confirmations.switchAutomatorMode && (AutomatorBackend.isRunning || hasInvalidCommands)) {
        const blockified = AutomatorGrammar.blockifyTextAutomator(currScript);
        Modal.switchAutomatorEditorMode.show({
          callBack: () => this.$recompute("currentScriptContent"),
          lostBlocks: blockified.validatedBlocks - blockified.visitedBlocks,
        });
      } else {
        const scriptID = this.currentScriptID;
        Tutorial.moveOn(TUTORIAL_STATE.AUTOMATOR);
        if (this.automatorType === AUTOMATOR_TYPE.BLOCK) {
          // This saves the script after converting it.
          BlockAutomator.parseTextFromBlocks();
          player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
          // Don't use this.currentScriptContent here due to reactivity issues, but on the other hand reactively
          // updating content might lead to decreased performance.
        } else {
          const toConvert = AutomatorTextUI.editor.getDoc().getValue();
          // Needs to be called to update the lines prop in the BlockAutomator object
          BlockAutomator.fromText(toConvert);
          AutomatorBackend.saveScript(scriptID, toConvert);
          player.reality.automator.type = AUTOMATOR_TYPE.BLOCK;
        }
        this.$recompute("currentScriptContent");
        AutomatorHighlighter.clearAllHighlightedLines();
      }
    }
  }
};
</script>

<template>
  <button
    v-tooltip="{
      content: automatorModeTooltip,
      hideOnTargetClick: false
    }"
    :class="{
      'c-slider-toggle-button': true,
      'c-slider-toggle-button--right': isTextAutomator,
      ...tutorialClass
    }"
    @click="toggleAutomatorMode"
  >
    <i class="fas fa-cubes" />
    <i class="fas fa-code" />
  </button>
</template>

<style scoped>
.c-slider-toggle-button {
  display: flex;
  overflow: hidden;
  position: relative;
  align-items: center;
  color: var(--color-automator-docs-font);
  background-color: #626262;
  border: var(--var-border-width, 0.2rem) solid #767676;
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0.2rem 0.4rem 0.2rem auto;
  padding: 0.3rem 0;
  cursor: pointer;
}

.c-slider-toggle-button .fas {
  width: 3rem;
  position: relative;
  z-index: 1;
}

.c-slider-toggle-button::before {
  content: "";
  width: 3rem;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background-color: var(--color-automator-controls-inactive);
  border-radius: var(--var-border-radius, 0.3rem);
  transition: 0.3s ease all;
}

.c-slider-toggle-button--right::before {
  left: 3rem;
  background-color: var(--color-automator-controls-inactive);
}

.tutorial--glow::after {
  z-index: 2;
}
</style>
