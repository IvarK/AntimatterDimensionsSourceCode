<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
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
      showAllChallenges: false,
      autoEC: false,
      isAutoECVisible: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
      hasECR: false,
    };
  },
  computed: {
    challenges() {
      return EternityChallenges.all;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.unlockedCount = EternityChallenges.all
        .filter(this.isChallengeVisible)
        .length;
      this.isAutoECVisible = Perk.autocompleteEC1.isBought && !Pelle.isDoomed;
      this.autoEC = player.reality.autoEC;
      const remainingCompletions = EternityChallenges.remainingCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Math.max(autoECInterval - player.reality.lastAutoEC, 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC + (autoECInterval * (remainingCompletions - 1)));
      }
      this.hasECR = Perk.studyECRequirement.isBought;
    },
    isChallengeVisible(challenge) {
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
    <div v-if="autoEC && isAutoECVisible">
      Eternity Challenges are automatically completed sequentially, requiring all previous
      Eternity Challenges to be fully completed before any progress is made.
    </div>
    <div
      v-if="autoEC && isAutoECVisible && remainingECTiers > 0"
      class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
    >
      <div class="l-challenges-tab__auto-ec-timers">
        <span v-if="remainingECTiers > 1">
          Next Auto Eternity Challenge completion in: {{ untilNextEC }} (real time)
        </span>
        <span>
          All Auto Eternity Challenge completions in: {{ untilAllEC }} (real time)
        </span>
      </div>
    </div>
    <div>
      Complete Eternity Challenges again for a bigger reward, maximum of {{ formatInt(5) }} times.<br>
      The rewards are applied permanently with no need to have the respective Eternity Challenge Time Study purchased.
    </div>
    <div v-if="!hasECR">
      When you respec out of an unlocked Eternity Challenge, you don't need to redo the secondary requirement<br>
      in order to unlock it again until you complete it; only the Time Theorems are required.
    </div>
    <div v-if="unlockedCount !== 12">
      You have seen {{ formatInt(unlockedCount) }} out of {{ formatInt(12) }} Eternity Challenges.
    </div>
    <div v-else>
      You have seen all {{ formatInt(12) }} Eternity Challenges.
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <EternityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>

</style>
