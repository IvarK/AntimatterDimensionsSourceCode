<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "OptionsButton",
  components: {
    PrimaryButton
  }
};
</script>

<template>
  <PrimaryButton
    class="o-primary-btn--option l-options-grid__button"
    @click="emitClick"
  >
    <slot />
  </PrimaryButton>
</template>
