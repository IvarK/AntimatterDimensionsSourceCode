"use strict";

Vue.component("infinity-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      canBeBought: false,
      chargePossible: false,
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
      return (this.chargePossible && (this.isCharged || this.showingCharged || this.shiftDown))
      ? config.charged
      : config;
    },
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--bought": this.isBought,
        "o-infinity-upgrade-btn--available": !this.isBought && this.canBeBought,
        "o-infinity-upgrade-btn--unavailable": !this.isBought && !this.canBeBought,
        "o-infinity-upgrade-btn--chargeable": !this.isCharged && this.chargePossible &&
          (this.showingCharged || this.shiftDown),
        "o-infinity-upgrade-btn--charged": this.isCharged,
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.chargePossible = Ra.chargeUnlocked && (this.upgrade.config.charged !== undefined);
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
