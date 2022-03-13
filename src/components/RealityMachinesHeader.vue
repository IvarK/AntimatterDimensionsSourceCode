<script>
export default {
  name: "RealityMachinesHeader",
  data() {
    return {
      realityMachines: new Decimal(),
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
  }
};
</script>

<template>
  <div class="c-reality-tab__header">
    You have
    <span class="c-reality-tab__reality-machines">
      {{ machineStr }}
    </span>
    {{ pluralize("Reality Machine", realityMachines) }}.
    <span v-if="unlockedIM">
      (Cap: {{ capStr }})
    </span>
  </div>
</template>

<style scoped>

</style>
