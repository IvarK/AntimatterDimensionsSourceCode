"use strict";

Vue.component("modal-start-infinity-challenge", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return "You will Big Crunch, if possible, and will start a new Infinity within the challenge, " + 
        `with all the restrictions and modifiers that entails. Upon reaching ` +
        `${format(InfinityChallenge(this.modal.id).goal)} Antimatter, ` + 
        `you can Big Crunch for the reward. ` +
        "You do not start with any Dimensions or Galaxies, regardless of other upgrades." +
        ` The reward for completing Infinity Challenge ${this.modal.id} is:`;
    },
    enteringWhatIC() {
      return `You are about to enter Infinity Challenge ${this.modal.id}`;
    },
    ICReward() {
      return `${InfinityChallenge(2).reward._config.description}`;
    }
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
    <h2>{{ enteringWhatIC }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <br>
      <div class="c-modal=message__text">
      {{ ICReward }}
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