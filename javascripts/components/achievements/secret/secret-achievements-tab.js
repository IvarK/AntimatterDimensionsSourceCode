"use strict";

Vue.component("secret-achievements-tab", {
  template:
  `<div class="l-achievements-tab">
    <div class="c-achievements-tab__header">
      <span>
        Secret Achievements are optional and give no bonuses.
      </span>
    </div>
    <div class="l-achievement-grid">
      <secret-achievement-row v-for="row in 4" :key="row" :row="row" />
    </div>
  </div>`
});
