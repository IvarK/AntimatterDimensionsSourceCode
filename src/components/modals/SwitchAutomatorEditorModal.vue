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
      errorCount: 0,
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
    otherMode() {
      return this.isCurrentlyBlocks ? "Text" : "Block";
    }
  },
  methods: {
    update() {
      this.errorCount = AutomatorData.currentErrors().length;
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
      Change Automator to {{ otherMode }} editor
    </template>
    <div class="c-modal-message__text">
      This will stop your current script if it is running!
      <div v-if="errorCount">
        <br>
        Your script has some errors which may not get converted properly to {{ otherMode }} mode. Continuing on will
        make the Automator attempt to parse these lines anyway, although some information may get lost or not be
        converted properly.
      </div>
      <!-- Note: this can only ever appear on text-to-block -->
      <b v-if="lostBlocks">
        <br>
        Warning: Your script also currently has some lines which cannot interpreted as particular commands. These
        lines will end up being deleted since there is no block they can be converted into.
        If an error occurs at the start of a loop or IF, this may end up deleting large portions of your script!
        <span class="l-lost-text">
          Changing editor modes right now will cause {{ quantifyInt("line", lostBlocks) }} of code to be irreversibly
          lost!
        </span>
      </b>
      <br>
      <span class="l-lost-text">
        Hiding this confirmation is not recommended, as it may cause parts of scripts to be immediately and irreversibly
        lost if your script has errors when attempting to switch modes.
      </span>
      <br>
      <br>
      Are you sure you want to change to the {{ otherMode }} editor?
    </div>
    <template #confirm-text>
      Change Modes
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-lost-text {
  color: var(--color-bad);
}
</style>
