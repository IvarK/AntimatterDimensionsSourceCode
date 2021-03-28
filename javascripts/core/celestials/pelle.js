"use strict";

const Pelle = {
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff back
  isDisabled(mechanic) {
    if (!this.isDoomed) return false;

    switch (mechanic) {

      // case: "glyphs"

      case "IPGain":
        return !PelleUpgrade.ipGain.canBeApplied;

      case "EPGain":
        return !PelleUpgrade.epGain.canBeApplied;

      case "achievements":
        return !PelleUpgrade.achievementsBack.canBeApplied;

      case "IPMults":
        return !PelleUpgrade.nerfedIPMult.canBeApplied;

      case "EPMults":
        return !PelleUpgrade.nerfedEPMult.canBeApplied;

      case "galaxies":
        return !PelleUpgrade.nerfedGalaxies.canBeApplied;

      case "InfinitiedMults":
        return !PelleUpgrade.infinitiedGain.canBeApplied;

      case "infinitiedGen":
        return !PelleUpgrade.passivePrestigeGain.canBeApplied;

      case "eternityGain":
        return !PelleUpgrade.eternityGain.canBeApplied;

      case "eternityMults":
        return true;

      case "studies":
        return !PelleUpgrade.studiesUnlock.canBeApplied;

      default:
        return true;
    }
  },

  armageddon(gainStuff) {
    const time = player.records.thisReality.realTime;
    finishProcessReality({ reset: true, armageddon: true });
    disChargeAll();
    this.cel.lastArmageddonAt = Date.now();
    if (gainStuff) {
      let unstableMatterGain = Math.log10(this.cel.maxAMThisArmageddon.plus(1).log10() + 1) ** 3;
      if (PelleUpgrade.timeMultToUnstable.canBeApplied) {
        unstableMatterGain *= (time / 500) ** 1.1;
      }
      this.cel.unstableMatter = this.cel.unstableMatter.plus(unstableMatterGain);
    }

    this.cel.maxAMThisArmageddon = new Decimal(0);
  },

  gameLoop(diff) {
    if (this.isDoomed && Date.now() - this.cel.lastArmageddonAt > this.armageddonInterval) {
      this.armageddon(true);
    }

    if (this.isDoomed) {
      this.cel.maxAMThisArmageddon = player.antimatter.max(this.cel.maxAMThisArmageddon);
    }

    const currencies = ['famine', 'pestilence', 'chaos'];

    currencies.forEach(currency => {
      if (!this[currency].unlocked) return;
      this.cel[currency].timer += TimeSpan.fromMilliseconds(diff).totalSeconds * 10 / this[currency].fillTime;
      if (this.cel[currency].timer > 10) {
        this.cel[currency].amount = this.cel[currency].amount.plus(this[currency].gain)
        this.cel[currency].timer = 0
      }
    })
  },

  famine: {
    get fillTime() {
      let div = PelleUpgrade.famineGain.canBeApplied ? 2 : 1;
      const speedUpgradeEffect = 1.2 ** player.celestials.pelle.famine.speedUpgrades;
      return 2.5 * 1 / Math.log10(Math.log10(player.dimensionBoosts + 2) + 1) / div / speedUpgradeEffect;
    },
    get gain() {
      let base = 1;
      if (PelleUpgrade.famineGain.canBeApplied) base *= 2;
      if (PelleUpgrade.moreFamine.canBeApplied) base *= 5;
      if (PelleUpgrade.pestilenceUnlock.canBeApplied) base *= Pelle.pestilence.famineGainMult;
      return base;
    },
    get unlocked() { return PelleUpgrade.famineUnlock.canBeApplied },
    get multiplierToAntimatter() {
      let base = Decimal.pow(1.1, player.celestials.pelle.famine.amount);
      if (base.gte(1e100)) {
        // After 1e100 the effect is raised to ^1/10
        base = (new Decimal(1e100)).times(base.dividedBy(1e100).plus(1).log10() ** 5)
      }
      return base
    },
    get exponentToAntimatter() { return 1 + Math.log10(player.celestials.pelle.famine.amount.plus(1).log10() + 1) / 10 },
    get bonusDescription() {
      return `Multiplies Antimatter Dimensions by ${formatX(this.multiplierToAntimatter, 2, 2)} ${this.multiplierToAntimatter.gte(1e100) ? "(softcapped)" : ""} and powers them up by ${formatPow(this.exponentToAntimatter, 2, 2)}`
    }
  },
  pestilence: {
    get fillTime() { 
      const speedUpgradeEffect = 1.2 ** player.celestials.pelle.pestilence.speedUpgrades;
      return 10 / (Math.log10(Replicanti.amount.log10() + 1) + 1) / speedUpgradeEffect
    },
    get gain() { return 1 },
    get unlocked() { return PelleUpgrade.pestilenceUnlock.canBeApplied },
    get armageddonTimeMultiplier() { return Math.max(player.celestials.pelle.pestilence.amount.plus(1).log10(), 1) },
    get famineGainMult() { return player.celestials.pelle.pestilence.amount.pow(0.5).plus(1).toNumber() },
    get bonusDescription() { return `Armageddon lasts ${formatX(this.armageddonTimeMultiplier, 2, 2)} longer, you gain ${formatX(this.famineGainMult, 2, 2)} more Famine.` }
  },
  chaos: {
    get fillTime() { 
      const speedUpgradeEffect = 1.2 ** player.celestials.pelle.chaos.speedUpgrades;
      return 10 / speedUpgradeEffect;
    },
    get gain() { return 1 },
    get unlocked() { return false },
    get bonusDescription() { return `` }
  },

  get cel() {
    return player.celestials.pelle;
  },

  get isDoomed() {
    return this.cel.doomed;
  },

  // Milliseconds
  get armageddonInterval() {
    let base = PelleUpgrade.longerArmageddon.canBeApplied ? 5000 : 500;
    if (PelleUpgrade.doubleArmageddon.canBeApplied) base *= 2;
    if (PelleUpgrade.pestilenceUnlock.canBeApplied) base *= Pelle.pestilence.armageddonTimeMultiplier;
    return base;
  },

  get disabledAchievements() {
    return [142, 141, 125, 117, 92, 91];
  },
};

class RebuyablePelleUpgradeState extends RebuyableMechanicState {

  get currency() {
    return Currency[this.config.currency]
  }

  get boughtAmount() {
    return player.celestials.pelle.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.celestials.pelle.rebuyables[this.id] = value;
  }

  get cost() {
    return this.config.cost();
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

class PelleUpgradeState extends SetPurchasableMechanicState {

  get set() {
    return player.celestials.pelle.upgrades
  }

  get currency() {
    return Currency[this.config.currency]
  }

  get description() {
    return this.config.description;
  }

  get cost() {
    return this.config.cost;
  }

  get isAvailableForPurchase() {
    return Pelle.isDoomed;
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

      case "infinityPoints":
        return "Infinity Points";

      case "eternityPoints":
        return "Eternity Points";

      case "antimatter":
        return "Antimatter";
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

const PelleRebuyableUpgrade = (function() {
  const db = GameDatabase.celestials.pelle.rebuyables;
  const obj = {}
  Object.keys(db).forEach(key => {
    obj[key] = new RebuyablePelleUpgradeState(db[key]);
  })
  return {
    all: Object.values(obj),
    ...obj
  }
}());
