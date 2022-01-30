<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import InfinityChallengeBox from "./InfinityChallengeBox";

export default {
  name: "InfinityChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    InfinityChallengeBox
  },
  data() {
    return {
      nextIC: 0,
      showAllChallenges: false
    };
  },
  computed: {
    nextAtDisplay() {
      const first = this.nextIC?.id === 1;
      const next = InfinityChallenges.nextICUnlockAM;

      if (first) return `The first Infinity Challenge unlocks at ${format(next)} antimatter.`;
      return next === undefined
        ? "All Infinity Challenges unlocked"
        : `Next Infinity Challenge unlocks at ${format(next)} antimatter.`;
    }
  },
  methods: {
    update() {
      this.nextIC = InfinityChallenges.nextIC;
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(id) {
      return InfinityChallenge(id).isUnlocked || (this.showAllChallenges && PlayerProgress.eternityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div>
      An active Big Crunch Autobuyer will Crunch immediately when
      reaching an Infinity Challenge's antimatter goal, regardless of settings.
    </div>
    <div>{{ nextAtDisplay }}</div>
    <ChallengeGrid
      v-slot="slotProps"
      :count="8"
      :is-challenge-visible="isChallengeVisible"
    >
      <InfinityChallengeBox :challenge-id="slotProps.challengeId" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
