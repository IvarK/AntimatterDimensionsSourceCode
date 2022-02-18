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
  computed: {
    message() {
      const doomed = Pelle.isDoomed
        ? `Armageddon`
        : `Reality`;
      return `This will put you at the start of your ${doomed},
      giving you no rewards from your progress in your current ${doomed}.`;
    },
    header() {
      const doomed = Pelle.isDoomed
        ? `Armageddon`
        : `Reality`;
      return `You are about to reset your ${doomed},`;
    }
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
      {{ header }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
      <br>
      <br>
      Are you sure you want to do this?
    </div>
    <template #confirm-text>
      Reset
    </template>
  </ModalWrapperChoice>
</template>
