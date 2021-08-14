"use strict";

Vue.component("sidebar-rm", {
  data() {
    return {
      rm: new Decimal(0),
      im: 0,
    };
  },
  methods: {
    update() {
      this.rm.copyFrom(Currency.realityMachines);
      this.im = Currency.imaginaryMachines.value;
    }
  },
  template: `
    <div class="resource">
      <div v-if="im === 0">
        <h2 class="o-sidebar-reality-button">{{ format(rm, 2) }}</h2>
        <div class="resource-information">
          <span class="resource-name">Reality {{ "Machine" | pluralize(rm) }}</span>
        </div>
      </div>
      <div v-else>
        <h3 class="o-sidebar-reality-button">
          {{ format(rm, 2) }}<br> + {{ format(im, 2) }}i
        </h3>
        <div class="resource-information">
          <span class="resource-name">Machines</span>
        </div>
      </div>
    </div>`
});
