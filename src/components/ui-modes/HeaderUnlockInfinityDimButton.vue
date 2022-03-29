<script>
export default {
  name: "HeaderUnlockInfinityDimButton",
  data() {
    return {
      isVisible: false,
      canUnlock: false,
    };
  },
  computed: {
    text() {
      const nextDimension = InfinityDimensions.next();
      const dimensionText = `a new ${nextDimension.hasIPUnlock ? "type of Dimension" : "Infinity Dimension"}.`;
      if (this.canUnlock) {
        return `Unlock ${dimensionText}`;
      }
      const amDisplay = format(nextDimension.amRequirement);
      const ipDisplay = format(nextDimension.ipRequirement);
      if (nextDimension.hasIPUnlock) {
        return `Reach ${ipDisplay} Infinity Points and ${amDisplay} antimatter to unlock ${dimensionText}`;
      }
      return `Reach ${amDisplay} antimatter to unlock ${dimensionText}`;
    },
    buttonClassObject() {
      return {
        "o-prestige-button": true,
        "o-infinity-button": true,
        "l-game-header__new-dim-btn": true,
        "o-infinity-button--unavailable": !this.canUnlock
      };
    },
  },
  methods: {
    update() {
      this.isVisible = player.break && !InfinityDimension(8).isUnlocked && !Player.canEternity &&
        !EternityMilestone.autoUnlockID.isReached;
      if (!this.isVisible) return;
      this.canUnlock = InfinityDimensions.next().canUnlock;
    },
    tryUnlockNextInfinityDimension() {
      InfinityDimensions.unlockNext();
    }
  },
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClassObject"
    @click="tryUnlockNextInfinityDimension"
  >
    {{ text }}
  </button>
</template>

<style scoped>

</style>
