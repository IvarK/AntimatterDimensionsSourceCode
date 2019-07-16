"use strict";

Vue.component("black-hole-upgrade-button", {
  props: {
    config: Object
  },
  data() {
    return {
      isAffordable: false,
    };
  },
  computed: {
    effectConfig() {
      const { config } = this;
      return {
        effect: () => config.upgrade.value,
        formatEffect: value => this.displayString(value)
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
    },
    displayString(value) {
      switch (this.config.upgrade.attribute) {
        case BlackHoleUpgradeType.power:
          return `${formatX(value, 2, 2)}`;
        case BlackHoleUpgradeType.interval:
        case BlackHoleUpgradeType.duration:
          return `${TimeSpan.fromSeconds(value).toStringShort(false)}`;
        default:
          throw crash("Invalid Black hole attribute");
      }
    },
  },
  template: `
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      @click="config.upgrade.purchase()"
    >
      <description-display :config="config" />
      <effect-display :config="effectConfig" :title="config.effectTitle" />
      <cost-display v-if="config.upgrade.value !== 0" :config="costConfig" singular="RM" plural="RM" />
    </button>
  `
});