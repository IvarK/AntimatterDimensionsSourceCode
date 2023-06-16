<script>
import wordShift from "@/core/word-shift";

import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import EternityChallengeBoxWrapper from "./EternityChallengeBoxWrapper";

export default {
  name: "EternityChallengeBox",
  components: {
    EternityChallengeBoxWrapper,
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      isCompleted: false,
      canBeUnlocked: false,
      completions: 0,
      showGoalSpan: false,
      lastGoal: "",
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    goalDisplay() {
      const config = this.config;
      let goal = `Goal: ${this.goalAtCompletions(this.completions)} IP`;
      if (config.restriction) {
        goal += ` ${config.formatRestriction(config.restriction(this.completions))}`;
      }
      return goal;
    },
    firstGoal() {
      return this.goalAtCompletions(0);
    },
    currentRewardConfig() {
      const challenge = this.challenge;
      const config = this.config.reward;
      return {
        effect: () => config.effect(challenge.completions),
        formatEffect: config.formatEffect,
        cap: config.cap,
      };
    },
    nextRewardConfig() {
      const challenge = this.challenge;
      const config = this.config.reward;
      return {
        effect: () => config.effect(challenge.completions + 1),
        formatEffect: config.formatEffect,
        cap: config.cap,
      };
    },
    name() {
      return `EC${this.challenge.id}`;
    }
  },
  methods: {
    update() {
      const challenge = this.challenge;
      this.isUnlocked = challenge.isUnlocked;
      this.isRunning = challenge.isRunning;
      this.isCompleted = challenge.isFullyCompleted;
      this.completions = challenge.completions;
      this.showGoalSpan = PlayerProgress.realityUnlocked();
      this.canBeUnlocked = TimeStudy.eternityChallenge(challenge.id).canBeBought;

      this.lastGoal = (Enslaved.isRunning && this.challenge.id === 1)
        ? wordShift.wordCycle(this.config.scrambleText.map(x => format(x)))
        : this.goalAtCompletions(this.challenge.maxCompletions - 1);
    },
    start() {
      if (this.canBeUnlocked) {
        TimeStudy.eternityChallenge(this.challenge.id).purchase();
      } else this.challenge.requestStart();
    },
    goalAtCompletions(completions) {
      return format(this.challenge.goalAtCompletions(completions), 2, 1);
    }
  }
};
</script>

<template>
  <EternityChallengeBoxWrapper
    :name="name"
    :is-unlocked="isUnlocked"
    :is-running="isRunning"
    :is-completed="isCompleted"
    :can-be-unlocked="canBeUnlocked"
    :completion-count="completions"
    @start="start"
  >
    <template #top>
      <DescriptionDisplay :config="config" />
    </template>
    <template #bottom>
      <div :style="{ visiblity: completions < 5 ? 'visible' : 'hidden' }">
        <div>
          Completed {{ quantifyInt("time", completions) }}
        </div>
        {{ goalDisplay }}
      </div>
      <span v-if="showGoalSpan">
        Goal Span: {{ firstGoal }} IP - {{ lastGoal }} IP
      </span>
      <span>
        Reward:
        <DescriptionDisplay
          :config="config.reward"
          :length="55"
          name="c-challenge-box__reward-description"
        />
      </span>
      <span>
        <EffectDisplay
          v-if="completions > 0"
          :config="currentRewardConfig"
        />
        <span v-if="completions > 0 && completions < 5">|</span>
        <EffectDisplay
          v-if="completions < 5"
          :config="nextRewardConfig"
          label="Next"
          :ignore-capped="true"
        />
      </span>
    </template>
  </EternityChallengeBoxWrapper>
</template>

<style scoped>

</style>
