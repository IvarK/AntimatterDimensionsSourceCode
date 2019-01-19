
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
  },
  nerfFactor(power) {
    let x = Decimal.max(power, 10).log10();
    if (!this.has(TERESA_UNLOCKS.ETERNITY_COMPLETE)) {
      return Math.min(1 + 0.5 * Math.log10(x), 10);
    }
    return Math.min(1 + 2.5 * Math.log10(x), 20);
  },
  get tickspeed() {
    const base = 3 + player.tickspeed.reciprocal().clampMin(10).log10();
    const pow = -6.5 * this.nerfFactor(player.timeShards);
    return new Decimal(base).pow(pow).clampMax(1).times(1000);
  },
  multiplier(mult) {
    const base = new Decimal(mult).clampMin(10).log10();
    const pow = this.nerfFactor(player.infinityPower);
    return new Decimal(Math.pow(base, pow));
  },
  get bonusRG() { // Will return 0 if Teresa Infinity is uncompleted
    return Math.floor(replicantiCap().log10() / Math.log10(Number.MAX_VALUE) - 1);
  }
};
