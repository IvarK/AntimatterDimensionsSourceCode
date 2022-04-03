<script>
export default {
  props: {
    budget: Decimal,
    cost: Decimal,
    formatCost: {
      type: Function,
      required: true,
    },
    action: {
      type: Function,
      required: true
    },
  },
  computed: {
    isEnabled() {
      if (Pelle.isDoomed && player.eternities.eq(0)) return false;
      return this.budget.gte(this.cost);
    },
    enabledClass() {
      if (!this.isEnabled || this.isLimitedByPelle) return "c-tt-buy-button--locked";

      return "c-tt-buy-button--unlocked";
    },
    isLimitedByPelle() {
      return Pelle.isDoomed && player.eternities.eq(0);
    }
  },
};
</script>

<template>
  <button
    class="l-tt-buy-button c-tt-buy-button"
    :class="enabledClass"
    @click="action"
  >
    {{ isLimitedByPelle ? "Locked in Doomed before Eternity" : formatCost(cost) }}
  </button>
</template>