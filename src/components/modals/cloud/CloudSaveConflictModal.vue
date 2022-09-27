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
    }
  },
  methods: {
    saveClick(accepted) {
      Cloud.hasSeenSavingConflict = true;
      Cloud.shouldOverwriteCloudSave = accepted;
      if (accepted) {
        this.conflict.onAccept?.();
      }
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
    <b>
      <span v-if="wrongHash">
        Your Cloud Save has been changed by someone else since you last saved to the Cloud this session.
      </span>
      <span v-else-if="hasDifferentName">
        Your Local and Cloud Saves have different names.
      </span>
      <span v-else-if="older">
        Your Cloud Save appears to be older than your Local Save.
      </span>
      <span v-else-if="farther">
        Your Cloud Save appears to be farther than your Local Save.
      </span>
      <span v-else>
        Your Local Save and Cloud Save appear to have similar amounts of progress.
      </span>
    </b>
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
    <br>
    Would you like to overwrite the Cloud Save? Your choice here will apply for every
    time the game automatically attempts to Cloud Save, until the page is reloaded.
    <div
      v-if="hasLessSTDs"
      class="c-modal-IAP__warning"
    >
      LOCAL SAVE HAS LESS STDs BOUGHT, YOU WILL LOSE THEM IF YOU OVERWRITE.
      <br>CLICK THE BUTTON 5 TIMES TO CONFIRM.
    </div>
    <template #cancel-text>
      Overwrite Cloud Save <span v-if="hasLessSTDs">({{ clicksLeft }})</span>
    </template>
    <template #confirm-text>
      Do not overwrite
    </template>
  </ModalWrapperChoice>
</template>