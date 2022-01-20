<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "InfinityChallengeStartModal",
  componentsn: {
    PrimaryButton
  },
  computed: {
    challenge() {
      return InfinityChallenge(this.modal.id);
    },
    challengeIsCompleted() {
      return this.challenge.isCompleted;
    },
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
      return `You will Big Crunch (if possible) and start a new Infinity within the Challenge, with all the
        Challenge-specific restrictions and modifiers active. To complete the Challenge 
        ${this.challengeIsCompleted ? "" : "and gain its reward"}, you must reach the Challenge goal of
        ${format(InfinityChallenge(this.modal.id).goal)} Antimatter.
        You do not start with any Dimensions or Galaxies, regardless of upgrades.`;
    },
    entranceLabel() {
      return `You are about to enter Infinity Challenge ${this.modal.id}`;
    },
    reward() {
      let rewardDescription = this.challenge._config.reward.description;
      if (typeof rewardDescription === "function") {
        rewardDescription = rewardDescription();
      }
      return `The reward for completing this challenge is: ${rewardDescription}`;
    },
    condition() {
      let conditionOfChallenge = this.challenge._config.description;
      if (typeof conditionOfChallenge === "function") {
        conditionOfChallenge = conditionOfChallenge();
      }
      return `Inside this Infinity Challenge,
        ${conditionOfChallenge.charAt(0).toLowerCase() + conditionOfChallenge.slice(1)}`;
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      this.challenge.start();
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
};
</script>

<template>
  <div class="c-modal-message l-modal-content--centered">
    <h2>{{ entranceLabel }}</h2>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ condition }}
    </div>
    <div
      v-if="!challengeIsCompleted"
      class="c-modal-message__text"
    >
      <br>
      {{ reward }}
    </div>
    <div class="l-options-grid__row">
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >
        Cancel
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
        @click="handleYesClick"
      >
        Begin
      </PrimaryButton>
    </div>
  </div>
</template>
