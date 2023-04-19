<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DeleteAutomatorScriptModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    scriptID: {
      type: [String, Number],
      required: true
    }
  },
  methods: {
    handleYesClick() {
      const script = this.scriptID;
      const runningScriptID = AutomatorBackend.state.topLevelScript;

      AutomatorBackend.deleteScript(script);

      const scriptList = Object.values(player.reality.automator.scripts).map(sc => ({
        id: sc.id,
        name: sc.name,
      }));
      if (AutomatorBackend.isOn && runningScriptID !== script) {
        player.reality.automator.state.editorScript = runningScriptID;
      } else {
        // AutomatorBackend.deleteScript will create an empty script if necessary
        player.reality.automator.state.editorScript = scriptList[0].id;
      }
      AutomatorData.clearUndoData();
      EventHub.dispatch(GAME_EVENT.AUTOMATOR_SAVE_CHANGED);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      Delete this script
    </template>
    <div class="c-modal-message__text">
      Please confirm your desire to delete this Automator script.
    </div>
    <template #confirm-text>
      Delete
    </template>
  </ModalWrapperChoice>
</template>
