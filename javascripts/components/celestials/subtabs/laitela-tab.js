Vue.component('laitela-tab', {
  data: function() {
    return {
      matter: 0
    };
  },
  methods: {
    update() {
      this.matter = player.celestials.laitela.matter
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
      <button @click="startRun">Start run</button>
      <div>You have {{ shorten(matter, 2, 0) }} Matter</div>
      <matter-dimension-row
        v-for="(dimension, i) in dimensions"
        :key="i"
        :dimension="dimension"
      />
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
      amount: 0
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
    }
  },
  template:
  `<div>
    <div> {{ shorten(amount) }}</div>
    <button @click="dimension.buyChance()"> {{ chance }}% <br>Cost: {{ shorten(chanceCost) }}</button>
    <button @click="dimension.buyInterval()"> {{ interval }}ms <br>Cost: {{ shorten(intervalCost) }}</button>
    <button @click="dimension.buyPower()"> {{ shorten(power, 1, 1) }}x <br>Cost: {{ shorten(powerCost) }}</button>
  </div>
  
  `
})