"use strict";

Vue.component("hint-text", {
  template:
    `<div v-show="$viewModel.shiftDown" class="o-hint-text l-hint-text"><slot /></div>`
});
