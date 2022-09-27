<script>
import GameSpeedDisplay from "../GameSpeedDisplay";

import HeaderBlackHole from "./HeaderBlackHole";

export default {
  name: "HeaderGameSpeed",
  components: {
    GameSpeedDisplay,
    HeaderBlackHole
  },
  data() {
    return {
      showSpeed: false,
    };
  },
  methods: {
    update() {
      const ec12 = EternityChallenge(12);
      const hasSeenAlteredSpeed = PlayerProgress.realityUnlocked() || ec12.completions > 0 || ec12.isRunning;
      const hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      // This is additionally shown in a different place on Modern, so we hide it to prevent showing it twice
      this.showSpeed = hasRealityButton || (hasSeenAlteredSpeed && !player.options.newUI);
    },
  }
};
</script>

<template>
  <span>
    <GameSpeedDisplay v-if="showSpeed" />
    <br>
    <HeaderBlackHole />
  </span>
</template>
