<script>
import ArmageddonButton from "../tabs/celestial-pelle/ArmageddonButton";
import RealityMachinesHeader from "../RealityMachinesHeader";

import HeaderTickspeedRowClassic from "./HeaderTickspeedRowClassic";
import HeaderTickspeedRowModern from "./HeaderTickspeedRowModern";
import RealityButton from "./RealityButton";

// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button
export default {
  name: "HeaderCenterContainer",
  components: {
    HeaderTickspeedRowClassic,
    HeaderTickspeedRowModern,
    RealityMachinesHeader,
    RealityButton,
    ArmageddonButton,
  },
  data() {
    return {
      isModern: false,
      hasRealityButton: false,
      isDoomed: false,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0),
    };
  },
  methods: {
    update() {
      this.isModern = player.options.newUI;
      this.isDoomed = Pelle.isDoomed;
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
      <ArmageddonButton
        v-if="isDoomed"
        :is-header="true"
      />
      <RealityButton v-else />
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
