import { GameDatabase } from "../secret-formula/game-database.js";
import { BitUpgradeState, RebuyableMechanicState } from "../game-mechanics/index.js";
import { CelestialQuotes } from "./quotes.js";

export const Teresa = {
  timePoured: 0,
  lastUnlock: "shop",
  pouredAmountCap: 1e24,
  displayName: "Teresa",
  get isUnlocked() {
    return Achievement(147).isUnlocked;
  },
  pourRM(diff) {
    if (this.pouredAmount >= Teresa.pouredAmountCap) return;
    this.timePoured += diff;
    const rm = Currency.realityMachines.value;
    const rmPoured = Math.min((this.pouredAmount + 1e6) * 0.01 * Math.pow(this.timePoured, 2), rm.toNumber());
    this.pouredAmount += Math.min(rmPoured, Teresa.pouredAmountCap - this.pouredAmount);
    Currency.realityMachines.subtract(rmPoured);
    this.checkForUnlocks();
  },
  checkForUnlocks() {
    for (const info of Object.values(TeresaUnlocks)) {
      if (!info.isUnlocked && this.pouredAmount >= info.price) {
        // eslint-disable-next-line no-bitwise
        info.unlock();
      }
    }
  },
  has(info) {
    if (!info.hasOwnProperty("id")) throw "Pass in the whole TERESA UNLOCK object";
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.teresa.unlockBits & (1 << info.id));
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.teresa.run = true;
  },
  rewardMultiplier(antimatter) {
    return Decimal.max(Decimal.pow(antimatter.plus(1).log10() / 1.5e8, 12), 1).toNumber();
  },
  get pouredAmount() {
    return player.celestials.teresa.pouredAmount;
  },
  set pouredAmount(amount) {
    player.celestials.teresa.pouredAmount = amount;
  },
  get fill() {
    return Math.min(Math.log10(this.pouredAmount) / 24, 1);
  },
  get possibleFill() {
    return Math.min(Currency.realityMachines.value.plus(this.pouredAmount).log10() / 24, 1);
  },
  get rmMultiplier() {
    return Math.max(250 * Math.pow(this.pouredAmount / 1e24, 0.1), 1);
  },
  get runRewardMultiplier() {
    return this.rewardMultiplier(player.celestials.teresa.bestRunAM);
  },
  get isRunning() {
    return player.celestials.teresa.run;
  },
  get runCompleted() {
    return player.celestials.teresa.bestRunAM.gt(0);
  },
  quotes: new CelestialQuotes("teresa", {
    INITIAL: {
      id: 1,
      lines: [
        "We have been observing you.",
        "You have shown promise with your bending of Reality.",
        "We are the Celestials, and we want you to join us.",
        "My name is Teresa, the Celestial Of Reality.",
        "Prove your worth.",
      ]
    },
    UNLOCK_REALITY: CelestialQuotes.singleLine(
      2, "I will let you inside my Reality, mortal. Do not get crushed by it."
    ),
    COMPLETE_REALITY: CelestialQuotes.singleLine(
      3, "Why are you still here... you were supposed to fail."
    ),
    EFFARIG: {
      id: 4,
      lines: [
        "You are still no match for us.",
        "I hope the others succeed where I have failed."
      ]
    }
  }),
  symbol: "Ϟ"
};

class PerkShopUpgradeState extends RebuyableMechanicState {
  constructor(config) {
    super(config);
    this.costCap = config.costCap;
  }

  get currency() {
    return Currency.perkPoints;
  }

  get boughtAmount() {
    return player.celestials.teresa.perkShop[this.id];
  }

  set boughtAmount(value) {
    player.celestials.teresa.perkShop[this.id] = value;
  }

  get isCapped() {
    return this.cost === this.costCap(this.bought);
  }

  get isAvailableForPurchase() {
    const otherReq = this.config.otherReq ? this.config.otherReq() : true;
    return this.cost <= this.currency.value && otherReq;
  }

  onPurchased() {
    if (this.id === 1) {
      Autobuyer.reality.bumpAmount(2);
    }
    // Give a single music glyph
    if (this.id === 4) {
      if (Glyphs.freeInventorySpace === 0) {
        // Refund the perk point if they didn't actually get a glyph
        Currency.perkPoints.add(1);
        GameUI.notify.error("You have no empty inventory space!");
      } else {
        Glyphs.addToInventory(GlyphGenerator.musicGlyph());
        GameUI.notify.success("Created a Music Glyph");
      }
    }
    // Fill the inventory with music glyphs
    if (this.id === 5) {
      const toCreate = Glyphs.freeInventorySpace;
      for (let count = 0; count < toCreate; count++) Glyphs.addToInventory(GlyphGenerator.musicGlyph());
      GameUI.notify.success(`Created ${quantifyInt("Music Glyph", toCreate)}`);
    }
  }
}

class TeresaUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.teresa.unlockBits; }
  set bits(value) { player.celestials.teresa.unlockBits = value; }

  get price() {
    return this.config.price;
  }

  get pelleDisabled() {
    return Pelle.isDoomed && Pelle.uselessTeresaUnlocks.includes(this.config.name);
  }

  get canBeApplied() {
    return this.isUnlocked && !this.pelleDisabled;
  }

  get description() {
    if (this.pelleDisabled) {
      return "This has no effect while in Doomed";
    }
    return typeof this.config.description === "function" ? this.config.description()
      : this.config.description;
  }

  onUnlock() {
    EventHub.dispatch(GAME_EVENT.CELESTIAL_UPGRADE_UNLOCKED, Teresa, this);
  }
}

export const TeresaUnlocks = (function() {
  const db = GameDatabase.celestials.teresa.unlocks;
  const result = {};
  for (const idx in db) {
    db[idx].name = idx;
    result[idx] = new TeresaUnlockState(db[idx]);
  }
  return result;
}());

export const PerkShopUpgrade = (function() {
  const db = GameDatabase.celestials.perkShop;
  return {
    glyphLevel: new PerkShopUpgradeState(db.glyphLevel),
    rmMult: new PerkShopUpgradeState(db.rmMult),
    bulkDilation: new PerkShopUpgradeState(db.bulkDilation),
    autoSpeed: new PerkShopUpgradeState(db.autoSpeed),
    musicGlyph: new PerkShopUpgradeState(db.musicGlyph),
    fillMusicGlyph: new PerkShopUpgradeState(db.fillMusicGlyph),
  };
}());

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.teresa.isOpen) Teresa.quotes.show(Teresa.quotes.INITIAL);
});

EventHub.logic.on(GAME_EVENT.CELESTIAL_UPGRADE_UNLOCKED, ([celestial, upgradeInfo]) => {
  if (celestial === Teresa) {
    if (upgradeInfo === TeresaUnlocks.run) Teresa.quotes.show(Teresa.quotes.UNLOCK_REALITY);
    if (upgradeInfo === TeresaUnlocks.effarig) Teresa.quotes.show(Teresa.quotes.EFFARIG);
  }
});

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => Teresa.checkForUnlocks());
