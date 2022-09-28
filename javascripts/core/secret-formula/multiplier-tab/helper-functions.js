import { DC } from "../../../core/constants";

export const MultiplierTabHelper = {
  // Helper method for counting enabled dimensions
  activeDimCount(type) {
    switch (type) {
      case "AD":
        return AntimatterDimensions.all.filter(ad => ad.isProducing).length;
      case "ID":
        return InfinityDimensions.all.filter(id => id.isProducing).length;
      case "TD":
        return TimeDimensions.all.filter(td => td.isProducing).length;
      default:
        throw new Error("Unrecognized Dimension type in Multiplier tab GameDB entry");
    }
  },

  // Helper method for galaxy strength multipliers affecting all galaxy types (this is used a large number of times)
  globalGalaxyMult() {
    return Effects.product(
      InfinityUpgrade.galaxyBoost,
      InfinityUpgrade.galaxyBoost.chargedEffect,
      BreakInfinityUpgrade.galaxyBoost,
      TimeStudy(212),
      TimeStudy(232),
      Achievement(86),
      Achievement(178),
      InfinityChallenge(5).reward,
      PelleUpgrade.galaxyPower,
      PelleRifts.decay.milestones[1]
    );
  },

  // Helper method for galaxies and tickspeed, broken up as contributions of tickspeed*log(perGalaxy) and galaxyCount to
  // their product, which is proportional to log(tickspeed)
  decomposeTickspeed() {
    let effectiveCount = effectiveBaseGalaxies();
    const effects = this.globalGalaxyMult();

    let galFrac, tickFrac;
    if (effectiveCount < 3) {
      let baseMult = 1.1245;
      if (player.galaxies === 1) baseMult = 1.11888888;
      if (player.galaxies === 2) baseMult = 1.11267177;
      if (NormalChallenge(5).isRunning) {
        baseMult = 1.08;
        if (player.galaxies === 1) baseMult = 1.07632;
        if (player.galaxies === 2) baseMult = 1.072;
      }
      // This is needed for numerical consistency with the other conditional case
      baseMult /= 0.965 ** 2;
      const logBase = Math.log10(baseMult);

      const perGalaxy = 0.02 * effects;
      effectiveCount *= Pelle.specialGlyphEffect.power;

      tickFrac = Tickspeed.totalUpgrades * logBase;
      galFrac = -Math.log10(Math.max(0.01, 1 / baseMult - (effectiveCount * perGalaxy))) / logBase;
    } else {
      effectiveCount -= 2;
      effectiveCount *= effects;
      effectiveCount *= getAdjustedGlyphEffect("realitygalaxies") * (1 + ImaginaryUpgrade(9).effectOrDefault(0));
      effectiveCount *= Pelle.specialGlyphEffect.power;

      // These all need to be framed as INCREASING x/sec tick rate (ie. all multipliers > 1, all logs > 0)
      const baseMult = 0.965 ** 2 / (NormalChallenge(5).isRunning ? 0.83 : 0.8);
      const logBase = Math.log10(baseMult);
      const logPerGalaxy = -DC.D0_965.log10();

      tickFrac = Tickspeed.totalUpgrades * logBase;
      galFrac = (1 + effectiveCount / logBase * logPerGalaxy);
    }

    const sum = tickFrac + galFrac;
    return {
      tickspeed: tickFrac / sum,
      galaxies: galFrac / sum,
    };
  },

  // Helper method to check for whether an achievement affects a particular dimension or not. Format of dimStr is
  // expected to be a three-character string "XXN", eg. "AD3" or "TD2"
  achievementDimCheck(ach, dimStr) {
    switch (ach) {
      case 23:
        return dimStr === "AD8";
      case 28:
      case 31:
      case 68:
      case 71:
        return dimStr === "AD1";
      case 94:
        return dimStr === "ID1";
      case 34:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) !== 8;
      case 64:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) <= 4;
      default:
        return true;
    }
  },

  // Helper method to check for whether a time study affects a particular dimension or not, see achievementDimCheck()
  timeStudyDimCheck(ts, dimStr) {
    switch (ts) {
      case 11:
        return dimStr === "TD1";
      case 71:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) !== 8;
      case 72:
        return dimStr === "ID4";
      case 73:
        return dimStr === "TD3";
      case 214:
        return dimStr === "AD8";
      case 227:
        return dimStr === "TD4";
      case 234:
        return dimStr === "AD1";
      default:
        return true;
    }
  },

  // Helper method to check for whether an IC reward affects a particular dimension or not, see achievementDimCheck()
  ICDimCheck(ic, dimStr) {
    switch (ic) {
      case 1:
      case 6:
        return dimStr.substr(0, 2) === "ID";
      case 3:
      case 4:
        return dimStr.substr(0, 2) === "AD";
      case 8:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) > 1 && Number(dimStr.charAt(2)) < 8;
      default:
        return false;
    }
  },

  // Helper method to check for whether an EC reward affects a particular dimension or not, see achievementDimCheck()
  ECDimCheck(ec, dimStr) {
    switch (ec) {
      case 1:
      case 10:
        return dimStr.substr(0, 2) === "TD";
      case 2:
        return dimStr === "ID1";
      case 4:
      case 9:
        return dimStr.substr(0, 2) === "ID";
      default:
        return false;
    }
  },
};

// All the resource files in this GameDB folder set props of multiplierTabValues, but it needs to be initialized.
// This file comes first in the import order and thus will make sure that nothing else attempts to define a prop
// on an undefined object
GameDatabase.multiplierTabValues = {};
