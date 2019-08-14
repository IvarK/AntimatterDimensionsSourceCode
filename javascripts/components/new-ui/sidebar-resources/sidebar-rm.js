"use strict";

Vue.component("sidebar-rm", {
  data() {
    return {
      rm: new Decimal(0),
      gained: new Decimal(0)
    };
  },
  props: {
    cond: Boolean
  },
  methods: {
    update() {
      this.rm.copyFrom(player.reality.realityMachines);
    }
  },
  template:
  `<div class="resource">
    <div v-if="cond">
      <h2 id="rm">{{ shorten(rm, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Reality Machines</span>
        <span class="resource-per-second"> +{{ shorten(gained) }}</span>
      </div>
    </div>
  </div>`
});