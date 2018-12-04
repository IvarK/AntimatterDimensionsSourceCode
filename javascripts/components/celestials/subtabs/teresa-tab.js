Vue.component('teresa-tab', {
  data: function() {
    return {
      relicShards: 0,
      shardsGained: 0,
      unlocks: []
    };
  },
  methods: {
    update() {
      this.relicShards = player.celestials.teresa.relicShards
      this.shardsGained = Teresa.shardsGained
      this.unlocks = player.celestials.teresa.unlocks
    },
    buyUnlock(id, cost) {
      Teresa.buyUnlock(id, cost)
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
    </div>`
});