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
  data() {
    return {
      isDoomed: false,
    };
  },
  computed: {
    resetTerm() { return this.isDoomed ? "Armageddon" : "Reality"; },
  },
  methods: {
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
    },
    update() {
      this.isDoomed = Pelle.isDoomed;
    }
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      You are about to reset your {{ resetTerm }}
    </template>
    <div class="c-modal-message__text">
      This will put you at the start of your {{ resetTerm }},
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
