"use strict";

Vue.component("reality-machines-header", {
  data() {
    return {
      realityMachines: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.realityMachines.copyFrom(player.reality.realityMachines);
    }
  },
  template: `
    <div class="l-rm-amount__desc c-rm-amount__desc">
      You have
      <span class="c-rm-amount">{{ format(realityMachines, 2, 0) }}</span>
      {{ "Reality Machine" | pluralize(realityMachines) }}.
    </div>
  `
});
