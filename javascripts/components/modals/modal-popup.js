Vue.component('modal-popup', {
  methods: {
    hide: function() {
      Modal.hide();
    }
  },
  template:
    `<div class="c-modal l-modal">
      <component :is="$viewModel.modal.current" @close="hide" />
    </div>`
});

Vue.component('modal-close-button', {
  template:
    `<primary-button
      class="o-primary-btn--modal-close c-modal__close-btn"
      @click="emitClick"
    >&times;</primary-button>`
});