
var effarigQuotes = [
  
]

const EFFARIG_UNLOCKS = {
  ADJUSTER: 0,
  AUTOSACRIFICE: 1,
  AUTOPICKER: 2,
  RUN: 3,
  INFINITY_COMPLETE: 4,
  ETERNITY_COMPLETE: 5,
  REALITY_COMPLETE: 6
}

var Effarig = {
  buyUnlock(id, cost) {
    if (this.shardAmount < cost) return
    if (this.has(id)) return
    player.celestials.effarig.unlocks.push(id)
    player.celestials.effarig.relicShards -= cost
    if (id === EFFARIG_UNLOCKS.ADJUSTER) {
      ui.view.tabs.reality.openGlyphWeights = true;
      showRealityTab("glyphstab");
    };
  },
  has(id) {
    return player.celestials.effarig.unlocks.includes(id)
  },
  unlock(id) {
    player.celestials.effarig.unlocks.push(id);
  },
  startRun() {
    respecGlyphs()
    startRealityOver()
    player.celestials.effarig.run = true
    player.celestials.effarig.glyphEquipped = false
  },
  get isRunning() {
    return player.celestials.effarig.run;
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
    if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) {
      return Math.floor(Math.pow(player.eternityPoints.e / 7500, this.glyphEffectAmount))
    }
    return 0
  },
  get shardAmount() {
    return player.celestials.effarig.relicShards
  },
  nerfFactor(power) {
    let x = Decimal.max(power, 10).log10();
    if (!this.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE)) {
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
  get bonusRG() { // Will return 0 if Effarig Infinity is uncompleted
    return Math.floor(replicantiCap().log10() / Math.log10(Number.MAX_VALUE) - 1);
  }
};
