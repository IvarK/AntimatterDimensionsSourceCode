import { Currency } from "../../currency";
import { DC } from "../../constants";
import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";
import { SetPurchasableMechanicState } from "../../utils";

import { Quotes } from "../quotes";

import wordShift from "../../wordShift";

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
  glyphs: () => !PelleRifts.vacuum.milestones[0].canBeApplied,
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
  symbol: "♅",
  // Suppress the randomness for this form
  possessiveName: "Pelle's",

  get displayName() {
    return Date.now() % 4000 > 500 ? "Pelle" : wordShift.randomCrossWords("Pelle");
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
    EventHub.dispatch(GAME_EVENT.ARMAGEDDON_BEFORE, gainStuff);
    if (gainStuff) {
      this.cel.remnants += this.remnantsGain;
    }
    finishProcessReality({ reset: true, armageddon: true });
    disChargeAll();
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.autoStoreReal = false;
    this.cel.armageddonDuration = 0;
    if (PelleStrikes.dilation.hasStrike) player.dilation.active = true;
    EventHub.dispatch(GAME_EVENT.ARMAGEDDON_AFTER, gainStuff);
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
    return [164, 143, 142, 141, 137, 134, 133, 132, 125, 118, 117, 111, 104, 103, 93, 92, 91, 87, 85, 78, 76,
      74, 65, 55, 54, 37];
  },

  get uselessInfinityUpgrades() {
    return ["passiveGen", "ipMult", "infinitiedGeneration"];
  },

  get uselessTimeStudies() {
    return [32, 41, 51, 61, 62, 121, 122, 123, 141, 142, 143, 192, 213];
  },

  get disabledRUPGs() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 22, 23, 24];
  },

  get uselessPerks() {
    return [10, 12, 13, 14, 15, 16, 17, 30, 40, 41, 42, 43, 44, 45, 46, 51, 53,
      60, 61, 62, 80, 81, 82, 83, 100, 105, 106, 201, 202, 203, 204];
  },

  get specialGlyphEffect() {
    const isUnlocked = this.isDoomed && PelleRifts.chaos.milestones[1].canBeApplied;
    const description = this.getSpecialGlyphEffectDescription(this.activeGlyphType);
    const isActive = type => isUnlocked && this.activeGlyphType === type;
    return {
      isUnlocked,
      description,
      infinity: (isActive("infinity") && player.challenge.eternity.current <= 8)
        ? Currency.infinityPoints.value.plus(1).pow(0.2)
        : DC.D1,
      time: isActive("time")
        ? Currency.eternityPoints.value.plus(1).pow(0.3)
        : DC.D1,
      replication: isActive("replication")
        ? 10 ** 53 ** (PelleRifts.vacuum.percentage)
        : 1,
      dilation: isActive("dilation")
        ? Decimal.pow(player.dilation.totalTachyonGalaxies, 1.5).max(1)
        : DC.D1,
      power: isActive("power")
        ? 1.02
        : 1,
      companion: isActive("companion")
        ? 1.34
        : 1,
      isScaling: () => ["infinity", "time", "replication", "dilation"].includes(this.activeGlyphType),
    };
  },
  getSpecialGlyphEffectDescription(type) {
    switch (type) {
      case "infinity":
        return `Infinity Point gain ${player.challenge.eternity.current <= 8
          ? formatX(Currency.infinityPoints.value.plus(1).pow(0.2), 2)
          : formatX(DC.D1, 2)} (based on current IP)`;
      case "time":
        return `Eternity Point gain ${formatX(Currency.eternityPoints.value.plus(1).pow(0.3), 2)}
          (based on current EP)`;
      case "replication":
        return `Replication speed ${formatX(10 ** 53 ** (PelleRifts.vacuum.percentage), 2)} \
        (based on ${wordShift.wordCycle(PelleRifts.vacuum.name)})`;
      case "dilation":
        return `Dilated Time gain ${formatX(Decimal.pow(player.dilation.totalTachyonGalaxies, 1.5).max(1), 2)}
          (based on Tachyon Galaxies)`;
      case "power":
        return `Galaxies are ${formatPercents(0.02)} stronger`;
      case "companion":
        return `You feel ${formatPercents(0.34)} better`;
      // Undefined means that there is no glyph equipped, needs to be here since this function is used in
      // both Current Glyph Effects and Glyph Tooltip
      case undefined:
        return "No glyph equipped!";
      default:
        return "";
    }
  },

  get remnantRequirementForDilation() {
    return 3.8e7;
  },

  get canDilateInPelle() {
    return this.cel.remnants >= this.remnantRequirementForDilation;
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

  // Calculations assume this is in units of proportion per second (eg. 0.03 is 3% drain per second)
  get riftDrainPercent() {
    return 0.03;
  },

  get glyphMaxLevel() {
    return PelleUpgrade.glyphLevels.effectValue;
  },

  get glyphStrength() {
    return 1;
  },

  antimatterDimensionMult(x) {
    return Decimal.pow(10, Math.log10(x + 1) + x ** 5.1 / 1e3 + 4 ** x / 1e19);
  },

  get activeGlyphType() {
    return Glyphs.active.filter(Boolean)[0]?.type;
  },

  get hasGalaxyGenerator() {
    return player.celestials.pelle.galaxyGenerator.unlocked;
  },

  // Transition text from "from" to "to", stage is 0-1, 0 is fully "from" and 1 is fully "to"
  // Also adds more zalgo the bigger the stage
  transitionText(from, to, stage = 0) {
    const len = Math.round((from.length * (1 - stage) + to.length * stage) * 1e8) / 1e8;
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

  endTabNames: "End Is Nigh Destruction Is Imminent Help Us Good Bye".split(" "),

  quotes: Quotes.pelle,
};

EventHub.logic.on(GAME_EVENT.ARMAGEDDON_AFTER, () => {
  if (Currency.remnants.gte(1)) {
    Pelle.quotes.arm.show();
  }
});
EventHub.logic.on(GAME_EVENT.PELLE_STRIKE_UNLOCKED, () => {
  if (PelleStrikes.infinity.hasStrike) {
    Pelle.quotes.strike1.show();
  }
  if (PelleStrikes.powerGalaxies.hasStrike) {
    Pelle.quotes.strike2.show();
  }
  if (PelleStrikes.eternity.hasStrike) {
    Pelle.quotes.strike3.show();
  }
  if (PelleStrikes.ECs.hasStrike) {
    Pelle.quotes.strike4.show();
  }
  if (PelleStrikes.dilation.hasStrike) {
    Pelle.quotes.strike5.show();
  }
});

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

  get isCapped() {
    return this.boughtAmount >= this.config.cap;
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.boughtAmount);
  }

  onPurchased() {
    if (this.id === "glyphLevels") EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
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

export const PelleUpgrade = mapGameDataToObject(
  GameDatabase.celestials.pelle.upgrades,
  config => (config.rebuyable
    ? new RebuyablePelleUpgradeState(config)
    : new PelleUpgradeState(config)
  )
);

PelleUpgrade.rebuyables = PelleUpgrade.all.filter(u => u.isRebuyable);
PelleUpgrade.singles = PelleUpgrade.all.filter(u => !u.isRebuyable);
