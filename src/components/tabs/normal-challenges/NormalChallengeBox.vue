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
      isRunning: false,
      isCompleted: false,
      isBroken: false,
      isUnlocked: false,
      lockedAt: new Decimal()
    };
  },
  computed: {
    descriptionDisplayConfig() {
      if (this.challenge.isUnlocked) {
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
      this.isUnlocked = this.challenge.isUnlocked;
      this.isRunning = this.challenge.isRunning;
      this.lockedAt = this.challenge.config.lockedAt;
      this.isBroken = Enslaved.isRunning && Enslaved.BROKEN_CHALLENGES.includes(this.challengeId);
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
      <span>Reward: {{ challenge.config.reward }}</span>
    </template>
  </ChallengeBox>
</template>

<style scoped>

</style>
