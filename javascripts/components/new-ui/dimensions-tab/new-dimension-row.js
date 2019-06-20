"use strict";

Vue.component("new-dimension-row", {
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
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      isAffordableUntil10: false,
      remainingUntil10: 0,
      howManyCanBuy: 0
    };
  },
  computed: {
    name() {
      return SHORT_DISPLAY_NAMES[this.tier];
    },
    amountDisplay() {
      return this.tier < 8 ? this.shortenDimensions(this.amount) : shortenSmallInteger(this.amount);
    },
    rateOfChangeDisplay() {
      return this.tier < 8
        ? ` (+${this.shortenRateOfChange(this.rateOfChange)}%/s)`
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
      const isUnlocked = NormalDimension(tier).isAvailable;
      this.isUnlocked = isUnlocked;
      if (!isUnlocked) return;
      const dimension = NormalDimension(tier);
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought >= 10;
      this.multiplier.copyFrom(getDimensionFinalMultiplier(tier));
      this.amount.copyFrom(dimension.amount);
      this.boughtBefore10 = dimension.boughtBefore10;
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.costUntil10.times(dimension.howManyCanBuy));
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
      this.remainingUntil10 = dimension.remainingUntil10;
      this.howManyCanBuy = until10Setting ? dimension.howManyCanBuy : Math.min(dimension.howManyCanBuy, 1);
    },
    buy() {
      // TODO: Buy Until is on
      if (until10Setting) {
        buyAsManyAsYouCanBuyBtnClick(this.tier);
      } else {
        buyOneDimensionBtnClick(this.tier);
      }
    },
    showCostTitle(value) {
      return value.exponent < 1000000;
    }
  },
  template:
  `<div v-show="isUnlocked" class="dimension-row">
    <h3>{{name}} D<span class="mult">x{{ shortenMultiplier(multiplier) }}</span></h3>
    <span>{{amountDisplay}}</span>
    <button class="storebtn" @click="buy" :class="{ 'storebtn-unavailable': !isAffordable }">
      <div 
        class="button-content"
        :enabled="isAffordable"
        :ach-tooltip="cappedTooltip"
        >Buy {{ howManyCanBuy }}<br>Cost: {{ shortenCosts(singleCost) }}</div>
      <div class="fill">
        <div class="fill1" :style="{ 'width': boughtBefore10*10 + '%' }"></div>
        <div class="fill2" :style="{ 'width': howManyCanBuy*10 + '%' }"></div>
      </div>
    </button>
    <div
      v-for="text in floatingText"
      :key="text.key"
      class='c-normal-dim-row__floating-text'
    >{{text.text}}</div>
  </div>`
});