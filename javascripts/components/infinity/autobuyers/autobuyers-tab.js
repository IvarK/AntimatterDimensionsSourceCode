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
      <div class="l-autobuyer-grid">
        <div class="l-autobuyer-grid__row">
          <reality-autobuyer-box />
          <eternity-autobuyer-box />
        </div>
        <div class="l-autobuyer-grid__row">
          <dimboost-autobuyer-box />
          <galaxy-autobuyer-box />
          <big-crunch-autobuyer-box />
        </div>
        <div v-if="!hasContinuum">
          <div class="l-autobuyer-grid__row">
            <dimension-autobuyer-box v-for="column in 3" :key="column" :tier="column"/>
          </div>
          <div class="l-autobuyer-grid__row">
            <dimension-autobuyer-box v-for="column in 3" :key="column + 3" :tier="column + 3"/>
          </div>
          <div class="l-autobuyer-grid__row">
            <dimension-autobuyer-box v-for="column in 2" :key="column + 6" :tier="column + 6"/>
            <tickspeed-autobuyer-box />
          </div>
        </div>
        <div v-else>
          <br>
          Continuum makes Normal Dimension and tickspeed autobuyers obsolete, 
          as you now automatically have a certain amount of simulated Normal Dimension 
          and tickspeed purchases based on your antimatter.
          <br>
          <br>
        </div>
        <div class="l-autobuyer-grid__row">
          <sacrifice-autobuyer-box />
        </div>
      </div>
    </div>`
});
