"use strict";

Vue.component("pelle-upgrade", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isBought: false,
      canBeBought: false
    }
  },
  methods: {
    update() {
      this.isBought = this.upgrade.isBought;
      this.canBeBought = this.upgrade.canBeBought;
    },
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    upgradeClass() {
      return {
        [`pelle-upgrade-${this.upgrade.config.currency}`]: true,
        "pelle-upgrade--canbuy": this.canBeBought,
        "pelle-upgrade--isbought": this.isBought
      };
    }
  },
  template:
  `<div
    class="pelle-upgrade" 
    :class="upgradeClass" 
    @click="upgrade.purchase()">
    <description-display :config="config"/>
    <effect-display br :config="config" />
    <cost-display br
      v-if="!isBought"
      :config="config"
      :singular="upgrade.currencyDisplay"
      :plural="upgrade.currencyDisplay"
    />
  </div>`
});