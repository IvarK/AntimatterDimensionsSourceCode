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
      canBuyPower: false
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
      this.canBuyChance = player.celestials.laitela.matter.gte(this.chanceCost);
      this.canBuyInterval = player.celestials.laitela.matter.gte(this.intervalCost);
      this.canBuyPower = player.celestials.laitela.matter.gte(this.powerCost);
    }
  },
  template:
  `<div class="c-matter-dimension-container">
    <div class="o-matter-dimension-amount"> {{ shorten(amount, 2, 0) }}</div>
    <div class="c-matter-dimension-buttons">
      <button 
        @click="dimension.buyChance()" 
        class="o-matter-dimension-button" 
        :class="{ 'o-matter-dimension-button--available': canBuyChance }"> 
        {{ chance }}% <br>Cost: {{ shorten(chanceCost, 2, 0) }}
      </button>
      <button 
        @click="dimension.buyInterval()" 
        class="o-matter-dimension-button" 
        :class="{ 'o-matter-dimension-button--available': canBuyInterval }"> 
        {{ interval.toFixed(2) }}ms <br>Cost: {{ shorten(intervalCost, 2, 0) }}
      </button>
      <button 
        @click="dimension.buyPower()" 
        class="o-matter-dimension-button" 
        :class="{ 'o-matter-dimension-button--available': canBuyPower }"> 
        {{ shorten(power, 2, 2) }}x <br>Cost: {{ shorten(powerCost, 2, 0) }}
      </button>
    </div>
  </div>
  
  `
})
