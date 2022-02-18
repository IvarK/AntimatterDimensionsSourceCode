<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "PelleEffectsModal",
  components: {
    PrimaryButton,
    ModalWrapper,
  },
  data() {
    return {
      nerfs: [
        // Numerical nerfs and disabled boosts
        "Anything unlocked through a Pelle upgrade cannot be unlocked normally",
        "All pre-Doomed IP and EP multipliers are disabled",
        "All pre-Doomed Replicanti speed multipliers are disabled",
        "Most Eternity Challenges are harder",
        "All Galaxies are only 50% as effective",
        "Antimatter Dimension multiplier is divided by 10",
        "Achievement multiplier and many achievement rewards are disabled",
        "All Infinity and Eternity multipliers and generation are disabled",
        "Black Holes are disabled",
        `Reality Upgrade "Temporal Transcendence" is disabled`,

        // Initial QoL and automation
        "All rewards which increase your starting resources are disabled",
        "All rewards which prevent resources from being reset are disabled",
        "Perk rewards which reduce unlock costs have been disabled",
        "Automatic Infinity and Eternity Challenges are disabled",
        "All Dimension and pre-Infinity Autobuyers are disabled until reacquired through Pelle",
        "The Time Theorem Autobuyer is disabled",
        "All Automation related to Time Dilation or later are disabled",

        // Time studies + Dilation
        "Eternity Upgrade to Time Dimensions based on days played is based on this Armageddon time",
        "All pre-Doomed Dilated Time multipliers are disabled except the 2x buyable",
        "All Tachyon Particle multipliers are disabled",
        "All pre-Doomed Time Theorem generation effects are disabled except the Dilation upgrade",

        // Glyphs
        "Glyph equipping is disabled until reacquired",
        "Glyph levels are lowered and rarity is set to 0%",
        "Effects from Glyph Sacrifice, Alteration, and Alchemy are all disabled",

        // Celestial features
        "All rewards from Effarig are disabled",
        "Infinity Upgrades cannot be charged",
        "Triad Studies and Space Theorems are disabled",
        "Imaginary Upgrades are disabled",
        "Continuum and Singularity rewards are disabled"
      ]
    };
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      List of disabled effects in Doomed
    </template>
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
      @click="emitClose"
    >
      Okay
    </PrimaryButton>
  </ModalWrapper>
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
