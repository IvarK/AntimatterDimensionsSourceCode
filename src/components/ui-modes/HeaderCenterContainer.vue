<script>
import RealityMachinesHeader from "../RealityMachinesHeader";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";
import HeaderTickspeedRow from "./HeaderTickspeedRow";
import RealityButton from "./RealityButton";

// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button
export default {
  name: "HeaderCenterContainer",
  components: {
    GameSpeedDisplay,
    HeaderTickspeedRow,
    RealityMachinesHeader,
    RealityButton,
  },
  data() {
    return {
      isModern: false,
      hasRealityButton: false,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0),
      realityMachines: new Decimal(0),
      unlockedIM: false,
      machineStr: "",
    };
  },
  methods: {
    update() {
      this.isModern = player.options.newUI;
      this.antimatter.copyFrom(Currency.antimatter);
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      if (!this.hasRealityButton) this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
    },
  },
};
</script>

<template>
  <div>
    <span>You have <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span> antimatter.</span>
    <div
      v-if="hasRealityButton"
      class="c-reality-container"
    >
      <RealityMachinesHeader />
      <RealityButton />
    </div>
    <div v-else>
      You are getting {{ format(antimatterPerSec, 2) }} antimatter per second.
      <br>
      <GameSpeedDisplay
        v-if="isModern"
        :is-standalone="true"
      />
      <HeaderTickspeedRow v-else />
    </div>
  </div>
</template>

<style scoped>
.c-reality-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
