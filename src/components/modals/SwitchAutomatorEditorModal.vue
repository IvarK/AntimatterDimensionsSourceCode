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
    lostBlocks: {
      type: Number,
      required: false,
      default: 0,
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
      AutomatorBackend.changeModes(this.currentScriptID);
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
      <div v-if="lostBlocks">
        Additionally, your script currently has some lines which cannot interpreted as particular commands. Switching
        to the block editor will cause these lines to be automatically deleted, since blocks only exist for valid
        commands.
        <b>
          Warning: If these errors are caused by malformed loops or IFs, this may end up deleting large portions of
          your script! Changing editor modes currently will cause {{ quantifyInt("line", lostBlocks) }} of code to be
          lost!
        </b>
      </div>
      <br>
      Are you sure you want to change to the {{ isCurrentlyBlocks ? "text" : "block" }} editor?
    </div>
    <template #confirm-text>
      Change Modes
    </template>
  </ModalWrapperChoice>
</template>
