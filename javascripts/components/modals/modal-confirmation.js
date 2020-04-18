"use strict";

Vue.component("modal-confirmation", {
  data: () => ({
    message: ""
  }),
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    }
  },
  methods: {
    update() {
      if (this.modal) this.message = this.modal.message;
    },
    handleClick() {
      safeCall(this.modal.callback);
      this.emitClose();
    },
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
      <div
        class="c-modal-message__text"
        v-html="message"
      />
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleClick"
      >Okay</primary-button>
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="emitClose"
      >Cancel</primary-button>
    </div>`
});