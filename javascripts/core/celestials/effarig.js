"use strict";

const EFFARIG_STAGES = {
  INFINITY: 1,
  ETERNITY: 2,
  REALITY: 3
};

const Effarig = {
  displayName: "Effarig",
  startRun() {
    player.options.retryCelestial = false;
    if (!startRealityOver()) return;
    player.celestials.effarig.run = true;
    recalculateAllGlyphs();
    Tab.reality.glyphs.show();
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
    return this.isRunning && this.currentStage === EFFARIG_STAGES.ETERNITY ? new Decimal(1e50) : undefined;
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
    const genEffectBitmask = Glyphs.activeList
      .filter(g => generatedTypes.includes(g.type))
      // eslint-disable-next-line no-bitwise
      .reduce((prev, curr) => prev | curr.effects, 0);
    const nongenEffectBitmask = Glyphs.activeList
      .filter(g => !generatedTypes.includes(g.type))
      // eslint-disable-next-line no-bitwise
      .reduce((prev, curr) => prev | curr.effects, 0);
    return countEffectsFromBitmask(genEffectBitmask) + countEffectsFromBitmask(nongenEffectBitmask);
  },
  get shardsGained() {
    if (Teresa.has(TERESA_UNLOCKS.EFFARIG)) {
      return Math.floor(Math.pow(player.eternityPoints.e / 7500, this.glyphEffectAmount)) *
        AlchemyResource.effarig.effectValue;
    }
    return 0;
  },
  get shardAmount() {
    return player.celestials.effarig.relicShards;
  },
  get maxRarityBoost() {
    return 5 * Math.log10(Math.log10(this.shardAmount + 10));
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
    const base = 3 + Tickspeed.baseValue.reciprocal().log10();
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
  quotes: new CelestialQuotes("effarig", {
    INITIAL: {
      id: 1,
      lines: [
        "Welcome to my humble abode.",
        "I am Effarig, and I govern Glyphs.",
        "I am different from Teresa; not as simplistic as you think.",
        "I use the shards of Glyphs to enforce my will.",
        "Collect them for the bounty of this realm.",
        "What are you waiting for? Get started.",
      ]
    },
    UNLOCK_WEIGHTS: CelestialQuotes.singleLine(
      2, "Do you like my little Stall? It’s not much, but it’s mine."
    ),
    UNLOCK_BASIC_FILTER: CelestialQuotes.singleLine(
      3, "Thank you for your purchase, customer!"
    ),
    UNLOCK_ADVANCED_FILTER: CelestialQuotes.singleLine(
      4, "Is that too much? I think it’s too much."
    ),
    UNLOCK_RUN: {
      id: 5,
      lines: [
        "You bought out my entire stock... well, at least I‘m rich now.",
        "The heart of my reality is suffering. Each Layer is harder than the last.",
        "I hope you never complete it.",
      ]
    },
    COMPLETE_INFINITY: {
      id: 6,
      lines: [
        "* You have completed Effarig's Infinity.",
        "This is the first threshold. It only gets worse from here."
      ]
    },
    COMPLETE_ETERNITY: {
      id: 7,
      lines: [
        "* You have completed Effarig's Eternity.",
        "This is the limit. I don’t want you to proceed past this point.",
        "I'll just wait here until you give up."
      ]
    },
    COMPLETE_REALITY: {
      id: 8,
      lines: [
        "* You have completed Effarig's Reality.",
        "So this is the diabolical power... what frightened the others...",
        "Do you think this was worth it? Trampling on what I’ve done?",
        "And for what purpose? You could’ve joined, we could’ve cooperated.",
        "But no. It’s over. Leave while I cling onto what’s left.",
      ]
    }
  }),
};

class EffarigUnlockState extends GameMechanicState {
  constructor(config) {
    super(config);
    if (this.id < 0 || this.id > 31) throw new Error(`Id ${this.id} out of bit range`);
  }

  get cost() {
    return this.config.cost;
  }

  get isUnlocked() {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.effarig.unlockBits & (1 << this.id));
  }

  unlock() {
    // eslint-disable-next-line no-bitwise
    player.celestials.effarig.unlockBits |= (1 << this.id);
  }

  purchase() {
    if (this.isUnlocked || Effarig.shardAmount < this.cost) return;
    this.unlock();
    player.celestials.effarig.relicShards -= this.cost;
    if (this === EffarigUnlock.adjuster) {
      ui.view.tabs.reality.openGlyphWeights = true;
      Tab.reality.glyphs.show();
    }
    switch (this.id) {
      case EffarigUnlock.adjuster.id:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_WEIGHTS);
        break;
      case EffarigUnlock.basicFilter.id:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_BASIC_FILTER);
        break;
      case EffarigUnlock.advancedFilter.id:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_ADVANCED_FILTER);
        break;
      case EffarigUnlock.run.id:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_RUN);
        break;
      default:
        throw new Error("Unknown Effarig upgrade");
    }
  }
}

const EffarigUnlock = (function() {
  const db = GameDatabase.celestials.effarig.unlocks;
  return {
    adjuster: new EffarigUnlockState(db.adjuster),
    basicFilter: new EffarigUnlockState(db.basicFilter),
    advancedFilter: new EffarigUnlockState(db.advancedFilter),
    run: new EffarigUnlockState(db.run),
    infinity: new EffarigUnlockState(db.infinity),
    eternity: new EffarigUnlockState(db.eternity),
    reality: new EffarigUnlockState(db.reality),
  };
}());

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.effarig.isOpen) Effarig.quotes.show(Effarig.quotes.INITIAL);
});

EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.show(Effarig.quotes.COMPLETE_INFINITY);
});

EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.show(Effarig.quotes.COMPLETE_ETERNITY);
});
