Vue.component('effarig-tab', {
  data: function() {
    return {
      relicShards: 0,
      shardsGained: 0,
      unlocks: [],
      weights: player.celestials.effarig.glyphWeights,
      typePriorities: ["Power", "Time", "Infinity", "Dilation", "Replication"]
    };
  },
  methods: {
    update() {
      this.relicShards = player.celestials.effarig.relicShards
      this.shardsGained = Effarig.shardsGained
      this.unlocks = Object.values(EFFARIG_UNLOCKS).map(id => Effarig.has(id))
      this.typePriorities = player.celestials.effarig.typePriorityOrder
    },
    startRun() {
      Effarig.startRun()
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
      Effarig.buyUnlock(id, cost)
    },
    move() {
      player.celestials.effarig.typePriorityOrder = this.typePriorities
    }
  },
  computed: {
    effarigUnlocks() {
      return EFFARIG_UNLOCKS
    },
    effarigCosts() {
      return EFFARIG_COSTS
    },
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
        `<div class="o-effarig-slider"> 
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
    `<div class="l-effarig-celestial-tab">
      <div class="c-effarig-relics">You have {{ shortenRateOfChange(relicShards) }} Relic Shards.</div>
      <div class="c-effarig-relic-description">You gain {{ shortenRateOfChange(shardsGained) }} Shards next reality, based on different kinds of glyph effects you have equipped and EP.</div>
      <div class="l-effarig-shop">
        <button class="o-effarig-shop-button" @click="buyUnlock(effarigUnlocks.ADJUSTER, effarigCosts.ADJUSTER)" :class="{ 'effarig-unlock-bought': unlocks[effarigUnlocks.ADJUSTER] }">Unlock glyph level adjustment.<br>Cost: {{ shorten(effarigCosts.ADJUSTER) }} Relic Shards</button>
        <button class="o-effarig-shop-button" @click="buyUnlock(effarigUnlocks.AUTOSACRIFICE, effarigCosts.AUTOSACRIFICE)" :class="{ 'effarig-unlock-bought': unlocks[effarigUnlocks.AUTOSACRIFICE] }">Unlock automatic glyph sacrifice.<br>Cost: {{ shorten(effarigCosts.AUTOSACRIFICE) }} Relic Shards</button>
        <button class="o-effarig-shop-button" @click="buyUnlock(effarigUnlocks.AUTOPICKER, effarigCosts.AUTOPICKER)" :class="{ 'effarig-unlock-bought': unlocks[effarigUnlocks.AUTOPICKER] }">Unlock automatic glyph picker.<br>Cost: {{ shorten(effarigCosts.AUTOPICKER) }} Relic Shards</button>
      </div>
      <button class="o-effarig-shop-button" @click="buyUnlock(effarigUnlocks.RUN, effarigCosts.RUN)" :class="{ 'effarig-unlock-bought': unlocks[effarigUnlocks.RUN] }">Unlock Effarig's reality.<br>Cost: {{ shorten(effarigCosts.RUN) }} Relic Shards</button>
      <div class="l-effarig-glyph-settings">
        <div v-if="unlocks[effarigUnlocks.AUTOSACRIFICE]">
          Highest type will be picked, lowest sacrificed.
          <draggable :list="typePriorities" @end="move()">
            <div v-for="element in typePriorities" class="o-effarig-glyph-type">{{element}}</div>
          </draggable>
        </div>
        <div v-if="unlocks[effarigUnlocks.ADJUSTER]">
          <div>
            <glyph-weight-sliders v-model="weights.ep" name="EP" @input="adjustWeights('ep')"/>
            <glyph-weight-sliders v-model="weights.repl" name="Replicanti" @input="adjustWeights('repl')"/>
          </div>
          <div>
            <glyph-weight-sliders v-model="weights.dt" name="DT" @input="adjustWeights('dt')"/>
            <glyph-weight-sliders v-model="weights.eternities" name="Eternities" @input="adjustWeights('eternities')"/>
          </div>
        </div>
        <div v-if="unlocks[effarigUnlocks.AUTOPICKER]">Glyph effect weight settings here</div>
      </div>
      <div v-if="unlocks[effarigUnlocks.RUN]"><button class="o-effarig-shop-button effarig-run-button" @click="startRun()">Start a new reality, all production and gamespeed is severely lowered, infinity and time dimensions reduce the production penalty. Glyph levels are temporarily capped. You will gain unlocks at Infinity, Eternity and Reality.</button>
        <div v-if="unlocks[effarigUnlocks.INFINITY_COMPLETE]">Infinity: IP mults are capped at 1e50 in Effarig Reality; infinitied stat raises the replicanti cap and increases your max RG.</div>
        <div v-if="unlocks[effarigUnlocks.ETERNITY_COMPLETE]">Eternity: IP mults and gamespeed are no longer limited in Effarig Reality; eternitied stat generates infinitied stat, unlocks The Enslaved Ones.</div>
        <div v-if="unlocks[effarigUnlocks.REALITY_COMPLETE]">Reality: (Reward not implemented yet)</div>
      </div>
    </div>`
});