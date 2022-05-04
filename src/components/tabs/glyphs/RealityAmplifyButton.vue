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
      this.canAmplify = !this.isDisabled && this.ratio > 1 && !this.isDoomed;
    },
    toggleActive() {
      if (!this.canAmplify) return;
      Enslaved.boostReality = !Enslaved.boostReality;
    }
  }
};
</script>

<template>
  <div v-if="isVisible">
    <button
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
        <br>
        All rewards ×{{ formatInt(ratio) }}
      </div>
      <div v-else>
        Not enough stored real time to amplify.
      </div>
    </button>
  </div>
</template>

<style scoped>
.c-button-wrapper {
  width: 100%;
}
</style>
