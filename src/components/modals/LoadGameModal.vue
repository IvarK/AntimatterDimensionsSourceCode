<script>
import LoadGameEntry from "@/components/modals/LoadGameEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "LoadGameModal",
  components: {
    ModalWrapperOptions,
    LoadGameEntry
  }
};
</script>

<template>
  <ModalWrapperOptions>
    <template #header>
      Save Selection
    </template>
    <LoadGameEntry
      v-for="id in 3"
      :key="id"
      :save-id="id - 1"
      class="c-entry-border"
    />
  </ModalWrapperOptions>
</template>

<style scoped>
.c-entry-border {
  border-bottom: 0.1rem solid var(--color-text);
  width: 28rem;
  padding-bottom: 1rem;
}

.c-entry-border:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>
