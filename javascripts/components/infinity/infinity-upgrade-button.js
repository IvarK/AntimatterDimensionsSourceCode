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
      // A bit hacky, but the offline passive IP upgrade (the one that doesn't work online)
      // should hide its effect value if offline progress is disabled, in order to be
      // consistent with the other offline progress upgrades which hide as well.
      // Also, the IP upgrade that works both online and offline should not
      // show 0 if its value is 0. This is a bit inconvenient because sometimes,
      // like after eternity, it can be bought but have value 0, but not showing the effect
      // in this case doesn't feel too bad. Other upgrades, including the cost scaling
      // rebuyables, should never hide their effect.
      this.isDisabled = upgrade.config.isDisabled && upgrade.config.isDisabled(upgrade.config.effect());
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
      <cost-display
        br
        v-if="!isBought"
        :config="config"
        name="Infinity Point"
      />
      <slot />
    </button>`
});
