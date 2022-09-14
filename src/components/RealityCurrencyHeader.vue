<script>
export default {
  name: "RealityCurrencyHeader",
  data() {
    return {
      isDoomed: false,
      currencyValue: new Decimal(),
      currencyName: "",
    };
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      if (this.isDoomed) {
        const shards = Currency.realityShards.value;
        this.currencyValue = format(shards, 2, 2);
        this.currencyName = pluralize("Reality Shard", shards);
      } else {
        const rm = Currency.realityMachines.value;
        this.currencyValue = formatMachines(rm, Currency.imaginaryMachines.value);
        this.currencyName = pluralize("Reality Machine", rm);
      }
    },
    resourceClass() {
      return {
        "c-reality-tab__reality-machines": true,
        "c-shard-color": this.isDoomed
      };
    }
  }
};
</script>

<template>
  <div class="c-reality-currency">
    You have
    <b :class="resourceClass()">
      {{ currencyValue }}
    </b>
    {{ currencyName }}.
  </div>
</template>

<style scoped>
.c-reality-currency {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.c-shard-color {
  color: var(--color-pelle--base);
}
</style>
