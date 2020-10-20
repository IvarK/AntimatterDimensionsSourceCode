"use strict";

const Pelle = {
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff back
  isDisabled(mechanic) {
    if (!this.isDoomed) return false;

    switch (mechanic) {

      // case: "glyphs"
      default:
        return true;
    }
  },

  armageddon(gainStuff) {
    finishProcessReality({ reset: true });
    this.cel.lastArmageddonAt = Date.now();
    if (gainStuff) {
      this.cel.unstableMatter = this.cel.unstableMatter.plus(Math.log10(player.antimatter.log10()) ** 3);
    }
  },

  gameLoop() {
    if (Date.now() - this.cel.lastArmageddonAt > this.armageddonInterval) {
      this.armageddon(true);
    }
  },

  get cel() {
    return player.celestials.pelle;
  },

  get isDoomed() {
    return this.cel.doomed;
  },

  // Milliseconds
  get armageddonInterval() {
    return 500;
  }
};

class PelleUpgradeState extends SetPurchasableMechanicState {

  get set() {
    return player.celestials.pelle.upgrades
  }

  get currency() {
    return player.celestials.pelle[this.config.currency]
  }

  get description() {
    return this.config.description;
  }

  get cost() {
    return this.config.cost;
  }

  get currencyDisplay() {
    switch(this.config.currency) {
      case "unstableMatter":
        return "Unstable Matter";

      case "famine":
        return "Famine";

      case "pestilence":
        return "Pestilence";

      case "chaos":
        return "Chaos";
    }
  }
}

const PelleUpgrade = (function() {
  const db = GameDatabase.celestials.pelle.upgrades;
  const obj = {}
  Object.keys(db).forEach(key => {
    obj[key] = new PelleUpgradeState(db[key]);
  })
  return {
    all: Object.values(obj),
    ...obj
  }
}());