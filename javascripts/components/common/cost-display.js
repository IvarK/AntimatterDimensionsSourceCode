"use strict";

Vue.component("cost-display", {
  props: {
    config: Object,
    br: Boolean,
    name: String,
    title: {
      type: String,
      default: "Cost:",
    }
  },
  data() {
    return {
      isVisible: false,
      cost: 0
    };
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.isVisible = false;
        if (config === undefined) return;
        const cost = config.cost;
        if (cost === undefined) return;
        this.isVisible = true;
        this.formatCost = this.config.formatCost ? this.config.formatCost : format;
        if (typeof cost !== "function") {
          this.cost = typeof cost === "number" ? cost : Decimal.fromDecimal(cost);
          return;
        }
        const costValue = cost();
        const isNumber = typeof costValue === "number";
        this.cost = isNumber ? costValue : Decimal.fromDecimal(costValue);
        this.updateFn = isNumber
          ? () => this.cost = cost()
          : () => this.cost.copyFrom(cost());
      }
    }
  },
  methods: {
    update() {
      if (this.updateFn) this.updateFn();
    }
  },
  template: `
    <span v-if="isVisible">
      <br v-if="br">
      {{ title }} {{ name | quantify(cost, 0, 0, formatCost) }}
    </span>`
});
