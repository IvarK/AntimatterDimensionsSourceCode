
var teresaQuotes = [
  
]

const TERESA_UNLOCKS = {
  ADJUSTER: 0,
  AUTOSACRIFICE: 1,
  AUTOPICKER: 2,
  RUN: 3,
  INFINITY_COMPLETE: 4,
  ETERNITY_COMPLETE: 5,
  REALITY_COMPLETE: 6
}

function teresaNerfFactor(power) {
  let x = (power.max(10)).log10();
  return Math.min(1 + 0.7*Math.log10(x), 10);
}

function teresaTickspeed() {
  return new Decimal(1000 * Math.pow(1 / (3 + (player.tickspeed.reciprocal().plus(new Decimal(10))).log10()), 5*teresaNerfFactor(player.timeShards))).min(1000);
}

function teresaMultiplier(multiplier) {
  return new Decimal(Math.pow((multiplier.plus(new Decimal(10))).log10(), teresaNerfFactor(player.infinityPower)));
}

var Teresa = {
  buyUnlock(id, cost) {
    if (this.shardAmount < cost) return
    if (this.has(id)) return
    player.celestials.teresa.unlocks.push(id)
    player.celestials.teresa.relicShards -= cost
    if (id === TERESA_UNLOCKS.ADJUSTER) {
      ui.view.tabs.reality.openGlyphWeights = true;
      showRealityTab("glyphstab");
    };
  },
  has(id) {
    return player.celestials.teresa.unlocks.includes(id)
  },
  startRun() {
    respecGlyphs()
    startRealityOver()
    player.celestials.teresa.run = true
    player.celestials.teresa.glyphEquipped = false
  },
  get isRunning() {
    return player.celestials.teresa.run;
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
