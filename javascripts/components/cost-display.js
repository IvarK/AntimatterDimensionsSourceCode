Vue.component("cost-display", {
  props: {
    config: Object,
    br: Boolean,
    singular: String,
    plural: String
  },
  data() {
    return {
      isVisible: false,
      cost: 0
    };
  },
  computed: {
    costDisplay() {
      return this.formatCost ? this.formatCost(this.cost) : this.shortenCosts(this.cost);
    }
  },
  created() {
    const cost = this.config.cost;
    if (cost === undefined) return;
    this.isVisible = true;
    this.formatCost = this.config.formatCost;
    if (typeof cost !== "function") {
      this.cost = cost;
      return;
    }
    this.cost = cost();
    const update = typeof this.cost === "number" ?
      () => this.cost = cost() :
      () => this.cost.copyFrom(cost());
    this.on$(GameEvent.UPDATE, update);
  },
  template: `<span v-if="isVisible"><br v-if="br">Cost: {{costDisplay}} {{singular | pluralize(cost, plural)}}</span>`
});