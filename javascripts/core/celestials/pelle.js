import { RebuyableMechanicState } from "../game-mechanics/rebuyable";
import { GameMechanicState, SetPurchasableMechanicState } from "../utils";

const disabledMechanicUnlocks = {
  achievements: () => ({}),
  IPMults: () => ({}),
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
  antimatterDimAutobuyer1: () => ({}),
  antimatterDimAutobuyer2: () => ({}),
  antimatterDimAutobuyer3: () => ({}),
  antimatterDimAutobuyer4: () => ({}),
  antimatterDimAutobuyer5: () => ({}),
  antimatterDimAutobuyer6: () => ({}),
  antimatterDimAutobuyer7: () => ({}),
  antimatterDimAutobuyer8: () => ({}),
  tickspeedAutobuyer: () => ({}),
  dimBoostAutobuyer: () => ({}),
  galaxyAutobuyer: () => ({}),
  timeTheoremAutobuyer: () => ({}),
  rupg10: () => ({}),
  dtMults: () => ({}),
  chargedInfinityUpgrades: () => ({})
};

export const Pelle = {

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
      this.cel.armageddonDuration += diff;
      this.cel.maxAMThisArmageddon = player.antimatter.max(this.cel.maxAMThisArmageddon);
      PelleStrikes.all.forEach(strike => strike.tryUnlockStrike());
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

  get disabledAchievements() {
    return [142, 141, 125, 117, 92, 91, 76];
  },

  get remnantsGain() {
    let gain = Math.log10(this.cel.maxAMThisArmageddon.plus(1).log10() + 1) ** 3;

    gain = new Decimal(gain).timesEffectsOf(
      PelleUpgrade.remnantsBasedOnArmageddon,
      PelleUpgrade.starterRemnantMult
    );
    return gain;
  },

  get glyphMaxLevel() {
    return 10;
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

export const PelleUpgrade = (function() {
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

export const PelleRebuyableUpgrade = (function() {
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

class PelleStrikeState extends GameMechanicState {
  constructor(config) {
    super(config);
    if (this.id < 0 || this.id > 31) throw new Error(`Id ${this.id} out of bit range`);
  }

  get hasStrike() {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.pelle.progressBits & (1 << this.id));
  }

  tryUnlockStrike() {
    if (!this.hasProgress && this._config.requirement()) {
      GameUI.notify.success(`You encountered a Pelle Strike: ${this._config.requirementDescription}`);
      // eslint-disable-next-line no-bitwise
      player.celestials.pelle.progressBits |= (1 << this.id);
    }
  }
}

export const PelleStrikes = (function() {
  const db = GameDatabase.celestials.pelle.strikes;
  return {
    infinity: new PelleStrikeState(db.infinity),
    all: Object.keys(db).map(key => new PelleStrikeState(db[key]))
  };
}());