Vue.component('teresa-tab', {
  data: function() {
    return {
      relicShards: 0,
      shardsGained: 0,
      unlocks: [],
      typePriorities: ["Power", "Time", "Infinity", "Dilation", "Replication"]
    };
  },
  methods: {
    update() {
      this.relicShards = player.celestials.teresa.relicShards
      this.shardsGained = Teresa.shardsGained
      this.unlocks = Object.values(TERESA_UNLOCKS).map(id => Teresa.has(id))
      this.typePriorities = player.celestials.teresa.typePriorityOrder
    },
    adjustWeights() {
      player.celestials.teresa.glyphWeights.ep = this.weights.ep
    },
    buyUnlock(id, cost) {
      Teresa.buyUnlock(id, cost)
    },
    move() {
      player.celestials.teresa.typePriorityOrder = this.typePriorities
    }
  },
  components: {
    "glyph-weight-sliders": {
      props: {
        value: {
          type: Number,
          default: 50
        },
        name: {
          type: String
        }, 
      },
      template:
        `<div class="o-primary-btn o-primary-btn--option o-primary-btn--update-rate l-options-grid__button"> 
          <b>{{ name }} weight: {{ value }}%</b>
          <input
            style="font-size: 1.2rem"
            :value="value"
            class="o-primary-btn--update-rate__slider"
            type="range"
            min="0"
            max="100"
            @input="emitInput(parseInt($event.target.value))"
          />
         </div>`
    }
  },
  template:
    `<div class="l-teresa-celestial-tab">
      <div class="c-teresa-relics">You have {{ shorten(relicShards) }} Relic Shards.</div>
      <div class="c-teresa-relic-description">You gain {{ shorten(shardsGained) }} Shards next reality, based on different kinds of glyph effects you have equipped and EP.</div>
      <div class="l-teresa-shop">
        <button class="o-teresa-shop-button" @click="buyUnlock(0, 50000)" :class="{ 'teresa-unlock-bought': unlocks[0] }">Unlock glyph level adjustment.<br>Cost: 50 000 Relic Shards</button>
        <button class="o-teresa-shop-button" @click="buyUnlock(1, 2e6)" :class="{ 'teresa-unlock-bought': unlocks[1] }">Unlock automatic glyph sacrifice.<br>Cost: 2 000 000 Relic Shards</button>
        <button class="o-teresa-shop-button" @click="buyUnlock(2, 5e6)" :class="{ 'teresa-unlock-bought': unlocks[2] }">Unlock automatic glyph picker.<br>Cost: 5 000 000 Relic Shards</button>
      </div>
      <button class="o-teresa-shop-button" @click="buyUnlock(3, 1e7)" :class="{ 'teresa-unlock-bought': unlocks[3] }">Unlock Teresa's reality.<br>Cost: 10 000 000 Relic Shards</button>
      <div class="l-teresa-glyph-settings">
        <div v-if="unlocks[1]">
          Highest type will be picked, lowest sacrificed.
          <draggable :list="typePriorities" @end="move()">
            <div v-for="element in typePriorities" class="o-teresa-glyph-type">{{element}}</div>
          </draggable>
        </div>
        <div v-if="unlocks[0]">Glyph level adjuster here</div>
        <div v-if="unlocks[2]">Glyph effect weight settings here</div>
      </div>
      <div v-if="unlocks[3]"><button class="o-teresa-shop-button teresa-run-button">Start a new reality, antimatter production is severely lowered and you can only use one glyph, infinity and time dimensions reduce the production penalty. You will gain unlocks at Infinity, Eternity and Reality.</button></div>
    </div>`
});