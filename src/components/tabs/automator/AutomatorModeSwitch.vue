<script>
import { blockifyTextAutomator } from "@/core/automator";

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
        AutomatorData.clearUndoData();
      }
      if (BlockAutomator.hasUnparsableCommands(this.currentScript) &&
        player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) {
        Modal.message.show(`Some script commands were unrecognizable - defaulting to text editor.`);
        AutomatorBackend.changeModes(this.currentScriptID);
      }
      this.$nextTick(() => BlockAutomator.updateEditor(this.currentScript));
    },
    toggleAutomatorMode() {
      const currScript = player.reality.automator.scripts[this.currentScriptID].content;
      const hasTextErrors = this.automatorType === AUTOMATOR_TYPE.TEXT &&
        (BlockAutomator.hasUnparsableCommands(currScript) || AutomatorData.currentErrors().length !== 0);

      if (player.options.confirmations.switchAutomatorMode && (hasTextErrors || AutomatorBackend.isRunning)) {
        const blockified = blockifyTextAutomator(currScript);

        // We explicitly pass in 0 for lostBlocks if converting from block to text since nothing is ever lost in that
        // conversion direction
        const lostBlocks = this.automatorType === AUTOMATOR_TYPE.TEXT
          ? blockified.validatedBlocks - blockified.visitedBlocks
          : 0;
        Modal.switchAutomatorEditorMode.show({
          callBack: () => this.$recompute("currentScriptContent"),
          lostBlocks,
        });
      } else {
        AutomatorBackend.changeModes(this.currentScriptID);
      }
      AutomatorData.clearUndoData();
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
  margin: 0.3rem 0.4rem 0.3rem 0.5rem;
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
