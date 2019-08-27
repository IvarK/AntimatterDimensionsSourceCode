"use strict";

Vue.component("sidebar-rm", {
  data() {
    return {
      rm: new Decimal(0)
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
      <h2 class="o-sidebar-reality-button">{{ shorten(rm, 2, 0) }}</h2>
      <div class="resource-information">
        <span class="resource-name">Reality Machines</span>
      </div>
    </div>
  </div>`
});