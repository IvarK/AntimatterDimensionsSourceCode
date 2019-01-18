
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
  let x = Decimal.max(power, 10).log10();
  if (!Teresa.has(TERESA_UNLOCKS.ETERNITY_COMPLETE)) return Math.min(1 + 0.5 * Math.log10(x), 10);
  else  return Math.min(1 + 2.5 * Math.log10(x), 20);
}

function teresaTickspeed() {
  return new Decimal(1 / (3 + (player.tickspeed.reciprocal().plus(new Decimal(10))).log10())).pow(6.5 * teresaNerfFactor(player.timeShards)).min(1).times(1000);
}

function teresaMultiplier(multiplier) {
  return new Decimal(Math.pow(Decimal.plus(multiplier, new Decimal(10)).log10(), teresaNerfFactor(player.infinityPower)));
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
  unlock(id) {
    player.celestials.teresa.unlocks.push(id);
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
    if (Effarig.has(EFFARIG_UNLOCKS.TERESA)) {
      return Math.floor(Math.pow(player.eternityPoints.e / 7500, this.glyphEffectAmount))
    }
    return 0
  },
  get shardAmount() {
    return player.celestials.teresa.relicShards
  }
}
