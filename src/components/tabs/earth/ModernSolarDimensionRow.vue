<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernSolarDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      requirementReached: false
    };
  },
  computed: {
    name() {
      return `${SolarDimension(this.tier).shortDisplayName} Solar Dimension`;
    },
    showRow() {
      return true;
    },
    buttonContents() {
      return `Cost: ${format(this.cost, 2)} PP`;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = SolarDimension(tier);
      this.isUnlocked = dimension.isUnlocked;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.amount);
      this.bought = dimension.bought;
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      this.requirementReached = Currency.planetPoints.gte(dimension.cost);
    },
    buySolarDimension() {
      buySingleSolarDimension(this.tier);
    },
    buyMaxSolarDimension() {
      buyMaxSolarDimension(this.tier);
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-solar-dim l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': (!isUnlocked || !requirementReached) && !amount.gt(0) }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--buy-td o-primary-btn o-primary-btn--new o-primary-btn--buy-dim"
        @click="buySolarDimension"
      >
        {{ buttonContents }}
      </PrimaryButton>
      <PrimaryButton
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--buy-td-auto"
        @click="buyMaxSolarDimension"
      >
        Buy Max
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-dimension-row-solar-dim:nth-child(even) {
  background-color: var(--color-earth--bg);
}
</style>