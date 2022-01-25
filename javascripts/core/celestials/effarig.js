import { GameDatabase } from "../secret-formula/game-database.js";
import { GameMechanicState } from "../game-mechanics/index.js";
import { CelestialQuotes } from "./quotes.js";
import { DC } from "../constants.js";

export const EFFARIG_STAGES = {
  INFINITY: 1,
  ETERNITY: 2,
  REALITY: 3,
  COMPLETED: 4
};

export const Effarig = {
  displayName: "Effarig",
  initializeRun() {
    const isRestarting = player.celestials.effarig.run;
    clearCelestialRuns();
    player.celestials.effarig.run = true;
    recalculateAllGlyphs();
    Tab.reality.glyphs.show(false);
    if (!isRestarting) {
      Modal.message.show(`Your Glyph levels have been limited to ${Effarig.glyphLevelCap}. Infinity Power
        reduces the nerf to multipliers and game speed, and Time Shards reduce the nerf to Tickspeed.`);
    }
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
    if (!EffarigUnlock.reality.isUnlocked) {
      return EFFARIG_STAGES.REALITY;
    }
    return EFFARIG_STAGES.COMPLETED;
  },
  get eternityCap() {
    return this.isRunning && this.currentStage === EFFARIG_STAGES.ETERNITY ? DC.E50 : undefined;
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
    return countValuesFromBitmask(genEffectBitmask) + countValuesFromBitmask(nongenEffectBitmask);
  },
  get shardsGained() {
    if (!Teresa.has(TERESA_UNLOCKS.EFFARIG)) return 0;
    return Math.floor(Math.pow(Currency.eternityPoints.exponent / 7500, this.glyphEffectAmount)) *
      AlchemyResource.effarig.effectValue;
  },
  get maxRarityBoost() {
    return 5 * Math.log10(Math.log10(Currency.relicShards.value + 10));
  },
  nerfFactor(power) {
    let c;
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        c = 1500;
        break;
      case EFFARIG_STAGES.ETERNITY:
        c = 29.29;
        break;
      case EFFARIG_STAGES.REALITY:
      default:
        c = 25;
        break;
    }
    return 3 * (1 - c / (c + Math.sqrt(power.pLog10())));
  },
  get tickspeed() {
    const base = 3 + Tickspeed.baseValue.reciprocal().log10();
    const pow = 0.7 + 0.1 * this.nerfFactor(Currency.timeShards.value);
    return Decimal.pow10(Math.pow(base, pow)).reciprocal();
  },
  multiplier(mult) {
    const base = new Decimal(mult).pLog10();
    const pow = 0.25 + 0.25 * this.nerfFactor(Currency.infinityPower.value);
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
        "I collect them for the bounty of this realm.",
        "What are you waiting for? Get started.",
      ]
    },
    UNLOCK_WEIGHTS: CelestialQuotes.singleLine(
      2, "Do you like my little shop? It is not much, but it is mine."
    ),
    UNLOCK_GLYPH_FILTER: CelestialQuotes.singleLine(
      3, "This purchase will help you out."
    ),
    UNLOCK_SET_SAVES: CelestialQuotes.singleLine(
      4, "Is that too much? I think it is too much."
    ),
    UNLOCK_RUN: {
      id: 5,
      lines: [
        "You bought out my entire stock... well, at least I am rich now.",
        "The heart of my Reality is suffering. Each Layer is harder than the last.",
        "I hope you never complete it.",
      ]
    },
    COMPLETE_INFINITY: {
      id: 6,
      lines: [
        "* You have completed Effarig's Infinity.",
        "This is the first threshold. It only gets worse from here.",
        "None but me know enough about my domain to get further.",
      ]
    },
    COMPLETE_ETERNITY: {
      id: 7,
      lines: [
        "* You have completed Effarig's Eternity.",
        "This is the limit. I do not want you to proceed past this point.",
        "You will not finish this in your lifetime.",
        "I will just wait here until you give up.",
      ]
    },
    COMPLETE_REALITY: {
      id: 8,
      lines: [
        "* You have completed Effarig's Reality.",
        "So this is the diabolical power... what frightened the others...",
        "Do you think this was worth it? Trampling on what I have done?",
        "And for what purpose? You could have joined, we could have cooperated.",
        "But no. It is over. Leave while I cling onto what is left.",
      ]
    }
  }),
  symbol: "Ϙ"
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

  get canBeApplied() {
    return super.canBeApplied && !Pelle.isDisabled("effarig");
  }

  unlock() {
    // eslint-disable-next-line no-bitwise
    player.celestials.effarig.unlockBits |= (1 << this.id);
  }

  purchase() {
    if (this.isUnlocked || !Currency.relicShards.purchase(this.cost)) return;
    this.unlock();
    switch (this) {
      case EffarigUnlock.adjuster:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_WEIGHTS);
        ui.view.tabs.reality.openGlyphWeights = true;
        Tab.reality.glyphs.show();
        break;
      case EffarigUnlock.glyphFilter:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_GLYPH_FILTER);
        player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.FILTER_SETTINGS;
        break;
      case EffarigUnlock.setSaves:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_SET_SAVES);
        player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.SAVED_SETS;
        break;
      case EffarigUnlock.run:
        Effarig.quotes.show(Effarig.quotes.UNLOCK_RUN);
        break;
      default:
        throw new Error("Unknown Effarig upgrade");
    }
  }
}

export const EffarigUnlock = (function() {
  const db = GameDatabase.celestials.effarig.unlocks;
  return {
    adjuster: new EffarigUnlockState(db.adjuster),
    glyphFilter: new EffarigUnlockState(db.glyphFilter),
    setSaves: new EffarigUnlockState(db.setSaves),
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
