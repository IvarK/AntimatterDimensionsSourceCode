<script>
import CreditsDisplay from "@/components/CreditsDisplay";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "CreditsModal",
  components: {
    CreditsDisplay,
    ModalWrapper
  },
};
</script>

<template>
  <ModalWrapper class="l-credits-modal c-credits-modal">
    <template #header>
      <h1 class="c-game-header__antimatter">
        Antimatter Dimensions
      </h1>
    </template>
    <div class="c-credits-modal__body">
      <CreditsDisplay :is-modal="true" />
    </div>
  </ModalWrapper>
</template>

<style scoped>
.l-credits-modal {
  /* stylelint-disable-next-line unit-allowed-list */
  width: calc(100vw - 60vh);
  min-width: 70rem;
}

.c-credits-modal {
  margin: 0.5rem;
}

.c-credits-modal__body {
  overflow-y: scroll;
  /* stylelint-disable-next-line unit-allowed-list */
  height: 60vh;
}
</style>