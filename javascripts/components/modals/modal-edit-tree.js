"use strict";

Vue.component("modal-edit-tree", {
  props: {
    modalConfig: Object
  },
  computed: {
    editLabel() {
      return `Editing ${this.name}`;
    },
    inputIsValid() {
      return this.inputIsValidTree;
    },
    inputIsValidTree() {
      const formattedInput = this.input.split("|")[0].split(",");
      let isValid = true;
      for (const study of formattedInput) {
        if (TimeStudy(study) === undefined) isValid = false;
      }
      return isValid;
    }
  },
  data() {
    return {
      input: player.timestudy.presets[this.modalConfig.id].studies,
      name: player.timestudy.presets[this.modalConfig.id].name,
    };
  },
  methods: {
    confirmEdits() {
      if (this.inputIsValid) { 
        player.timestudy.presets[this.modalConfig.id].studies = this.input;
        this.emitClose();
      }
    },
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
      <div v-if="!inputIsValid">Invalid tree</div>
      <primary-button
        class="o-primary-btn--width-medium c-modal-import-tree__import-btn"
        @click="confirmEdits"
        :enabled="inputIsValid"
      >Confirm</primary-button>
    </div>`
});

// We goin to flavortown USA
// hi i'm guy fieri and we're rolling out
// looking for america's greatest
// diners, drive-ins, and dives.