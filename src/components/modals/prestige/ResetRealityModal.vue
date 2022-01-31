<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ResetRealityModal",
  components: {
    ModalWrapperChoice
  },
  created() {
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      You are about to reset your Reality
    </template>
    <div class="c-modal-message__text">
      This will put you at the start of your Reality and reset your progress in this Reality,
      giving you no rewards from your progress in your current Reality.
      <br>
      <br>
      Are you sure you want to do this?
    </div>
    <template #confirm-text>
      Reset
    </template>
  </ModalWrapperChoice>
</template>
