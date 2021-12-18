import "./imaginary-upgrade-button.js";

Vue.component("imaginary-upgrades-tab", {
  data() {
    return {
      baseRMCap: new Decimal(0),
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
      this.baseRMCap.copyFrom(MachineHandler.baseRMCap);
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
      Machines gained in excess of {{ format(baseRMCap) }} will raise the maximum amount of Imaginary Machines
      you can have. (Currently capped at {{ format(capIM, 2, 2) }} Imaginary Machines)
      <br>
      Imaginary Machines are gained passively over time up to the cap, but the rate of gain slows down exponentially
      as you approach the cap.
      The amount of iM below the cap will be cut in half every {{ formatInt(scaleTime) }} seconds.
      <br>
      <br>
      The first two rows of upgrades can be purchased endlessly, and the rest of the upgrades are one-time upgrades
      which have an unlocking requirement in addition to costing Imaginary Machines.
      <br>
      These requirements, once completed, permanently unlock the ability to purchase the upgrades at any point.
      <br>
      Red upgrades are impossible to unlock in your current Reality, while yellow upgrades are still possible.
      <br>
      Locked upgrades show their requirement and effect by default; unlocked ones show
      their effect, current bonus, and cost.
      <br>
      Hold shift to swap this behavior.
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
