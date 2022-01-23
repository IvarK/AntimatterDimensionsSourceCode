<script>
import OptionsWrapperModal from "@/components/modals/options/OptionsWrapperModal";
import ConfirmationOptionsEntry from "@/components/modals/options/ConfirmationOptionsEntry";

export default {
  name: "ConfirmationOptionsModal",
  components: {
    OptionsWrapperModal,
    ConfirmationOptionsEntry,
  },
  computed: {
    count() {
      return ConfirmationTypes.length;
    },
    noConfirmations() {
      return ConfirmationTypes.every(x => !x.isUnlocked());
    }
  }
};
</script>

<template>
  <OptionsWrapperModal
    class="c-modal-options__large"
    @close="emitClose"
  >
    <div class="c-modal-options__button-container">
      <span v-if="noConfirmations">
        You do not have anything that requires confirmation,<br>
        but if you did it would appear here.
      </span>
      <ConfirmationOptionsEntry
        v-for="entryNumber in count"
        :key="entryNumber"
        :index="entryNumber - 1"
      />
    </div>
  </OptionsWrapperModal>
</template>
