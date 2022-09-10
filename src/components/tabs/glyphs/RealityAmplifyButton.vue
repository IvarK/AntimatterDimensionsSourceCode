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
    },
    buttonClass() {
      return {
        "l-reality-amplify-button": true,
        "l-reality-amplify-button--clickable": !this.isDoomed && this.canAmplify,
        "o-enslaved-mechanic-button--storing-time": this.isActive,
      };
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
    :class="buttonClass"
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
</template>

<style scoped>

</style>
