Vue.component("reality-machines-header", {
  data() {
    return {
      realityMachines: new Decimal(0),
      unlockedIM: false,
      machineStr: "",
      capStr: "",
    };
  },
  methods: {
    update() {
      this.realityMachines.copyFrom(Currency.realityMachines.value);
      this.unlockedIM = MachineHandler.isIMUnlocked;
      this.machineStr = formatComplex(this.realityMachines, Currency.imaginaryMachines.value);
      this.capStr = formatComplex(MachineHandler.hardcapRM, MachineHandler.currentIMCap);
    }
  },
  template: `
    <div class="c-reality-tab__header">
      You have
      <span class="c-reality-tab__reality-machines">
        {{ machineStr }}
      </span>
      {{ pluralize("Reality Machine", realityMachines) }}.
      <span v-if="unlockedIM">
        (Cap: {{ capStr }})
      </span>
    </div>`
});
