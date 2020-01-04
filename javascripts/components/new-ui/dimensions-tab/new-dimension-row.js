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
      buyUntil10: true,
      howManyCanBuy: 0
    };
  },
  computed: {
    name() {
      return SHORT_DISPLAY_NAMES[this.tier];
    },
    costDisplay() {
      return this.buyUntil10 ? format(this.until10Cost, 0, 0) : format(this.singleCost, 0, 0);
    },
    amountDisplay() {
      return this.tier < 8 ? format(this.amount, 2, 0) : formatInt(this.amount);
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
      const buyUntil10 = player.buyUntil10;
      const dimension = NormalDimension(tier);
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought >= 10;
      this.multiplier.copyFrom(NormalDimension(tier).multiplier);
      this.amount.copyFrom(dimension.amount);
      this.boughtBefore10 = dimension.boughtBefore10;
      this.howManyCanBuy = buyUntil10 ? dimension.howManyCanBuy : Math.min(dimension.howManyCanBuy, 1);
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.cost.times(Math.max(dimension.howManyCanBuy, 1)));
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
      this.remainingUntil10 = dimension.remainingUntil10;
      this.buyUntil10 = buyUntil10;
    },
    buy() {
      // TODO: Buy Until is on
      if (this.buyUntil10) {
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
    <h3>{{name}} D<span class="mult">{{ formatX(multiplier, 1, 1) }}</span></h3>
    <span>{{amountDisplay}}</span>
    <button class="o-primary-btn o-primary-btn--new" @click="buy" :class="{ 'o-primary-btn--disabled': !isAffordable }">
      <div
        class="button-content"
        :enabled="isAffordable"
        :ach-tooltip="cappedTooltip"
        >Buy {{ howManyCanBuy }}<br>Cost: {{ costDisplay }}</div>
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
