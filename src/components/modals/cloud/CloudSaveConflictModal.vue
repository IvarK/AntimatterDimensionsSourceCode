<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import SaveInfoEntry from "@/components/modals/cloud/SaveInfoEntry";

export default {
  name: "CloudSaveConflictModal",
  components: {
    ModalWrapperChoice,
    SaveInfoEntry,
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    older() {
      return this.conflict.saveComparison.older === -1;
    },
    farther() {
      return this.conflict.saveComparison.farther === -1;
    },
    hasDifferentName() {
      return this.conflict.cloud.saveName !== this.conflict.local.saveName;
    },
    wrongHash() {
      return this.conflict.saveComparison.hashMismatch;
    },
    suggestionText() {
      const goodStyle = `style="color: var(--color-good)"`;
      const badStyle = `style="color: var(--color-infinity)"`;

      const suggestions = ["Saving to the Cloud "];
      const cloudProg = this.conflict.cloud.compositeProgress, localProg = this.conflict.local.compositeProgress;
      const warnOverwrite = this.farther && Math.abs(cloudProg - localProg) > 0.15;
      suggestions.push(warnOverwrite
        ? `<b ${badStyle}>would overwrite a save with significantly more progress</b>`
        : `<b ${goodStyle}>is probably safe</b>`);
      if (this.hasDifferentName || this.wrongHash) {
        suggestions.push(` ${warnOverwrite ? "Additionally" : "However"}, you may be overwriting a 
          <b ${badStyle}>save from a different device</b>.`);
      }
      if (warnOverwrite || this.hasDifferentName || this.wrongHash) {
        suggestions.push(`<br><b ${badStyle}>Are you sure you wish to overwrite the Cloud save?</b>`);
      }
      return suggestions.join("");
    },
    noOverwriteInfo() {
      return `Save conflicts will keep occurring without overwriting.`;
    },
    overwriteInfo() {
      return `If another device is also saving to the cloud on this Google Account at the same time,
        this modal may appear repeatedly.`;
    }
  },
  methods: {
    doNotSave() {
      player.options.cloudEnabled = false;
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
    overwrite() {
      this.conflict.onAccept?.();
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    :cancel-fn="overwrite"
    @confirm="doNotSave()"
  >
    <template #header>
      Save Game to Cloud
    </template>
    <span v-if="wrongHash">
      Your Cloud Save has been <b>changed by a different device</b> since you last saved to the Cloud this session.
    </span>
    <span v-else-if="hasDifferentName">
      Your Local and Cloud Saves have <b>different names</b>.
    </span>
    <span v-else-if="older">
      Saving to the Cloud would <b>overwrite an older save</b>.
    </span>
    <span v-else-if="farther">
      Saving to the Cloud would <b>overwrite a save with more progress</b>.
    </span>
    <span v-else>
      Your Local Save and Cloud Save <b>appear to have similar amounts of progress</b>.
    </span>
    <br>
    <SaveInfoEntry
      :save-data="conflict.local"
      :other-data="conflict.cloud"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="Local Save"
    />
    <SaveInfoEntry
      :save-data="conflict.cloud"
      :other-data="conflict.local"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="Cloud Save"
    />
    <span v-html="suggestionText" />
    <br>
    <span>
      Not overwriting will turn off Cloud saving and you will need to manually turn it back on again
      if you want to use it.
      <span :ach-tooltip="noOverwriteInfo">
        <i class="fas fa-question-circle" />
      </span>
    </span>
    <span>
      Overwriting will force a save to the Cloud in this particular instance; in most
      cases this should prevent this modal from reappearing afterwards.
      <span :ach-tooltip="overwriteInfo">
        <i class="fas fa-question-circle" />
      </span>
    </span>
    <template #cancel-text>
      Overwrite Cloud Save
    </template>
    <template #confirm-text>
      Do not overwrite
    </template>
  </ModalWrapperChoice>
</template>
