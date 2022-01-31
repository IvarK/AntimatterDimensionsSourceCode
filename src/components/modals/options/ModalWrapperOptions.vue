<script>
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "ModalWrapperOptions",
  components: {
    ModalWrapper
  }
};
</script>

<template>
  <ModalWrapper class="c-modal-options l-modal-options">
    <template #header>
      <slot name="header" />
    </template>
    <slot />
  </ModalWrapper>
</template>
