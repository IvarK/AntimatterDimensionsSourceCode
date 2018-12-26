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
      <div v-for="row in grid" class="l-eternity-upgrades-grid__row">
        <eternity-upgrade-button
          v-for="getUpgrade in row"
          :key="getUpgrade().id"
          :getUpgrade="getUpgrade"
          class="l-eternity-upgrades-grid__cell"
        />
      </div>
      <ep-multiplier-button />
    </div>`
});