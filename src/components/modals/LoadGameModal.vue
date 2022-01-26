<script>
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import LoadGameEntry from "@/components/modals/LoadGameEntry";

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
    />
  </ModalWrapperOptions>
</template>
