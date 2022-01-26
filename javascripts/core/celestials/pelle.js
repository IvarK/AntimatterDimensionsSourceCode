import { Currency } from "../currency";
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
  antimatterDimAutobuyer1: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer2: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer3: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer4: () => PelleUpgrade.antimatterDimAutobuyers1,
  antimatterDimAutobuyer5: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer6: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer7: () => PelleUpgrade.antimatterDimAutobuyers2,
  antimatterDimAutobuyer8: () => PelleUpgrade.antimatterDimAutobuyers2,
  tickspeedAutobuyer: () => ({}),
  dimBoostAutobuyer: () => PelleUpgrade.dimBoostAutobuyer,
  galaxyAutobuyer: () => ({}),
  timeTheoremAutobuyer: () => ({}),
  rupg10: () => ({}),
  dtMults: () => ({}),
  chargedInfinityUpgrades: () => ({}),
  alteration: () => ({}),
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

  get canArmageddon() {
    return this.remnantsGain >= 1;
  },

  armageddon(gainStuff) {
    if (!this.canArmageddon && gainStuff) return;
    if (gainStuff) {
      this.cel.remnants += this.remnantsGain;
    }
    finishProcessReality({ reset: true, armageddon: true });
    disChargeAll();
    this.cel.armageddonDuration = 0;
  },

  gameLoop(diff) {
    if (this.isDoomed) {
      this.cel.armageddonDuration += diff;
      Currency.realityShards.add(this.realityShardGainPerSecond.times(diff).div(1000));
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
    return [142, 141, 125, 118, 117, 111, 92, 91, 76];
  },

  get remnantsGain() {
    const am = this.cel.records.totalAntimatter.plus(1).log10();
    const ip = this.cel.records.totalInfinityPoints.plus(1).log10();
    const ep = this.cel.records.totalEternityPoints.plus(1).log10();
    const gain = (
      (Math.log10(am + 2) + Math.log10(ip + 2) + Math.log10(ep + 2)) / 1.64
    ) ** 7.5;

    return gain < 1 ? gain : Math.floor(gain - this.cel.remnants);
  },

  realityShardGain(remnants) {
    return Decimal.pow(10, remnants ** (1 / 7.5) * 4).minus(1).div(1e3);
  },

  get realityShardGainPerSecond() {
    return this.realityShardGain(this.cel.remnants);
  },

  get nextRealityShardGain() {
    return this.realityShardGain(this.remnantsGain + this.cel.remnants);
  },

  get glyphMaxLevel() {
    return 1;
  },

  antimatterDimensionMult(x) {
    return Decimal.pow(10, Math.log10(x + 1) + x ** 5.3 / 1e3 + 4 ** x / 1e19);
  }

};

export class RebuyablePelleUpgradeState extends RebuyableMechanicState {

  get currency() {
    return Currency.realityShards;
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

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.boughtAmount);
  }
}

export class PelleUpgradeState extends SetPurchasableMechanicState {

  get set() {
    return player.celestials.pelle.upgrades;
  }

  get currency() {
    return Currency.realityShards;
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

  get requirement() {
    return this._config.requirementDescription;
  }

  get penalty() {
    return this._config.penaltyDescription;
  }

  get reward() {
    return this._config.rewardDescription;
  }

  trigger() {
    this.tryUnlockStrike();
  }

  tryUnlockStrike() {
    if (!this.hasStrike) {
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