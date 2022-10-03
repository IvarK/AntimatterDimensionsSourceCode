import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.AD = {
  total: {
    name: dim => (dim ? `AD ${dim} Multiplier` : "All AD Multipliers"),
    multValue: dim => (dim
      ? AntimatterDimension(dim).multiplier
      : AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => ad.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: dim => AntimatterDimension(dim ?? 1).isProducing,
    overlay: ["Ω", "<i class='fas fa-cube' />"],
    icon: dim => MultiplierTabIcons.DIMENSION("AD", dim),
  },
  purchase: {
    name: dim => (dim ? `Purchased AD ${dim}` : "Purchases"),
    multValue: dim => {
      const getPurchases = ad => (Laitela.continuumActive
        ? AntimatterDimension(ad).continuumValue
        : Math.floor(AntimatterDimension(ad).bought / 10)
      );
      if (dim) return Decimal.pow(AntimatterDimensions.buyTenMultiplier, getPurchases(dim));
      return AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => Decimal.pow(AntimatterDimensions.buyTenMultiplier, getPurchases(ad.tier)))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => !EternityChallenge(11).isRunning,
    icon: dim => MultiplierTabIcons.PURCHASE("AD", dim),
  },
  dimboost: {
    name: dim => (dim ? `Dimboosts on AD ${dim}` : "Dimboosts"),
    multValue: dim => (dim
      ? DimBoost.multiplierToNDTier(dim)
      : AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => DimBoost.multiplierToNDTier(ad.tier))
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: () => true,
    icon: MultiplierTabIcons.DIMBOOST,
  },
  sacrifice: {
    name: () => "Sacrifice Multiplier",
    multValue: dim => ((!dim || dim === 8) ? Sacrifice.totalBoost : DC.D1),
    isActive: dim => (!dim || dim === 8) && Sacrifice.totalBoost.gt(1),
    icon: MultiplierTabIcons.SACRIFICE("antimatter"),
  },
  achievement: {
    name: () => "Achievements",
    multValue: dim => {
      const allMult = new Decimal(Achievements.power).timesEffectsOf(
        Achievement(48),
        Achievement(56),
        Achievement(65),
        Achievement(72),
        Achievement(73),
        Achievement(74),
        Achievement(76),
        Achievement(84),
        Achievement(91),
        Achievement(92)
      );

      const dimMults = Array.repeat(DC.D1, 9);
      for (let tier = 1; tier <= 8; tier++) {
        if (tier === 1) {
          dimMults[tier] = dimMults[tier].timesEffectsOf(
            Achievement(28),
            Achievement(31),
            Achievement(68),
            Achievement(71),
          );
        }
        dimMults[tier] = dimMults[tier].timesEffectsOf(
          tier === 8 ? Achievement(23) : null,
          tier < 8 ? Achievement(34) : null,
          tier <= 4 ? Achievement(64) : null,
        );
        if (Achievement(43).isUnlocked) {
          dimMults[tier] = dimMults[tier].times(1 + tier / 100);
        }
      }

      if (dim) return allMult.times(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]).times(allMult);
      }
      return totalMult;
    },
    powValue: () => Achievement(183).effectOrDefault(1),
    isActive: () => true,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  infinityUpgrade: {
    name: dim => (dim ? `Infinity Upgrades (AD ${dim})` : "Infinity Upgrades"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        InfinityUpgrade.totalTimeMult,
        InfinityUpgrade.thisInfinityTimeMult,
      );

      const dimMults = Array.repeat(DC.D1, 9);
      for (let tier = 1; tier <= 8; tier++) {
        if (tier === 1) {
          dimMults[tier] = dimMults[tier].timesEffectsOf(
            InfinityUpgrade.unspentIPMult,
            InfinityUpgrade.unspentIPMult.chargedEffect,
          );
        }
        dimMults[tier] = dimMults[tier].timesEffectsOf(
          AntimatterDimension(tier).infinityUpgrade,
        );
      }

      if (dim) return allMult.times(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]).times(allMult);
      }
      return totalMult;
    },
    powValue: dim => {
      const allPow = InfinityUpgrade.totalTimeMult.chargedEffect.effectOrDefault(1) *
          InfinityUpgrade.thisInfinityTimeMult.chargedEffect.effectOrDefault(1);

      const dimPow = Array.repeat(1, 9);
      for (let tier = 1; tier <= 8; tier++) {
        dimPow[tier] = AntimatterDimension(tier).infinityUpgrade.chargedEffect.effectOrDefault(1);
      }

      if (dim) return allPow * dimPow[dim];
      // This isn't entirely accurate because you can't return a power for all ADs if only some of them actually have
      // it, so we cheat somewhat by returning the geometric mean of all actively producing dimensions (this should
      // be close to the same value if all the base multipliers are similar in magnitude)
      return allPow * Math.exp(dimPow.slice(1)
        .map(n => Math.log(n)).sum() / MultiplierTabHelper.activeDimCount("AD"));
    },
    isActive: () => PlayerProgress.infinityUnlocked(),
    icon: MultiplierTabIcons.UPGRADE("infinity"),
  },
  breakInfinityUpgrade: {
    name: () => "Break Infinity Upgrades",
    multValue: dim => {
      const mult = DC.D1.timesEffectsOf(
        BreakInfinityUpgrade.totalAMMult,
        BreakInfinityUpgrade.currentAMMult,
        BreakInfinityUpgrade.achievementMult,
        BreakInfinityUpgrade.slowestChallengeMult,
        BreakInfinityUpgrade.infinitiedMult
      );
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    isActive: () => player.break,
    icon: MultiplierTabIcons.BREAK_INFINITY,
  },
  infinityPower: {
    name: () => "Infinity Power",
    multValue: dim => {
      const mult = Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate).max(1);
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    isActive: () => Currency.infinityPower.value.gt(1) && !EternityChallenge(9).isRunning,
    icon: MultiplierTabIcons.INFINITY_POWER,
  },
  infinityChallenge: {
    name: dim => (dim ? `Infinity Challenges (AD ${dim})` : "Infinity Challenges"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        InfinityChallenge(3),
        InfinityChallenge(3).reward,
      );

      const dimMults = Array.repeat(DC.D1, 9);
      for (let tier = 1; tier <= 8; tier++) {
        dimMults[tier] = dimMults[tier].timesEffectsOf(
          tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null
        );
      }

      if (dim) return allMult.times(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]).times(allMult);
      }
      return totalMult;
    },
    powValue: () => (InfinityChallenge(4).isCompleted ? InfinityChallenge(4).reward.effectValue : 1),
    isActive: () => player.break,
    icon: MultiplierTabIcons.CHALLENGE("infinity"),
  },
  timeStudy: {
    name: dim => (dim ? `Time Studies (AD ${dim})` : "Time Studies"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        TimeStudy(91),
        TimeStudy(101),
        TimeStudy(161),
        TimeStudy(193),
      );

      const dimMults = Array.repeat(DC.D1, 9);
      for (let tier = 1; tier <= 8; tier++) {
        if (tier === 1) {
          dimMults[tier] = dimMults[tier].timesEffectsOf(
            TimeStudy(234)
          );
        }

        // We don't want to double-count the base effect that TS31 boosts
        const infinitiedMult = DC.D1.timesEffectsOf(
          AntimatterDimension(tier).infinityUpgrade,
          BreakInfinityUpgrade.infinitiedMult
        );
        dimMults[tier] = dimMults[tier].times(infinitiedMult.pow(TimeStudy(31).effectOrDefault(1) - 1));

        dimMults[tier] = dimMults[tier].timesEffectsOf(
          tier < 8 ? TimeStudy(71) : null,
          tier === 8 ? TimeStudy(214) : null,
        );
      }

      if (dim) return allMult.times(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]).times(allMult);
      }
      return totalMult;
    },
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  eternityChallenge: {
    name: () => "Eternity Challenges",
    multValue: dim => Decimal.pow(EternityChallenge(10).effectValue,
      dim ? 1 : MultiplierTabHelper.activeDimCount("AD")),
    isActive: () => EternityChallenge(10).isRunning,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  glyph: {
    name: () => "Glyph Effects",
    multValue: dim => {
      const mult = getAdjustedGlyphEffect("powermult");
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    powValue: () => getAdjustedGlyphEffect("powerpow") * getAdjustedGlyphEffect("effarigdimensions"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  alchemy: {
    name: () => "Glyph Alchemy",
    multValue: dim => {
      const mult = AlchemyResource.dimensionality.effectOrDefault(1)
        .times(Currency.realityMachines.value.powEffectOf(AlchemyResource.force));
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    powValue: () => AlchemyResource.power.effectOrDefault(1) * Ra.momentumValue,
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  other: {
    name: () => "Other sources",
    multValue: dim => {
      const mult = ShopPurchase.dimPurchases.currentMult * ShopPurchase.allDimPurchases.currentMult;
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    powValue: () => VUnlocks.adPow.effectOrDefault(1) * PelleRifts.paradox.effectOrDefault(1),
    isActive: () => player.IAP.totalSTD > 0 || PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.OTHER,
  },
};
