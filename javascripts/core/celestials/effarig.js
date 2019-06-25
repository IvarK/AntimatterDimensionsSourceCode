"use strict";

const effarigQuotes = [
  "Welcome to my humble abode.",
  "I am Effarig, and I govern Glyphs.",
  "I am different from Teresa; not as simplistic as you think.",
  "I use the shards of Glyphs to enforce my will.",
  "Collect them for the bounty of this realm.",
  "What are you waiting for? Get started.",
  "Do you like my little Stall? It’s not much, but it’s mine.",
  "Thank you for your purchase, customer!",
  "Is that too much? I think it’s too much.",
  "You bought out my entire stock... well, at least I‘m rich now.",
  "The heart of my reality is suffering. Each Layer is harder than the last.",
  "I hope you never complete it.",
  "This is the first threshold. It only gets worse from here.",
  "This is the limit. I don’t want you to proceed past this point.",
  "So this is the diabolical power... what frightened the others...",
  "Do you think this was worth it? Trampling on what I’ve done?",
  "And for what purpose? You could’ve joined, we could’ve cooperated.",
  "But no. It’s over. Leave while I cling onto what’s left."
];

const EFFARIG_STAGES = {
  INFINITY: 1,
  ETERNITY: 2,
  REALITY: 3
}

class EffarigUnlockState extends GameMechanicState {
  constructor(config) {
    super(config);
  }

  get isUnlocked() {
    return player.celestials.effarig.unlocks.includes(this.id);
  }

  unlock() {
    if (!this.isUnlocked) {
      player.celestials.effarig.unlocks.push(this.id);
    }
  }

  purchase() {
    if (this.isUnlocked || Effarig.shardAmount < this.cost) return;
    this.unlock();
    player.celestials.effarig.relicShards -= this.cost;
    if (this === EffarigUnlock.adjuster) {
      ui.view.tabs.reality.openGlyphWeights = true;
      showRealityTab("glyphstab");
    }
  }
}

const EffarigUnlock = (function() {
  const db = GameDatabase.celestials.effarig.unlocks;
  return {
    adjuster: new EffarigUnlockState(db.adjuster),
    autosacrifice: new EffarigUnlockState(db.autosacrifice),
    autopicker: new EffarigUnlockState(db.autopicker),
    run: new EffarigUnlockState(db.run),
    infinity: new EffarigUnlockState(db.infinity),
    eternity: new EffarigUnlockState(db.eternity),
    reality: new EffarigUnlockState(db.reality),
  };
}());

const Effarig = {
  startRun() {
    if (!startRealityOver()) return;
    player.celestials.effarig.run = true
    recalculateAllGlyphs()
    showRealityTab("glyphstab");
    Modal.message.show(`Your glyph levels have been limited to ${Effarig.glyphLevelCap}. ` +
      "Infinity power reduces the nerf to multipliers and game speed, and time shards reduce the nerf to tickspeed.");
  },
  get isRunning() {
    return player.celestials.effarig.run;
  },

  get currentStage() {
    if (!EffarigUnlock.infinity.isUnlocked) {
      return EFFARIG_STAGES.INFINITY;
    }
    if (!EffarigUnlock.eternity.isUnlocked) {
      return EFFARIG_STAGES.ETERNITY;
    }
    return EFFARIG_STAGES.REALITY;
  },

  get eternityCap() {
    return Effarig.isRunning && this.currentStage === EFFARIG_STAGES.ETERNITY ? new Decimal(1e50) : undefined;
  },

  get glyphLevelCap() {
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        return 100;
      case EFFARIG_STAGES.ETERNITY:
        return 1500;
      case EFFARIG_STAGES.REALITY:
      default:
        return 2000;
    }
  },

  get glyphEffectAmount() {
    const counted = new Set();
    for (const g of Glyphs.activeList) {
      for (const e in g.effects) counted.add(g.type + e);
    }
    return counted.size;
  },

  get shardsGained() {
    if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) {
      return Math.floor(Math.pow(player.eternityPoints.e / 7500, this.glyphEffectAmount));
    }
    return 0;
  },
  get shardAmount() {
    return player.celestials.effarig.relicShards;
  },
  nerfFactor(power) {
    let c;
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        c = 1500;
        break;
      case EFFARIG_STAGES.ETERNITY: 
        c = 29;
        break;
      case EFFARIG_STAGES.REALITY:
        c = 25;
        break;
    }
    return 3 * (1 - c / (c + Math.sqrt(power.pLog10())));
  },
  get tickspeed() {
    const base = 3 + player.tickspeed.reciprocal().log10();
    const pow = 0.7 + 0.1 * this.nerfFactor(player.timeShards);
    return Decimal.pow10(Math.pow(base, pow)).reciprocal();
  },
  multiplier(mult) {
    const base = new Decimal(mult).pLog10();
    const pow = 0.25 + 0.25 * this.nerfFactor(player.infinityPower);
    return Decimal.pow10(Math.pow(base, pow));
  },
  get bonusRG() {
    // Will return 0 if Effarig Infinity is uncompleted
    return Math.floor(replicantiCap().pLog10() / LOG10_MAX_VALUE - 1);
  },
  get maxQuoteIdx() {
    const base = 5;
    const unlockQuotes = [
      [EffarigUnlock.adjuster, 1],
      [EffarigUnlock.autopicker, 1],
      [EffarigUnlock.autosacrifice, 1],
      [EffarigUnlock.run, 3],
      [EffarigUnlock.infinity, 1],
      [EffarigUnlock.eternity, 1],
      [EffarigUnlock.reality, 4]
    ]
      .filter(pair => pair[0].isUnlocked)
      .map(pair => pair[1])
      .sum();
    return base + unlockQuotes;
  },
  get quote() {
    return effarigQuotes[player.celestials.effarig.quoteIdx]
  },
  nextQuote() {
    if (player.celestials.effarig.quoteIdx < this.maxQuoteIdx) player.celestials.effarig.quoteIdx++
  }
};
