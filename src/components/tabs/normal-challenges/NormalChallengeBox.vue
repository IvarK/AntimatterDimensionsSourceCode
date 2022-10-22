<script>
import ChallengeBox from "@/components/ChallengeBox";
import DescriptionDisplay from "@/components/DescriptionDisplay";

export default {
  name: "NormalChallengeBox",
  components: {
    ChallengeBox,
    DescriptionDisplay
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDoomed: false,
      isDisabled: false,
      isRunning: false,
      isCompleted: false,
      isBroken: false,
      isUnlocked: false,
      lockedAt: new Decimal()
    };
  },
  computed: {
    descriptionDisplayConfig() {
      if (this.isUnlocked) {
        return this.challenge.config;
      }
      return {
        description: `Infinity ${formatInt(this.challenge.config.lockedAt)} times to unlock.`
      };
    },
    name() {
      return `C${this.challenge.id}`;
    },
    overrideLabel() {
      return this.isBroken ? "Broken" : "";
    },
  },
  methods: {
    update() {
      this.isDisabled = this.challenge.isDisabled;
      this.isUnlocked = this.challenge.isUnlocked;
      // This stops normal challenges from appearing like they're running during IC1
      this.isRunning = this.challenge.isOnlyActiveChallenge;
      this.lockedAt = this.challenge.config.lockedAt;
      this.isBroken = Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(this.challenge.id);
      this.isCompleted = this.challenge.isCompleted && !this.isBroken;
    }
  }
};
</script>

<template>
  <ChallengeBox
    :name="name"
    :is-unlocked="isUnlocked"
    :is-running="isRunning"
    :is-completed="isCompleted"
    :override-label="overrideLabel"
    :locked-at="lockedAt"
    class="c-challenge-box--normal"
    @start="challenge.requestStart()"
  >
    <template #top>
      <DescriptionDisplay :config="descriptionDisplayConfig" />
    </template>
    <template #bottom>
      <span :class="{ 'o-pelle-disabled': isDisabled }">Reward: {{ challenge.config.reward }}</span>
    </template>
  </ChallengeBox>
</template>

<style scoped>

</style>
