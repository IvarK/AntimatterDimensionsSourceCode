<script>
import FullScreenAnimationHandler from "@/core/full-screen-animation-handler";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterDilationModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      return `Dilating time will start a new Eternity, and all Dimension multiplier's exponents and
        tickspeed multiplier's exponent will be reduced to ${formatPow(0.75, 2, 2)}. If you can Eternity while Dilated,
        your Tachyon Particles will be increased to a value based on your highest antimatter and any Tachyon Particle
        multipliers you have.`;
    },
    entranceLabel() {
      return `You are about to enter Dilation`;
    },
    EPSinceLabel() {
      if (player.dilation.lastEP.eq(-1)) {
        return "This is your first Dilation";
      }
      if (!isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied) {
        return `You already have the maximum feasible amount of Tachyon Particles you can attain due to
          Teresa's Level ${formatInt(25)} reward.`;
      }
      return `You last completed Dilation at ${format(player.dilation.lastEP, 2, 2)} Eternity Points.`;
    }
  },
  methods: {
    handleYesClick() {
      if (player.dilation.active) return;
      if (player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying) {
        animateAndDilate();
      } else {
        startDilatedEternity();
      }
      if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="dilation"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ EPSinceLabel }}
      <br>
      <br>
      {{ message }}
    </div>
    <template #confirm-text>
      Enter
    </template>
  </ModalWrapperChoice>
</template>
