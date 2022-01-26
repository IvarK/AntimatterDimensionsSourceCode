<script>
import CloudConflictRecordModal from "@/components/modals/cloud/CloudConflictRecordModal";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "CloudLoadConflictModal",
  components: {
    ModalWrapperChoice,
    CloudConflictRecordModal,
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
    }
  },
  methods: {
    confirm() {
      this.conflict.onAccept?.();
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    class="c-modal-options__large"
    :cancel-class="'c-modal-message__okay-btn'"
    :confirm-class="'c-modal-message__okay-btn c-modal__confirm-btn'"
    @confirm="confirm"
  >
    <template #header>
      Load Game from Cloud
    </template>
    <b>
      <span v-if="older">
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
      save-type="Local Save"
    />
    <br>
    <CloudConflictRecordModal
      :save-data="conflict.cloud"
      :save-id="conflict.saveId"
      save-type="Cloud Save"
    />
    <template #cancel-text>
      Keep Local Save
    </template>
    <template #confirm-text>
      Overwrite Local with Cloud Save
    </template>
  </ModalWrapperChoice>
</template>
