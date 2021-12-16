<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "OptionsWrapperModal",
  components: {
    ModalCloseButton,
  },
};
</script>

<template>
  <div class="c-modal-options l-modal-options">
    <ModalCloseButton @click="emitClose" />
    <slot />
  </div>
</template>
