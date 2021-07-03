"use strict";

Vue.component("multiplier-breakdown", {
  props: {
    id: Number,
  },
  data() {
    return {
      expand: false,
    };
  },
  computed: {
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
      return format(this.scope.value, 2, 2);
    }
  },
  methods: {
    toggleExpand() {
      this.expand = !this.expand;
    }
  },
  template: `
    <div>
      <div v-if="expand">
        <multiplier-row
          v-for="(power, i) in powers"
          :key="'p' + i"
          :effect="power"
          operation="POWERS"
        />
        <multiplier-row
          v-for="(multiplier, i) in multipliers"
          :key="'m' + i"
          :effect="multiplier"
          operation="MULTIPLIERS"
        />
      </div>
      <div class="c-past-runs-header" @click="toggleExpand">
        <drop-down :shown.sync="expand" />
        <span>
          <h3 v-if="expand">{{ name }}: {{ total }}</h3>
          <span v-else>{{ name }}: {{ total }}</span>
        </span>
      </div>
    </div>`
});
