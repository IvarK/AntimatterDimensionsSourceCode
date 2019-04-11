Vue.component('matter-dimension-row', {
  props: {
    dimension: Object
  },
  data() {
    return {
      chance: 0,
      interval: 0,
      power: 0,
      chanceCost: 0,
      intervalCost: 0,
      powerCost: 0,
      amount: 0,
      canBuyChance: false,
      canBuyInterval: false,
      canBuyPower: false
    };
  },
  methods: {
    update() {
      this.chance = this.dimension.chance;
      this.interval = this.dimension.interval;
      this.power = this.dimension.power;
      this.chanceCost = this.dimension.chanceCost;
      this.intervalCost = this.dimension.intervalCost;
      this.powerCost = this.dimension.powerCost;
      this.amount = this.dimension.amount;
      this.canBuyChance = player.celestials.laitela.matter >= this.chanceCost;
      this.canBuyInterval = player.celestials.laitela.matter >= this.intervalCost;
      this.canBuyPower = player.celestials.laitela.matter >= this.powerCost;
    }
  },
  template:
  `<div class="c-matter-dimension-container">
    <div class="o-matter-dimension-amount"> {{ shorten(amount) }}</div>
    <div class="c-matter-dimension-buttons">
      <button @click="dimension.buyChance()" :class="{ 'o-matter-dimension-button-available': canBuyChance }"> {{ chance }}% <br>Cost: {{ shorten(chanceCost) }}</button>
      <button @click="dimension.buyInterval()" :class="{ 'o-matter-dimension-button-available': canBuyInterval }"> {{ interval.toFixed(2) }}ms <br>Cost: {{ shorten(intervalCost) }}</button>
      <button @click="dimension.buyPower()" :class="{ 'o-matter-dimension-button-available': canBuyPower }"> {{ shorten(power, 1, 1) }}x <br>Cost: {{ shorten(powerCost) }}</button>
    </div>
  </div>
  
  `
});
