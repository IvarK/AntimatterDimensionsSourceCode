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
    config() {
      const config = this.upgrade.config;
      return (this.isCharged || this.showingCharged) ? config.charged : config;
    },
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--bought": this.isBought,
        "o-infinity-upgrade-btn--available": !this.isBought && this.canBeBought,
        "o-infinity-upgrade-btn--unavailable": !this.isBought && !this.canBeBought,
        "o-infinity-upgrade-btn--chargeable": !this.isCharged && this.showingCharged && this.canBeCharged,
        "o-infinity-upgrade-btn--charged": this.isCharged,
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isMaxed;
      this.canBeBought = upgrade.canBeBought;
      const isBanned = upgrade.config.bannedFromCharging;
      this.canBeCharged = (isBanned ? !isBanned : true) && Ra.chargesLeft > 0;
      this.isCharged = upgrade.isCharged;
    }
  },
  template:
    `<button :class="classObject"
      @mouseover="showingCharged = canBeCharged"
      @mouseleave="showingCharged = false" 
      @click="upgrade.purchase()">
      <description-display :config="config"/>
      <effect-display br :config="config" />
      <cost-display br
        v-if="!isBought"
        :config="config"
        singular="IP"
        plural="IP"
      />
      <slot />
    </button>`
});