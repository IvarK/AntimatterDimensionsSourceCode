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
      if (this.canUnlock) {
        return "Unlock a new\nInfinity Dimension";
      }
      const nextDimension = InfinityDimensions.next();
      const amDisplay = format(nextDimension.amRequirement);
      const ipDisplay = format(nextDimension.ipRequirement);
      if (nextDimension.hasIPUnlock) {
        return `Reach ${ipDisplay} Infinity Points and ${amDisplay} antimatter to unlock Infinity Dimensions`;
      }
      return `Reach ${amDisplay} antimatter to unlock a new Infinity Dimension`;
    },
    buttonClassObject() {
      return {
        "o-infinity-button--unavailable": !this.canUnlock
      };
    },
  },
  methods: {
    update() {
      this.isVisible = player.break && !InfinityDimension(8).isUnlocked &&
        player.records.thisEternity.maxIP.lt(Decimal.NUMBER_MAX_VALUE) &&
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
    class="o-prestige-button o-infinity-button l-game-header__new-dim-btn"
    @click="tryUnlockNextInfinityDimension"
  >
    {{ text }}
  </button>
</template>

<style scoped>

</style>
