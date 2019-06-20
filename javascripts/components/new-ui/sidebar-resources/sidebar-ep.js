"use strict";

Vue.component("sidebar-ep", {
  data() {
    return {
      ep: new Decimal(0),
      gained: new Decimal(0)
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
      <h2 id="ep">{{ shorten(ep, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Eternity Points</span>
        <span class="resource-per-second"> +{{ shorten(gained) }}</span>
      </div>
    </div>
  </div>`
});