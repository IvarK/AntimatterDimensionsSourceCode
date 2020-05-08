"use strict";

Vue.component("matter-dimension-row", {
  props: {
    dimension: Object
  },
  data() {
    return {
      tier: 0,
      interval: new Decimal(0),
      baseInterval: new Decimal(0),
      powerDM: new Decimal(0),
      powerDE: new Decimal(0),
      intervalCost: 0,
      powerDMCost: 0,
      powerDECost: 0,
      amount: new Decimal(0),
      canBuyInterval: false,
      canBuyPowerDM: false,
      canBuyPowerDE: false,
      timer: 0,
      timerPecent: 0,
      intervalCap: 0
    };
  },
  computed: {
    name() {
      const suffix = " Dark Matter Dimension";
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
          throw new Error("Invalid Dark Matter Dimension index");
      }
    }
  },
  methods: {
    update() {
      this.tier = this.dimension._tier;
      this.interval = this.dimension.interval;
      this.baseInterval = this.dimension.baseInterval;
      this.powerDM.copyFrom(this.dimension.powerDM);
      this.powerDE = this.dimension.powerDE;
      this.intervalCost = this.dimension.intervalCost;
      this.powerDMCost = this.dimension.powerDMCost;
      this.powerDECost = this.dimension.powerDECost;
      this.amount.copyFrom(this.dimension.amount);
      this.canBuyInterval = this.dimension.canBuyInterval;
      this.canBuyPowerDM = this.dimension.canBuyPowerDM;
      this.canBuyPowerDE = this.dimension.canBuyPowerDE;
      this.timer = this.dimension.timeSinceLastUpdate;
      this.timerPercent = this.timer / this.interval;
      this.intervalCap = this.dimension.intervalPurchaseCap;
    }
  },
  template:
  `<div class="c-matter-dimension-container">
    <div class="o-matter-dimension-amount"> {{ name }} : {{ format(amount, 2, 0) }}</div>
    <div class="c-matter-dimension-buttons">
      <button 
        @click="dimension.buyInterval()" 
        class="o-matter-dimension-button" 
        :class="{ 'o-matter-dimension-button--available': canBuyInterval }"> 
        {{ format(interval, 2, 2) }}ms <span v-if="baseInterval > intervalCap">
        <br>Cost: {{ format(intervalCost, 2, 0) }}</span>
      </button>
      <button
        @click="dimension.buyPowerDM()"
        class="o-matter-dimension-button"
        :class="{ 'o-matter-dimension-button--available': canBuyPowerDM }">
        DM {{ formatX(powerDM, 2, 2) }} <br>Cost: {{ format(powerDMCost, 2, 0) }}
      </button>
      <button
        @click="dimension.buyPowerDE()"
        class="o-matter-dimension-button"
        :class="{ 'o-matter-dimension-button--available': canBuyPowerDE }">
        DE {{ formatX(powerDE, 4, 4) }} <br>Cost: {{ format(powerDECost, 2, 0) }}
      </button>
    </div>
    <div v-if="interval > 200">Tick: {{ formatInt(timer) }} ms ({{ formatPercents(timerPercent, 1) }})</div>
    <div>DE: {{ format(powerDE * 1000 / interval, 2, 4) }}/s</div>
  </div>

  `
})
