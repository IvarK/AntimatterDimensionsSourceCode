<script>
import CloudConflictRecordModal from "@/components/modals/cloud/CloudConflictRecordModal";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "CloudLoadConflictModal",
  components: {
    ModalWrapperChoice,
    CloudConflictRecordModal,
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
      return this.conflict.saveComparison.older === 1;
    },
    farther() {
      return this.conflict.saveComparison.farther === 1;
    },
    hasDifferentName() {
      return this.conflict.cloud.saveName !== this.conflict.local.saveName;
    },
    hasLessSTDs() {
      return this.conflict.local.totalSTD > this.conflict.cloud.totalSTD;
    },
    clicksLeft() {
      return 5 - this.overwriteCounter;
    }
  },
  methods: {
    confirm() {
      this.overwriteCounter++;
      if (this.hasLessSTDs && this.clicksLeft > 0) return;
      this.conflict.onAccept?.();
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    :confirm-fn="confirm"
  >
    <template #header>
      Load Game from Cloud
    </template>
    <b>
      <span v-if="hasDifferentName">
        Your Local and Cloud Saves have different names.
      </span>
      <span v-else-if="older">
        Your Local Save appears to be older than your Cloud Save.
      </span>
      <span v-else-if="farther">
        Your Local Save appears to be farther than your Cloud Save.
      </span>
      <span v-else>
        Your Local Save and Cloud Save appear to have similar amounts of progress.
      </span>
      Please select the save you want to load.
    </b>
    <br>
    <CloudConflictRecordModal
      :save-data="conflict.local"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="Local Save"
    />
    <br>
    <CloudConflictRecordModal
      :save-data="conflict.cloud"
      :save-id="conflict.saveId"
      :show-name="hasDifferentName"
      save-type="Cloud Save"
    />
    <div
      v-if="hasLessSTDs"
      class="c-modal-IAP__warning"
    >
      CLOUD SAVE HAS LESS STDs BOUGHT, YOU WILL LOSE THEM IF YOU OVERWRITE.
      <br>CLICK THE BUTTON 5 TIMES TO CONFIRM.
    </div>
    <template #cancel-text>
      Keep Local Save
    </template>
    <template #confirm-text>
      Overwrite Local with Cloud Save <span v-if="hasLessSTDs">({{ clicksLeft }})</span>
    </template>
  </ModalWrapperChoice>
</template>