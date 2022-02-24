<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "PelleQuotesModal",
  components: {
    PrimaryButton,
    ModalWrapper
  },
  data() {
    return {
      isDoomed: false,
      hasStrike: false,
      hasGalaxyGenerator: false,
    };
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Lore
    </template>
    <celestial-quote-history
      celestial="pelle"
      line-height="4em"
    />
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="emitClose"
    >
      Okay
    </PrimaryButton>
  </ModalWrapper>
</template>

<style scoped>
  .o-celestial-quote-history {
    margin: 10rem 0;
  }
</style>