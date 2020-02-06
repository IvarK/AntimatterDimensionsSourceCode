"use strict";

Vue.component("eternity-upgrades-tab", {
  computed: {
    grid() {
      return [
        [
          EternityUpgrade.idMultEP,
          EternityUpgrade.idMultEternities,
          EternityUpgrade.idMultICRecords
        ],
        [
          EternityUpgrade.tdMultAchs,
          EternityUpgrade.tdMultTheorems,
          EternityUpgrade.tdMultRealTime,
        ]
      ];
    },
    costIncreases: () => EternityUpgrade.epMult.costIncreaseThresholds.map(x => new Decimal(x)),
  },
  template:
    `<div class="l-eternity-upgrades-grid">
      <div v-for="row in grid" class="l-eternity-upgrades-grid__row">
        <eternity-upgrade-button
          v-for="upgrade in row"
          :key="upgrade.id"
          :upgrade="upgrade"
          class="l-eternity-upgrades-grid__cell"
        />
      </div>
      <ep-multiplier-button />
      <div>
        The cost for the EP multiplier jumps at {{format(costIncreases[0])}} EP,
        {{format(costIncreases[1], 2, 2)}} EP, and {{format(costIncreases[2])}} EP.
        <br>
        It gets expensive more quickly past {{format(costIncreases[3])}} EP.
      </div>
    </div>`
});