<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "ModalWrapper",
  components: {
    ModalCloseButton,
  },
};
</script>

<template>
  <div>
    <ModalCloseButton @click="emitClose" />
    <h3><slot name="header" /></h3>
    <slot />
  </div>
</template>
