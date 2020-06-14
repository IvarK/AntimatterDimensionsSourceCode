"use strict";

Vue.component("reset-reality-button", {
  data() {
    return {
      canReality: false,
    };
  },
  methods: {
    update() {
      this.canReality = TimeStudy.reality.isBought && player.eternityPoints.gte("1e4000");
    },
    resetReality() {
      resetReality();
    },
  },
  template: `
  <button :class="['l-reset-reality-button', 'c-reset-reality-button']"
          @click="resetReality">
    <div class="l-reality-button__contents">
      Start this Reality over
    </div>
  </button>
  `
});