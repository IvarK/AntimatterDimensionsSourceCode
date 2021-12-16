<script>
import AwayProgressOptionsEntry from "@/components/modals/options/AwayProgressOptionsEntry";
import OptionsWrapperModal from "@/components/modals/options/OptionsWrapperModal";

export default {
  name: "AwayProgressOptionsModal",
  components: {
    AwayProgressOptionsEntry,
    OptionsWrapperModal,
  },
  computed: {
    all() {
      return AwayProgressTypes.showOption;
    }
  },
};
</script>

<template>
  <OptionsWrapperModal
    style="width: 75rem"
    @close="emitClose"
  >
    <div class="c-modal-options__button-container">
      <AwayProgressOptionsEntry
        v-for="name of all"
        :key="name"
        :name="name"
      />
    </div>
    Note: Selected resources will only show if they've increased.
  </OptionsWrapperModal>
</template>
