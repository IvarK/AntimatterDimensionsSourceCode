<script>
import HeaderBlackHole from "./HeaderBlackHole";
import HeaderChallengeDisplay from "./HeaderChallengeDisplay";
import HeaderChallengeEffects from "./HeaderChallengeEffects";
import HeaderPrestigeGroup from "./HeaderPrestigeGroup";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";

export default {
  name: "GameHeader",
  components: {
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
  },
  data() {
    return {
      hasReality: false,
    };
  },
  methods: {
    update() {
      this.hasReality = PlayerProgress.realityUnlocked();
    },
  },
};
</script>

<template>
  <div>
    <HeaderChallengeDisplay />
    <HeaderChallengeEffects />
    <HeaderPrestigeGroup />
    <GameSpeedDisplay v-if="hasReality" />
    <br v-if="hasReality">
    <HeaderBlackHole />
  </div>
</template>

<style scoped>

</style>
