"use strict";

Vue.component("imaginary-upgrade-button", {
  props: {
    upgrade: Object
  },
  data() {
    return {
      isAvailableForPurchase: false,
      canBeBought: false,
      isRebuyable: false,
      isBought: false,
      isPossible: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false
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
        "c-reality-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-reality-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.imaginaryUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isAutoUnlocked = ImaginaryUpgrade(20).isBought;
      if (this.isRebuyable) this.isAutobuyerOn = Autobuyer.imaginaryUpgrade(upgrade.id).isActive;
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <button
        :class="classObject"
        class="l-reality-upgrade-btn c-reality-upgrade-btn"
        @click="upgrade.purchase()"
      >
        <hint-text
          type="realityUpgrades"
          class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
        >
          {{ config.name }}
        </hint-text>
        <description-display :config="config"/>
        <description-display
          v-if="($viewModel.shiftDown === isAvailableForPurchase) && !isRebuyable"
          :config="requirementConfig"
          title="Requirement:"
          class="c-reality-upgrade-btn__requirement"
        />
        <template v-else>
          <effect-display :config="config" />
          <cost-display
            v-if="!isBought"
            :config="config"
            singular="Imaginary Machine"
            plural="Imaginary Machines"
          />
        </template>
      </button>
      <primary-button-on-off
        v-if="isRebuyable && isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Auto:"
        class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
      />
    </div>`
});
