Vue.component('teresa-tab', {
  data: function() {
    return {
      relicShards: 0,
      shardsGained: 0,
      unlocks: [],
      weights: player.celestials.teresa.glyphWeights
    };
  },
  methods: {
    update() {
      this.relicShards = player.celestials.teresa.relicShards
      this.shardsGained = Teresa.shardsGained
      this.unlocks = player.celestials.teresa.unlocks
    },
    adjustWeights() {
      player.celestials.teresa.glyphWeights.ep = this.weights.ep
    },
    buyUnlock(id, cost) {
      Teresa.buyUnlock(id, cost)
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
        <button class="o-teresa-shop-button" @click="buyUnlock(0, 50000)">Unlock glyph level adjustment.<br>Cost: 50 000 Relic Shards</button>
      </div>
      <div>Glyph level adjuster here</div>
      <glyph-weight-sliders v-model="weights.ep" name="EP" oninput="adjustWeights()"/>
      <glyph-weight-sliders v-model="weights.repl" name="Replicanti" oninput="adjustWeights()"/>
    </div>`
});