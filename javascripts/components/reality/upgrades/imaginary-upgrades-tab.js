"use strict";

Vue.component("imaginary-upgrades-tab", {
  data() {
    return {
      capRM: new Decimal(0),
      capIM: 0,
      scaleTime: 0,
    };
  },
  computed: {
    upgrades: () => ImaginaryUpgrades.all,
    maxNumber: () => Decimal.NUMBER_MAX_VALUE,
  },
  methods: {
    update() {
      this.capRM.copyFrom(MachineHandler.hardcapRM);
      this.capIM = MachineHandler.currentIMCap;
      this.scaleTime = MachineHandler.scaleTimeForIM;
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  },
  template: `
    <div class="l-reality-upgrade-grid">
      You have reached the limits of reality and cannot hold more than {{ format(capRM) }} Reality Machines.
      <br>
      Machines gained in excess of {{ format("1e1000") }} will raise the maximum amount of Imaginary Machines
      you can have. (Currently capped at {{ format(capIM, 2, 2) }} Imaginary Machines)
      <br>
      Imaginary machines are gained passively over time up to the cap, but the rate of gain slows down exponentially
      as you approach the cap.
      The amount of iM below the cap will be cut in half every {{ formatInt(scaleTime) }} seconds.
      <br>
      <br>
      <div v-for="row in 5" class="l-reality-upgrade-grid__row">
        <imaginary-upgrade-button
          v-for="column in 5"
          :key="id(row, column)"
          :upgrade="upgrades[id(row, column)]"
        />
      </div>
    </div>
  `
});
