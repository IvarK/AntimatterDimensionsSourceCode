"use strict";

Vue.component("multiplier-row", {
  props: {
    effect: Object,
    operation: String,
  },
  data() {
    return {
      value: new Decimal(0),
      innerId: -1
    };
  },
  computed: {
    displayValue() {
      const SYM = {
        overides: val => `#${format(val, 2, 2)}`,
        addends: val => `+${format(val, 2, 2)}`,
        subtrahends: val => `-${format(val, 2, 2)}`,
        dividends: val => `/${format(val, 2, 2)}`,
        multipliers: val => formatX(val, 2, 2),
        powers: val => formatPow(val, 2, 2),
        dilations: val => `~${format(val, 2, 2)}`,
      };
      return SYM[this.operation](this.value);
    }
  },
  methods: {
    update() {
      const EFFECT = this.effect;
      this.value.copyFrom(new Decimal(EFFECT.effectValue));
      this.name = EFFECT.name;
      this.innerId = EFFECT && EFFECT instanceof EffectScope && Object.values(EFFECT.validEffects).reduce((acc, arr) =>
        acc + arr.length
      , 0) > 1 ? EffectScopes.all.indexOf(EFFECT) : -1;
    }
  },
  template: `
  <div>
    <multiplier-breakdown v-if="innerId > -1" :id="innerId"/>
    <div v-else> {{name}} : {{displayValue}} </div>
  </div>
  `
});