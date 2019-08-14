"use strict";

Vue.component("reality-upgrades-tab", {
  computed: {
    upgrades: () => RealityUpgrades.all
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  },
  template: `
    <div class="l-reality-upgrade-grid">
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
