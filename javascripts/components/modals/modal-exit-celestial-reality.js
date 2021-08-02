"use strict";

Vue.component("modal-exit-celestial-reality", {
  methods: {
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      this.emitClose();
    },
    handleNoClick() {
      this.emitClose();
    }
  },
  template: `
  <div class="c-modal-message l-modal-content--centered">
    <h2>You are about to exit a Celestial Reality</h2>
    <div class="c-modal-message__text">
      Exiting a Celestial's Reality early will reset you to the beginning of a new Reality with no benefits.
    </div>
    <div class="l-options-grid__row">
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >
        Cancel
      </primary-button>
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
        @click="handleYesClick"
      >
        Exit
      </primary-button>
    </div>
  </div>`
});