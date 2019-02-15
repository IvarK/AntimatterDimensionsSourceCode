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
      effectValue: 0
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
        this.updateFn = typeof effectValue === "number" ?
          () => this.effectValue = effect() :
          () => this.effectValue.copyFrom(effect());
        if (this.hasCap) {
          this.reachedCap = typeof effectValue === "number" ?
            () => this.effectValue >= this.cap :
            () => this.effectValue.gte(this.cap);
        }
      }
    }
  },
  computed: {
    titleDisplay() {
      if (this.config.staticEffect) return undefined;
      return (this.hasCap && this.reachedCap() ? "Capped" : this.title) + ": ";
    },
    effectDisplay() {
      return this.formatEffect(this.hasCap && this.reachedCap() ? this.cap : this.effectValue);
    },
    cap() {
      return typeof this.config.cap === "function" ? this.config.cap() : this.config.cap;
    },
    hasCap() {
      return this.cap !== undefined || (typeof this.cap === "function" && this.cap() !== undefined);
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