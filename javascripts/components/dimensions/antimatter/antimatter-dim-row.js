"use strict";

Vue.component("antimatter-dim-row", {
  props: {
    floatingText: Array,
    tier: Number
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      boughtBefore10: 0,
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      isAffordableUntil10: false,
      isContinuumActive: false,
      continuumValue: 0,
      isShown: false
    };
  },
  computed: {
    name() {
      return AntimatterDimension(this.tier).shortDisplayName;
    },
    amountDisplay() {
      return this.tier < 8 ? format(this.amount, 2, 0) : formatInt(this.amount);
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${format(this.rateOfChange, 2, 2)}%/s)`
        : "";
    },
    cappedTooltip() {
      return this.isCapped
        ? "Further eighth dimension purchases are prohibited, as they are the only way to acquire galaxies"
        : null;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    }
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
    tutorialClass() {
      if (this.tier === 1) {
        return Tutorial.glowingClass(TUTORIAL_STATE.DIM1, this.isAffordable);
      } 
      
      if (this.tier === 2) {
        return Tutorial.glowingClass(TUTORIAL_STATE.DIM2, this.isAffordable);
      }

      return {};
    }
  },
  template:
    `<div v-show="showRow" class="c-antimatter-dim-row"
      :class="{ 'c-dim-row--not-reached': !isUnlocked }">
      <div class="c-dim-row__label c-dim-row__name">
        {{name}} Antimatter Dimension {{formatX(multiplier, 1, 1)}}
      </div>
      <div class="c-dim-row__label c-dim-row__label--growable">
        {{amountDisplay}} ({{formatInt(boughtBefore10)}})
        <span class="c-dim-row__label--small" v-if="rateOfChange.neq(0)">{{rateOfChangeDisplay}}</span>
      </div>
      <primary-button
        v-if="!isContinuumActive"
        :enabled="isAffordable && !isCapped && isUnlocked"
        class="o-primary-btn--buy-ad o-primary-btn--buy-single-ad l-dim-row__button"
        :class="tutorialClass()"
        :ach-tooltip="cappedTooltip"
        @click="buySingle">
        <span v-if="isCapped">Capped</span>
        <template v-else>
          <span v-if="showCostTitle(singleCost)">Cost: </span>{{format(singleCost)}}
        </template>
      </primary-button>
      <primary-button
        :enabled="(isAffordableUntil10 || isContinuumActive) && !isCapped && isUnlocked"
        class="o-primary-btn--buy-ad o-primary-btn--buy-10-ad l-dim-row__button"
        :ach-tooltip="cappedTooltip"
        @click="buyUntil10">
        <span v-if="isCapped">Capped</span>
        <span v-else-if="isContinuumActive">Continuum: {{continuumString}}</span>
        <template v-else>
          Until {{formatInt(10)}}, <span v-if="showCostTitle(until10Cost)">
          Cost: </span>{{format(until10Cost)}}
        </template>
      </primary-button>
      <div
        v-for="text in floatingText"
        :key="text.key"
        class='c-antimatter-dim-row__floating-text'
      >{{text.text}}</div>
    </div>`,
});
