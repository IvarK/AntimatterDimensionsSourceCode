"use strict";

Vue.component("autobuyers-tab", {
  data: () => ({
    hasContinuum: false
  }),
  methods: {
    update() {
      this.hasContinuum = Laitela.continuumActive;
    }
  },
  template:
    `<div class="l-autobuyers-tab">
      <autobuyer-toggles class="l-autobuyers-tab__toggles" />
      <table style="width: 90rem;">
        <tbody>
          <reality-autobuyer-box />
          <eternity-autobuyer-box />
          <dimboost-autobuyer-box />
          <galaxy-autobuyer-box />
          <big-crunch-autobuyer-box />
          <div v-if="hasContinuum">
            <dimension-autobuyer-box v-for="tier in 8" :key="tier" :tier="tier"/>
          </div>
          <div v-else>
            Continuum makes Normal Dimension and tickspeed autobuyers obsolete, 
            as you now automatically have a certain amount of simulated Normal Dimension 
            and tickspeed purchases based on your antimatter.
          </div>
          <tickspeed-autobuyer-box />
          <sacrifice-autobuyer-box />
        </tbody>
      </table>
    </div>`
});
