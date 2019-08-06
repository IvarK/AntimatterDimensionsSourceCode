"use strict";

Vue.component("sidebar-ip", {
  data() {
    return {
      ip: new Decimal(0),
    };
  },
  props: {
    cond: Boolean
  },
  methods: {
    update() {
      this.ip.copyFrom(player.infinityPoints);
    },
  },
  template:
  `<div class="resource">
    <div v-if="cond">
      <h2 class="o-color-infinity">{{ shorten(ip, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Infinity Points</span>
      </div>
    </div>
  </div>`
});