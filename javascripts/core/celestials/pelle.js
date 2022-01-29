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
  glyphs: () => !PelleRifts.famine.hasMilestone(0),
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
  tickspeedAutobuyer: () => PelleUpgrade.tickspeedAutobuyer,
  dimBoostAutobuyer: () => PelleUpgrade.dimBoostAutobuyer,
  galaxyAutobuyer: () => PelleUpgrade.galaxyAutobuyer,
  timeTheoremAutobuyer: () => ({}),
  rupg10: () => ({}),
  dtMults: () => ({}),
  chargedInfinityUpgrades: () => ({}),
  alteration: () => ({}),
  timeTheorems: () => ({})
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

    if (typeof upgrade === "boolean") {
      return upgrade;
    }

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
      PelleRifts.all.forEach(r => r.fill(diff));
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
    return [143, 142, 141, 125, 118, 117, 111, 92, 91, 76];
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
    return PelleRebuyableUpgrade.glyphLevels.effectValue;
  },

  antimatterDimensionMult(x) {
    return Decimal.pow(10, Math.log10(x + 1) + x ** 5.1 / 1e3 + 4 ** x / 1e19);
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

  purchase() {
    if (!super.purchase() || this.id !== "glyphLevels") return;
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
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

  get rift() {
    return this._config.rift();
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
    powerGalaxies: new PelleStrikeState(db.powerGalaxies),
    all: Object.keys(db).map(key => new PelleStrikeState(db[key]))
  };
}());

class RiftState extends GameMechanicState {
  get fillCurrency() {
    return this.config.currency();
  }

  get strike() {
    return this.config.strike();
  }

  get canBeApplied() {
    return this.strike.hasStrike;
  }

  get name() {
    return this.config.name;
  }

  get rift() {
    return player.celestials.pelle.rifts[this.config.key];
  }

  get totalFill() {
    return this.rift.fill;
  }

  set totalFill(value) {
    this.rift.fill = value;
  }

  get isActive() {
    return this.rift.active;
  }

  get percentage() {
    return this.config.percentage(this.totalFill);
  }

  get milestones() {
    return this.config.milestones;
  }

  get description() {
    return this.config.description;
  }

  get effectDescription() {
    return this.config.effectDescription(this.effectValue);
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.totalFill);
  }

  get maxValue() {
    return this.config.percentageToFill(1);
  }

  get isMaxed() {
    return this.totalFill.gte(this.maxValue);
  }

  hasMilestone(idx) {
    return this.milestones[idx].requirement <= this.percentage;
  }

  toggle() {
    this.rift.active = !this.rift.active;
  }

  fill(diff) {
    if (!this.isActive || this.isMaxed) return;
    const spent = this.fillCurrency.value.times(0.03).times(diff / 1000);
    this.fillCurrency.subtract(spent);
    this.totalFill = this.totalFill.plus(spent).min(this.maxValue);
  }
}

export const PelleRifts = (function() {
  const db = GameDatabase.celestials.pelle.rifts;

  const all = Object.keys(db).map(key => new RiftState(db[key]));
  return {
    famine: new RiftState(db.famine),
    pestilence: new RiftState(db.pestilence),
    all,
    totalMilestones: () => all.flatMap(r => r.milestones.filter((m, idx) => r.hasMilestone(idx))).length
  };
}());