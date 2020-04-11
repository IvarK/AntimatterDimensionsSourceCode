"use strict";

Vue.component("old-ui-tab-button", {
  props: {
    tab: Object
  },
  data() {
    return {
      isAvailable: false,
      hasNotification: false
    };
  },
  methods: {
    update() {
      this.isAvailable = this.tab.isAvailable;
      this.hasNotification = this.tab.hasNotification;
    }
  },
  template: `
    <button
      v-if="isAvailable"
      :class="tab.config.UIClass"
      class="o-tab-btn"
      style="margin: 0.2rem"
      @click="tab.show()"
    >{{tab.name}} <i v-if="hasNotification" class="fas fa-exclamation"></i></button>
  `
});
