"use strict";

Vue.component("sidebar-am", {
  data() {
    return {
      am: new Decimal(0),
      perSecond: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.am.copyFrom(player.money);
      this.perSecond.copyFrom(Player.antimatterPerSecond);
    }
  },
  template:
  `<div class="resource">
    <h2 id="antimatter">{{ shorten(am, 2, 1) }}</h2>
    <div class="resource-information">
      <span class="resource-name">Antimatter</span>
      <span class="resource-per-second"> +{{ shorten(perSecond, 2, 0) }}/s</span>
    </div>
  </div>`
});