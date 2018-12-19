Vue.component('teresa-tab', {
  data: function() {
    return {
      relicShards: 0,
      shardsGained: 0,
      unlocks: [],
      weights: player.celestials.teresa.glyphWeights,
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
    adjustWeights(name) {
      let tempTotalWeight = 0
      for (i in this.weights) {
        tempTotalWeight += this.weights[i]
      }
      let tempExtra = tempTotalWeight - 100
      if (this.weights[name] === 100) {
        for (i in this.weights) {
          this.weights[i] = 0;
        }
        this.weights[name] = 100;
      } else {
        while (tempExtra > 0) {
          for (i in this.weights) {
            if (tempExtra > 0 && this.weights[i] > 0 && i != name) {
              this.weights[i]--;
              tempExtra--;
            }
          }
        }
      }
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
        }
      },
      template:
        `<div class="o-teresa-slider"> 
          <b>{{ name }} weight: {{ value/100 }}</b>
          <input
            style="margin-left:0rem;"
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
        <button class="o-teresa-shop-button" @click="buyUnlock(0, 50000)" :class="{ 'teresa-unlock-bought': unlocks[0] }">Unlock glyph level adjustment.<br>Cost: 50,000 Relic Shards</button>
        <button class="o-teresa-shop-button" @click="buyUnlock(1, 2e6)" :class="{ 'teresa-unlock-bought': unlocks[1] }">Unlock automatic glyph sacrifice.<br>Cost: 2,000,000 Relic Shards</button>
        <button class="o-teresa-shop-button" @click="buyUnlock(2, 5e6)" :class="{ 'teresa-unlock-bought': unlocks[2] }">Unlock automatic glyph picker.<br>Cost: 5,000,000 Relic Shards</button>
      </div>
      <button class="o-teresa-shop-button" @click="buyUnlock(3, 1e7)" :class="{ 'teresa-unlock-bought': unlocks[3] }">Unlock Teresa's reality.<br>Cost: 10,000,000 Relic Shards</button>
      <div class="l-teresa-glyph-settings">
        <div v-if="unlocks[1]">
          Highest type will be picked, lowest sacrificed.
          <draggable :list="typePriorities" @end="move()">
            <div v-for="element in typePriorities" class="o-teresa-glyph-type">{{element}}</div>
          </draggable>
        </div>
        <div v-if="unlocks[0]">
          <div>
            <glyph-weight-sliders v-model="weights.ep" name="EP" @input="adjustWeights('ep')"/>
            <glyph-weight-sliders v-model="weights.repl" name="Replicanti" @input="adjustWeights('repl')"/>
          </div>
          <div>
            <glyph-weight-sliders v-model="weights.dt" name="DT" @input="adjustWeights('dt')"/>
            <glyph-weight-sliders v-model="weights.eternities" name="Eternities" @input="adjustWeights('eternities')"/>
          </div>
        </div>
        <div v-if="unlocks[2]">Glyph effect weight settings here</div>
      </div>
      <div v-if="unlocks[3]"><button class="o-teresa-shop-button teresa-run-button">Start a new reality, antimatter production is severely lowered and you can only use one glyph, infinity and time dimensions reduce the production penalty. You will gain unlocks at Infinity, Eternity and Reality.</button></div>
    </div>`
});