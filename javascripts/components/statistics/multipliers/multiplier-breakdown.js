"use strict";

Vue.component("multiplier-breakdown", {
  props: {
    id: Number,
    operation: {
      type: String,
      default: "BASE"
    }
  },
  data() {
    return {
      expand: false,
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
        BASE: val => format(val, 2, 2)
      };
      return SYM[this.operation](this.scope.value);
    },
    scope() {
      return EffectScopes.all[this.id];
    },
    multipliers() {
      return EFFECT_TYPE.MULTIPLIERS in this.scope.validEffects ? this.scope.validEffects.MULTIPLIERS : [];
    },
    powers() {
      return EFFECT_TYPE.POWERS in this.scope.validEffects ? this.scope.validEffects.POWERS : [];
    },
    name() {
      return this.scope.name;
    },
    total() {
      return this.displayValue;
    }
  },
  methods: {
    toggleExpand() {
      this.expand = !this.expand;
    }
  },
  template: `
    <div>
      <div class="c-multiplier-tab-breakdown" v-if="expand">
        <multiplier-row
          v-for="(multiplier, i) in multipliers"
          :key="'m' + i"
          :effect="multiplier"
          operation="MULTIPLIERS"
        />
        <multiplier-row
          v-for="(power, i) in powers"
          :key="'p' + i"
          :effect="power"
          operation="POWERS"
        />
      </div>
      <div class="c-multiplier-tab-row-entry c-multiplier-tab-header" @click="toggleExpand">
        <div class="c-multiplier-tab-row-name">
          <drop-down :shown.sync="expand" />
          <span> {{name}} </span>
        </div>
        <div class="c-multiplier-tab-row-value"> {{total}}  </div>
      </div>
    </div>`
});
