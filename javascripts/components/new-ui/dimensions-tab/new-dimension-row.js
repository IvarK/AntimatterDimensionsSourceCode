"use strict";

Vue.component("new-dimension-row", {
  props: {
    tier: Number
  },
  data() {
    return {
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
      buyUntil10: true,
      howManyCanBuy: 0,
      isPrevented: false,
      isContinuumActive: false,
      continuumValue: 0,
      isShown: false
    };
  },
  computed: {
    name() {
      return AntimatterDimension(this.tier).shortDisplayName;
    },
    costDisplay() {
      return this.buyUntil10 ? format(this.until10Cost) : format(this.singleCost);
    },
    amountDisplay() {
      return this.tier < 8 ? format(this.amount, 2, 0) : formatInt(this.amount);
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${format(this.rateOfChange, 2, 2)}%/s)`
        : "";
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
      return `Purchased ${formatInt(this.bought)} ${pluralize("time", this.bought)}`;
    },
  },
  methods: {
    update() {
      const tier = this.tier;
      if (tier > DimBoost.maxDimensionsUnlockable) return;
      const dimension = AntimatterDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      const buyUntil10 = player.buyUntil10;
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought >= 10;
      this.multiplier.copyFrom(AntimatterDimension(tier).multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought = dimension.bought;
      this.boughtBefore10 = dimension.boughtBefore10;
      this.howManyCanBuy = buyUntil10 ? dimension.howManyCanBuy : Math.min(dimension.howManyCanBuy, 1);
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.cost.times(Math.max(dimension.howManyCanBuy, 1)));
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.buyUntil10 = buyUntil10;
      this.isPrevented = this.tier === 8 && Enslaved.isRunning && AntimatterDimension(8).bought >= 1;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = dimension.continuumValue;
      this.isShown =
        (DimBoost.totalBoosts > 0 && DimBoost.totalBoosts + 3 >= tier) || PlayerProgress.infinityUnlocked();
    },
    buy() {
      if (this.isContinuumActive) return;
      if (this.howManyCanBuy === 1) {
        buyOneDimension(this.tier);
      } else {
        buyAsManyAsYouCanBuy(this.tier);
      }

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
  template: `
    <div
      v-show="showRow"
      class="c-antimatter-dim-row"
      :class="{ 'c-dim-row--not-reached': !isUnlocked }"
    >
      <div class="c-dim-row__label c-dim-row__name">
        {{ name }} Antimatter D <span class="c-antimatter-dim-row__multiplier">{{ formatX(multiplier, 1, 1) }}</span>
      </div>
      <div class="c-dim-row__label c-dim-row__label--growable">
        {{ amountDisplay }}
        <span class="c-dim-row__label--small" v-if="rateOfChange.neq(0)">{{ rateOfChangeDisplay }}</span>
      </div>
      <button
        class="o-primary-btn o-primary-btn--new"
        :class="{ 'o-primary-btn--disabled': (!isAffordable && !isContinuumActive) || !isUnlocked || isPrevented}"
        @click="buy"
      >
        <div
          v-tooltip="boughtTooltip"
          class="button-content"
          :enabled="isAffordable || isContinuumActive"
          :class="tutorialClass()"
        >
          <span v-if="isPrevented">
            Shattered by Enslaved
          </span>
          <span v-else-if="isContinuumActive">
            Continuum:
            <br>
            {{ continuumString }}
          </span>
          <span v-else>
            Buy {{ howManyCanBuy }}
            <br>
            Cost: {{ costDisplay }}
          </span>
        </div>
        <div class="fill" v-if="!isContinuumActive && isUnlocked && !isPrevented">
          <div class="fill-purchased" :style="{ 'width': boughtBefore10*10 + '%' }"></div>
          <div class="fill-possible" :style="{ 'width': howManyCanBuy*10 + '%' }"></div>
        </div>
      </button>
    </div>`
});
