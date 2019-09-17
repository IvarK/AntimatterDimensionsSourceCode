"use strict";

Vue.component("modal-popup", {
  methods: {
    hide() {
      Modal.hide();
    }
  },
  template:
    `<div v-if="!$viewModel.modal.current.isBare" class="c-modal l-modal">
      <component :is="$viewModel.modal.current.component" @close="hide" />
    </div>
    <component v-else :is="$viewModel.modal.current.component" />`
});

Vue.component("modal-close-button", {
  template:
    `<primary-button
      class="o-primary-btn--modal-close c-modal__close-btn"
      @click="emitClick"
    >&times;</primary-button>`
});