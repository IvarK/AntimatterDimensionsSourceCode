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
      return conflict.saveComparison.older === 1;
    },
    farther() {
      return conflict.saveComparison.farther === 1;
    }
  },
  methods: {
    handleClick(accepted) {
      if (accepted) {
        this.conflict.onAccept?.();
      }
      this.emitClose();
    }
  }
};
</script>

<template>
  <div
    class="c-modal-options c-modal-options__large l-modal-options"
  >
    <ModalCloseButton @click="emitClose" />
    <h1>Load Game from Cloud</h1>
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
    <ModalCloudConflictRecord
      :save-data="conflict.local"
      :save-id="conflict.saveId"
      save-type="Local Save"
    />
    <PrimaryButton
      class="o-primary-btn"
      @click="handleClick(false)"
    >
      Keep Local Save
    </PrimaryButton>
    <br>
    <ModalCloudConflictRecord
      :save-data="conflict.cloud"
      :save-id="conflict.saveId"
      save-type="Cloud Save"
    />
    <PrimaryButton
      class="o-primary-btn"
      @click="handleClick(true)"
    >
      Overwrite Local with Cloud Save
    </PrimaryButton>
  </div>
</template>
