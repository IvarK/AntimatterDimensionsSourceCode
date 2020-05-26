"use strict";

Vue.component("modal-edit-tree", {
  computed: {
    modal() {
      return this.$viewModel.modal.current;
    },
    editLabel() {
      return `Editing ${this.name}`;
    },
  },
  data() {
    return {
      input: "",
      name: player.timestudy.preset[this.modal.id].name,
    };
  },
  watch: {
    changeInInput(newValue) {
      this.input = newValue;
    }
  },
  methods: {
    confirmEdits() {
      this.emitClose();
    },
    update() {
      const preset = player.timestudy.preset[this.modal.id];
      this.name = preset.name;
      this.input = preset.studies;
    }
  },
  template:
    `<div class="c-modal-import-tree l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
      <h3>{{ editLabel }}</h3>
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

// This was code from the old edit thing in tt-shop.js
// this.hideContextMenu();
// if (newValue !== null) this.preset.studies = newValue;