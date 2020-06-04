"use strict";

Vue.component("modal-start-infinity-challenge", {
  computed: {
    challengeIsCompleted() {
      return InfinityChallenge(this.modal.id).isCompleted;
    },
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return "You will Big Crunch, if possible, and will start a new Infinity within the challenge, " + 
        "with all the restrictions and modifiers that entails. Upon reaching the goal " +
        `(${format(InfinityChallenge(this.modal.id).goal)} Antimatter for this challenge), ` + 
        `you can Big Crunch${this.challengeIsCompleted ? " to complete the challenge" : 
        " to complete the challenge and gain the reward"}. ` +
        "You do not start with any dimensions or galaxies, regardless of upgrades.";
    },
    entranceLabel() {
      return `You are about to enter Infinity Challenge ${this.modal.id}`;
    },
    reward() {
      let rewardDescription = InfinityChallenge(this.modal.id)._config.reward.description;
      if (typeof rewardDescription === "function") {
        rewardDescription = rewardDescription();
      }
      return `The reward for completing this challenge is: ${rewardDescription}`;
    },
  },
  methods: {
    handleYesClick() {
      InfinityChallenge(this.modal.id).start();
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
          class="o-primary-btn--width-medium c-modal-message__okay-btn"
          @click="handleYesClick"
        >Begin</primary-button>
      </div>
    </div>`
});
