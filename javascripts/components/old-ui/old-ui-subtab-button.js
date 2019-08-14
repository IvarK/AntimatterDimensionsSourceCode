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
    <button v-if="isAvailable" @click="subtab.show()" style="margin: .5rem .8rem" class="o-btn o-btn--secondary-tab">
      {{subtab.name}}
    </button>
  `
});
