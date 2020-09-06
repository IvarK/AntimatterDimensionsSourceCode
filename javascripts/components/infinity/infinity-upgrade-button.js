"use strict";

Vue.component("infinity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      canBeBought: false,
      canBeCharged: false,
      isBought: false,
      isCharged: false,
      showingCharged: false
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    config() {
      const config = this.upgrade.config;
      return (this.isCharged || this.showingCharged || (this.shiftDown && this.canBeCharged)) ? config.charged : config;
    },
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--bought": this.isBought,
        "o-infinity-upgrade-btn--available": !this.isBought && this.canBeBought,
        "o-infinity-upgrade-btn--unavailable": !this.isBought && !this.canBeBought,
        "o-infinity-upgrade-btn--chargeable": (!this.isCharged && this.showingCharged && this.canBeCharged) ||
          (this.shiftDown && this.canBeCharged),
        "o-infinity-upgrade-btn--charged": this.isCharged,
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.canBeBought = upgrade.canBeBought;
      this.canBeCharged = upgrade.canCharge;
      this.isCharged = upgrade.isCharged;
    }
  },
  template:
    `<button :class="classObject"
      @mouseenter="showingCharged = canBeCharged"
      @mouseleave="showingCharged = false"
      @click="upgrade.purchase()">
      <description-display :config="config"/>
      <effect-display br :config="config" />
      <cost-display br
        v-if="!isBought"
        :config="config"
        singular="Infinity Point"
        plural="Infinity Points"
      />
      <slot />
    </button>`
});
