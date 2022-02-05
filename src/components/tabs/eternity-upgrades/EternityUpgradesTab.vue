<script>
import EternityUpgradeButton from "./EternityUpgradeButton";
import EpMultiplierButton from "./EpMultiplierButton";

export default {
  name: "EternityUpgradesTab",
  components: {
    EternityUpgradeButton,
    EpMultiplierButton
  },
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
  }
};
</script>

<template>
  <div class="l-eternity-upgrades-grid">
    <div
      v-for="(row, i) in grid"
      :key="i"
      class="l-eternity-upgrades-grid__row"
    >
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
  </div>
</template>

<style scoped>

</style>
