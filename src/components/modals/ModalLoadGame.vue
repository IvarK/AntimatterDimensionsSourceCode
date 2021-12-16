<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";
import ModalLoadGameEntry from "@/components/modals/ModalLoadGameEntry";

export default {
  components: {
    ModalCloseButton,
    ModalLoadGameEntry
  }
};
</script>

<template>
  <div class="c-modal-options l-modal-options">
    <ModalCloseButton @click="emitClose" />
    <ModalLoadGameEntry
      v-for="id in 3"
      :key="id"
      :save-id="id - 1"
    />
  </div>
</template>
