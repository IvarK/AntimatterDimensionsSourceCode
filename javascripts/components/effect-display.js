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
    }
  },
  created() {
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
  },
  template: `<span v-if="isVisible"><br v-if="br">Currently: {{effectDisplay}}</span>`
});