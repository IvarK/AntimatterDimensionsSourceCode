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
    <span class="c-modal__title">
      <slot name="header" />
    </span>
    <slot />
  </div>
</template>
