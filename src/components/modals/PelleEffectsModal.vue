<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "PelleEffectsModal",
  components: {
    PrimaryButton,
    ModalCloseButton,
  },
  data() {
    return {
      nerfs: [
        "All pre-doomed IP multipliers are disabled",
        "All pre-doomed EP multipliers are disabled",
        "All infinity multipliers and infinity generation are disabled",
        "All eternity multipliers and eternity generation are disabled",
        "Black Hole is disabled",
        "All \"Start with X currency\" rewards are disabled",
        "All pre-doomed Dilated Time multipliers are disabled except the 2x buyable",
        "All Tachyon Particle multipliers are disabled",
        "Automatic Eternity Challenges are disabled",
        "Imaginary Upgrades are disabled",
        "Reality Upgrade \"Existentially Prolong\" is disabled",
        "Replicanti Interval multipliers are disabled except the interval upgrade",
        "The following achievement rewards are disabled: 143, 142, 141, 125, 118, 117, 111, 103, 92, 91, 76, 74, 65",
        "Achievement multiplier is disabled",
        "Antimatter Dimension Autobuyers are disabled until reacquired",
        "Infinity Dimension Autobuyers are disabled until reacquired",
        "Time Dimension Autobuyers are disabled until reacquired",
        "Dimensional Boost Autobuyer is disabled until reacquired",
        "Antimatter Galaxy Autobuyer is disabled until reacquired",
        "Tickspeed Autobuyer is disabled until reacquired",
        "Time Theorem Autobuyer is disabled",
        "All Effarig effects are disabled",
        "Charged Infinity Upgrades are disabled",
        "Continumm is disabled",
        "Singularity rewards are disabled",
        "Glyph Alchemy effects are disabled",
        "Glyph Alteration effects are disabled",
        "Glyph Sacrifice effects are disabled",
        "Triad Studies and Space Theorems are disabled",
        "All Time Dilation related automation is disabled",
        "Automatic Time Dimension unlocks are disabled",
        "Automatic Eternity Upgrades are disabled",
        "Dilation Glyph Time Theorem generation is disabled",
        "Time Theorem generation multipliers and powers are disabled",
        "\"Dimension boost resets nothing\" -rewards are disabled",
        "Most Eternity Challenges are harder",
        "Infinity Challenges aren't completed automatically",
        "Galaxies are only 50% as effective",
        "Antimatter Dimension multiplier is divided by 10",
        "Infinity Dimensions require antimatter to unlock",
        "Reality Upgrade \"Temporal Transcendence\" is disabled",
        "Glyph equipping is disabled until reacquired",
        "Effective Glyph levels are lowered",
        "Effective Glyph rarity is set to the lowest possible",
        "Eternity Upgrade to Time Dimensions based on days played is based on this armageddon time",
        "Time Dilation unlock requires ECs again"
      ]
    };
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
  },
  methods: {
    update() {
      this.message = this.modal.message;
    },
    handleClick() {
      this.modal.callback?.();
      this.emitClose();
    }
  },
};
</script>

<template>
  <div class="l-modal-content--centered">
    <ModalCloseButton
      v-if="modal.closeButton"
      class="c-modal__close-btn--tiny"
      @click="emitClose"
    />
    <h1>List of disabled effects in Doomed</h1>
    <div class="pelle-effects-container">
      <p
        v-for="(nerf, idx) in nerfs"
        :key="idx"
      >
        {{ nerf }}
      </p>
    </div>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="handleClick"
    >
      Okay
    </PrimaryButton>
  </div>
</template>

<style scoped>
  .pelle-effects-container {
    height: 40rem;
    overflow-y: scroll;
  }

  p {
    margin-bottom: 1rem;
  }
</style>