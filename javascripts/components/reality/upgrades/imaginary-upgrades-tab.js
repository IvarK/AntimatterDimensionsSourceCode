"use strict";

Vue.component("imaginary-upgrades-tab", {
  data() {
    return {
      capRM: new Decimal(0),
      capIM: 0,
    };
  },
  computed: {
    upgrades: () => ImaginaryUpgrades.all,
    maxNumber: () => Decimal.NUMBER_MAX_VALUE,
  },
  methods: {
    update() {
      this.capRM.copyFrom(MachineHandler.hardcapRM);
      this.capIM = player.reality.iMCap;
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
      as you approach the cap. (TODO: Put the number in this description after testing)
      <br>
      (More imaginary upgrade info-text once we figure out the details...)
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
