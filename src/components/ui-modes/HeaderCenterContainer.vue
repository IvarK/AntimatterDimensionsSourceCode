<script>
import GameSpeedDisplay from "@/components/GameSpeedDisplay";
import HeaderTickspeedRow from "./HeaderTickspeedRow";

export default {
  name: "HeaderCenterContainer",
  components: {
    GameSpeedDisplay,
    HeaderTickspeedRow,
  },
  data() {
    return {
      isModern: false,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0)
    };
  },
  methods: {
    update() {
      this.isModern = player.options.newUI;
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
    <br>
    <GameSpeedDisplay
      v-if="isModern"
      :is-standalone="true"
    />
    <HeaderTickspeedRow v-else />
  </div>
</template>

<style scoped>

</style>
