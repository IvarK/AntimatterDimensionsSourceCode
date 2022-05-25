<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicAntimatterDimensionRow",
  components: {
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
      end: false,
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: 0,
      boughtBefore10: 0,
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      isAffordableUntil10: false,
      isContinuumActive: false,
      continuumValue: 0,
      isShown: false,
      isCostsAD: false,
    };
  },
  computed: {
    name() {
      return AntimatterDimension(this.tier).shortDisplayName;
    },
    amountText() {
      const amount = this.tier < 8 ? format(this.amount, 2) : formatInt(this.amount);
      return `${amount} (${formatInt(this.boughtBefore10)})`;
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${format(this.rateOfChange, 2, 2)}%/s)`
        : "";
    },
    singleText() {
      if (this.isCapped) return "Capped";
      const prefix = this.showCostTitle(this.singleCost) ? "Cost: " : "";
      const suffix = this.isCostsAD ? `${this.costUnit}` : "AM";
      return `${prefix} ${format(this.singleCost)} ${suffix}`;
    },
    until10Text() {
      if (this.isCapped) return "Capped";
      if (this.isContinuumActive) return `Continuum: ${this.continuumString}`;

      const prefix = `Until ${formatInt(10)},${this.showCostTitle(this.until10Cost) ? " Cost" : ""}`;
      const suffix = this.isCostsAD ? `${this.costUnit}` : "AM";
      return `${prefix} ${format(this.until10Cost)} ${suffix}`;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    },
    boughtTooltip() {
      if (this.isCapped) return `Enslaved prevents the purchase of more than ${format(1)} 8th Antimatter Dimension`;
      if (this.isContinuumActive) return "Continuum produces all your Antimatter Dimensions";
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    costUnit() {
      return `${AntimatterDimension(this.tier - 2).shortDisplayName} AD`;
    },
  },
  methods: {
    update() {
      const tier = this.tier;
      if (tier > DimBoost.maxDimensionsUnlockable) return;
      const dimension = AntimatterDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought >= 1;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.totalAmount = dimension.totalAmount;
      this.bought = dimension.bought;
      this.boughtBefore10 = dimension.boughtBefore10;
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.costUntil10);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = dimension.continuumValue;
      this.isShown =
        (DimBoost.totalBoosts > 0 && DimBoost.totalBoosts + 3 >= tier) || PlayerProgress.infinityUnlocked();
      this.isCostsAD = NormalChallenge(6).isRunning && tier > 2 && !this.isContinuumActive;
    },
    buySingle() {
      if (this.isContinuumActive) return;
      buyOneDimension(this.tier);
      if (this.tier === 2) {
        Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
      }
    },
    buyUntil10() {
      if (this.isContinuumActive) return;
      buyManyDimension(this.tier);
      if (this.tier === 2) {
        Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
      }
    },
    showCostTitle(value) {
      return value.exponent < 1000000;
    },
    isLongText(str) {
      return str.length > 15;
    },
    singlesClass() {
      const small = { "l-condensed-text": this.isLongText(this.singleText) };
      let tutorial;
      switch (this.tier) {
        case 1:
          tutorial = Tutorial.glowingClass(TUTORIAL_STATE.DIM1, this.isAffordable);
          break;
        case 2:
          tutorial = Tutorial.glowingClass(TUTORIAL_STATE.DIM2, this.isAffordable);
          break;
      }

      return { ...small, ...tutorial };
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-antimatter-dim-row l-full-row-container"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <div class="c-dim-row__label c-dim-row__name l-text-rows">
      <span>{{ name }} Antimatter Dimension</span>
      <span class="c-dim-row__label--small">
        {{ formatX(multiplier, 1, 1) }}
      </span>
    </div>
    <div class="c-dim-row__label c-dim-row__label--amount l-text-rows">
      <span>
        {{ amountText }}
      </span>
      <span
        v-if="rateOfChange.neq(0)"
        class="c-dim-row__label--small"
      >
        {{ rateOfChangeDisplay }}
      </span>
    </div>
    <PrimaryButton
      v-if="!isContinuumActive"
      v-tooltip="boughtTooltip"
      :enabled="isAffordable && !isCapped && isUnlocked"
      class="o-primary-btn--buy-ad o-primary-btn--buy-single-ad l-dim-row__button"
      :class="singlesClass()"
      @click="buySingle"
    >
      {{ singleText }}
    </PrimaryButton>
    <PrimaryButton
      :enabled="(isAffordableUntil10 || isContinuumActive) && !isCapped && isUnlocked"
      class="o-primary-btn--buy-ad o-primary-btn--buy-10-ad l-dim-row__button"
      :class="{ 'l-condensed-text': isLongText(until10Text) }"
      :ach-tooltip="boughtTooltip"
      @click="buyUntil10"
    >
      {{ until10Text }}
    </PrimaryButton>
  </div>
</template>

<style scoped>
.l-full-row-container {
  height: 4.5rem;
}

.l-condensed-text {
  vertical-align: middle;
  font-size: 1rem;
  line-height: 1rem;
}

.l-text-rows {
  display: flex;
  flex-direction: column;
}
</style>

