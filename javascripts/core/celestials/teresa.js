"use strict";

const teresaQuotes = [
  "We've been observing you",
  "You have shown promise with your bending of the reality",
  "We are the Celestials, and we want you to join us.",
  "My name is Teresa, the Celestial Of Reality",
  "Prove your worth.",
  "I'll let you inside my Reality, mortal. Don't get crushed by it.",
  "You've proven your worth mortal, if you wish to join us you need to start over...",
  "Why are you still here... You were supposed to vanish... You are still no match for us.",
  "I hope the others succeed where I have failed."
];

const TERESA_UNLOCKS = {
  RUN: {
    id: 0,
    price: 1e14,
    description: "unlock Teresa's reality.",
  },
  EPGEN: {
    id: 1,
    price: 1e18,
    description: "unlock Teresa's EP generation.",
  },
  EFFARIG: {
    id: 2,
    price: 1e21,
    description: "unlock Effarig, Celestial of Ancient Relics.",
  },
  SHOP: {
    id: 3,
    price: 1e24,
    description: "unlock Perk Point Shop.",
  },
};

const Teresa = {
  timePoured: 0,
  unlockInfo: TERESA_UNLOCKS,
  lastUnlock: "SHOP",
  rmStoreMax: 1e24,
  pourRM(diff) {
    if (this.rmStore >= Teresa.rmStoreMax) return;
    this.timePoured += diff;
    const rm = player.reality.realityMachines;
    const rmPoured = Math.min((this.rmStore + 1e6) * 0.01 * Math.pow(this.timePoured, 2), rm.toNumber());
    this.rmStore += Math.min(rmPoured, Teresa.rmStoreMax - this.rmStore);
    player.reality.realityMachines = rm.minus(rmPoured);
    this.checkForUnlocks();
  },
  checkForUnlocks() {
    for (const info of Object.values(Teresa.unlockInfo)) {
      if (!this.has(info) && this.rmStore >= info.price) {
        player.celestials.teresa.unlocks.push(info.id);
      }
    }
  },
  has(info) {
    if (!info.hasOwnProperty("id")) throw "Pass in the whole TERESA UNLOCK object";
    return player.celestials.teresa.unlocks.includes(info.id);
  },
  startRun() {
    player.celestials.teresa.run = startRealityOver() || player.celestials.teresa.run;
  },
  rewardMultiplier(antimatter) {
    return Decimal.max(Decimal.pow(antimatter.plus(1).log10() / 1.5e8, 12), 1).toNumber();
  },
  get rmStore() {
    return player.celestials.teresa.rmStore;
  },
  set rmStore(amount) {
    player.celestials.teresa.rmStore = amount;
  },
  get fill() {
    return Math.min(Math.log10(this.rmStore) / 24, 1);
  },
  get rmMultiplier() {
    return Math.max(Math.pow(this.rmStore, 0.1), 1);
  },
  get runRewardMultiplier() {
    return this.rewardMultiplier(player.celestials.teresa.bestRunAM);
  },
  get quote() {
    return teresaQuotes[player.celestials.teresa.quoteIdx];
  },
  nextQuote() {
    if (player.celestials.teresa.quoteIdx < 4 + player.celestials.teresa.unlocks.length) {
      player.celestials.teresa.quoteIdx++;
    }
  },
  get isRunning() {
    return player.celestials.teresa.run;
  },
};

class PerkShopUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.perkPoints;
  }

  get boughtAmount() {
    return player.celestials.teresa.perkShop[this.id];
  }

  set boughtAmount(value) {
    player.celestials.teresa.perkShop[this.id] = value;
  }
  
  get cap() {
    return this.config.cap();
  }

  get isAvailable() {
    return this.cost < this.cap;
  }

  purchase() {
    if (!super.purchase()) return;
    if (this.id === 1) {
      Autobuyer.reality.bumpAmount(2);
    }
    if (this.id === 3) {
      dev.giveMusicGlyph();
    }
  }
}

const PerkShopUpgrade = (function() {
  const db = GameDatabase.celestials.perkShop;
  return {
    glyphLevel: new PerkShopUpgradeState(db.glyphLevel),
    rmMult: new PerkShopUpgradeState(db.rmMult),
    bulkDilation: new PerkShopUpgradeState(db.bulkDilation),
    musicGlyph: new PerkShopUpgradeState(db.musicGlyph),
  };
})();
