"use strict";

Vue.component("autobuyers-tab", {
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
        <div class="l-autobuyer-grid__row">
          <dimension-autobuyer-box v-for="tier in 3" :key="tier" :tier="tier"/>
        </div>
        <div class="l-autobuyer-grid__row">
          <dimension-autobuyer-box v-for="tier in 3" :key="tier + 3" :tier="tier + 3"/>
        </div>
        <div class="l-autobuyer-grid__row">
          <dimension-autobuyer-box v-for="tier in 2" :key="tier + 6" :tier="tier + 6"/>
          <tickspeed-autobuyer-box />
        </div>
        <div class="l-autobuyer-grid__row">
          <sacrifice-autobuyer-box />
        </div>
      </div>
    </div>`
});
