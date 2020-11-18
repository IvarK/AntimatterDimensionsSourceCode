"use strict";

Vue.component("modal-start-normal-challenge", {
  computed: {
    challengeIsCompleted() {
      return NormalChallenge(this.modal.id).isCompleted;
    },
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return "You will Big Crunch, if possible, and will start a new Infinity within the challenge, " + 
        "with all the restrictions and modifiers that entails. Upon reaching Infinity, " +
        "you can complete the Challenge, which grants you the reward. " + 
        "You do not start with any dimensions or galaxies, regardless of upgrades.";
    },
    entranceLabel() {
      return `You are about to enter Challenge ${this.modal.id}`;
    },
    reward() {
      return `The reward for completing this challenge is: ${NormalChallenge(this.modal.id)._config.reward}`;
    }
  },
  methods: {
    handleYesClick() {
      NormalChallenge(this.modal.id).start();
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
    <h2>{{ entranceLabel }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <div v-if="!challengeIsCompleted" class="c-modal-message__text">
      <br>
      {{ reward }}
      </div>
      <div class="l-options-grid__row">
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleNoClick"
        >Cancel</primary-button>
        <primary-button
          class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
          @click="handleYesClick"
        >Begin</primary-button>
        </div>
      </div>
    </div>`
});
