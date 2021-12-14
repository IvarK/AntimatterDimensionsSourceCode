<script>
import ModalCloudConflictRecord from "@/components/modals/cloud/ModalCloudConflictRecord";
import PrimaryButton from "@/components/PrimaryButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  components: {
    PrimaryButton,
    ModalCloseButton,
    ModalCloudConflictRecord,
  },
  computed: {
    conflict() {
      return this.$viewModel.modal.cloudConflict;
    },
    older() {
      return conflict.saveComparison.older === -1;
    },
    farther() {
      return conflict.saveComparison.farther === -1;
    }
  },
  methods: {
    saveClick(accepted) {
      Cloud.hasSeenSavingConflict = true;
      Cloud.shouldOverwriteCloudSave = accepted;
      if (accepted) {
        this.conflict.onAccept?.();
      }
      this.emitClose();
    }
  },
};
</script>

<template>
  <div
    class="c-modal-options c-modal-options__large l-modal-options"
  >
    <ModalCloseButton @click="emitClose" />
    <h1>Save Game to Cloud</h1>
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
    <ModalCloudConflictRecord
      :save-data="conflict.local"
      :save-id="conflict.saveId"
      save-type="Local Save"
    />
    <ModalCloudConflictRecord
      :save-data="conflict.cloud"
      :save-id="conflict.saveId"
      save-type="Cloud Save"
    />
    <br>
    Would you like to overwrite the Cloud Save? Your choice here will apply for every
    time the game automatically attempts to Cloud Save, until the page is reloaded.
    <PrimaryButton
      class="o-primary-btn"
      @click="saveClick(true)"
    >
      Overwrite Cloud Save
    </PrimaryButton>
    <br>
    <PrimaryButton
      class="o-primary-btn"
      @click="saveClick(false)"
    >
      Do not overwrite
    </PrimaryButton>
  </div>
</template>
