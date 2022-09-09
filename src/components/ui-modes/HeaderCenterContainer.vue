<script>
import HeaderTickspeedRow from "./HeaderTickspeedRow";

export default {
  name: "HeaderCenterContainer",
  components: {
    HeaderTickspeedRow,
  },
  data() {
    return {
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.antimatter.copyFrom(Currency.antimatter);
      this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
    },
  },
};
</script>

<template>
  <div>
    You have <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span> antimatter.
    <br>
    You are getting {{ format(antimatterPerSec, 2) }} antimatter per second.
    <HeaderTickspeedRow />
  </div>
</template>

<style scoped>

</style>
