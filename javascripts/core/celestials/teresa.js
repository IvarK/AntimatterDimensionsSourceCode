
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

const EFFARIG_COSTS = {
  ADJUSTER: 1e7,
  AUTOSACRIFICE: 2e8,
  AUTOPICKER: 3e9,
  RUN: 4e10,
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
    recalculateAllGlyphs()
    showRealityTab("glyphstab");
    Modal.message.show("Your glyph levels have been limited to 100.  Infinity power reduces the nerf to multipliers and gamespeed, and time shards reduce the nerf to tickspeed.");
  },
  get isRunning() {
    return player.celestials.effarig.run;
  },
  get eternityCap() {
    return Effarig.isRunning && !Effarig.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE) ? 1e50 : undefined;
  },
  get glyphLevelCap() {
    if (Effarig.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE)) {
      return 10000
    }
    else if (Effarig.has(EFFARIG_UNLOCKS.INFINITY_COMPLETE)) {
      return 3000
    }
    else {
      return 100
    }

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
    let x = Decimal.max(power, 10);
    if (!this.has(EFFARIG_UNLOCKS.INFINITY_COMPLETE)) {
      return Math.min(x.log10() / 1000, 1);
    }
    else if (!this.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE)) {
      return Math.min(x.log10() / 120, 1);
    }
    return Math.min(x.log10() / 120, 3);
  },
  get tickspeed() {
    const base = 3 + player.tickspeed.reciprocal().log10();
    const pow = 0.625 + 0.125 * this.nerfFactor(player.timeShards);
    return new Decimal.pow(10, Math.pow(base, pow)).reciprocal();
  },
  multiplier(mult) {
    const base = new Decimal(mult).clampMin(10).log10();
    const pow = 0.25 + 0.25 * this.nerfFactor(player.infinityPower);
    return new Decimal.pow(10, Math.pow(base, pow));
  },
  get bonusRG() { // Will return 0 if Effarig Infinity is uncompleted
    return Math.floor(replicantiCap().log10() / Math.log10(Number.MAX_VALUE) - 1);
  }
};
