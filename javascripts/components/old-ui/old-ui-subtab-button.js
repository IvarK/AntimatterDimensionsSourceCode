"use strict";

Vue.component("old-ui-subtab-button", {
  props: {
    subtab: Object
  },
  data() {
    return {
      isAvailable: false,
      hasNotification: false
    };
  },
  methods: {
    update() {
      this.isAvailable = this.subtab.isAvailable;
      this.hasNotification = this.subtab.hasNotification;
    }
  },
  template: `
  <button
    v-if="isAvailable"
    @click="subtab.show(true)"
    style="margin: 0.5rem 0.8rem"
    class="o-tab-btn o-tab-btn--secondary">
    {{subtab.name}} <i v-if="hasNotification" class="fas fa-exclamation"></i>
  </button>
  `
});
