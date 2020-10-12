"use strict";

Vue.component("reset-reality-button", {
  data() {
    return {
      canReality: false,
      resetCelestial: false,
      isInCelestialReality: false,
    };
  },
  computed: {
    classObject() {
      return {
        "l-reset-reality-button": true,
        "c-reset-reality-button": true,
        "c-reset-reality-button-celestial": this.isInCelestialReality,
      };
    }
  },
  methods: {
    update() {
      this.canReality = TimeStudy.reality.isBought && player.eternityPoints.gte("1e4000");
      this.resetCelestial = player.options.retryCelestial;
      this.isInCelestialReality = Object.entries(player.celestials).map(x => x[1].run).includes(true);
    },
    resetReality() {
      resetReality();
    },
    resetText() {
      if (this.isInCelestialReality && !this.resetCelestial) {
        return "Exit Celestial early";
      }
      if (this.isInCelestialReality && this.resetCelestial) {
        return "Start this Celestial over";
      }
      return "Start this Reality over";
    },
  },
  template: `
  <button :class="classObject"
          @click="resetReality">
    <div class="l-reality-button__contents">{{ resetText() }}</div>
  </button>
  `
});
