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
  <button :class="['l-reset-reality-button', 'c-reset-reality-button', 'c-reality-button--bad']"
          @click="resetReality" :style="canReality ? '' : 'visibility: hidden;'">
    <div class="l-reality-button__contents">
      Start reality over
    </div>
  </button>
  `
});