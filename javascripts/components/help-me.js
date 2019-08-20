"use strict";

Vue.component("help-me", {
  methods: {
    openH2p() {
      Modal.h2p.show();
    }
  },
  template: `<div @click="openH2p" class="o-btn l-help-me">?</div>`
});