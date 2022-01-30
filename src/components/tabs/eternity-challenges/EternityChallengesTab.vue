<script>
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import ChallengeGrid from "@/components/ChallengeGrid";
import EternityChallengeBox from "./EternityChallengeBox";

export default {
  name: "EternityChallengesTab",
  components: {
    ChallengeTabHeader,
    ChallengeGrid,
    EternityChallengeBox
  },
  data() {
    return {
      unlockedCount: 0,
      showAllChallenges: false
    };
  },
  methods: {
    update() {
      this.unlockedCount = [...Array(12).keys()]
        .filter(id => this.isChallengeVisible(id + 1))
        .length;
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(id) {
      const challenge = EternityChallenge(id);
      return challenge.completions > 0 ||
        challenge.isUnlocked ||
        (this.showAllChallenges && PlayerProgress.realityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>Complete Eternity Challenges again for a bigger reward, maximum of {{ formatInt(5) }} times.</div>
    <div v-if="unlockedCount !== 12">
      You have seen {{ formatInt(unlockedCount) }} out of {{ formatInt(12) }} Eternity Challenges.
    </div>
    <div v-else>
      You have seen all {{ formatInt(12) }} Eternity Challenges.
    </div>
    <ChallengeGrid
      v-slot="slotProps"
      :count="12"
      :is-challenge-visible="isChallengeVisible"
    >
      <EternityChallengeBox :challenge-id="slotProps.challengeId" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
