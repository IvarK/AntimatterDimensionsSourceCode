"use strict";

Vue.component("reality-amplify-button", {
  data: () => ({
    isUnlocked: false,
    isActive: false,
    ratio: 1,
  }),
  computed: {
  },
  methods: {
    update() {
      this.isUnlocked = Enslaved.isUnlocked;
      this.isActive = Enslaved.boostReality;
      this.ratio = Enslaved.realityBoostRatio;
    },
    toggleActive() {
      Enslaved.boostReality = !Enslaved.boostReality;
    }
  },
  template: `
  <div v-if="isUnlocked"
       class="l-reality-amplify-button">
    <button :class="['o-enslaved-mechanic-button',
                     {'o-enslaved-mechanic-button--storing-time': isActive}]"
            @click="toggleActive">
      <div>Amplify using stored real time</div>
      <div>× {{shortenSmallInteger(ratio)}}</div>
    </button>
  </div>`
});