"use strict";

Vue.component("modal-edit-tree", {
 computed: {
    modal() {
        return this.$viewModel.modal.current;
      },
    },
  data() {
    return {
      input: this.modal.editingTree
    };
  },
  methods: {
    update() {
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
        @keyup.enter="importTree"
        @keyup.esc="emitClose"
      />
        </template>
        <div v-if="hasInput">Not a valid tree</div>
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn"
        @click="importTree"
      >Import</primary-button>
    </div>`
});