<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicAntimatterDimensionRow",
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
      formattedAmount: null,
      hasTutorial: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return `${AntimatterDimension(this.tier).shortDisplayName} Antimatter Dimension`;
    },
    amountText() {
      if (this.formattedAmount) return this.formattedAmount;
      const amount = this.tier < 8 ? format(this.amount, 2) : formatInt(this.amount);
      return `${amount} (${formatInt(this.boughtBefore10)})`;
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
      if (this.isCapped) return `Nameless prevents the purchase of more than ${format(1)} 8th Antimatter Dimension`;
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
      if (tier === 8 && this.isDoomed) this.formattedAmount = formatInt(this.amount);
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
      this.hasTutorial = (tier === 1 && Tutorial.isActive(TUTORIAL_STATE.DIM1)) ||
        (tier === 2 && Tutorial.isActive(TUTORIAL_STATE.DIM2));
    },
    buySingle() {
      if (this.isContinuumActive) return;
      if (!buyOneDimension(this.tier)) return;
      if (this.tier === 1) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM1);
      if (this.tier === 2) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
    },
    buyUntil10() {
      if (this.isContinuumActive) return;
      if (!buyManyDimension(this.tier)) return;
      if (this.tier === 2) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
    },
    showCostTitle(value) {
      return value.exponent < 1000000;
    },
    isLongText(str) {
      return str.length > 20;
    },
    textClass() {
      return {
        "l-dim-row-small-text": this.isLongText(this.singleText) || !this.showCostTitle(this.singleCost),
      };
    },
    tutorialClass() {
      return {
        "l-glow-container": true,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    },
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row c-antimatter-dim-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount-text="amountText"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        v-if="!isContinuumActive"
        :ach-tooltip="boughtTooltip"
        :enabled="isAffordable && !isCapped && isUnlocked"
        class="o-primary-btn--buy-ad o-primary-btn--buy-single-ad"
        :class="textClass()"
        @click="buySingle"
      >
        <div :class="tutorialClass()">
          {{ singleText }}
        </div>
        <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
        />
      </PrimaryButton>
      <PrimaryButton
        :enabled="(isAffordableUntil10 || isContinuumActive) && !isCapped && isUnlocked"
        class="o-primary-btn--buy-ad o-primary-btn--buy-dim"
        :class="{
          'o-primary-btn--buy-10-ad': !isContinuumActive,
          'o-primary-btn--continuum-ad': isContinuumActive,
          'l-dim-row-small-text': isLongText(until10Text) && !isContinuumActive
        }"
        :ach-tooltip="boughtTooltip"
        @click="buyUntil10"
      >
        {{ until10Text }}
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-glow-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: var(--var-border-radius, inherit);
}
</style>
