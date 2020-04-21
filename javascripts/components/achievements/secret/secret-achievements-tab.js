"use strict";

Vue.component("secret-achievements-tab", {
  template:
    `<div class="l-achievement-grid">
      <br>
      <secret-achievement-row v-for="row in 4" :key="row" :row="row" />
    </div>`
});