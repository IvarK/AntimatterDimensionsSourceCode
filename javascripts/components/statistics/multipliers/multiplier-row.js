"use strict";

Vue.component("multiplier-row", {
  props: {
    effect: Object,
    operation: String,
    total: Object
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
        OVERRIDES: val => `#${format(val, 2, 2)}`,
        ADDENDS: val => `+${format(val, 2, 2)}`,
        SUBTRAHENDS: val => `-${format(val, 2, 2)}`,
        DIVISORS: val => `/${format(val, 2, 2)}`,
        MULTIPLIERS: val => formatX(val, 2, 2),
        POWERS: val => formatPow(val, 2, 2),
        DILATIONS: val => `~${format(val, 2, 2)}`,
      };
      return SYM[this.operation](this.value);
    },
    displayTotal() {
      return format(this.total, 2, 2)
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
    <div class="c-multiplier-tab-row">
      <multiplier-breakdown v-if="innerId > -1" :id="innerId" :operation="operation">
        <div class="c-multiplier-tab-row-value"> {{ displayValue }} Total: {{ displayTotal }}</div>
      </multiplier-breakdown>
      <div class="c-multiplier-tab-row-entry" v-else>
        <div class="c-multiplier-tab-row-name">{{ name }}</div>
        <div class="c-multiplier-tab-row-value"> {{ displayValue }} Total: {{ displayTotal }}</div>
      </div>
    </div>`
});
