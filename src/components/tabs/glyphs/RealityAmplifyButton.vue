<script>
export default {
  name: "RealityAmplifyButton",
  data: () => ({
    isDoomed: false,
    isVisible: false,
    isDisabled: false,
    isActive: false,
    ratio: 1,
    canAmplify: false,
  }),
  computed: {
    tooltip() {
      if (this.isDoomed) return "You cannot amplify a Doomed Reality";
      if (this.isDisabled) return "You cannot amplify Celestial Realities";
      if (!this.canAmplify) {
        return "Store more real time or complete the Reality faster to amplify";
      }
      return null;
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isVisible = Enslaved.isUnlocked;
      this.isDisabled = isInCelestialReality();
      this.isActive = Enslaved.boostReality;
      this.ratio = Enslaved.realityBoostRatio;
      this.canAmplify = Enslaved.canAmplify;
    },
    toggleActive() {
      if (!this.canAmplify) return;
      Enslaved.boostReality = !Enslaved.boostReality;
    }
  }
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="['l-reality-amplify-button', {'o-enslaved-mechanic-button--storing-time': isActive}]"
    class="c-button-wrapper"
    :ach-tooltip="tooltip"
    @click="toggleActive"
  >
    <div v-if="isDoomed">
      You cannot amplify Doomed Realities.
    </div>
    <div v-else-if="canAmplify">
      <span v-if="isActive">Will be amplified:</span>
      <span v-else>Amplify this Reality:</span>
      All rewards ×{{ formatInt(ratio) }}
    </div>
    <div v-else>
      Not enough stored real time to amplify.
    </div>
  </button>
</template>

<style scoped>
.c-button-wrapper {
  width: calc(100% - 1rem);
  margin-bottom: 1rem;
}
</style>
