import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const AD = {
  total: {
    name: dim => {
      if (dim) return `AD ${dim} Multiplier`;
      if (NormalChallenge(12).isRunning) {
        if (MultiplierTabHelper.actualNC12Production().eq(0)) return "Base AD Production from All Dimensions";
        return `Base AD Production from ${MultiplierTabHelper.isNC12ProducingEven() ? "Even" : "Odd"} Dimensions`;
      }
      return "Base AD Production";
    },
    displayOverride: dim => {
      if (dim) {
        const singleMult = NormalChallenge(12).isRunning
          ? MultiplierTabHelper.multInNC12(dim)
          : AntimatterDimension(dim).multiplier;
        return formatX(singleMult, 2, 2);
      }
      const maxTier = EternityChallenge(7).isRunning ? 7 : MultiplierTabHelper.activeDimCount("AD");
      if (NormalChallenge(12).isRunning) return `${format(MultiplierTabHelper.actualNC12Production(), 2)}/sec`;
      return `${format(AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => ad.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)
        .times(AntimatterDimension(maxTier).totalAmount), 2)}/sec`;
    },
    multValue: dim => {
      if (NormalChallenge(12).isRunning) {
        const nc12Prod = MultiplierTabHelper.actualNC12Production();
        if (!dim) return nc12Prod.eq(0) ? 1 : nc12Prod;
        return (MultiplierTabHelper.isNC12ProducingEven() ? dim % 2 === 0 : dim % 2 === 1)
          ? MultiplierTabHelper.multInNC12(dim)
          : DC.D1;
      }
      const mult = dim
        ? AntimatterDimension(dim).multiplier
        : AntimatterDimensions.all
          .filter(ad => ad.isProducing)
          .map(ad => ad.multiplier)
          .reduce((x, y) => x.times(y), DC.D1);
      const highestDim = AntimatterDimension(
        EternityChallenge(7).isRunning ? 7 : MultiplierTabHelper.activeDimCount("AD")).totalAmount;
      return mult.times(highestDim).clampMin(1);
    },
    isActive: dim => (dim ? dim <= MultiplierTabHelper.activeDimCount("AD") : true),
    dilationEffect: () => {
      const baseEff = (player.dilation.active || Enslaved.isRunning)
        ? 0.75 * Effects.product(DilationUpgrade.dilationPenalty)
        : 1;
      return baseEff * (Effarig.isRunning ? Effarig.multDilation : 1);
    },
    isDilated: true,
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
  highestDim: {
    name: () => `Amount of highest Dimension`,
    displayOverride: () => {
      const dim = EternityChallenge(7).isRunning ? 7 : MultiplierTabHelper.activeDimCount("AD");
      return `AD ${dim}, ${format(AntimatterDimension(dim).totalAmount, 2)}`;
    },
    multValue: () => {
      const dim = EternityChallenge(7).isRunning ? 7 : MultiplierTabHelper.activeDimCount("AD");
      return AntimatterDimension(dim).totalAmount;
    },
    isActive: () => AntimatterDimension(1).isProducing,
    icon: MultiplierTabIcons.DIMENSION("AD"),
  },

  dimboost: {
    name: dim => (dim ? `Dimboosts on AD ${dim}` : "Dimboosts"),
    multValue: dim => (dim
      ? DimBoost.multiplierToNDTier(dim)
      : AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => DimBoost.multiplierToNDTier(ad.tier))
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: true,
    icon: MultiplierTabIcons.DIMBOOST,
  },
  sacrifice: {
    name: "Sacrifice Multiplier",
    multValue: dim => ((!dim || dim === 8) ? Sacrifice.totalBoost : DC.D1),
    isActive: dim => (!dim || dim === 8) && Sacrifice.totalBoost.gt(1) && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.SACRIFICE("antimatter"),
  },
  achievementMult: {
    name: "Achievement Multiplier",
    multValue: dim => Decimal.pow(Achievements.power, dim ? 1 : MultiplierTabHelper.activeDimCount("AD")),
    isActive: () => !Pelle.isDoomed && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  achievement: {
    name: "Achievement Rewards",
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
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
    isActive: () => !EternityChallenge(11).isRunning,
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
    isActive: () => PlayerProgress.infinityUnlocked() && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.UPGRADE("infinity"),
  },
  breakInfinityUpgrade: {
    name: "Break Infinity Upgrades",
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
    isActive: () => player.break && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.BREAK_INFINITY,
  },
  infinityPower: {
    name: "Multiplier from Infinity Power",
    fakeValue: () => Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate),
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
    powValue: () => InfinityChallenge(4).reward.effectOrDefault(1),
    isActive: () => player.break && !EternityChallenge(11).isRunning,
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
        // We don't want to double-count the base effect that TS31 boosts
        const infinitiedMult = DC.D1.timesEffectsOf(
          AntimatterDimension(tier).infinityUpgrade,
          BreakInfinityUpgrade.infinitiedMult
        );
        dimMults[tier] = dimMults[tier].times(infinitiedMult.pow(TimeStudy(31).effectOrDefault(1) - 1));

        dimMults[tier] = dimMults[tier].timesEffectsOf(
          tier < 8 ? TimeStudy(71) : null,
          tier === 8 ? TimeStudy(214) : null,
          tier === 1 ? TimeStudy(234) : null,
        );
      }

      if (dim) return allMult.times(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]).times(allMult);
      }
      return totalMult;
    },
    isActive: () => PlayerProgress.eternityUnlocked() && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  eternityChallenge: {
    name: "Eternity Challenges",
    multValue: dim => Decimal.pow(EternityChallenge(10).effectValue,
      dim ? 1 : MultiplierTabHelper.activeDimCount("AD")),
    isActive: () => EternityChallenge(10).isRunning,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  glyph: {
    name: "Glyph Effects",
    multValue: dim => {
      const mult = getAdjustedGlyphEffect("powermult");
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    powValue: () => {
      const totalPow = getAdjustedGlyphEffect("powerpow") * getAdjustedGlyphEffect("effarigdimensions");
      return totalPow * (player.dilation.active ? getAdjustedGlyphEffect("dilationpow") : 1);
    },
    isActive: () => PlayerProgress.realityUnlocked() && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  v: {
    name: "5 V-Achievement Milestone - AD Power based on Space Theorems",
    powValue: () => VUnlocks.adPow.effectOrDefault(1),
    isActive: () => PlayerProgress.realityUnlocked() && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  alchemy: {
    name: "Glyph Alchemy",
    multValue: dim => {
      const mult = AlchemyResource.dimensionality.effectOrDefault(1)
        .times(Currency.realityMachines.value.powEffectOf(AlchemyResource.force));
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    powValue: dim => {
      const basePow = AlchemyResource.power.effectOrDefault(1) * Ra.momentumValue;
      // Not entirely accurate, but returns the geometric mean of all producing dimensions (which should be close)
      // Set to default value of 1 in non-unlocked case (arguably some sort of effect-or-default would be better,
      // but I don't want to risk breaking things).
      let inflationPow = 1;
      if (AlchemyResource.inflation.isUnlocked) {
        if (dim) {
          inflationPow = AntimatterDimension(dim).multiplier.gte(AlchemyResource.inflation.effectValue) ? 1.05 : 1;
        } else {
          const inflated = AntimatterDimensions.all
            .countWhere(ad => ad.isProducing && ad.multiplier.gte(AlchemyResource.inflation.effectValue));
          inflationPow = Math.pow(1.05, inflated / AntimatterDimensions.all.countWhere(ad => ad.isProducing));
        }
      }
      return basePow * inflationPow;
    },
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  pelle: {
    name: "Pelle Upgrades",
    multValue: dim => Decimal.pow(PelleUpgrade.antimatterDimensionMult.effectOrDefault(1),
      dim ? 1 : MultiplierTabHelper.activeDimCount("AD")),
    powValue: () => PelleRifts.paradox.effectOrDefault(DC.D1).toNumber(),
    isActive: () => Pelle.isDoomed && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: dim => {
      const mult = ShopPurchase.dimPurchases.currentMult * ShopPurchase.allDimPurchases.currentMult;
      return Decimal.pow(mult, dim ? 1 : MultiplierTabHelper.activeDimCount("AD"));
    },
    isActive: () => ShopPurchaseData.totalSTD > 0 && !EternityChallenge(11).isRunning,
    icon: MultiplierTabIcons.IAP,
  },

  effectNC: {
    name: dim => (dim ? `Normal Challenge Effect (AD ${dim})` : "Normal Challenge Effects"),
    // Depending on the challenge itself and the game state, this could be either a nerf or a buff, so we make
    // sure to render a x or / conditionally. This requires we calculate the value itself again, however
    displayOverride: dim => {
      const formatFn = num => (num.gte(1) ? formatX(num, 2, 2) : `/${format(num.reciprocal(), 2, 2)}`);

      let dimMults = Array.repeat(DC.D1, 9);
      if (NormalChallenge(2).isRunning) {
        dimMults = Array.repeat(new Decimal(player.chall2Pow), 9);
      }
      if (NormalChallenge(3).isRunning) {
        dimMults[1] = dimMults[1].times(player.chall3Pow);
      }

      if (NormalChallenge(12).isRunning) {
        dimMults[2] = AntimatterDimension(2).totalAmount.pow(0.6);
        dimMults[4] = AntimatterDimension(4).totalAmount.pow(0.4);
        dimMults[6] = AntimatterDimension(6).totalAmount.pow(0.2);
      }

      if (dim) return formatFn(dimMults[dim]);
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]);
      }
      return formatFn(totalMult);
    },
    // This and displayOverride contain largely the same code
    multValue: dim => {
      let dimMults = Array.repeat(DC.D1, 9);
      // Do not change this to an else-if, as NC2/NC3 need to be enterable simultaneously in IC1
      if (NormalChallenge(2).isRunning) {
        dimMults = Array.repeat(new Decimal(player.chall2Pow), 9);
      }
      if (NormalChallenge(3).isRunning) {
        dimMults[1] = dimMults[1].times(player.chall3Pow);
      }

      // Legacy behavior for NC12 we're preserving dictates that it boosts production based on dimension amount
      // without actually increasing the multiplier itself, so this effectively turns the powers in the production
      // code info effective multipliers raised to pow-1
      if (NormalChallenge(12).isRunning) {
        dimMults[2] = AntimatterDimension(2).totalAmount.pow(0.6);
        dimMults[4] = AntimatterDimension(4).totalAmount.pow(0.4);
        dimMults[6] = AntimatterDimension(6).totalAmount.pow(0.2);

        // We have to hide this when producing odd or when referencing a dimension which has no amount, but then we
        // also need to total up the multipliers when on the grouped layout. No amount evaluates to zero, so in all
        // those cases we use 1 instead in order to calculate properly
        if (!MultiplierTabHelper.isNC12ProducingEven()) return DC.D1;
        if (dim) return dimMults[dim].neq(0) ? dimMults[dim] : DC.D1;
        let totalNC12 = DC.D1;
        for (let d = 2; d <= 6; d += 2) totalNC12 = totalNC12.times(dimMults[d].clampMin(1));
        return totalNC12;
      }

      if (dim) return dimMults[dim];
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]);
      }
      return totalMult;
    },
    isActive: () => [2, 3, 12].some(c => NormalChallenge(c).isRunning),
    icon: MultiplierTabIcons.CHALLENGE("infinity"),
  },
  nerfIC: {
    name: dim => (dim ? `Infinity Challenge Nerf (AD ${dim})` : "Infinity Challenge Nerf"),
    multValue: dim => {
      let dimMults = Array.repeat(DC.D1, 9);
      if (InfinityChallenge(4).isRunning) {
        for (let tier = 1; tier <= 8; tier++) {
          if (player.postC4Tier !== tier) {
            dimMults[tier] = dimMults[tier].pow(1 - InfinityChallenge(4).effectValue).reciprocal();
          }
        }
      } else if (InfinityChallenge(6).isRunning) {
        dimMults = Array.repeat(DC.D1.dividedByEffectOf(InfinityChallenge(6)), 9);
      } else if (InfinityChallenge(8).isRunning) {
        dimMults = Array.repeat(DC.D1.timesEffectsOf(InfinityChallenge(8)), 9);
      }

      if (dim) return dimMults[dim];
      let totalMult = DC.D1;
      for (let tier = 1; tier <= MultiplierTabHelper.activeDimCount("AD"); tier++) {
        totalMult = totalMult.times(dimMults[tier]);
      }
      return totalMult;
    },
    isActive: () => [4, 6, 8].some(ic => InfinityChallenge(ic).isRunning),
    icon: MultiplierTabIcons.CHALLENGE("infinity"),
  },
  nerfV: {
    name: "V's Reality",
    powValue: () => 0.5,
    isActive: () => V.isRunning,
    icon: MultiplierTabIcons.GENERIC_V,
  },
  nerfCursed: {
    name: "Cursed Glyphs",
    powValue: () => getAdjustedGlyphEffect("curseddimensions"),
    isActive: () => getAdjustedGlyphEffect("curseddimensions") !== 1,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("cursed"),
  },
  nerfPelle: {
    name: "Doomed Reality",
    multValue: 0.1,
    powValue: () => (PelleStrikes.infinity.hasStrike ? 0.5 : 1),
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  }
};
