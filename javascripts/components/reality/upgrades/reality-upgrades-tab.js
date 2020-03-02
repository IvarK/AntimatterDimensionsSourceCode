"use strict";

Vue.component("reality-upgrades-tab", {
  computed: {
    upgrades: () => RealityUpgrades.all,
    maxNumber: () => Decimal.NUMBER_MAX_VALUE,
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  },
  template: `
    <div class="l-reality-upgrade-grid">
      The first row of upgrades can be purchased endlessly, but get expensive more quickly above {{ format(1e30) }} RM
      and {{ format(maxNumber, 1) }} RM.
      <br>
      The rest of the upgrades are one-time upgrades which have an unlocking requirement in addition to an RM cost.
      <br>
      These requirements, once completed, permanently unlock the ability to purchase the upgrades at any point.
      <br>
      Upgrades show their requirements by default; hold shift to see the costs for the upgrades instead.
      <br>
      <br>
      <div v-for="row in 5" class="l-reality-upgrade-grid__row">
        <reality-upgrade-button
          v-for="column in 5"
          :key="id(row, column)"
          :upgrade="upgrades[id(row, column)]" 
        />
      </div>
    </div>
  `
});
