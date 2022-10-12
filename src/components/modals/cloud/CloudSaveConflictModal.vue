<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import SaveInfoEntry from "@/components/modals/cloud/SaveInfoEntry";

export default {
  name: "CloudSaveConflictModal",
  components: {
    ModalWrapperChoice,
    SaveInfoEntry,
  },
  data() {
    return {
      overwriteCounter: 0,
    };
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
    hasLessSTDs() {
      return this.conflict.cloud.totalSTD > this.conflict.local.totalSTD;
    },
    wrongHash() {
      return this.conflict.saveComparison.hashMismatch;
    },
    clicksLeft() {
      return 5 - this.overwriteCounter;
    },
    suggestionText() {
      const goodStyle = `style="color: var(--color-good)"`;
      const badStyle = `style="color: var(--color-bad)"`;

      const suggestions = ["Saving to the Cloud "];
      const cloudProg = this.conflict.cloud.compositeProgress, localProg = this.conflict.local.compositeProgress;
      const warnOverwrite = this.farther && Math.abs(cloudProg - localProg) > 0.15;
      suggestions.push(warnOverwrite
        ? `<b ${badStyle}>would overwrite a save with significantly more progress</b>`
        : `<b ${goodStyle}>is probably safe</b>`);
      suggestions.push(this.hasLessSTDs
        ? ` ${warnOverwrite ? "and" : "but"} <b ${badStyle}>will cause your Cloud save to lose STDs</b>.`
        : "."
      );
      if (this.hasDifferentName || this.wrongHash) {
        suggestions.push(` ${warnOverwrite ? "Additionally" : "However"}, you may be overwriting a 
          <b ${badStyle}>save from a different device</b>.`);
      }
      if (warnOverwrite || this.hasDifferentName || this.wrongHash) {
        suggestions.push(`<br><b ${badStyle}>Are you sure you wish to overwrite the Cloud save?</b>`);
      }
      return suggestions.join("");
    }
  },
  methods: {
    saveClick(accepted) {
      Cloud.hasSeenSavingConflict = true;
      Cloud.shouldOverwriteCloudSave = accepted;
      if (accepted) {
        this.conflict.onAccept?.();
      }
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    },
    cancel() {
      this.overwriteCounter++;
      if (this.hasLessSTDs && this.clicksLeft > 0) return;
      Cloud.hasSeenSavingConflict = true;
      Cloud.shouldOverwriteCloudSave = true;
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
    :cancel-fn="cancel"
    @confirm="saveClick(false)"
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
    <div
      v-if="hasLessSTDs"
      class="c-modal-IAP__warning"
    >
      LOCAL SAVE HAS LESS STDs BOUGHT, YOU WILL LOSE THEM IF YOU OVERWRITE.
      <br>CLICK THE BUTTON 5 TIMES TO CONFIRM.
    </div>
    <br>
    Choosing to overwrite will force a save to the Cloud every time, while choosing to not
    overwrite will effectively disable Cloud saving. This lasts until you reload the page.
    <template #cancel-text>
      Overwrite Cloud Save <span v-if="hasLessSTDs">({{ clicksLeft }})</span>
    </template>
    <template #confirm-text>
      Do not overwrite
    </template>
  </ModalWrapperChoice>
</template>
