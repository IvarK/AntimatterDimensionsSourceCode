<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SwitchAutomatorEditorModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    callback: {
      type: Function,
      required: false,
      default: () => ({})
    },
    hasInvalidCommands: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      isCurrentlyBlocks: false
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
  },
  methods: {
    update() {
      this.isCurrentlyBlocks = player.reality.automator.type === AUTOMATOR_TYPE.BLOCK;
    },
    toggleAutomatorMode() {
      const scriptID = this.currentScriptID;
      Tutorial.moveOn(TUTORIAL_STATE.AUTOMATOR);
      if (this.isCurrentlyBlocks) {
        // This saves the script after converting it.
        BlockAutomator.parseTextFromBlocks();
        player.reality.automator.type = AUTOMATOR_TYPE.TEXT;
      } else {
        AutomatorBackend.saveScript(scriptID, AutomatorTextUI.editor.getDoc().getValue());
        player.reality.automator.type = AUTOMATOR_TYPE.BLOCK;
      }
      this.callback?.();
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    option="switchAutomatorMode"
    @confirm="toggleAutomatorMode"
  >
    <template #header>
      Change Automator to {{ isCurrentlyBlocks ? "text" : "block" }} editor
    </template>
    <div class="c-modal-message__text">
      This will stop your current script if it is running!
      <div v-if="hasInvalidCommands">
        Additionally, your script currently has some lines which cannot interpreted as particular commands. Switching
        to the block editor will cause these lines to be automatically deleted, since blocks only exist for valid
        commands.
      </div>
      <br>
      Are you sure you want to change to the {{ isCurrentlyBlocks ? "text" : "block" }} editor?
    </div>
    <template #confirm-text>
      Change Modes
    </template>
  </ModalWrapperChoice>
</template>
