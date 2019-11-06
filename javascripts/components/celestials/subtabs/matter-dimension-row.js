"use strict";

Vue.component("matter-dimension-row", {
  props: {
    dimension: Object
  },
  data() {
    return {
      tier: 0,
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
      timer: 0,
      intervalCap: 0
    };
  },
  computed: {
    name() {
      const suffix = " Dark Dimension";
      switch (this.tier) {
        case 0:
          return `First ${suffix}`;
        case 1:
          return `Second ${suffix}`;
        case 2:
          return `Third ${suffix}`;
        case 3:
          return `Fourth ${suffix}`;
        default:
          throw new Error("Invalid Dark Dimension index");
      }
    }
  },
  methods: {
    update() {
      this.tier = this.dimension._tier;
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
      this.timer = this.dimension.timeSinceLastUpdate;
      this.intervalCap = this.dimension.intervalPurchaseCap;
    }
  },
  template:
  `<div class="c-matter-dimension-container">
    <div class="o-matter-dimension-amount"> {{ name }} : {{ shorten(amount, 2, 0) }}</div>
    <div class="c-matter-dimension-buttons">
      <button 
        @click="dimension.buyChance()" 
        class="o-matter-dimension-button" 
        :class="{ 'o-matter-dimension-button--available': canBuyChance }"> 
        {{ shorten(chance, 2, 2) }}% <span v-if="chance !== 100"><br>Cost: {{ shorten(chanceCost, 2, 0) }}</span>
      </button>
      <button 
        @click="dimension.buyInterval()" 
        class="o-matter-dimension-button" 
        :class="{ 'o-matter-dimension-button--available': canBuyInterval }"> 
        {{ interval.toFixed(2) }}ms <span v-if="interval.gt(intervalCap)">
        <br>Cost: {{ shorten(intervalCost, 2, 0) }}</span>
      </button>
      <button
        @click="dimension.buyPower()"
        class="o-matter-dimension-button"
        :class="{ 'o-matter-dimension-button--available': canBuyPower }">
        {{ format(power, 2, 2) }}x <br>Cost: {{ format(powerCost, 2, 0) }}
      </button>
    </div>
    <span v-if="interval.gt(200)">Tick: {{ timer.toFixed(0) }} ms</span>
  </div>

  `
})
