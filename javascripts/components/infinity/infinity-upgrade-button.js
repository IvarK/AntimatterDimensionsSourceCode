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
      isDisabled: false,
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
      this.chargePossible = Ra.chargeUnlocked && upgrade.hasChargeEffect;
      this.canBeBought = upgrade.canBeBought;
      this.canBeCharged = upgrade.canCharge;
      this.isCharged = upgrade.isCharged;
      // A bit hacky, but the offline passive IP upgrade is the only one which will ever be zero. We use this to
      // hide the effect value in order to be consistent with the other offline progress upgrades which hide as well
      this.isDisabled = typeof upgrade.config.effect === "function" && Decimal.eq(upgrade.config.effect(), 0);
    }
  },
  template: `
    <button
      :class="classObject"
      @mouseenter="showingCharged = canBeCharged"
      @mouseleave="showingCharged = false"
      @click="upgrade.purchase()"
    >
      <description-display :config="config" />
      <effect-display br v-if="!isDisabled" :config="config" />
      <cost-display br
        v-if="!isBought"
        :config="config"
        singular="Infinity Point"
        plural="Infinity Points"
      />
      <slot />
    </button>`
});
