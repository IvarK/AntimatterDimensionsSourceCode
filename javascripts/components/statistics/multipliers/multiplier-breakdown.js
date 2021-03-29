"use strict";

Vue.component("multiplier-breakdown", {
  props: {
    id: [String, Number],
  },
  computed: {
    multipliers() {
      return EffectScopes.all[this.id].effects.multipliers.map(
        (effect, id) => (effect.canBeApplied && !new Decimal(effect.effectValue).eq(1) ? id : null)).filter(
          val => val !== null);
    },
    powers() {
      return "powers" in EffectScopes.all[this.id].effects ? EffectScopes.all[this.id].effects.powers.map(
        (effect, id) => (effect.canBeApplied && !new Decimal(effect.effectValue).eq(1) ? id : null)).filter(
          val => val !== null) : [];
    }
  },
  template: `
    <div>
      <multiplier-row
      v-for="effId in powers"
          :key="'p' + effId"
          :effectId="effId"
          :scopeId="id"
          operation="powers"/>
      <multiplier-row
        v-for="effId in multipliers"
          :key="'m' + effId"
          :effectId="effId"
          :scopeId="id"
          operation="multipliers"/>
    </div>
  `
});
