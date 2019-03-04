Vue.component("cost-display", {
  props: {
    config: Object,
    br: Boolean,
    singular: String,
    plural: String,
    prefix: {
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
        this.formatCost = this.config.formatCost;
        if (typeof cost !== "function") {
          this.cost = cost;
          return;
        }
        this.cost = cost();
        this.updateFn = typeof this.cost === "number" ?
          () => this.cost = cost() :
          () => this.cost.copyFrom(cost());
      }
    }
  },
  computed: {
    costDisplay() {
      return this.formatCost ? this.formatCost(this.cost) : this.shorten(this.cost, 0, 0);
    }
  },
  methods: {
    update() {
      if (this.updateFn) this.updateFn();
    }
  },
  template: `<span v-if="isVisible"><br v-if="br">{{prefix}} {{costDisplay}} {{singular | pluralize(cost, plural)}}</span>`
});