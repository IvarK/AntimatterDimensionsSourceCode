
var effarigQuotes = [
  "Welcome to my humble abode.",
  "I am Effarig, and I govern Glyphs.",
  "I am different from Teresa; not as simplistic as you think.",
  "I use the shards of Glyphs to enforce my will.",
  "Collect them for the bounty of this realm.",
  "What are you waiting for? Get started.",
  "Do you like my little Stall? It’s not much, but it’s mine.",
  "Thank you for your purchase, customer!",
  "Is that too much? I think it’s too much.",
  "You bought out my entire stock... well at least I‘m rich now.",
  "The heart of my reality is suffering. Each Layer is harder than the last.",
  "I hope you never complete it.",
  "This is the first threshold. It only gets worse from here.",
  "This is the limit. I don’t want you to proceed past this point.",
  "So this is the diabolical power... what frightened the others...",
  "Do you think this was worth it? Trampling on what I’ve done?",
  "And for what purpose? You could’ve joined, we could’ve cooperated.",
  "But no. It’s over. Leave while I cling onto what’s left."
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
    Modal.message.show("Your glyph levels have been limited to " + Effarig.glyphLevelCap + ".  Infinity power reduces the nerf to multipliers and gamespeed, and time shards reduce the nerf to tickspeed.");
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
  },
  get maxQuoteIdx() {
    let base = 5
    if (this.has(EFFARIG_UNLOCKS.ADJUSTER)) base++;
    if (this.has(EFFARIG_UNLOCKS.AUTOPICKER)) base++;
    if (this.has(EFFARIG_UNLOCKS.AUTOSACRIFICE)) base++;
    if (this.has(EFFARIG_UNLOCKS.RUN)) base += 3;
    if (this.has(EFFARIG_UNLOCKS.INFINITY_COMPLETE)) base++;
    if (this.has(EFFARIG_UNLOCKS.ETERNITY_COMPLETE)) base++;
    if (this.has(EFFARIG_UNLOCKS.REALITY_COMPLETE)) base += 4;
    return base
  },
  get quote() {
    return effarigQuotes[player.celestials.effarig.quoteIdx]
  },
  nextQuote() {
    if (player.celestials.effarig.quoteIdx < this.maxQuoteIdx) player.celestials.effarig.quoteIdx++
  }
};
