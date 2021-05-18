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

      case "EPgen":
        return !PelleUpgrade.passiveEP.canBeApplied;

      case "autoec":
        return !PelleUpgrade.autoEc.canBeApplied;
      
      case "equipGlyphs":
        return true;

      default:
        return true;
    }
  },

  armageddon(gainStuff) {
    if (gainStuff) {
      this.cel.unstableMatter = this.cel.unstableMatter.plus(this.unstableMatterGain);
    }
    finishProcessReality({ reset: true, armageddon: true });
    disChargeAll();
    this.cel.lastArmageddonAt = Date.now();

    this.cel.maxAMThisArmageddon = new Decimal(0);
  },

  gameLoop(diff) {
    if (this.isDoomed && this.currentArmageddonDuration > this.armageddonInterval) {
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
        this.cel[currency].amount = this.cel[currency].amount.plus(this[currency].gain * (Math.floor(this.cel[currency].timer / 10)));
        this.cel[currency].timer = 0;
        if (currency === "chaos") {
          for (let i = 1; i <= 8; i++) {
            AntimatterDimension(i).costScale.updateCostScale();
          }
        }
      }
    })

    if (PelleUpgrade.passiveUnstableMatter.canBeApplied) {
      this.cel.unstableMatter = this.cel.unstableMatter.plus(
        this.unstableMatterGain * (TimeSpan.fromMilliseconds(diff).totalSeconds / 3)
      );
    }
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
    get gain() {
      let gain = 1;
      if (Pelle.chaos.unlocked) gain *= Pelle.chaos.pestilenceGainMult;
      return gain 
    },
    get unlocked() { return PelleUpgrade.pestilenceUnlock.canBeApplied },
    get armageddonTimeMultiplier() { return Math.max(player.celestials.pelle.pestilence.amount.plus(1).log10(), 1) },
    get famineGainMult() { return player.celestials.pelle.pestilence.amount.pow(0.5).plus(1).toNumber() },
    get bonusDescription() { return `Armageddon lasts ${formatX(this.armageddonTimeMultiplier, 2, 2)} longer, you gain ${formatX(this.famineGainMult, 2, 2)} more Famine.` }
  },
  chaos: {
    get fillTime() { 
      const speedUpgradeEffect = 1.2 ** player.celestials.pelle.chaos.speedUpgrades;
      return 10 / (Currency.timeShards.value.plus(1).log10() ** 0.3 / 3) / speedUpgradeEffect;
    },
    get gain() {
      let gain = 1;
      if (PelleUpgrade.chaosMultiplier.canBeApplied) gain *= PelleUpgrade.chaosMultiplier.effectValue;
      return gain;
    },
    get unlocked() { return PelleUpgrade.chaosUnlock.canBeApplied },
    get dimensionDiscount() { return new Decimal(10).pow(Currency.chaos.value.pow(2)) },
    get pestilenceGainMult() { return Currency.chaos.value.pow(0.5).plus(1).toNumber() },
    get bonusDescription() { 
      let dimensionString = ""
      if (PelleUpgrade.chaosEffect1stAnd4th.canBeApplied) dimensionString += "1st, ";
      if (PelleUpgrade.chaosEffect1stAnd4th.canBeApplied) dimensionString += "4th, ";
      dimensionString += "6th"
      const hasMultiple = dimensionString.length > 3;
      if (hasMultiple) dimensionString = dimensionString.splice(dimensionString.lastIndexOf(","), 1, " and")
      return `${dimensionString} Antimatter Dimension${hasMultiple ? "s" : ""} ${hasMultiple ? "are" : "is"} ${formatX(this.dimensionDiscount, 2, 2)} cheaper, you gain ${formatX(this.pestilenceGainMult, 2, 2)} more Pestilence. ` 
    }
  },

  get cel() {
    return player.celestials.pelle;
  },

  get isDoomed() {
    return this.cel.doomed;
  },

  get currentArmageddonDuration() {
    return Date.now() - this.cel.lastArmageddonAt;
  },

  // Milliseconds
  get armageddonInterval() {
    let base = PelleUpgrade.longerArmageddon.canBeApplied ? 5000 : 500;
    if (PelleUpgrade.doubleArmageddon.canBeApplied) base *= 2;
    if (this.pestilence.unlocked) base *= Pelle.pestilence.armageddonTimeMultiplier;
    if (PelleUpgrade.unspentTTArmageddon.canBeApplied) base *= PelleUpgrade.unspentTTArmageddon.effectValue;
    return base;
  },

  get disabledAchievements() {
    return [142, 141, 125, 117, 92, 91];
  },

  get unstableMatterGain() {
    let gain = Math.log10(this.cel.maxAMThisArmageddon.plus(1).log10() + 1) ** 3;
    if (PelleUpgrade.timeMultToUnstable.canBeApplied) {
      gain *= PelleUpgrade.timeMultToUnstable.effectValue;
    }
    if (PelleUpgrade.rgMultToUnstable.canBeApplied) {
      gain *= PelleUpgrade.rgMultToUnstable.effectValue
    }
    return gain;
  }
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
