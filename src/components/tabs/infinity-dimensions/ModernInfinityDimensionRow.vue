<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ModernInfinityDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      hasPrevTier: false,
      isUnlocked: false,
      canUnlock: false,
      multiplier: new Decimal(0),
      baseAmount: 0,
      amount: new Decimal(0),
      purchases: 0,
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isCapped: false,
      capIP: new Decimal(0),
      isAutobuyerOn: false,
      isEC8Running: false,
      hardcap: InfinityDimensions.HARDCAP_PURCHASES,
      eternityReached: false,
      enslavedRunning: false,
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return `${InfinityDimension(this.tier).shortDisplayName} Infinity Dimension`;
    },
    costDisplay() {
      if (this.isUnlocked || this.shiftDown) {
        if (this.isCapped) return "Capped";
        return this.showCostTitle ? `Cost: ${format(this.cost)} IP` : `${format(this.cost)} IP`;
      }

      if (this.canUnlock) {
        return "Unlock";
      }

      return `Reach ${formatPostBreak(InfinityDimension(this.tier).amRequirement)} AM`;
    },
    hasLongText() {
      return this.costDisplay.length > 15;
    },
    capTooltip() {
      if (this.enslavedRunning) return `Nameless prevents the purchase of more than ${format(10)} Infinity Dimensions`;
      if (this.isCapped) return `Cap reached at ${format(this.capIP)} IP`;
      return `Purchased ${quantifyInt("time", this.purchases)}`;
    },
    showRow() {
      return this.eternityReached || this.isUnlocked || this.canUnlock || this.amount.gt(0) ||
        this.hasPrevTier;
    },
    showCostTitle() {
      return this.cost.exponent < 1e6;
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.infinityDimension(this.tier).isActive = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = InfinityDimension(tier);
      this.hasPrevTier = tier === 1 || InfinityDimension(tier - 1).isUnlocked;
      this.isUnlocked = dimension.isUnlocked;
      this.canUnlock = dimension.canUnlock;
      this.multiplier.copyFrom(dimension.multiplier);
      this.baseAmount = dimension.baseAmount;
      this.purchases = dimension.purchases;
      this.amount.copyFrom(dimension.amount);
      this.rateOfChange.copyFrom(dimension.rateOfChange);
      this.isAutobuyerUnlocked = Autobuyer.infinityDimension(tier).isUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      this.isCapped = dimension.isCapped;
      if (this.isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
        this.hardcap = dimension.purchaseCap;
      }
      this.isEC8Running = EternityChallenge(8).isRunning;
      this.isAutobuyerOn = Autobuyer.infinityDimension(tier).isActive;
      this.eternityReached = PlayerProgress.eternityUnlocked();
      this.enslavedRunning = Enslaved.isRunning;
    },
    buySingleInfinityDimension() {
      InfinityDimension(this.tier).buySingle();
    },
    buyMaxInfinityDimension() {
      InfinityDimension(this.tier).buyMax(false);
    },
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-infinity-dim l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !canUnlock }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <div class="c-modern-dim-purchase-count-tooltip">
        {{ capTooltip }}
      </div>
      <PrimaryButton
        :enabled="isAvailableForPurchase || (!isUnlocked && canUnlock)"
        class="o-primary-btn--buy-id o-primary-btn o-primary-btn--new o-primary-btn--buy-dim"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buySingleInfinityDimension"
      >
        {{ costDisplay }}
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="isAutobuyerUnlocked && !isEC8Running"
        v-model="isAutobuyerOn"
        class="o-primary-btn--id-auto"
        label="Auto:"
      />
      <PrimaryButton
        v-else
        :enabled="isAvailableForPurchase"
        class="o-primary-btn--id-auto"
        @click="buyMaxInfinityDimension"
      >
        Buy Max
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.c-modern-dim-tooltip-container .c-modern-dim-purchase-count-tooltip {
  position: absolute;
  width: 20rem;
  top: 50%;
  font-size: 1.3rem;
  line-height: 1.6rem;
  color: white;
  background: black;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-width, 0.5rem);
  /* Buttons are 40rem wide, tooltip is 20rem */
  transform: translate(calc(-175% - 1rem), -50%);
  padding: 0.5rem;
  visibility: hidden;
}
</style>
