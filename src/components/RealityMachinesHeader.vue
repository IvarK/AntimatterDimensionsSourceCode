<script>
export default {
  name: "RealityMachinesHeader",
  data() {
    return {
      realityMachines: new Decimal(),
      machineStr: "",
    };
  },
  methods: {
    update() {
      this.realityMachines.copyFrom(Currency.realityMachines.value);
      this.machineStr = formatMachines(this.realityMachines, Currency.imaginaryMachines.value);
    }
  }
};
</script>

<template>
  <div class="c-reality-tab__header">
    You have
    <b class="c-reality-tab__reality-machines">
      {{ machineStr }}
    </b>
    {{ pluralize("Reality Machine", realityMachines) }}.
  </div>
</template>

<style scoped>

</style>
