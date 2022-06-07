<script>
import CreditsDisplay from "@/components/CreditsDisplay";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "CreditsModal",
  components: {
    CreditsDisplay,
    ModalCloseButton
  },
};
</script>

<template>
  <div class="l-credits-modal c-credits-modal">
    <ModalCloseButton @click="emitClose" />
    <CreditsDisplay />
  </div>
</template>

<style scoped>
.l-credits-modal {
  display: block;
  /* stylelint-disable-next-line unit-allowed-list */
  width: calc(100vw - 60vh);
  /* stylelint-disable-next-line unit-allowed-list */
  height: calc(100vh - 40vh);
}

.c-credits-modal {
  overflow-y: scroll;
  margin: 0.5rem;
}
</style>