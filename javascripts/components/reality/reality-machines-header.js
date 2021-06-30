"use strict";

Vue.component("reality-machines-header", {
  data() {
    return {
      realityMachines: new Decimal(0),
      imaginaryMachines: 0,
      unlockedIM: false,
      capRM: new Decimal(0),
      capIM: 0,
    };
  },
  methods: {
    update() {
      this.realityMachines.copyFrom(Currency.realityMachines.value);
      this.imaginaryMachines = Currency.imaginaryMachines.value;
      this.unlockedIM = this.imaginaryMachines > 0 || this.realityMachines.exponent >= 1000;
      this.capRM.copyFrom(MachineHandler.hardcapRM);
      this.capIM = MachineHandler.finalIMCap;
    }
  },
  template: `
    <div class="c-reality-tab__header">
      You have
      <span class="c-reality-tab__reality-machines">
        {{ format(realityMachines, 2) }}
        <span v-if="unlockedIM">+ {{ format(imaginaryMachines, 2, 2) }}i</span>
      </span>
      {{ "Reality Machine" | pluralize(realityMachines) }}.
      <span v-if="unlockedIM">
        (Cap: {{ format(capRM, 2, 2) }} + {{ format(capIM, 2, 2) }}i)
      </span>
    </div>`
});
