<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import NormalChallengeBox from "./NormalChallengeBox";

export default {
  name: "NormalChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    NormalChallengeBox
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>
      If you have an active Big Crunch Autobuyer, it will attempt to Crunch
      as soon as possible when reaching Infinite antimatter.
    </div>
    <ChallengeGrid :count="12">
      <NormalChallengeBox
        slot-scope="slotProps"
        :challenge-id="slotProps.challengeId"
      />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
