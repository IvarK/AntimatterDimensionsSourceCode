"use strict";

Vue.component("autobuyer-toggles", {
  data() {
    return {
      autobuyersOn: false,
      bulkOn: false
    };
  },
  watch: {
    autobuyersOn(newValue) {
      player.options.autobuyersOn = newValue;
    },
    bulkOn(newValue) {
      player.options.bulkOn = newValue;
    }
  },
  methods: {
    update() {
      this.autobuyersOn = player.options.autobuyersOn;
      this.bulkOn = player.options.bulkOn;
    }
  },
  template:
    `<div class="l-autobuyer-toggles">
      <primary-button-on-off-custom
        v-model="autobuyersOn"
        on="Disable autobuyers"
        off="Enable autobuyers"
        class="o-primary-btn--autobuyer-toggle"
      />
      <primary-button-on-off-custom
        v-model="bulkOn"
        on="Disable bulk buy"
        off="Enable bulk buy"
        class="o-primary-btn--autobuyer-toggle"
      />
    </div>`
});
