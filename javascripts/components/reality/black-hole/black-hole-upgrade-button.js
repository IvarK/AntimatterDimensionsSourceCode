"use strict";

Vue.component("black-hole-upgrade-button", {
  props: {
    config: Object
  },
  data() {
    return {
      isAffordable: false,
      isCapped: false
    };
  },
  computed: {
    effectConfig() {
      const { config } = this;
      return {
        effect: () => config.upgrade.value,
        formatEffect: () => config.formatEffect(config.upgrade.value)
      };
    },
    costConfig() {
      const { config } = this;
      return {
        cost: () => config.upgrade.cost,
        formatCost: value => shorten(value, 2, 0)
      };
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--unavailable": !this.isAffordable
      };
    }
  },
  methods: {
    update() {
      this.isAffordable = this.config.upgrade.isAffordable && this.config.upgrade.value !== 0;
      this.isCapped = this.config.upgrade.value === 0;
    }
  },
  template: `
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      @click="config.upgrade.purchase()"
    >
      <description-display :config="config" />
      <effect-display :config="effectConfig" :title="config.effectTitle" />
      <cost-display v-if="!isCapped" :config="costConfig" singular="RM" plural="RM" />
    </button>
  `
});