<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ResetRealityModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      hasConfirmed: false
    };
  },
  computed: {
    resetTerm() { return this.isDoomed ? "Armageddon" : "Reality"; },
  },
  created() {
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, () => this.closeIfOpen());
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      this.hasConfirmed = true;
    },
    closeIfOpen() {
      if (!this.hasConfirmed) this.emitClose();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="resetReality"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to reset your {{ resetTerm }}
    </template>
    <div class="c-modal-message__text">
      This will reset you to the start of your {{ resetTerm }},
      giving you no rewards from your progress in your current {{ resetTerm }}.
      <br>
      <br>
      Are you sure you want to do this?
    </div>
    <template #confirm-text>
      Reset
    </template>
  </ModalWrapperChoice>
</template>
