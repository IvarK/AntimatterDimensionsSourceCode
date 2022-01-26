<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "ModalWrapper",
  components: {
    ModalCloseButton,
  },
  methods: {
    closeModal() {
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  }
};
</script>

<template>
  <div>
    <ModalCloseButton @click="closeModal" />
    <h3><slot name="header" /></h3>
    <slot />
  </div>
</template>
