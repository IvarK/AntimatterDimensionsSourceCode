<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import LoadGameEntry from "@/components/modals/LoadGameEntry";

export default {
  name: "LoadGameModal",
  components: {
    ModalCloseButton,
    LoadGameEntry
  }
};
</script>

<template>
  <div class="c-modal-options l-modal-options">
    <ModalCloseButton @click="emitClose" />
    <LoadGameEntry
      v-for="id in 3"
      :key="id"
      :save-id="id - 1"
    />
  </div>
</template>
