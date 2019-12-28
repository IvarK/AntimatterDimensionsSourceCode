"use strict";

Vue.component("hint-text", {
  props: {
    type: String
  },
  computed: {
    showThisHintText() {
      return player.options.showHintText[this.type];
    }
  },
  template:
    `<div v-show="$viewModel.shiftDown || showThisHintText" class="o-hint-text l-hint-text"><slot /></div>`
});
