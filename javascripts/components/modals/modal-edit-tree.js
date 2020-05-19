"use strict";

Vue.component("modal-edit-tree", {
  computed: {
    getInput() {
      return {
        input: this.modal.editingTree
      };
    },
    modal() {
      return this.$viewModel.modal.current;
    }
  },
  data() {
    return {
      input: ""
    };
  },
  methods: {
    created() {
      this.input = this.modal.editingTree;
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
// hi i'm guy fieri and we're rolling out
// looking for america's greatest
// diners, drive-ins, and dives.