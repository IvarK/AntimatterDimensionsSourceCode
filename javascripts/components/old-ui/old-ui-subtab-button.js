"use strict";

Vue.component("old-ui-subtab-button", {
  props: {
    subtab: Object
  },
  data() {
    return {
      isAvailable: false
    };
  },
  methods: {
    update() {
      this.isAvailable = this.subtab.isAvailable;
    }
  },
  template: `
  <button v-if="isAvailable" @click="subtab.show()" style="margin: 0.5rem 0.8rem" class="o-tab-btn o-tab-btn--secondary">
    {{subtab.name}}
  </button>
  `
});
