"use strict";

Vue.component("autobuyer-toggles", {
  data() {
    return {
      options: player.options,
      hasAdditionalCrunchModes: false,
      autoCrunchMode: AutoCrunchMode.AMOUNT,
      hasAdditionalEternityModes: false,
      autoEternityMode: AutoEternityMode.AMOUNT,
      isAutoRealityUnlocked: false,
      autoRealityMode: AutoRealityMode.RM,
    };
  },
  computed: {
    autoCrunchModeDisplay() {
      switch (this.autoCrunchMode) {
        case AutoCrunchMode.AMOUNT: return "amount";
        case AutoCrunchMode.TIME: return "time";
        case AutoCrunchMode.RELATIVE: return "X times last crunch";
      }
      throw "Unknown auto crunch mode";
    },
    autoEternityModeDisplay() {
      switch (this.autoEternityMode) {
        case AutoEternityMode.AMOUNT: return "amount";
        case AutoEternityMode.TIME: return "time";
        case AutoEternityMode.RELATIVE: return "X times last eternity";
      }
      throw "Unknown auto eternity mode";
    },
    autoRealityModeDisplay() {
      switch (this.autoRealityMode) {
        case AutoRealityMode.RM: return "reality machines";
        case AutoRealityMode.GLYPH: return "glyph level";
        case AutoRealityMode.EITHER: return "either";
        case AutoRealityMode.BOTH: return "both";
      }
      throw "Unknown auto reality mode";
    }
  },
  methods: {
    update() {
      this.hasAdditionalCrunchModes = Autobuyer.bigCrunch.hasAdditionalModes;
      this.autoCrunchMode = Autobuyer.bigCrunch.mode;
      this.hasAdditionalEternityModes = Autobuyer.eternity.hasAdditionalModes;
      this.autoEternityMode = Autobuyer.eternity.mode;
      this.isAutoRealityUnlocked = Autobuyer.reality.isUnlocked;
      this.autoRealityMode = Autobuyer.reality.mode;
    }
  },
  template:
    `<div class="l-autobuyer-toggles">
      <primary-button
        class="o-primary-btn--autobuyer-toggle"
        onclick="Autobuyers.toggle()"
      >Enable/disable autobuyers</primary-button>
      <primary-button-on-off-custom
        v-model="options.bulkOn"
        on="Disable bulk buy"
        off="Enable bulk buy"
        class="o-primary-btn--autobuyer-toggle"
      />
      <primary-button
        v-if="hasAdditionalCrunchModes"
        class="o-primary-btn--autobuyer-toggle"
        onclick="Autobuyer.bigCrunch.toggleMode();"
      >Auto crunch mode: {{autoCrunchModeDisplay}}</primary-button>
      <primary-button
        v-if="hasAdditionalEternityModes"
        class="o-primary-btn--autobuyer-toggle"
        onclick="Autobuyer.eternity.toggleMode();"
      >Auto eternity mode: {{autoEternityModeDisplay}}</primary-button>
      <primary-button
        v-if="isAutoRealityUnlocked"
        class="o-primary-btn--autobuyer-toggle"
        onclick="Autobuyer.reality.toggleMode();"
      >Auto reality mode: {{autoRealityModeDisplay}}</primary-button>
    </div>`
});
