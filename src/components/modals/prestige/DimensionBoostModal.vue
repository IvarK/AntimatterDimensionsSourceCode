<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DimensionBoostModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    topLabel() {
      return `You are about to do a Dimension Boost Reset`;
    },
    message() {
      const areDimensionsReset = (Perk.antimatterNoReset.isBought || Achievement(111).isUnlocked) &&
      (!Pelle.isDoomed || PelleUpgrade.dimBoostResetsNothing.isBought)
        ? `not reset anything because you have ${Perk.antimatterNoReset.isBought ? "Perk ANR" : "Achievement 111"}`
        : `reset your Antimatter and Antimatter Dimensions`;

      return `This will ${areDimensionsReset}. Are you sure you want to do this?`;
    },
  },
  methods: {
    handleYesClick() {
      requestDimensionBoost(this.bulk);
      Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="dimensionBoost"
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
