import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.TD = {
  total: {
    name: dim => (dim ? `TD ${dim} Multiplier` : "All TD Multipliers"),
    multValue: dim => (dim
      ? TimeDimension(dim).multiplier
      : TimeDimensions.all
        .filter(td => td.isProducing)
        .map(td => td.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: dim => TimeDimension(dim ?? 1).isProducing,
    overlay: ["Δ", "<i class='fa-solid fa-cube' />"],
    icon: dim => MultiplierTabIcons.DIMENSION("TD", dim),
  },
  purchase: {
    name: dim => (dim ? `Purchased TD ${dim}` : "Purchases"),
    multValue: dim => {
      const getMult = td => {
        const d = TimeDimension(td);
        const bought = td === 8 ? Math.clampMax(d.bought, 1e8) : d.bought;
        return Decimal.pow(d.powerMultiplier, bought);
      };
      if (dim) return getMult(dim);
      return TimeDimensions.all
        .filter(td => td.isProducing)
        .map(td => getMult(td.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => !EternityChallenge(2).isRunning && !EternityChallenge(10).isRunning,
    icon: dim => MultiplierTabIcons.PURCHASE("TD", dim),
  },

  basePurchase: {
    name: () => "Base purchases",
    multValue: dim => {
      const getMult = td => Decimal.pow(4,
        td === 8 ? Math.clampMax(TimeDimension(td).bought, 1e8) : TimeDimension(td).bought);
      if (dim) return getMult(dim);
      return TimeDimensions.all
        .filter(td => td.isProducing)
        .map(td => getMult(td.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: dim => (dim
      ? ImaginaryUpgrade(14).canBeApplied || (dim === 8 && GlyphSacrifice.time.effectValue > 1)
      : TimeDimension(1).isProducing),
    icon: dim => MultiplierTabIcons.PURCHASE("TD", dim),
  },
  timeGlyphSacrifice: {
    name: () => "Time Glyph Sacrifice",
    multValue: () => (TimeDimension(8).isProducing
      ? Decimal.pow(GlyphSacrifice.time.effectValue, Math.clampMax(TimeDimension(8).bought, 1e8))
      : DC.D1),
    isActive: () => GlyphSacrifice.time.effectValue > 1,
    icon: MultiplierTabIcons.SACRIFICE("time"),
  },
  powPurchase: {
    name: () => "Power effect from Imaginary Upgrades",
    powValue: () => ImaginaryUpgrade(14).effectOrDefault(1),
    isActive: () => ImaginaryUpgrade(14).canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("imaginary"),
  },

  achievement: {
    name: () => "Achievements",
    multValue: dim => {
      const baseMult = DC.D1.timesEffectsOf(
        Achievement(105),
        Achievement(128),
        EternityUpgrade.tdMultAchs,
      );
      return Decimal.pow(baseMult, dim ? 1 : MultiplierTabHelper.activeDimCount("TD"));
    },
    isActive: () => Achievement(75).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: dim => (dim
      ? `Time Studies and Eternity Upgrades (TD ${dim})`
      : "Time Studies and Eternity Upgrades"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        TimeStudy(93),
        TimeStudy(103),
        TimeStudy(151),
        TimeStudy(221),
        TimeStudy(301),
        EternityUpgrade.tdMultTheorems,
        EternityUpgrade.tdMultRealTime,
      );

      const dimMults = Array.repeat(DC.D1, 9);
      for (let tier = 1; tier <= 8; tier++) {
        dimMults[tier] = dimMults[tier].timesEffectsOf(
          tier === 1 ? TimeStudy(11) : null,
          tier === 3 ? TimeStudy(73) : null,
          tier === 4 ? TimeStudy(227) : null
        );
      }

      if (dim) return allMult.times(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("TD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]).times(allMult);
      }
      return totalMult;
    },
    isActive: () => TimeDimension(1).isProducing,
    icon: MultiplierTabIcons.TIME_STUDY
  },
  eternityChallenge: {
    name: dim => (dim ? `Eternity Challenges (TD ${dim})` : "Eternity Challenges"),
    multValue: dim => {
      let allMult = DC.D1.timesEffectsOf(
        EternityChallenge(1).reward,
        EternityChallenge(10).reward,
      );
      if (EternityChallenge(9).isRunning) {
        allMult = allMult.times(
          Decimal.pow(Math.clampMin(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate / 7)
            .log2(), 1), 4).clampMin(1));
      }
      return Decimal.pow(allMult, dim ? 1 : MultiplierTabHelper.activeDimCount("TD"));
    },
    isActive: () => EternityChallenge(1).completions > 0,
    icon: MultiplierTabIcons.CHALLENGE("eternity")
  },
  glyph: {
    name: () => "Glyph Effects",
    multValue: () => 1,
    powValue: () => getAdjustedGlyphEffect("timepow") * getAdjustedGlyphEffect("effarigdimensions"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH
  },
  alchemy: {
    name: () => {
      const imStr = MachineHandler.isIMUnlocked ? " and Imaginary Upgrades" : "";
      return `Glyph Alchemy${imStr}`;
    },
    multValue: dim => {
      const mult = DC.D1.timesEffectsOf(
        AlchemyResource.dimensionality,
        ImaginaryUpgrade(11),
      );
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("TD"));
    },
    powValue: () => AlchemyResource.time.effectOrDefault(1) * Ra.momentumValue,
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  other: {
    name: () => "Other sources",
    multValue: dim => {
      const mult = new Decimal(ShopPurchase.allDimPurchases.currentMult).timesEffectsOf(
        Replicanti.areUnlocked && Replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
        Pelle.isDoomed ? null : RealityUpgrade(22),
        PelleRifts.chaos
      );
      const maxActiveDim = MultiplierTabHelper.activeDimCount("TD");
      return Decimal.pow(mult, dim ? 1 : maxActiveDim);
    },
    powValue: () => PelleRifts.paradox.effectOrDefault(1),
    isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    icon: MultiplierTabIcons.OTHER,
  },
};
