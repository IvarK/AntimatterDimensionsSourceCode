Vue.component("effect-display", {
  props: {
    config: Object,
    br: Boolean
  },
  data() {
    return {
      isVisible: false,
      effectValue: 0
    };
  },
  computed: {
    effectDisplay() {
      return this.formatEffect(this.effectValue);
    },
    cap() {
      return this.config.cap;
    },
    hasCap() {
      return this.cap !== undefined;
    }
  },
  created() {
    if (this.config === undefined) return;
    const config = this.config;
    const effect = config.effect;
    const formatEffect = config.formatEffect;
    if (effect === undefined || formatEffect === undefined) return;
    this.isVisible = true;
    this.formatEffect = formatEffect;
    const effectValue = effect();
    this.effectValue = effectValue;
    const update = typeof effectValue === "number" ?
      () => this.effectValue = effect() :
      () => this.effectValue.copyFrom(effect());
    this.on$(GameEvent.UPDATE, update);
    if (this.hasCap) {
      this.reachedCap = typeof effectValue === "number" ?
        () => this.effectValue >= this.cap :
        () => this.effectValue.gte(this.cap);
    }
  },
  template:
    `<span v-if="isVisible">
      <br v-if="br">
      {{hasCap && reachedCap() ? "Capped" : "Currently"}}: {{formatEffect(hasCap && reachedCap() ? cap : effectValue)}}
    </span>`
});