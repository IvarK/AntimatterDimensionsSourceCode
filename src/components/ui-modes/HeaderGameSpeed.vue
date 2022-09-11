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
      this.showSpeed = PlayerProgress.realityUnlocked() || ec12.completions > 0 || ec12.isRunning;
    },
  }
};
</script>

<template>
  <span>
    <GameSpeedDisplay
      v-if="showSpeed"
      :is-standalone="true"
    />
    <br>
    <HeaderBlackHole />
  </span>
</template>
