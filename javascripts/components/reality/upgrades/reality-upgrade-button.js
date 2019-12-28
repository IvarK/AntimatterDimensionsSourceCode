"use strict";

Vue.component("reality-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isAvailableForPurchase: false,
      canBeBought: false,
      isBought: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--bought": this.isBought,
        "c-reality-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-reality-upgrade-btn--locked": !this.isAvailableForPurchase,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
    }
  },
  template: `
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      @click="upgrade.purchase()"
    >
      <hint-text class="l-hint-text--reality-upgrade">RUPG {{config.id}}</hint-text>
      <description-display :config="config"/>
      <description-display
        v-if="!isAvailableForPurchase"
        :config="requirementConfig"
        title="Requires:"
        class="c-reality-upgrade-btn__requirement"
      />
      <template v-else>
        <effect-display :config="config" />
        <cost-display
          v-if="!isBought"
          :config="config"
          singular="RM"
          plural="RM"
        />
      </template>
    </button>
  `
});
