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
    costIncreases: () => EternityUpgrade.epMult.costIncreaseThresholds.map(x => new Decimal(x))
  },
  methods: {
    formatPostBreak(number, places) {
      return formatPostBreak(number, places);
    }
  },
  template: `
    <div class="l-eternity-upgrades-grid">
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
        The cost for the {{ formatX(5) }} multiplier jumps at {{ format(costIncreases[0]) }},
        {{ formatPostBreak(costIncreases[1], 2) }}, and {{ formatPostBreak(costIncreases[2]) }} Eternity Points.
        <br>
        The cost increases super-exponentially after {{ formatPostBreak(costIncreases[3]) }} Eternity Points.
      </div>
    </div>`
});
