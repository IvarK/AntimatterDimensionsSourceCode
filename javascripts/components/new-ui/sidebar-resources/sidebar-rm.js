"use strict";

Vue.component("sidebar-rm", {
  data() {
    return {
      rm: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.rm.copyFrom(Currency.realityMachines);
    }
  },
  template:
  `<div class="resource">
    <h2 class="o-sidebar-reality-button">{{ format(rm, 2, 0) }}</h2>
    <div class="resource-information">
      <span class="resource-name">Reality {{ "Machine" | pluralize(rm) }}</span>
    </div>
  </div>`
});
