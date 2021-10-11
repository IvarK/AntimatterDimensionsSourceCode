"use strict";

const disabledMechanicUnlocks = {
  IPGain: () => PelleUpgrade.IPGain,
  EPGain: () => ({}),
  achievements: () => ({}),
  IPMults: () => PelleUpgrade.IPMults,
  EPMults: () => ({}),
  galaxies: () => ({}),
  InfinitiedMults: () => ({}),
  infinitiedGen: () => ({}),
  eternityGain: () => ({}),
  eternityMults: () => ({}),
  studies: () => ({}),
  EPgen: () => ({}),
  autoec: () => ({}),
  replicantiIntervalMult: () => ({}),
  tpMults: () => ({}),
  equipGlyphs: () => ({}),
  V: () => ({}),
  singularity: () => ({}),
  continuum: () => ({}),
  alchemy: () => ({}),
  achievementMult: () => ({}),
  blackhole: () => ({}),
  effarig: () => ({}),
  imaginaryUpgrades: () => ({}),
  glyphsac: () => ({}),
  antimatterDimAutobuyer1: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer2: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer3: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer4: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer5: () => PelleUpgrade.antimatterDimAutobuyers3,
  antimatterDimAutobuyer6: () => PelleUpgrade.antimatterDimAutobuyers3,
  antimatterDimAutobuyer7: () => PelleUpgrade.antimatterDimAutobuyers4,
  antimatterDimAutobuyer8: () => PelleUpgrade.antimatterDimAutobuyers4,
  tickspeedAutobuyer: () => PelleUpgrade.tickspeedAutoBuyer,
  dimBoostAutobuyer: () => PelleUpgrade.dimBoostAutobuyer,
  galaxyAutobuyer: () => ({}),
  rupg10: () => ({}),
  dtMults: () => ({})
};

const Pelle = {

  get isUnlocked() {
    return ImaginaryUpgrade(25).isBought;
  },
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff back
  isDisabled(mechanic) {
    if (!this.isDoomed) return false;

    if (!mechanic) return true;
    if (!disabledMechanicUnlocks[mechanic]) {
      // eslint-disable-next-line
      console.error(`Mechanic ${mechanic} isn't present in the disabledMechanicUnlocks!`);
      return true;
    }
    const upgrade = disabledMechanicUnlocks[mechanic]();
    return Boolean(!upgrade.canBeApplied);
  },

  armageddon(gainStuff) {
    if (gainStuff) {
      this.cel.remnants = this.cel.remnants.plus(this.remnantsGain).min(this.remnantsLimit);
    }
    finishProcessReality({ reset: true, armageddon: true });
    disChargeAll();
    this.cel.armageddonDuration = 0;

    this.cel.maxAMThisArmageddon = new Decimal(0);
  },

  gameLoop(diff) {
    if (this.isDoomed) {
      this.cel.armageddonDuration += diff * this.armageddonSpeedModifier;
      this.cel.maxAMThisArmageddon = player.antimatter.max(this.cel.maxAMThisArmageddon);
    }

    if (this.isDoomed && this.armageddonInterval.lte(this.currentArmageddonDuration)) {
      this.armageddon(true);
    }

    const currencies = ["famine", "pestilence", "chaos"];

    currencies.forEach(currency => {
      if (!this[currency].unlocked) return;
      this.cel[currency].timer += TimeSpan.fromMilliseconds(diff).totalSeconds * 10 / this[currency].fillTime;
      if (this.cel[currency].timer > 10) {
        this.cel[currency].amount = this.cel[currency].amount.plus(
          this[currency].gain * (Math.floor(this.cel[currency].timer / 10))
        );
        this.cel[currency].timer = 0;
        if (currency === "chaos") {
          for (let i = 1; i <= 8; i++) {
            AntimatterDimension(i).costScale.updateCostScale();
          }
        }
      }
    });
  },

  famine: {
    get fillTime() {
      const div = 1;
      const speedUpgradeEffect = 1.2 ** player.celestials.pelle.famine.speedUpgrades;
      return 2.5 * 1 / Math.log10(Math.log10(player.dimensionBoosts + 2) + 1) / div / speedUpgradeEffect;
    },
    get gain() {
      const base = 1;
      return base;
    },
    get unlocked() { return false; },
    get multiplierToAntimatter() {
      let base = Decimal.pow(1.1, player.celestials.pelle.famine.amount);
      if (base.gte(1e100)) {
        // After 1e100 the effect is raised to ^1/10
        base = (new Decimal(1e100)).times(base.dividedBy(1e100).plus(1).log10() ** 5);
      }
      return base;
    },
    get exponentToAntimatter() { 
      return 1 + Math.log10(player.celestials.pelle.famine.amount.plus(1).log10() + 1) / 10;
    },
    get bonusDescription() {
      const softCapped = this.multiplierToAntimatter.gte(1e100);
      return `Multiplies Antimatter Dimensions by ` +
        `${formatX(this.multiplierToAntimatter, 2, 2)} ${softCapped ? "(softcapped)" : ""}` +
        ` and powers them up by ${formatPow(this.exponentToAntimatter, 2, 2)}`;
    }
  },
  pestilence: {
    get fillTime() { 
      const speedUpgradeEffect = 1.2 ** player.celestials.pelle.pestilence.speedUpgrades;
      return 10 / (Math.log10(Replicanti.amount.log10() + 1) + 1) / speedUpgradeEffect;
    },
    get gain() {
      let gain = 1;
      if (Pelle.chaos.unlocked) gain *= Pelle.chaos.pestilenceGainMult;
      return gain;
    },
    get unlocked() { return false; },
    get armageddonTimeMultiplier() { return Math.max(player.celestials.pelle.pestilence.amount.plus(1).log10(), 1); },
    get famineGainMult() { return player.celestials.pelle.pestilence.amount.pow(0.5).plus(1).toNumber(); },
    get bonusDescription() { 
      return `Armageddon lasts ${formatX(this.armageddonTimeMultiplier, 2, 2)} ` +
        `longer, you gain ${formatX(this.famineGainMult, 2, 2)} more Famine.`;
    }
  },
  chaos: {
    get fillTime() {
      const speedUpgradeEffect = 1.2 ** player.celestials.pelle.chaos.speedUpgrades;
      return 10 / (Currency.timeShards.value.plus(1).log10() ** 0.3 / 3) / speedUpgradeEffect;
    },
    get gain() {
      const gain = 1;
      return gain;
    },
    get unlocked() { return false; },
    get dimensionDiscount() { return new Decimal(10).pow(Currency.chaos.value.pow(2)).min(Decimal.MAX_VALUE); },
    get pestilenceGainMult() { return Currency.chaos.value.pow(0.5).plus(1).toNumber(); },
    get bonusDescription() { 
      let dimensionString = "";
      dimensionString += "6th";
      const hasMultiple = dimensionString.length > 3;
      if (hasMultiple) dimensionString = dimensionString.splice(dimensionString.lastIndexOf(","), 1, " and");
      return `${dimensionString} Antimatter Dimension${hasMultiple ? "s" : ""} ${hasMultiple ? "are" : "is"} ` +
        `${formatX(this.dimensionDiscount, 2, 2)} cheaper, ` +
        `you gain ${formatX(this.pestilenceGainMult, 2, 2)} more Pestilence.`;
    }
  },

  get cel() {
    return player.celestials.pelle;
  },

  get isDoomed() {
    return this.cel.doomed;
  },

  get currentArmageddonDuration() {
    return this.cel.armageddonDuration;
  },

  // Milliseconds
  get armageddonInterval() {
    let base = new Decimal(5000);

    base = base.timesEffectsOf(
      PelleUpgrade.longerArmageddon,
      PelleUpgrade.longerArmageddonBasedOnRemnants
    );

    if (this.pestilence.unlocked) base *= Pelle.pestilence.armageddonTimeMultiplier;
    return base;
  },

  get armageddonSpeedModifier() {
    if (!Pelle.isDoomed) return 1;
    return Math.max(Math.log10(Currency.antimatter.productionPerSecond.plus(1).log10() + 1) ** 2, 1);
  },

  get disabledAchievements() {
    return [142, 141, 125, 117, 92, 91];
  },

  get remnantsGain() {
    let gain = Math.log10(this.cel.maxAMThisArmageddon.plus(1).log10() + 1) ** 3;

    gain = new Decimal(gain).timesEffectsOf(
      PelleUpgrade.remnantsBasedOnArmageddon,
      PelleUpgrade.starterRemnantMult
    );
    return gain;
  },

  get remnantsLimit() {
    let limit = 10;
    if (PelleUpgrade.remnantGainLimitMult.canBeApplied) limit *= PelleUpgrade.remnantGainLimitMult.effectValue;
    return limit;
  }
};

class RebuyablePelleUpgradeState extends RebuyableMechanicState {

  get currency() {
    return Currency[this.config.currency];
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
    switch (this.config.currency) {
      case "remnants":
        return "Remnants";

      case "famine":
        return "Famine";

      case "pestilence":
        return "Pestilence";

      case "chaos":
        return "Chaos";

      default:
        return "";
    }
  }
}

class PelleUpgradeState extends SetPurchasableMechanicState {

  get set() {
    return player.celestials.pelle.upgrades;
  }

  get currency() {
    return Currency[this.config.currency];
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
    switch (this.config.currency) {
      case "remnants":
        return "Remnants";

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
        
      case "dilatedTime":
        return "Dilated Time";

      default:
        return "";
    }
  }
}

const PelleUpgrade = (function() {
  const db = GameDatabase.celestials.pelle.upgrades;
  const obj = {};
  Object.keys(db).forEach(key => {
    obj[key] = new PelleUpgradeState(db[key]);
  });
  return {
    all: Object.values(obj),
    ...obj
  };
}());

const PelleRebuyableUpgrade = (function() {
  const db = GameDatabase.celestials.pelle.rebuyables;
  const obj = {};
  Object.keys(db).forEach(key => {
    obj[key] = new RebuyablePelleUpgradeState(db[key]);
  });
  return {
    all: Object.values(obj),
    ...obj
  };
}());
