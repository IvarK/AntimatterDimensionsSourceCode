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
    startRun() {
      Teresa.startRun()
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
      <div class="c-teresa-relics">You have {{ shortenRateOfChange(relicShards) }} Relic Shards.</div>
      <div class="c-teresa-relic-description">You gain {{ shortenRateOfChange(shardsGained) }} Shards next reality, based on different kinds of glyph effects you have equipped and EP.</div>
      <div class="l-teresa-shop">
        <button class="o-teresa-shop-button" @click="buyUnlock(0, 5e6)" :class="{ 'teresa-unlock-bought': Teresa.has(TERESA_UNLOCKS.ADJUSTER) }">Unlock glyph level adjustment.<br>Cost: 5,000,000 Relic Shards</button>
        <button class="o-teresa-shop-button" @click="buyUnlock(1, 2e8)" :class="{ 'teresa-unlock-bought': Teresa.has(TERESA_UNLOCKS.AUTOSACRIFICE) }">Unlock automatic glyph sacrifice.<br>Cost: 200,000,000 Relic Shards</button>
        <button class="o-teresa-shop-button" @click="buyUnlock(2, 5e8)" :class="{ 'teresa-unlock-bought': Teresa.has(TERESA_UNLOCKS.AUTOPICKER) }">Unlock automatic glyph picker.<br>Cost: 500,000,000 Relic Shards</button>
      </div>
      <button class="o-teresa-shop-button" @click="buyUnlock(3, 1e9)" :class="{ 'teresa-unlock-bought': Teresa.has(TERESA_UNLOCKS.RUN) }">Unlock Teresa's reality.<br>Cost: 1,000,000,000 Relic Shards</button>
      <div class="l-teresa-glyph-settings">
        <div v-if="Teresa.has(TERESA_UNLOCKS.AUTOSACRIFICE)">
          Highest type will be picked, lowest sacrificed.
          <draggable :list="typePriorities" @end="move()">
            <div v-for="element in typePriorities" class="o-teresa-glyph-type">{{element}}</div>
          </draggable>
        </div>
        <div v-if="Teresa.has(TERESA_UNLOCKS.ADJUSTER)">
          <div>
            <glyph-weight-sliders v-model="weights.ep" name="EP" @input="adjustWeights('ep')"/>
            <glyph-weight-sliders v-model="weights.repl" name="Replicanti" @input="adjustWeights('repl')"/>
          </div>
          <div>
            <glyph-weight-sliders v-model="weights.dt" name="DT" @input="adjustWeights('dt')"/>
            <glyph-weight-sliders v-model="weights.eternities" name="Eternities" @input="adjustWeights('eternities')"/>
          </div>
        </div>
        <div v-if="Teresa.has(TERESA_UNLOCKS.AUTOPICKER)">Glyph effect weight settings here</div>
      </div>
      <div v-if="Teresa.has(TERESA_UNLOCKS.RUN)"><button class="o-teresa-shop-button teresa-run-button" @click="startRun()">Start a new reality, all production and gamespeed is severely lowered and you can only use one glyph, infinity and time dimensions reduce the production penalty. IP multipliers are disabled. You will gain unlocks at Infinity, Eternity and Reality.</button>
        <div v-if="Teresa.has(TERESA_UNLOCKS.INFINITY_COMPLETE)">Infinity: IP multipliers have partial effectiveness in Teresa Reality, infinitied stat raises the replicanti cap and increases your max RG.</div>
        <div v-if="Teresa.has(TERESA_UNLOCKS.ETERNITY_COMPLETE)">Eternity: You can now use 5 glyphs and production penalty is reduced in Teresa Reality; eternitied stat generates infinitied stat, unlocks The Enslaved Ones.</div>
        <div v-if="Teresa.has(TERESA_UNLOCKS.REALITY_COMPLETE)">Reality: (Reward not implemented yet)</div>
      </div>
    </div>`
});