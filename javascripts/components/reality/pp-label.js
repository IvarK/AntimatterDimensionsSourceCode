"use strict";

Vue.component("pp-label", {
  data() {
    return {
      pp: 0
    };
  },
  methods: {
    update() {
      this.pp = Math.floor(player.reality.pp);
    }
  },
  template: `
    <div class="c-pp-label">You have {{ format(pp, 2, 0) }} {{"Perk Point" | pluralize(pp)}}</div>
  `
});
