"use strict";

Vue.component("modal-custom-notation", {
  data() {
    return {
      input: "",
      useSpaceSeparator: false,
    };
  },
  template:
    `<div class="c-modal-import l-modal-content--centered">
      <modal-close-button @click="emitClose"/>
      <h3>Custom Notation letter sequence:</h3>
      <input
        v-model="input"
        ref="input"
        type="text"
        class="c-modal-input c-modal-custom-notation__input"
        @keyup.enter="setCustomNotation"
        @keyup.esc="emitClose"
      />
      <div>
        (you can use multi-character or emoji "letters" if you separate them with space in the input box)
      </div>
      <div>
        Separate letters with space in notation output: <input
          @click="toggle"
          :checked="useSpaceSeparator"
          type="checkbox"
        />
      </div>
      <primary-button
        v-if="inputIsValid"
        class="o-primary-btn--width-large c-modal-import__import-btn"
        @click="setCustomNotation"
      >Set Custom Notation parameters</primary-button>
      <div v-else>
        The supplied letter sequence must contain at least 2 letters.
      </div>
    </div>`,
  computed: {
    inputIsValid() {
      // I don't know why you'd want a single space but it's technically legal.
      return this.input.includes(" ") || Array.from(this.input).length > 1;
    },
    letters() {
      if (this.input.includes(" ")) {
        return this.input.split(" ");
      } else {
        // This handles some emoji (though it fails on others).
        return Array.from(this.input);
      }
    }
  },
  methods: {
    toggle() {
      this.useSpaceSeparator = !this.useSpaceSeparator;
    },
    setCustomNotation() {
      if (!this.inputIsValid) return;
      Modal.hide();
      player.options.customNotation.letters = this.letters.map(x => unescape(encodeURIComponent(x)));
      player.options.customNotation.useSpaceSeparator = this.useSpaceSeparator;
      Notations.updateCustomNotation(this.letters, this.useSpaceSeparator);
    }
  },
  mounted() {
    this.$refs.input.select();
  }
});
