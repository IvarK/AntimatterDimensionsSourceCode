Vue.component('laitela-tab', {
  data: function() {
    return {
      matter: 0,
      nextUnlock: "",
      matterEffectPercentage: ""
    };
  },
  methods: {
    update() {
      this.matter = player.celestials.laitela.matter
      this.nextUnlock = Laitela.nextMatterDimensionThreshold
      this.matterEffectPercentage = Laitela.matterEffectPercentage
    },
    startRun() {
      Laitela.startRun()
    }
  },
  computed: {
    dimensions() {
      return Array.range(1, 4).map( tier => MatterDimension(tier) )
    },
    runUnlockThresholds() {
      return laitelaRunUnlockThresholds
    }
  },
  template:
    `<div class="l-laitela-celestial-tab">
      <button class="o-laitela-run-button" @click="startRun">Start a new reality, only the first dimension of all types produce anything. You will unlock more matter dimensions at specific thresholds</button>
      <div class="o-laitela-matter-amount">You have {{ shorten(matter, 2, 0) }} Matter</div>
      <div>Matter causes your dimension cost multipliers to raise {{ matterEffectPercentage }} slower</div>
      <div v-for="(dimension, i) in dimensions" :key="i">
        <matter-dimension-row
        v-if="dimension.amount !== 0"
        :key="i"
        :dimension="dimension"
        />
      </div>
      <div>{{ nextUnlock }}</div>
    </div>`
});

Vue.component('matter-dimension-row', {
  props: {
    dimension: Object
  },
  data: function() {
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
    }
  },
  methods: {
    update() {
      this.chance = this.dimension.chance
      this.interval = this.dimension.interval
      this.power = this.dimension.power
      this.chanceCost = this.dimension.chanceCost
      this.intervalCost = this.dimension.intervalCost
      this.powerCost = this.dimension.powerCost
      this.amount = this.dimension.amount
      this.canBuyChance = player.celestials.laitela.matter >= this.chanceCost
      this.canBuyInterval = player.celestials.laitela.matter >= this.intervalCost
      this.canBuyPower = player.celestials.laitela.matter >= this.powerCost
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
})