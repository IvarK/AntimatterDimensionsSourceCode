"use strict";

Vue.component("modal-hard-reset", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    }
  },
  data() {
    return {
      clicksToDeath: 10,
    };
  },
  methods: {
    handleClick() {
      safeCall(this.modal.callback);
      this.emitClose();
    },
    handleYesClick() {
      if (this.clicksToDeath > 1) this.clicksToDeath--;
      else {
        GameStorage.hardReset();
        this.handleClick();
      }
    },
    handleNoClick() {
      this.handleClick();
    }
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
      <div class="c-modal-message__text">
        Please confirm your desire to hard reset your save. This is irreversible.
        <span v-if="clicksToDeath === 1">Goodbye cruel world</span>
      </div>
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleYesClick"
      >RESET in {{ clicksToDeath }}</primary-button>
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleNoClick"
      >Cancel</primary-button>
    </div>`
});
