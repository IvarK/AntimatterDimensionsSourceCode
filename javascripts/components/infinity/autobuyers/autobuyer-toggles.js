"use strict";

Vue.component("autobuyer-toggles", {
  data() {
    return {
      autobuyersOn: false,
      bulkOn: false,
      showContinuum: false,
      disableContinuum: false,
    };
  },
  watch: {
    autobuyersOn(newValue) {
      player.auto.autobuyersOn = newValue;
    },
    bulkOn(newValue) {
      player.auto.bulkOn = newValue;
    },
    disableContinuum(newValue) {
      Laitela.setContinuum(!newValue);
    }
  },
  methods: {
    update() {
      this.autobuyersOn = player.auto.autobuyersOn;
      this.bulkOn = player.auto.bulkOn;
      this.showContinuum = Laitela.isUnlocked;
      this.disableContinuum = player.auto.disableContinuum;
    },
    toggleAllAutobuyers() {
      const allAutobuyersDisabled = Autobuyers.unlocked.every(autobuyer => !autobuyer.isActive);
      if (allAutobuyersDisabled) {
        for (const autobuyer of Autobuyers.unlocked) {
          autobuyer.isActive = true;
        }
      } else {
        for (const autobuyer of Autobuyers.unlocked) {
          autobuyer.isActive = false;
        }
      }
    }
  },
  template: `
    <div class="c-subtab-option-container">
      <primary-button-on-off-custom
        v-model="autobuyersOn"
        on="Disable autobuyers"
        off="Enable autobuyers"
        class="o-primary-btn--subtab-option"
      />
      <primary-button
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers()"
      >
        Toggle all autobuyers
      </primary-button>
      <primary-button-on-off-custom
        v-model="bulkOn"
        on="Disable bulk buy"
        off="Enable bulk buy"
        class="o-primary-btn--subtab-option"
      />
      <primary-button-on-off-custom
        v-if="showContinuum"
        v-model="disableContinuum"
        on="Enable Continuum"
        off="Disable Continuum"
        class="o-primary-btn--subtab-option"
      />
    </div>`
});
