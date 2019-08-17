"use strict";

Vue.component("sidebar-ep", {
  data() {
    return {
      ep: new Decimal(0),
    };
  },
  props: {
    cond: Boolean
  },
  methods: {
    update() {
      this.ep.copyFrom(player.eternityPoints);
    }
  },
  template:
  `<div class="resource">
    <div v-if="cond">
      <h2 class="o-sidebar-eternity-button">{{ shorten(ep, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Eternity Points</span>
      </div>
    </div>
  </div>`
});