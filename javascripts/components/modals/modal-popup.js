"use strict";

Vue.component("modal-popup", {
  props: {
    modal: {
      type: Object,
    }
  },
  methods: {
    hide() {
      if (this.modal.hide) this.modal.hide();
      else Modal.hide();
    }
  },
  template:
    `<div v-if="!modal.isBare" class="c-modal l-modal">
      <component :is="modal.component" @close="hide" />
    </div>
    <component v-else :is="modal.component" />`
});

Vue.component("modal-close-button", {
  template:
    `<primary-button
      class="o-primary-btn--modal-close c-modal__close-btn"
      @click="emitClick"
    >&times;</primary-button>`
});