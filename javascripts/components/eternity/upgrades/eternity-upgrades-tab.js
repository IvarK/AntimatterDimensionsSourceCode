Vue.component("eternity-upgrades-tab", {
  computed: {
    grid() {
      return [
        [
          () => EternityUpgrade.idMultEP,
          () => EternityUpgrade.idMultEternities,
          () => EternityUpgrade.idMultICRecords
        ],
        [
          () => EternityUpgrade.tdMultAchs,
          () => EternityUpgrade.tdMultTheorems,
          () => EternityUpgrade.tdMultRealTime,
        ]
      ];
    }
  },
  template:
    `<div class="l-eternity-upgrades-grid">
      <div v-for="(row, rowIdx) in grid" class="l-eternity-upgrades-grid__row">
        <eternity-upgrade-button
          v-for="(getUpgrade, columnIdx) in row"
          :key="rowIdx * 3 + columnIdx"
          :getUpgrade="getUpgrade"
          class="l-eternity-upgrades-grid__cell"
        />
      </div>
      <ep-multiplier-button />
    </div>`
});