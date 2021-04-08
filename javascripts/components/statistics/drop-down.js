"use strict";

Vue.component("drop-down", {
  props: {
    shown: Boolean
  },
  computed: {
    dropDown() {
      return this.shown ? `<i class="far fa-minus-square"></i>` : `<i class="far fa-plus-square"></i>`;
    },
  },
  template: `
    <span class="o-run-drop-down-icon" v-html="dropDown" />
  `
});