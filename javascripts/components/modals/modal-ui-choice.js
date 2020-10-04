"use strict";

Vue.component("modal-ui-choice", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    }
  },
  methods: {
    handleClick() {
      safeCall(this.modal.callback);
      this.emitClose();
    },
    handleYesClick() {
      this.handleClick();
      GameOptions.toggleUI();
    },
    handleNoClick() {
      this.handleClick();
    }
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
      <div class="c-modal-message__text">
        We noticed that you've loaded an old save, would you like to swap to the new UI?
        (you can change this at any time in the options tab)
      </div>
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >No</primary-button>
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
        @click="handleYesClick"
      >Yes</primary-button>
    </div>`
});
