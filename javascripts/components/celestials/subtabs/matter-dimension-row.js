"use strict";

Vue.component("matter-dimension-row", {
  props: {
    dimension: Object
  },
  data() {
    return {
      chance: 0,
      interval: new Decimal(0),
      power: new Decimal(0),
      chanceCost: 0,
      intervalCost: 0,
      powerCost: 0,
      amount: new Decimal(0),
      canBuyChance: false,
      canBuyInterval: false,
      canBuyPower: false,
      isIntervalCapped: false,
    };
  },
  methods: {
    update() {
      this.chance = this.dimension.chance;
      this.interval.copyFrom(this.dimension.interval);
      this.power.copyFrom(this.dimension.power);
      this.chanceCost = this.dimension.chanceCost;
      this.intervalCost = this.dimension.intervalCost;
      this.powerCost = this.dimension.powerCost;
      this.amount.copyFrom(this.dimension.amount);
      this.canBuyChance = this.dimension.canBuyChance;
      this.canBuyInterval = this.dimension.canBuyInterval;
      this.canBuyPower = this.dimension.canBuyPower;
      this.isIntervalCapped = this.dimension.isIntervalCapped;
    }
  },
  template:
  `<div class="c-matter-dimension-container">
    <div class="o-matter-dimension-amount"> {{ format(amount, 2, 0) }}</div>
    <div class="c-matter-dimension-buttons">
      <button
        @click="dimension.buyChance()"
        class="o-matter-dimension-button"
        :class="{ 'o-matter-dimension-button--available': canBuyChance }">
        {{ chance }}% <span v-if="chance !== 100"><br>Cost: {{ format(chanceCost, 2, 0) }}</span>
      </button>
      <button
        @click="dimension.buyInterval()"
        class="o-matter-dimension-button"
        :class="{ 'o-matter-dimension-button--available': canBuyInterval }">
        {{ interval.toFixed(2) }}ms <span v-if="!isIntervalCapped"><br>Cost: {{ format(intervalCost, 2, 0) }}</span>
      </button>
      <button
        @click="dimension.buyPower()"
        class="o-matter-dimension-button"
        :class="{ 'o-matter-dimension-button--available': canBuyPower }">
        {{ format(power, 2, 2) }}x <br>Cost: {{ format(powerCost, 2, 0) }}
      </button>
    </div>
  </div>

  `
})
