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
    challengeId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isRunning: false,
      isCompleted: false,
      isBroken: false,
      isUnlocked: false,
    };
  },
  computed: {
    challenge() {
      return NormalChallenge(this.challengeId);
    },
    descriptionDisplayConfig() {
      if (this.challenge.isUnlocked) {
        return this.challenge.config;
      }
      return {
        description: `Infinity ${formatInt(this.challenge.config.lockedAt)} times to unlock.`
      };
    },
    name() {
      return `C${this.challengeId}`;
    },
    overrideLabel() {
      return this.isBroken ? "Broken" : "";
    },
  },
  methods: {
    update() {
      this.isUnlocked = this.challenge.isUnlocked;
      this.isRunning = this.challenge.isRunning;
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
    class="c-challenge-box--normal"
    @start="challenge.requestStart()"
  >
    <DescriptionDisplay
      slot="top"
      :config="descriptionDisplayConfig"
    />
    <span slot="bottom">Reward: {{ challenge.config.reward }}</span>
  </ChallengeBox>
</template>

<style scoped>

</style>
