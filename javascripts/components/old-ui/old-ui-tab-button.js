"use strict";

Vue.component("old-ui-tab-button", {
  props: {
    tab: Object
  },
  data() {
    return {
      isAvailable: false
    };
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
    }
  },
  template: `
    <button
      v-if="isAvailable"
      :class="tab.config.oldUIClass"
      class="tabbtn"
      style="margin: .2rem"
      @click="tab.show()"
    >{{tab.name}}</button>
  `
});
