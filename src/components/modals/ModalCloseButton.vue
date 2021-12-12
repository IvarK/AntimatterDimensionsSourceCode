<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  components: {
    PrimaryButton
  }
};
</script>

<template>
  <PrimaryButton
    class="o-primary-btn--modal-close c-modal__close-btn"
    @click="emitClick"
  >
    &times;
  </PrimaryButton>
</template>
