<script>
import CloudConflictRecordModal from "@/components/modals/cloud/CloudConflictRecordModal";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "CloudSaveConflictModal",
  components: {
    ModalWrapperChoice,
    CloudConflictRecordModal,
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
    }
  },
  methods: {
    saveClick(accepted) {
      Cloud.hasSeenSavingConflict = true;
      Cloud.shouldOverwriteCloudSave = accepted;
      if (accepted) {
        this.conflict.onAccept?.();
      }
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    @cancel="saveClick(true)"
    @confirm="saveClick(false)"
    @close="emitClose"
  >
    <template #header>
      Save Game to Cloud
    </template>
    <b>
      <span v-if="older">
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
    <CloudConflictRecordModal
      :save-data="conflict.local"
      :save-id="conflict.saveId"
      save-type="Local Save"
    />
    <CloudConflictRecordModal
      :save-data="conflict.cloud"
      :save-id="conflict.saveId"
      save-type="Cloud Save"
    />
    <br>
    Would you like to overwrite the Cloud Save? Your choice here will apply for every
    time the game automatically attempts to Cloud Save, until the page is reloaded.
    <template #cancel-text>
      Overwrite Cloud Save
    </template>
    <template #confirm-text>
      Do not overwrite
    </template>
  </ModalWrapperChoice>
</template>
