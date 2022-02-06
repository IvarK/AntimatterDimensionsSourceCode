import { Currency } from "../../currency";
import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";
import { GameMechanicState, SetPurchasableMechanicState } from "../../utils";
import zalgo from "./zalgo";

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

  additionalEnd: 0,

  get endState() {
    return Math.max((Math.log10(player.celestials.pelle.records.totalAntimatter.plus(1).log10() + 1) - 8.7) /
      (Math.log10(9e15) - 8.7) + this.additionalEnd, 0);
  },

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
      if (this.endState >= 1) this.additionalEnd += diff / 1000 / 20;
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
    return [143, 142, 141, 125, 118, 117, 111, 103, 92, 91, 76, 74, 65];
  },

  get uselessInfinityUpgrades() {
    return ["passiveGen", "ipMult", "infinitiedGeneration"];
  },

  // TS33 only gets useless with PelleUpgrade.replicantiGalaxyNoReset
  get uselessTimeStudies() {
    return [32, 41, 51, 61, 62, 121, 122, 123, 141, 142, 143, 192, 213];
  },

  get uselessRaMilestones() {
    return [0, 1, 15, 18, 19, 21];
  },

  get remnantRequirementForDilation() {
    return 3.8e7;
  },

  get remnantsGain() {
    let am = this.cel.records.totalAntimatter.plus(1).log10();
    let ip = this.cel.records.totalInfinityPoints.plus(1).log10();
    let ep = this.cel.records.totalEternityPoints.plus(1).log10();

    if (PelleStrikes.dilation.hasStrike) {
      am *= 500;
      ip *= 10;
      ep *= 5;
    }

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
  },

  get activeGlyphType() {
    return Glyphs.active.filter(Boolean)[0]?.type;
  },

  // Transition text from "from" to "to", stage is 0-1, 0 is fully "from" and 1 is fully "to"
  // Also adds more zalgo the bigger the stage
  transitionText(from, to, stage = 0) {
    const len = (from.length * (1 - stage) + to.length * stage);
    const toInterval = len * (1 - stage);
    let req = toInterval;
    let str = "";
    for (let i = 0; i < len; i++) {
      if (i >= req) {
        const idx = Math.floor(i * (to.length / len));
        str += to[idx];
        req += toInterval;
      } else {
        const idx = Math.floor(i * (from.length / len));
        str += from[idx];
      }
    }
    return zalgo(str, Math.floor(stage ** 2 * 7));
  },

};

export class RebuyablePelleUpgradeState extends RebuyableMechanicState {

  get hasCustomCurrency() {
    return Boolean(this.config.currency);
  }

  get currency() {
    return this.hasCustomCurrency ? this.config.currency() : Currency.realityShards;
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

  get isCapped() {
    return this.config.cap ? this.boughtAmount >= this.config.cap : false;
  }

  get isAffordable() {
    if (!this.hasCustomCurrency) return this.currency.gte(this.cost);

    return this.cost.lte(this.currency.value);
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.boughtAmount);
  }

  purchase() {
    if (this.hasCustomCurrency) {
      if (!this.canBeBought) return false;
      if (this.currency.value instanceof Decimal) {
        this.currency.value = this.currency.value.minus(this.cost);
      } else {
        this.currency.value -= this.cost.toNumber();
      }
      this.boughtAmount++;
      this.onPurchased();
      GameUI.update();
      return true;
    }

    const purchaseReturnValue = super.purchase();
    if (this.id === "glyphLevels") EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    return purchaseReturnValue;
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
  const upgradeDb = GameDatabase.celestials.pelle.rebuyables;
  const galaxyGeneratorDb = GameDatabase.celestials.pelle.galaxyGeneratorUpgrades;
  const upgrades = {}, galaxyGenerator = {};

  Object.keys(upgradeDb).forEach(key => {
    upgrades[key] = new RebuyablePelleUpgradeState(upgradeDb[key]);
  });

  Object.keys(galaxyGeneratorDb).forEach(key => {
    galaxyGenerator[key] = new RebuyablePelleUpgradeState(galaxyGeneratorDb[key]);
  });

  return {
    all: Object.values(upgrades),
    galaxyGenerator: Object.values(galaxyGenerator),
    ...upgrades,
    ...galaxyGenerator
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
    if (!Pelle.isDoomed || this.hasStrike) return;
    this.unlockStrike();

    // If it's death, reset the records
    if (this.id === 5) {
      Pelle.cel.records.totalAntimatter = new Decimal("1e180000");
      Pelle.cel.records.totalInfinityPoints = new Decimal("1e60000");
      Pelle.cel.records.totalEternityPoints = new Decimal("1e400");
    }
  }

  unlockStrike() {
    GameUI.notify.success(`You encountered a Pelle Strike: ${this._config.requirementDescription}`);
    // eslint-disable-next-line no-bitwise
    player.celestials.pelle.progressBits |= (1 << this.id);
  }
}

export const PelleStrikes = (function() {
  const db = GameDatabase.celestials.pelle.strikes;
  return {
    infinity: new PelleStrikeState(db.infinity),
    powerGalaxies: new PelleStrikeState(db.powerGalaxies),
    eternity: new PelleStrikeState(db.eternity),
    ECs: new PelleStrikeState(db.ECs),
    dilation: new PelleStrikeState(db.dilation),
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

  get reducedTo() {
    return this.rift.reducedTo;
  }

  set reducedTo(value) {
    this.rift.reducedTo = value;
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

  get realPercentage() {
    return this.config.percentage(this.totalFill);
  }

  get spentPercentage() {
    return this.rift.percentageSpent || 0;
  }

  get percentage() {
    if (this.reducedTo > 1) return this.reducedTo;
    if (!this.config.spendable) return Math.min(this.realPercentage, this.reducedTo);
    return Math.min(this.config.percentage(this.totalFill) - this.spentPercentage, this.reducedTo);
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
    return this.config.effect(this.config.percentageToFill(this.percentage));
  }

  get maxValue() {
    return this.config.percentageToFill(1 + this.spentPercentage);
  }

  get isMaxed() {
    return this.percentage >= 1;
  }

  hasMilestone(idx) {
    if (this.config.key === "pestilence" && PelleRifts.chaos.hasMilestone(0)) return true;
    return this.milestones[idx].requirement <= this.percentage;
  }

  toggle() {
    const active = PelleRifts.all.filter(r => r.isActive).length;
    if (!this.isActive && active === 2) GameUI.notify.error(`You can only have 2 rifts active at the same time!`);
    else this.rift.active = !this.rift.active;
  }

  fill(diff) {
    if (!this.isActive || this.isMaxed) return;

    if (this.fillCurrency.value instanceof Decimal) {
      const afterTickAmount = this.fillCurrency.value.times(0.97 ** (diff / 1000));
      const spent = this.fillCurrency.value.minus(afterTickAmount);
      this.fillCurrency.value = this.fillCurrency.value.minus(spent).max(0);
      this.totalFill = this.totalFill.plus(spent).min(this.maxValue);
    } else {
      const afterTickAmount = this.fillCurrency.value * 0.97 ** (diff / 1000);
      const spent = this.fillCurrency.value - afterTickAmount;
      this.fillCurrency.value = Math.max(this.fillCurrency.value - spent, 0);
      this.totalFill = this.totalFill.plus(spent).min(this.maxValue);
    }
  }
}

export const PelleRifts = (function() {
  const db = GameDatabase.celestials.pelle.rifts;

  const all = Object.keys(db).map(key => new RiftState(db[key]));
  return {
    famine: new RiftState(db.famine),
    pestilence: new RiftState(db.pestilence),
    chaos: new RiftState(db.chaos),
    war: new RiftState(db.war),
    death: new RiftState(db.death),
    all,
    totalMilestones: () => all.flatMap(r => r.milestones.filter((m, idx) => r.hasMilestone(idx))).length
  };
}());