
var teresaQuotes = [
  
]

const TERESA_UNLOCKS = {
  ADJUSTER: 0,
  AUTOSACRIFICE: 1,
  AUTOPICKER: 2,
  RUN: 3
}

var Teresa = {
  buyUnlock(id, cost) {
    if (this.shardAmount < cost) return
    if (this.has(id)) return
    player.celestials.teresa.unlocks.push(id)
    player.celestials.teresa.relicShards -= cost
  },
  has(id) {
    return player.celestials.teresa.unlocks.includes(id)
  },
  get glyphEffectAmount() {
    let counted = []
    let counter = 0
    player.reality.glyphs.active.forEach((g) => {
      for (i in g.effects) {
        if (!counted.includes(g.type + i)) {
          counted.push(g.type + i)
          counter += 1
        }
      }
    })
    return counter
  },
  get shardsGained() {
    return Math.floor(Math.pow(player.eternityPoints.e / 7500, this.glyphEffectAmount))
  },
  get shardAmount() {
    return player.celestials.teresa.relicShards
  }
}
