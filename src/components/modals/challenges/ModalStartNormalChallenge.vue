<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  components: {
    PrimaryButton
  },
  computed: {
    challenge() {
      return NormalChallenge(this.modal.id);
    },
    challengeIsCompleted() {
      return this.challenge.isCompleted;
    },
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
      return `You will Big Crunch, if possible, and will start a new Infinity within the challenge,
        with all the restrictions and modifiers that entails. Upon reaching Infinity,
        you can complete the Challenge, which grants you the reward.
        You do not start with any dimensions or galaxies, regardless of upgrades.`;
    },
    entranceLabel() {
      return `You are about to enter Challenge ${this.modal.id}`;
    },
    reward() {
      return `The reward for completing this challenge is: ${this.challenge._config.reward}`;
    },
    condition() {
      let conditionOfChallenge = this.challenge._config.description;
      if (typeof conditionOfChallenge === "function") {
        conditionOfChallenge = conditionOfChallenge();
      }
      return `Inside this Challenge, the condition is: ${conditionOfChallenge}`;
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
