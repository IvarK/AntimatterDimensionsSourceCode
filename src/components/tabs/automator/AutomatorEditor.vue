<script>
import AutomatorBlockEditor from "./AutomatorBlockEditor";
import AutomatorControls from "./AutomatorControls";
import AutomatorTextEditor from "./AutomatorTextEditor";

export default {
  name: "AutomatorEditor",
  components: {
    AutomatorBlockEditor,
    AutomatorTextEditor,
    AutomatorControls,
  },
  data() {
    return {
      automatorType: 0,
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
    isTextAutomator() {
      return this.automatorType === AUTOMATOR_TYPE.TEXT;
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
      if (AutomatorData.currentErrors().length !== 0 && player.reality.automator.type === AUTOMATOR_TYPE.BLOCK) {
        Modal.message.show(`Switched to text editor mode; this script has errors
          which cannot be converted to block mode.`);
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
      }
      this.$nextTick(() => BlockAutomator.fromText(this.currentScript));
    },
  }
};
</script>

<template>
  <div class="l-automator-pane">
    <div class="c-automator__controls l-automator__controls">
      <AutomatorControls />
    </div>
    <AutomatorTextEditor
      v-if="isTextAutomator"
      :current-script-id="currentScriptID"
    />
    <AutomatorBlockEditor v-if="!isTextAutomator" />
  </div>
</template>
