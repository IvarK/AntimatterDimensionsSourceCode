<script>
import EPMultiplierButton from "./EPMultiplierButton";
import EternityUpgradeButton from "./EternityUpgradeButton";

export default {
  name: "EternityUpgradesTab",
  components: {
    EternityUpgradeButton,
    EPMultiplierButton
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
    formatPostBreak
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
      <EternityUpgradeButton
        v-for="upgrade in row"
        :key="upgrade.id"
        :upgrade="upgrade"
        class="l-eternity-upgrades-grid__cell"
      />
    </div>
    <EPMultiplierButton />
    <div>
      The cost for the {{ formatX(5) }} multiplier jumps at {{ format(costIncreases[0]) }},
      {{ formatPostBreak(costIncreases[1], 2) }}, and {{ formatPostBreak(costIncreases[2]) }} Eternity Points.
      <br>
      The cost increases super-exponentially after {{ formatPostBreak(costIncreases[3]) }} Eternity Points.
    </div>
  </div>
</template>

<style scoped>
.l-eternity-upgrades-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.l-eternity-upgrades-grid__row {
  display: flex;
  flex-direction: row;
}

.l-eternity-upgrades-grid__cell {
  margin: 0.5rem 0.8rem;
}
</style>
