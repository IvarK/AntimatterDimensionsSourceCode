"use strict";

Vue.component("autobuyer-toggles", {
  data() {
    return {
      autobuyersOn: false,
      bulkOn: false,
      isAutoRealityUnlocked: false,
      autoRealityMode: AUTO_REALITY_MODE.RM,
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
  computed: {
    autoRealityModeDisplay() {
      switch (this.autoRealityMode) {
        case AUTO_REALITY_MODE.RM: return "reality machines";
        case AUTO_REALITY_MODE.GLYPH: return "glyph level";
        case AUTO_REALITY_MODE.EITHER: return "either";
        case AUTO_REALITY_MODE.BOTH: return "both";
      }
      throw new Error("Unknown auto reality mode");
    }
  },
  methods: {
    update() {
      this.autobuyersOn = player.options.autobuyersOn;
      this.bulkOn = player.options.bulkOn;
      this.isAutoRealityUnlocked = Autobuyer.reality.isUnlocked;
      this.autoRealityMode = Autobuyer.reality.mode;
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
      <primary-button
        v-if="isAutoRealityUnlocked"
        class="o-primary-btn--autobuyer-toggle"
        onclick="Autobuyer.reality.toggleMode();"
      >Auto reality mode: {{autoRealityModeDisplay}}</primary-button>
    </div>`
});
