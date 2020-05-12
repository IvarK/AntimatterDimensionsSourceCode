"use strict";

Vue.component("modal-start-eternity-challenge", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    message() {
        return "You will Eternity, if possible, and will start a new Eternity within the challenge, " + 
        "with all the restrictions and modifiers that entails. Upon reaching the goal, " + 
        "you can complete the Eternity Challenge, which grants you the reward. " + 
        "You can complete Eternity Challenges up to 5 times, with increasing goals, to get higher bonuses.";
    },
    enteringWhatEC() {
      return `You are about to enter Eternity Challenge ${this.modal.id}`;
    }
  },
  methods: {
    handleYesClick() {
        EternityChallenge(this.modal.id).start(true);
        this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    },
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
    <h2>{{ enteringWhatEC }}</h2>
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