"use strict";

Vue.component("reality-machines-header", {
  data() {
    return {
      realityMachines: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.realityMachines.copyFrom(Currency.realityMachines);
    }
  },
  template: `
    <div class="c-reality-tab__header">
      You have
      <span class="c-reality-tab__reality-machines">{{ format(realityMachines, 2, 0) }}</span>
      {{ "Reality Machine" | pluralize(realityMachines) }}.
    </div>
  `
});
