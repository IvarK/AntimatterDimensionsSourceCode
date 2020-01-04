"use strict";

Vue.component("normal-dim-row", {
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
    };
  },
  computed: {
    name() {
      return DISPLAY_NAMES[this.tier];
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
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const isUnlocked = NormalDimension(tier).isAvailableForPurchase;
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      const dimension = NormalDimension(tier);
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought >= 1;
      this.multiplier.copyFrom(NormalDimension(tier).multiplier);
      this.amount.copyFrom(dimension.amount);
      this.boughtBefore10 = dimension.boughtBefore10;
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.costUntil10);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
    },
    buySingle() {
      buyOneDimensionBtnClick(this.tier);
    },
    buyUntil10() {
      buyManyDimensionsBtnClick(this.tier);
    },
    showCostTitle(value) {
      return value.exponent < 1000000;
    }
  },
  template:
    `<div v-show="isUnlocked" class="c-normal-dim-row">
      <div class="c-normal-dim-row__name c-normal-dim-row__label">
        {{name}} Dimension {{formatX(multiplier, 1, 1)}}
      </div>
      <div class="c-normal-dim-row__label c-normal-dim-row__label--growable">
        {{amountDisplay}} ({{formatInt(boughtBefore10)}}){{rateOfChangeDisplay}}
      </div>
      <primary-button
        :enabled="isAffordable"
        class="o-primary-btn--buy-nd o-primary-btn--buy-single-nd c-normal-dim-row__buy-button"
        :ach-tooltip="cappedTooltip"
        @click="buySingle">
        <span v-if="isCapped">Capped!</span>
        <template v-else>
          <span v-if="showCostTitle(singleCost)">Cost: </span>{{format(singleCost)}}
        </template>
      </primary-button>
      <primary-button
        :enabled="isAffordableUntil10"
        class="o-primary-btn--buy-nd o-primary-btn--buy-10-nd c-normal-dim-row__buy-button"
        :ach-tooltip="cappedTooltip"
        @click="buyUntil10">
        <span v-if="isCapped">Capped!</span>
        <template v-else>
          Until {{formatInt(10)}}, <span v-if="showCostTitle(until10Cost)">
          Cost: </span>{{format(until10Cost)}}
        </template>
      </primary-button>
      <div
        v-for="text in floatingText"
        :key="text.key"
        class='c-normal-dim-row__floating-text'
      >{{text.text}}</div>
    </div>`,
});
