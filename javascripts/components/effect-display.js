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
        const effectValue = effect();
        this.effectValue = effectValue;
        let isNumber = typeof effectValue === "number";
        this.updateFn = isNumber ?
          () => this.effectValue = effect() :
          () => this.effectValue.copyFrom(effect());
        const cap = config.cap;
        if (cap === undefined) return;
        this.reachedCapFn = isNumber ?
          () => this.effectValue >= this.cap :
          () => this.effectValue.gte(this.cap);
        if (typeof cap !== "function") {
          this.hasCap = true;
          this.cap = isNumber ? cap : new Decimal(cap);
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
      if (this.config.staticEffect) return undefined;
      return (this.hasCap && this.reachedCap ? "Capped" : this.title) + ": ";
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
  template:
    `<span v-if="isVisible && effectDisplay !== undefined">
      <br v-if="br">
      {{titleDisplay}}{{effectDisplay}}
    </span>`
});