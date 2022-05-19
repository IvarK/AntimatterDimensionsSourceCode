<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SwitchAutomatorEditorModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    modalConfig: {
      type: Object,
      required: false,
      default: () => ({})
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
    currentScriptContent() {
      return player.reality.automator.scripts[this.currentScriptID].content;
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
      } else if (BlockAutomator.fromText(this.currentScriptContent)) {
        AutomatorBackend.saveScript(scriptID, AutomatorTextUI.editor.getDoc().getValue());
        player.reality.automator.type = AUTOMATOR_TYPE.BLOCK;
      } else {
        Modal.message.show("Automator script has errors, cannot convert to blocks.");
      }
      this.modalConfig.callback?.();
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
      Are you sure you want to change to the {{ isCurrentlyBlocks ? "text" : "block" }} editor?
      This will stop your current script!
    </div>
    <template #confirm-text>
      Change Modes
    </template>
  </ModalWrapperChoice>
</template>