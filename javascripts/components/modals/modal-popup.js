Vue.component('modal-popup', {
  methods: {
    hide: function() {
      Modal.hide();
    }
  },
  template:
    `<div class="modal">
        <component :is="$viewModel.modal.current" @close="hide" />
    </div>`
});