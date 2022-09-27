<script>
import HeaderChallengeDisplay from "./HeaderChallengeDisplay";
import HeaderChallengeEffects from "./HeaderChallengeEffects";
import HeaderGameSpeed from "./HeaderGameSpeed";
import HeaderPrestigeGroup from "./HeaderPrestigeGroup";

export default {
  name: "GameHeader",
  components: {
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    HeaderGameSpeed,
    HeaderPrestigeGroup,
  },
};
</script>

<template>
  <div>
    <HeaderChallengeDisplay />
    <HeaderChallengeEffects />
    <HeaderPrestigeGroup />
    <HeaderGameSpeed />
  </div>
</template>

<style scoped>

</style>
