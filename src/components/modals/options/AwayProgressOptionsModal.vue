<script>
import AwayProgressOptionsEntry from "@/components/modals/options/AwayProgressOptionsEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "AwayProgressOptionsModal",
  components: {
    AwayProgressOptionsEntry,
    ModalWrapperOptions,
  },
  computed: {
    all() {
      return AwayProgressTypes.showOption;
    }
  },
};
</script>

<template>
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      Away Progress Options
    </template>
    <div class="c-modal-options__button-container">
      <AwayProgressOptionsEntry
        v-for="name of all"
        :key="name"
        :name="name"
      />
    </div>
    Note: Selected resources will only show if they've increased.
  </ModalWrapperOptions>
</template>

<style scoped>
.l-wrapper {
  width: 75rem;
}
</style>