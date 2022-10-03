<script>
import HeaderBlackHole from "./HeaderBlackHole";
import HeaderChallengeDisplay from "./HeaderChallengeDisplay";
import HeaderChallengeEffects from "./HeaderChallengeEffects";
import HeaderPrestigeGroup from "./HeaderPrestigeGroup";

export default {
  name: "GameHeader",
  components: {
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    HeaderBlackHole,
    HeaderPrestigeGroup,
  },
};
</script>

<template>
  <div>
    <HeaderChallengeDisplay />
    <HeaderChallengeEffects />
    <HeaderPrestigeGroup />
    <HeaderBlackHole />
  </div>
</template>

<style scoped>

</style>
