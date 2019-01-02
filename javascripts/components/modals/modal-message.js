Vue.component('modal-message', {
  methods: {
    handleClick() {
      safeCall(this.$viewModel.modal.callback);
      this.emitClose();
    }
  },
  template:
    `<div class="c-modal-message l-modal-content--centered">
      <div
        class="c-modal-message__text"
        v-html="$viewModel.modal.message"
      />
      <primary-button
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="handleClick"
      >Okay</primary-button>
    </div>`
});