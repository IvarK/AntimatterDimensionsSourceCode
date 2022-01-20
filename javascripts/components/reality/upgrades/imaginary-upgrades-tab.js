import "./imaginary-upgrade-button.js";

Vue.component("imaginary-upgrades-tab", {
  data() {
    return {
      baseRMCap: new Decimal(0),
      capRM: new Decimal(0),
      scaleTime: 0,
    };
  },
  computed: {
    upgrades: () => ImaginaryUpgrades.all,
    maxNumber: () => Decimal.NUMBER_MAX_VALUE,
  },
  methods: {
    update() {
      this.baseRMCap.copyFrom(MachineHandler.baseRMCap);
      this.capRM.copyFrom(MachineHandler.hardcapRM);
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
      Machines gained in excess of {{ format(baseRMCap) }} will raise the maximum amount of Imaginary Machines
      you can have.
      <br>
      Imaginary Machines are gained passively over time up to the cap, but gain slows down exponentially
      as you approach the cap.
      <br>
      The amount of iM below the cap will be cut in half every {{ formatInt(scaleTime) }} seconds.
      <br>
      <br>
      The first two rows of upgrades can be purchased endlessly and the rest of the upgrades are one-time upgrades
      <br>
      which have an unlocking requirement in addition to costing Imaginary Machines.
      <br>
      The visual behavior of these upgrades is identical to upgrades in the Reality Upgrades tab.
      <br><br>
      <div v-for="row in 5" class="l-reality-upgrade-grid__row">
        <imaginary-upgrade-button
          v-for="column in 5"
          :key="id(row, column)"
          :upgrade="upgrades[id(row, column)]"
        />
      </div>
    </div>`
});
