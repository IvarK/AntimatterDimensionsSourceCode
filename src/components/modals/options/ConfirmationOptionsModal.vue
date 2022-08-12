<script>
import ConfirmationOptionsEntry from "@/components/modals/options/ConfirmationOptionsEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "ConfirmationOptionsModal",
  components: {
    ModalWrapperOptions,
    ConfirmationOptionsEntry,
  },
  computed: {
    count() {
      return ConfirmationTypes.index.length;
    },
    noConfirmations() {
      return ConfirmationTypes.index.every(x => !x.isUnlocked());
    }
  }
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__large">
    <template #header>
      Confirmation Options
    </template>
    <div class="c-modal-options__button-container">
      <span v-if="noConfirmations">
        You do not have anything that requires confirmation,
        but if you did it would appear here.
      </span>
      <ConfirmationOptionsEntry
        v-for="entryNumber in count"
        :key="entryNumber"
        :index="entryNumber - 1"
      />
    </div>
  </ModalWrapperOptions>
</template>
