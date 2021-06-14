"use strict";

Vue.component("imaginary-upgrades-tab", {
  data() {
    return {
      capRM: new Decimal(0),
    };
  },
  computed: {
    upgrades: () => ImaginaryUpgrades.all,
    maxNumber: () => Decimal.NUMBER_MAX_VALUE,
  },
  methods: {
    update() {
      this.capRM.copyFrom(MachineHandler.hardcapRM);
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  },
  template: `
    <div class="l-reality-upgrade-grid">
      You have reached the limits of reality and cannot hold more than {{ format(capRM) }} Reality Machines.
      Machines gained in excess of this cap will be converted into Imaginary Machines.
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
