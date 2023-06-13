<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PelleEffectsModal",
  components: {
    PrimaryButton,
    ModalWrapper,
  },
  computed: {
    nerfs() {
      return [
        // Numerical nerfs and disabled boosts
        "Anything unlocked through a Pelle upgrade cannot be unlocked normally",
        "All pre-Doomed IP and EP multipliers are disabled",
        "IP generation based on fastest infinity speed is disabled",
        "All pre-Doomed Replicanti speed multipliers are disabled",
        `Replicanti slows down more drastically above ${format(Number.MAX_VALUE, 2)}`,
        "Most Eternity Challenges are harder",
        `All Galaxies are only ${formatPercents(0.5)} as effective`,
        `Antimatter Dimension multiplier is divided by ${formatInt(10)}`,
        "Achievement multiplier and many achievement rewards are disabled",
        "All Infinity and Eternity multipliers and generation are disabled",
        "Black Holes are disabled",
        `Reality Upgrade "Temporal Transcendence" is disabled`,

        // Initial QoL and automation
        "All rewards which increase your starting resources except Achievement 21 are disabled",
        "All rewards which prevent resources from being reset are disabled",
        "Perk rewards which reduce unlock costs have been disabled, excluding the ECR group",
        "Automatic Infinity and Eternity Challenges are disabled",
        "All Dimension and pre-Infinity Autobuyers are disabled until reacquired through Pelle",
        "The Time Theorem Autobuyer is disabled",
        "All Automation related to Time Dilation or later is disabled",

        // Time studies + Dilation
        "Eternity Upgrade to Time Dimensions based on days played is based on this Armageddon time",
        `All pre-Doomed Dilated Time multipliers are disabled except the ${formatX(2)} buyable`,
        "All Tachyon Particle multipliers are disabled",
        "All pre-Doomed Time Theorem generation effects are disabled except the Dilation upgrade",

        // Glyphs
        "Glyph equipping is disabled until reacquired",
        `Glyph levels are lowered and rarity is set to ${formatPercents(0)}`,
        "Effects from Glyph Sacrifice, Alteration, and Alchemy are all disabled",

        // Celestial features
        "You cannot enter any other Celestial Realities",
        "Music Glyphs cannot be bought",
        "All rewards from Effarig are disabled",
        "All features related to storing time are disabled",
        "All rewards from V are disabled",
        `The Teresa Level ${formatInt(1)} effect from Ra is disabled`,
        "Infinity Upgrades cannot be charged",
        "Triad Studies and Space Theorems are disabled",
        "Imaginary Upgrades are disabled excluding those relating to DMD's and Celestial unlocks",
        "Continuum and Singularity rewards are disabled"
      ];
    }
  }
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      List of disabled and nerfed effects in Doomed
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
  overflow-y: scroll;
  height: 40rem;
}

p {
  margin-bottom: 1rem;
}
</style>
