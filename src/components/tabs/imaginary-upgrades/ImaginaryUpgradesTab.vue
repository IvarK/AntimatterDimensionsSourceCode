<script>
import ImaginaryUpgradeButton from "./ImaginaryUpgradeButton";

export default {
  name: "ImaginaryUpgradesTab",
  components: {
    ImaginaryUpgradeButton
  },
  data() {
    return {
      baseRMCap: new Decimal(),
      capRM: new Decimal(),
      scaleTime: 0,
      capStr: "",
    };
  },
  computed: {
    upgrades: () => ImaginaryUpgrades.all,
    lockTooltip: () => `Requirement locks only prevent manual and automated actions. Any related upgrades
      will not be disabled and may still cause requirements to be failed.`,
  },
  methods: {
    update() {
      this.baseRMCap.copyFrom(MachineHandler.baseRMCap);
      this.capRM.copyFrom(MachineHandler.hardcapRM);
      this.scaleTime = MachineHandler.scaleTimeForIM;
      this.capStr = formatMachines(MachineHandler.hardcapRM, MachineHandler.currentIMCap);
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-cap-text">
      Your Machine cap is <span class="c-reality-tab__reality-machines">{{ capStr }}</span>.
    </div>
    <div class="c-info-text">
      You have reached the limits of Reality and cannot hold more than {{ format(capRM) }} Reality Machines.
      <br>
      Machines gained in excess of {{ format(baseRMCap) }} will raise the maximum amount of Imaginary Machines
      you can have.
      <br>
      Imaginary Machines are gained passively over time up to the cap, but gain slows down exponentially
      as you approach the cap.
      <br>
      Every {{ formatInt(scaleTime) }} seconds the difference in iM between your current amount and the cap
      will be cut in half.
      <br>
      <br>
      The first two rows of upgrades can be purchased endlessly and the rest of the upgrades are one-time upgrades
      with requirements.
      <br>
      Upgrades here have the same gameplay and visual behavior as Reality Upgrades, but cost Imaginary Machines instead.
      <span :ach-tooltip="lockTooltip">
        <i class="fas fa-question-circle" />
      </span>
    </div>
    <div
      v-for="row in 5"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <ImaginaryUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-cap-text {
  color: var(--color-text);
  font-size: 1.5rem;
}

.c-info-text {
  color: var(--color-text);
  margin: 1.5rem;
}
</style>
