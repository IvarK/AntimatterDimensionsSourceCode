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
    orderedEffects() {
      const effectScope = this.scope;
      return effectScope.effectOrder.filter(
        effect =>
          effect.type in effectScope.validEffects && effectScope.validEffects[effect.type].includes(effect.effect)
      );
    },
    name() {
      return this.scope.name;
    },
    total() {
      return this.displayValue;
    },
    base() {
      return format(this.scope.base, 2, 2);
    }
  },
  methods: {
    toggleExpand() {
      this.expand = !this.expand;
    },
    runningTotalUntil(effect) {
      return this.scope.applyEffectsUntil(effect)
    }
  },
  template: `
    <div>
      <div class="c-multiplier-tab-row-entry c-multiplier-tab-header" @click="toggleExpand">
        <div class="c-multiplier-tab-row-name">
          <drop-down :shown.sync="expand" />
          <span> {{name}} </span>
        </div>
        <slot>
          <div class="c-multiplier-tab-row-value" v-if="!expand"> {{total}}  </div></slot>
        </div>
      <transition name="expandMulti">
        <div class="c-multiplier-tab-breakdown" v-if="expand">
          <multiplier-row
            v-for="effect in orderedEffects"
            :key="effect.id"
            :effect="effect.effect"
            :total="runningTotalUntil(effect)"
            :operation="effect.type"
          />
          </div>
      </transition>
    </div>`
});
