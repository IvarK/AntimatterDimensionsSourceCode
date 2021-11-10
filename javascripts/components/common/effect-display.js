Vue.component("effect-display", {
  props: {
    config: Object,
    br: Boolean,
    title: {
      type: String,
      default: "Currently"
    }
  },
  data() {
    return {
      isVisible: false,
      effectValue: 0,
      // Number.MAX_VALUE doesn't really matter here, but we need it because
      // undefined values are not allowed for reactive properties
      cap: Number.MAX_VALUE,
      hasCap: false
    };
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.isVisible = false;
        if (config === undefined) return;
        const effect = config.effect;
        const formatEffect = config.formatEffect;
        if (effect === undefined || formatEffect === undefined) return;
        this.isVisible = true;
        this.formatEffect = formatEffect;
        if (typeof effect !== "function") {
          this.effectValue = typeof effect === "number" ? effect : Decimal.fromDecimal(effect);
          return;
        }
        const effectValue = effect();
        const isNumber = typeof effectValue === "number";
        this.effectValue = isNumber ? effectValue : Decimal.fromDecimal(effectValue);
        this.updateFn = isNumber
          ? () => this.effectValue = effect()
          : () => this.effectValue.copyFrom(effect());
        // If the config has a reachedCapFn, we assume its effect value calculation
        // takes account of the cap itself, so we don't have to.
        const cap = config.reachedCapFn === undefined ? config.cap : () => this.effectValue;
        if (cap === undefined) return;
        if (config.reachedCapFn) {
          this.reachedCapFn = config.reachedCapFn;
        } else {
          this.reachedCapFn = isNumber
            ? () => this.effectValue >= this.cap
            : () => this.effectValue.gte(this.cap);
        }
        if (typeof cap !== "function") {
          this.hasCap = true;
          this.cap = isNumber ? cap : Decimal.fromDecimal(cap);
          return;
        }
        const updateCap = () => {
          this.cap = cap();
          this.hasCap = this.cap !== undefined;
        };
        const updateEffect = this.updateFn;
        this.updateFn = () => {
          updateEffect();
          updateCap();
        };
        updateCap();
      }
    }
  },
  computed: {
    reachedCap() {
      return this.reachedCapFn();
    },
    titleDisplay() {
      if (this.config.noTitle) return "";
      return `${this.hasCap && this.reachedCap ? "Capped" : this.title}: `;
    },
    effectDisplay() {
      return this.formatEffect(this.hasCap && this.reachedCap ? this.cap : this.effectValue);
    }
  },
  methods: {
    update() {
      if (this.updateFn) this.updateFn();
    }
  },
  template: `
    <span v-if="isVisible && effectDisplay !== undefined">
      <br v-if="br">
      {{ titleDisplay }}{{ effectDisplay }}
    </span>`
});
