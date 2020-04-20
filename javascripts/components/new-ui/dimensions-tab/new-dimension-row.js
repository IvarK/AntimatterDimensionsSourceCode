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
      buyUntil10: true,
      howManyCanBuy: 0,
      isContinuumActive: false,
      continuumValue: 0
    };
  },
  computed: {
    name() {
      return NormalDimension(this.tier).shortDisplayName;
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
    },
    continuumString() {
      return formatWithPrecision(this.continuumValue, 2);
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
      this.amount.copyFrom(dimension.totalAmount);
      this.boughtBefore10 = dimension.boughtBefore10;
      this.howManyCanBuy = buyUntil10 ? dimension.howManyCanBuy : Math.min(dimension.howManyCanBuy, 1);
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.cost.times(Math.max(dimension.howManyCanBuy, 1)));
      this.isAffordable = dimension.isAffordable;
      this.buyUntil10 = buyUntil10;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = dimension.continuumValue;
    },
    buy() {
      if (this.isContinuumActive) return;
      // TODO: Buy Until is on
      if (this.buyUntil10) {
        buyAsManyAsYouCanBuyBtnClick(this.tier);
      } else {
        buyOneDimensionBtnClick(this.tier);
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
  template:
  `<div v-show="isUnlocked" class="c-normal-dim-row">
    <div class="c-normal-dim-row__label c-normal-dim-row__name">
      {{name}} D <span class="c-normal-dim-row__multiplier">{{formatX(multiplier, 1, 1)}}</span>
    </div>
    <div class="c-normal-dim-row__label c-normal-dim-row__label--growable">
      {{amountDisplay}}
    </div>
    <button class="o-primary-btn o-primary-btn--new" @click="buy"
      :class="{ 'o-primary-btn--disabled': !isAffordable && !isContinuumActive }">
        <div class="button-content"
          :enabled="isAffordable || isContinuumActive"
          :ach-tooltip="cappedTooltip"
          :class="tutorialClass()">
            <span v-if="isContinuumActive">
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
        <div class="fill" v-if="!isContinuumActive">
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
