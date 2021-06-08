"use strict";

Vue.component("modal-reset-reality", {
  computed: {
    message() {
      return `This will put you at the start of your Reality and reset your progress in this Reality,\
              giving you no rewards from your progress in your current Reality.
              Are you sure you want to do this?`.split("\n");
    },
  },
  methods: {
    handleNoClick() {
      this.emitClose();
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      this.emitClose();
    },
  },
  template: `
    <div class="c-modal-message l-modal-content--centered">
      <h2>You are about to reset your Reality</h2>
      <div class="c-modal-message__text">
        <span v-for="line in message">
          {{ line }} <br>
        </span>
      </div>
      <br><br>
      <div class="l-options-grid__row">
        <primary-button
                class="o-primary-btn--width-medium c-modal-message__okay-btn"
                @click="handleNoClick"
                >Cancel</primary-button>
        <primary-button
                class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
                @click="handleYesClick"
                >Reset</primary-button>
      </div>
    </div>`
});
