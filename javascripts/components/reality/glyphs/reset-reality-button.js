"use strict";

Vue.component("reset-reality-button", {
  data() {
    return {
      canReality: false,
      resetCelestial: false,
      isInCelestialReality: false,
    };
  },
  methods: {
    update() {
      this.canReality = TimeStudy.reality.isBought && Currency.eternityPoints.exponent >= 4000;
      this.resetCelestial = player.options.retryCelestial;
      this.isInCelestialReality = Object.values(player.celestials).some(x => x.run);
    },
    resetReality() {
      const confirms = player.options.confirmations;
      if (this.isInCelestialReality) {
        if (confirms.resetCelestial) Modal.exitCelestialReality.show();
        else beginProcessReality(getRealityProps(true));
      } else if (confirms.resetReality) Modal.resetReality.show();
      else beginProcessReality(getRealityProps(true));
    },
    resetText() {
      if (this.isInCelestialReality && !this.resetCelestial) return "Exit this Celestial early";
      if (this.isInCelestialReality && this.resetCelestial) return "Restart this Celestial";
      return "Start this Reality over";
    },
  },
  template: `
    <button
      :class="['l-reset-reality-button', 'c-reset-reality-button',
        {'c-reset-reality-button-celestial': isInCelestialReality}]"
      @click="resetReality"
    >
      <div class="l-reality-button__contents">{{ resetText() }}</div>
    </button>`
});
