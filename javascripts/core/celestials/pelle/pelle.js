import { DC } from "../../constants";
import { Currency } from "../../currency";
import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";
import { SetPurchasableMechanicState } from "../../utils";
import zalgo from "./zalgo";
import { CelestialQuotes } from "../quotes.js";

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
  glyphs: () => !PelleRifts.famine.milestones[0].canBeApplied,
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

  get displayName() {
    return Date.now() % 4000 > 500 ? "Pelle" : Pelle.modalTools.randomCrossWords("Pelle");
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
    this.cel.armageddonDuration = 0;
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
    return [143, 142, 141, 125, 118, 117, 111, 104, 103, 92, 91, 78, 76, 74, 65, 55, 54, 37];
  },

  get uselessInfinityUpgrades() {
    return ["passiveGen", "ipMult", "infinitiedGeneration"];
  },

  get uselessTimeStudies() {
    const uselessTimeStudies = [32, 41, 51, 61, 62, 121, 122, 123, 141, 142, 143, 192, 213];
    if (PelleUpgrade.replicantiGalaxyNoReset.canBeApplied) uselessTimeStudies.push(33);
    return uselessTimeStudies;
  },

  get disabledRUPGs() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 22, 23, 24];
  },

  get uselessPerks() {
    return [10, 12, 13, 14, 15, 16, 17, 30, 40, 41, 42, 43, 44, 45, 46, 51, 53,
      60, 61, 62, 80, 81, 82, 83, 100, 105, 106, 201, 202, 203, 204];
  },

  // Glyph effects are controlled through other means, but are also enumerated here for accessing to improve UX. Note
  // that this field is NEGATED, describing an effect allowlist instead of a blocklist, as most of the effects are
  // already disabled by virtue of the glyph type being unequippable and many of the remaining ones are also disabled.
  get enabledGlyphEffects() {
    return ["timepow", "timespeed", "timeshardpow",
      "dilationpow", "dilationgalaxyThreshold",
      "replicationpow",
      "powerpow", "powermult", "powerdimboost", "powerbuy10",
      "infinitypow", "infinityrate",
      "companiondescription", "companionEP"];
  },

  get specialGlyphEffect() {
    const isUnlocked = this.isDoomed && PelleRifts.chaos.milestones[1].canBeApplied;
    let description;
    switch (Pelle.activeGlyphType) {
      case "infinity":
        description = "Infinity Point gain {value} (based on current IP)";
        break;
      case "time":
        description = "Eternity Point gain {value} (based on current EP)";
        break;
      case "replication":
        description = "Replication speed {value} (based on Famine)";
        break;
      case "dilation":
        description = "Dilated Time gain {value} (based on Tachyon Galaxies)";
        break;
      case "power":
        description = `Galaxies are ${formatPercents(0.02)} stronger`;
        break;
      case "companion":
        description = `You feel ${formatPercents(0.34)} better`;
        break;
      default:
        description = "No glyph equipped!";
        break;
    }
    const isActive = type => isUnlocked && this.activeGlyphType === type;
    return {
      isUnlocked,
      description,
      infinity: (isActive("infinity") && player.challenge.eternity.current <= 8)
        ? Currency.infinityPoints.value.pow(0.2)
        : DC.D1,
      time: isActive("time")
        ? Currency.eternityPoints.value.plus(1).pow(0.3)
        : DC.D1,
      replication: isActive("replication")
        ? 10 ** 53 ** (PelleRifts.famine.percentage)
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

  get uselessRaMilestones() {
    return [0, 1, 15, 18, 19, 21];
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

  endTabNames: "End Is Nigh Destruction Is Imminent Help Us Good Bye".split(" "),

  modalTools: {
    bracketOrder: ["()", "[]", "{}", "<>", "||"],
    wordCycle(x) {
      const list = x.split("-");
      const len = list.length;
      const maxWordLen = list.reduce((acc, str) => Math.max(acc, str.length), 0);
      const tick = Math.floor(Date.now() / 200) % (len * 5);
      const largeTick = Math.floor(tick / 5);
      const bP = this.bracketOrder[largeTick];
      let v = list[largeTick];
      if (tick % 5 < 1 || tick % 5 > 3) {
        v = this.randomCrossWords(v);
      }
      // Stands for Bracket Pair.
      const space = (maxWordLen - v.length) / 2;
      return bP[0] + ".".repeat(Math.floor(space)) + v + ".".repeat(Math.ceil(space)) + bP[1];
    },
    randomCrossWords(str) {
      const x = str.split("");
      for (let i = 0; i < x.length / 1.7; i++) {
        const randomIndex = Math.floor(this.predictableRandom(Math.floor(Date.now() / 500) % 964372 + i) * x.length);
        x[randomIndex] = this.randomSymbol;
      }
      return x.join("");
    },
    predictableRandom(x) {
      let start = Math.pow(x % 97, 4.3) * 232344573;
      const a = 15485863;
      const b = 521791;
      start = (start * a) % b;
      for (let i = 0; i < (x * x) % 90 + 90; i++) {
        start = (start * a) % b;
      }
      return start / b;
    },
    celCycle(x) {
      //                                   Gets trailing number and removes it
      const cels = x.split("-").map(cel => [parseInt(cel, 10), cel.replace(/\d+/u, "")]);
      const totalTime = cels.reduce((acc, cel) => acc + cel[0], 0);
      let tick = (Date.now() / 100) % totalTime;
      let index = -1;
      while (tick >= 0 && index < cels.length - 1) {
        index++;
        tick -= cels[index][0];
      }
      return `<!${cels[index][1]}!>`;
    },
    get randomSymbol() {
      return String.fromCharCode(Math.floor(Math.random() * 50) + 192);
    }
  },
  quotes: new CelestialQuotes("pelle", (function() {
    const wc = function(x) {
      return Pelle.modalTools.wordCycle.bind(Pelle.modalTools)(x);
    };
    const cc = function(x) {
      return Pelle.modalTools.celCycle.bind(Pelle.modalTools)(x);
    };
    const p = function(line) {
      if (!line.includes("[") && !line.includes("<")) return line;

      const sep = "  ---TEMPSEPERATOR---  ";
      const ops = [];
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "[") ops.push(wc);
        else if (line[i] === "<") ops.push(cc);
      }
      let l = line.replace("[", sep).replace("]", sep);
      l = l.replace("<", sep).replace(">", sep).split(sep);
      return () => l.map((v, x) => ((x % 2) ? ops[x / 2 - 0.5](v) : v)).join("");
    };

    const quotesObject = {};
    let iterator = 0;
    for (const i in GameDatabase.celestials.pelle.quotes) {
      iterator++;
      quotesObject[i] = {
        id: iterator,
        lines: GameDatabase.celestials.pelle.quotes[i].map(x => p(x))
      };
    }
    return quotesObject;
  }())),
  hasQuote(x) {
    return player.celestials.pelle.quotes.includes(x);
  },
};

EventHub.logic.on(GAME_EVENT.ARMAGEDDON_AFTER, () => {
  if (Currency.remnants.gte(1)) {
    Pelle.quotes.show(Pelle.quotes.ARM);
  }
});
EventHub.logic.on(GAME_EVENT.PELLE_STRIKE_UNLOCKED, () => {
  if (PelleStrikes.infinity.hasStrike) {
    Pelle.quotes.show(Pelle.quotes.STRIKE_1);
  }
  if (PelleStrikes.powerGalaxies.hasStrike) {
    Pelle.quotes.show(Pelle.quotes.STRIKE_2);
  }
  if (PelleStrikes.eternity.hasStrike) {
    Pelle.quotes.show(Pelle.quotes.STRIKE_3);
  }
  if (PelleStrikes.ECs.hasStrike) {
    Pelle.quotes.show(Pelle.quotes.STRIKE_4);
  }
  if (PelleStrikes.dilation.hasStrike) {
    Pelle.quotes.show(Pelle.quotes.STRIKE_5);
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

export const PelleUpgrade = (function() {
  return mapGameDataToObject(
    GameDatabase.celestials.pelle.upgrades,
    config => (config.rebuyable
      ? new RebuyablePelleUpgradeState(config)
      : new PelleUpgradeState(config)
    )
  );
}());

PelleUpgrade.rebuyables = PelleUpgrade.all.filter(u => u.isRebuyable);
PelleUpgrade.singles = PelleUpgrade.all.filter(u => !u.isRebuyable);
