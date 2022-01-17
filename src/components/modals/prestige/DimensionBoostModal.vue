<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DimensionBoostModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    modalConfig: {
      type: Object,
      required: true,
    }
  },
  computed: {
    bulk() { return this.modalConfig.bulk; },
    topLabel() {
      return `You are about to do a Dimension Boost Reset`;
    },
    message() {
      const areDimensionsReset = Perk.antimatterNoReset.isBought || Achievement(111).isUnlocked
        ? `not reset anything because you have ${Perk.antimatterNoReset.isBought ? "Perk ANR" : "Achievement 111"}`
        : `reset your Antimatter and Antimatter Dimensions`;

      return `This will ${areDimensionsReset}. Are you sure you want to do this?`;
    },
  },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, this.emitClose);
    this.on$(GAME_EVENT.BIG_CRUNCH_AFTER, this.emitClose);
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      requestDimensionBoost(this.bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    @close="emitClose"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
