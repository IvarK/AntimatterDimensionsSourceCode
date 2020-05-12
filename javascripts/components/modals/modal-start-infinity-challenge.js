"use strict";

Vue.component("modal-start-infinity-challenge", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return "You will Big Crunch, if possible, and will start a new Infinity within the challenge, " + 
        "with all the restrictions and modifiers that entails. Upon reaching the goal, " +
        "you can complete the Infinity Challenge, which grants you the reward. " + 
        "You do not start with any Dimensions or Galaxies, regardless of other upgrades.";
    },
    enteringWhatIC() {
      return `You are about to enter Infinity Challenge ${InfinityChallenges.starting}`;
    }
  },
  methods: {
    handleYesClick() {
        this.emitClose();
        InfinityChallenge(InfinityChallenges.starting).start();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
    <h2>{{ enteringWhatIC }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
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
      </div>
    </div>`
});