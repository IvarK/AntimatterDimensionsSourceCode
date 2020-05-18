"use strict";

Vue.component("modal-edit-tree", {
  computed: {
    getInput() {
      return {
        input: this.modal.editingTree
      };
    }
  },
  data() {
    return {
      input: ""
    };
  },
  methods: {
    update() {
      this.input = `{{ getInput }}`;
    },
  },
  template:
    `<div class="c-modal-import-tree l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
      <h3>Edit your tree</h3>
      <input
        v-model="input"
        ref="input"
        type="text"
        class="c-modal-input c-modal-import-tree__input"
        @keyup.esc="emitClose"
      />
      <primary-button
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn"
        @click="emitClose"
      >Confirm</primary-button>
    </div>`
});
// We goin to flavortown USA