"use strict";

Vue.component("modal-message", {
  data: function() {
    return {
      message: ""
    };
  },
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    }
  },
  methods: {
    update() {
      this.message = this.modal.message;
    },
    handleClick() {
      safeCall(this.modal.callback);
      this.emitClose();
    }
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
      <modal-close-button v-if="modal.closeButton" class="c-modal__close-btn--tiny" @click="emitClose"/>
      <div
        class="c-modal-message__text"
        v-html="message"
      />
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleClick"
      >Okay</primary-button>
    </div>`
});