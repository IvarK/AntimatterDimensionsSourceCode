"use strict";

Vue.component("multiplier-row", {
  props: {
    effectId: Number,
    scopeId: [String, Number],
    operation: String,
  },
  data() {
    return {
      value: new Decimal(0),
      expand: false,
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
      const EFFECT = EffectScopes.all[this.scopeId].effects[this.operation][this.effectId];
      this.value.copyFrom(new Decimal(EFFECT.effectValue));
      this.name = EFFECT.name;
      this.innerId = EFFECT instanceof EffectScope ? EffectScopes.all.indexOf(EFFECT) : -1;
    }
  },
  template: `
  <div>
    <div @click="expand=!expand"> {{name}} : {{displayValue}} </div>
    <multiplier-breakdown v-if="innerId > -1" v-show="expand" :id="innerId"/>
  </div>
  `
});