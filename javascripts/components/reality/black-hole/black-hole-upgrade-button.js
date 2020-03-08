"use strict";

Vue.component("black-hole-upgrade-button", {
  props: {
    config: Object
  },
  data() {
    return {
      isAffordable: false,
      isCapped: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false
    };
  },
  computed: {
    effectConfig() {
      const { config } = this;
      return {
        effect: () => config.upgrade.value,
        formatEffect: value => config.formatEffect(value)
      };
    },
    costConfig() {
      const { config } = this;
      return {
        cost: () => config.upgrade.cost,
        formatCost: value => format(value, 2, 0)
      };
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--unavailable": !this.isAffordable
      };
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      this.config.upgrade.isAutobuyerOn = newValue;
    }
  },
  methods: {
    update() {
      this.isAffordable = this.config.upgrade.isAffordable && this.config.upgrade.value !== 0;
      this.isCapped = this.config.upgrade.value === 0;
      this.isAutoUnlocked = this.config.upgrade.hasAutobuyer && Ra.has(RA_UNLOCKS.AUTO_BLACK_HOLE_POWER);
      this.isAutobuyerOn = this.config.upgrade.hasAutobuyer && this.config.upgrade.isAutobuyerOn;
    }
  },
  template: `
    <div class="l-spoon-btn-group">
      <button
        :class="classObject"
        class="l-reality-upgrade-btn c-reality-upgrade-btn"
        @click="config.upgrade.purchase()"
      >
        <description-display :config="config" />
        <effect-display :config="effectConfig" :title="config.effectTitle" />
        <cost-display v-if="!isCapped" :config="costConfig" singular="RM" plural="RM" />
      </button>
      <primary-button-on-off
        v-if="isAutoUnlocked"
        v-model="isAutobuyerOn"
        text="Auto:"
        class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
      />
    </div>
  `
});
