"use strict";

Vue.component("modal-start-normal-challenge", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return "You will Big Crunch, if possible, and will start a new Infinity within the challenge, " + 
        "with all the restrictions and modifiers that entails. Upon reaching Infinity, " +
        "you can complete the Challenge, which grants you the reward. " + 
        "You do not start with any Dimensions or Galaxies, regardless of other upgrades. " +
        "When you complete the challenge, your reward is:";
    },
    enteringWhatC() {
      return `You are about to enter Challenge ${this.modal.id}`;
    },
    CReward() {
      return `${NormalChallenge(this.modal.id)._config.reward}`;
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
    <h2>{{ enteringWhatC }}</h2>
      <div class="c-modal-message__text">
        {{ message }}
      </div>
      <div class="c-modal-message__text">
      {{ CReward }}
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