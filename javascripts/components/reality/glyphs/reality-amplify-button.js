"use strict";

Vue.component("reality-amplify-button", {
  data: () => ({
    isVisible: false,
    isActive: false,
    ratio: 1,
    canAmplify: false,
  }),
  methods: {
    update() {
      this.isVisible = Enslaved.isUnlocked && !isInCelestialReality();
      this.isActive = Enslaved.boostReality;
      this.ratio = Enslaved.realityBoostRatio;
      this.canAmplify = this.ratio > 1;
    },
    toggleActive() {
      if (!this.canAmplify) return;
      Enslaved.boostReality = !Enslaved.boostReality;
    }
  },
  template: `
    <div
      v-if="isVisible"
      class="l-reality-amplify-button"
    >
      <button
        :class="['o-enslaved-mechanic-button', {'o-enslaved-mechanic-button--storing-time': isActive}]"
        style="width: 25rem"
        @click="toggleActive"
      >
        <div v-if="canAmplify">
          <span v-if="isActive">This Reality will be amplified</span>
          <span v-else>Amplify this Reality</span>
          using stored real time, multiplying all rewards by ×{{ formatInt(ratio) }}
        </div>
        <div v-else>
          You do not have enough stored real time to amplify. Store more or complete the Reality in a
          shorter amount of time.
        </div>
      </button>
    </div>`
});
