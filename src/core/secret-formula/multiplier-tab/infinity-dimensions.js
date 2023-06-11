import { DC } from "../../constants";
import { PlayerProgress } from "../../player-progress";

import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const ID = {
  total: {
    name: dim => {
      if (dim) return `ID ${dim} Multiplier`;
      if (EternityChallenge(7).isRunning) return "AD7 Production";
      return "Infinity Power Production";
    },
    displayOverride: dim => (dim
      ? formatX(InfinityDimension(dim).multiplier, 2)
      : `${format(InfinityDimension(1).productionPerSecond, 2)}/sec`
    ),
    multValue: dim => (dim
      ? InfinityDimension(dim).multiplier
      : InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => id.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: dim => (dim
      ? InfinityDimension(dim).isProducing
      : (PlayerProgress.eternityUnlocked() || InfinityDimension(1).isProducing)),
    dilationEffect: () => {
      const baseEff = player.dilation.active
        ? 0.75 * Effects.product(DilationUpgrade.dilationPenalty)
        : 1;
      return baseEff * (Effarig.isRunning ? Effarig.multDilation : 1);
    },
    isDilated: true,
    overlay: ["∞", "<i class='fa-solid fa-cube' />"],
    icon: dim => MultiplierTabIcons.DIMENSION("ID", dim),
  },
  purchase: {
    name: dim => (dim ? `Purchased ID ${dim}` : "Purchases"),
    multValue: dim => {
      const getMult = id => Decimal.pow(InfinityDimension(id).powerMultiplier,
        Math.floor(InfinityDimension(id).baseAmount / 10));
      if (dim) return getMult(dim);
      return InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => getMult(id.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => !EternityChallenge(2).isRunning && !EternityChallenge(10).isRunning,
    icon: dim => MultiplierTabIcons.PURCHASE("ID", dim),
  },
  highestDim: {
    name: () => `Amount of highest Dimension`,
    displayOverride: () => {
      const dim = MultiplierTabHelper.activeDimCount("ID");
      return `ID ${dim}, ${format(InfinityDimension(dim).amount, 2)}`;
    },
    multValue: () => InfinityDimension(MultiplierTabHelper.activeDimCount("ID")).amount,
    isActive: () => InfinityDimension(1).isProducing,
    icon: MultiplierTabIcons.DIMENSION("ID"),
  },

  basePurchase: {
    name: "Base purchases",
    multValue: dim => {
      const getMult = id => {
        const purchases = id === 8
          ? Math.floor(InfinityDimension(id).baseAmount / 10)
          : Math.min(InfinityDimensions.HARDCAP_PURCHASES, Math.floor(InfinityDimension(id).baseAmount / 10));
        const baseMult = InfinityDimension(id)._powerMultiplier;
        return Decimal.pow(baseMult, purchases);
      };
      if (dim) return getMult(dim);
      return InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => getMult(id.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: true,
    icon: MultiplierTabIcons.PURCHASE("baseID"),
  },
  tesseractPurchase: {
    name: "Tesseracts",
    multValue: dim => {
      const getMult = id => {
        if (id === 8) return DC.D1;
        const purchases = Math.floor(InfinityDimension(id).baseAmount / 10);
        return Decimal.pow(InfinityDimension(id)._powerMultiplier,
          Math.clampMin(purchases - InfinityDimensions.HARDCAP_PURCHASES, 0));
      };
      if (dim) return getMult(dim);
      return InfinityDimensions.all
        .filter(id => id.isProducing)
        .map(id => getMult(id.tier))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => Tesseracts.bought > 0,
    icon: MultiplierTabIcons.PURCHASE("tesseractID"),
  },
  infinityGlyphSacrifice: {
    name: "Infinity Glyph sacrifice",
    multValue: () => (InfinityDimension(8).isProducing
      ? Decimal.pow(GlyphSacrifice.infinity.effectValue, Math.floor(InfinityDimension(8).baseAmount / 10))
      : DC.D1),
    isActive: () => GlyphSacrifice.infinity.effectValue > 1,
    icon: MultiplierTabIcons.SACRIFICE("infinity"),
  },
  powPurchase: {
    name: "Imaginary Upgrade - Recollection of Intrusion",
    powValue: () => ImaginaryUpgrade(14).effectOrDefault(1),
    isActive: () => ImaginaryUpgrade(14).canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("imaginary"),
  },

  replicanti: {
    name: "Replicanti Multiplier",
    multValue: dim => Decimal.pow(replicantiMult(), dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => Replicanti.areUnlocked,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("replication"),
  },
  achievementMult: {
    name: "Achievement Multiplier",
    multValue: dim => Decimal.pow(Achievements.power, dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => Achievement(75).canBeApplied && !Pelle.isDoomed,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  achievement: {
    // Note: This only applies to ID1
    name: () => "Achievement 94",
    multValue: dim => ((dim ?? 1) === 1 ? Achievement(94).effectOrDefault(1) : 1),
    isActive: () => Achievement(94).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  timeStudy: {
    name: dim => (dim ? `Time Studies (ID ${dim})` : "Time Studies"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        TimeStudy(82),
        TimeStudy(92),
        TimeStudy(162)
      );
      if (dim) return dim === 4 ? allMult.times(TimeStudy(72).effectOrDefault(1)) : allMult;
      const maxActiveDim = MultiplierTabHelper.activeDimCount("ID");
      return Decimal.pow(allMult, maxActiveDim).times(maxActiveDim >= 4 ? TimeStudy(72).effectOrDefault(1) : DC.D1);
    },
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.TIME_STUDY,
  },
  eternityUpgrade: {
    name: "Eternity Upgrades",
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        EternityUpgrade.idMultEP,
        EternityUpgrade.idMultEternities,
        EternityUpgrade.idMultICRecords,
      );
      return Decimal.pow(allMult, dim ? 1 : MultiplierTabHelper.activeDimCount("ID"));
    },
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.UPGRADE("eternity"),
  },

  eu1: {
    name: () => "Unspent Eternity Points",
    multValue: dim => Decimal.pow(EternityUpgrade.idMultEP.effectOrDefault(1),
      dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => EternityUpgrade.idMultEP.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("eternity"),
  },
  eu2: {
    name: () => "Eternity Count",
    multValue: dim => Decimal.pow(EternityUpgrade.idMultEternities.effectOrDefault(1),
      dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => EternityUpgrade.idMultEternities.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("eternity"),
  },
  eu3: {
    name: () => "Infinity Challenge Records",
    multValue: dim => Decimal.pow(EternityUpgrade.idMultICRecords.effectOrDefault(1),
      dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => EternityUpgrade.idMultICRecords.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("eternity"),
  },

  infinityChallenge: {
    name: "Infinity Challenges",
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        InfinityChallenge(1).reward,
        InfinityChallenge(6).reward,
      );
      return Decimal.pow(allMult, dim ? 1 : MultiplierTabHelper.activeDimCount("ID"));
    },
    isActive: () => InfinityChallenge(1).isCompleted,
    icon: MultiplierTabIcons.CHALLENGE("infinity"),
  },
  eternityChallenge: {
    name: dim => (dim ? `Eternity Challenges (ID ${dim})` : " Eternity Challenges"),
    multValue: dim => {
      const allMult = DC.D1.timesEffectsOf(
        EternityChallenge(4).reward,
        EternityChallenge(9).reward,
      ).times(EternityChallenge(7).isRunning ? Tickspeed.perSecond : DC.D1);
      if (dim) {
        if (dim === 1) return allMult.times(EternityChallenge(2).reward.effectOrDefault(1));
        return allMult;
      }
      const maxActiveDim = MultiplierTabHelper.activeDimCount("ID");
      return Decimal.pow(allMult, maxActiveDim)
        .times(maxActiveDim >= 1 ? EternityChallenge(2).reward.effectOrDefault(1) : DC.D1);
    },
    isActive: () => EternityChallenge(2).completions > 0,
    icon: MultiplierTabIcons.CHALLENGE("eternity"),
  },
  tickspeed: {
    name: () => "Tickspeed (EC7)",
    displayOverride: () => {
      const tickRate = Tickspeed.perSecond;
      const activeDims = MultiplierTabHelper.activeDimCount("ID");
      const dimString = MultiplierTabHelper.pluralizeDimensions(activeDims);
      return `${format(tickRate, 2, 2)}/sec on ${formatInt(activeDims)} ${dimString}
        ➜ ${formatX(tickRate.pow(activeDims), 2, 2)}`;
    },
    multValue: () => Tickspeed.perSecond.pow(8),
    isActive: () => EternityChallenge(7).isRunning,
    icon: MultiplierTabIcons.TICKSPEED,
  },
  glyph: {
    name: "Glyph Effects",
    multValue: () => 1,
    powValue: () => getAdjustedGlyphEffect("infinitypow") * getAdjustedGlyphEffect("effarigdimensions"),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH,
  },
  alchemy: {
    name: "Glyph Alchemy",
    multValue: dim => Decimal.pow(AlchemyResource.dimensionality.effectOrDefault(1),
      dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    powValue: () => AlchemyResource.infinity.effectOrDefault(1) * Ra.momentumValue,
    isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    icon: MultiplierTabIcons.ALCHEMY,
  },
  imaginaryUpgrade: {
    name: "Imaginary Upgrade - Hyperbolic Apeirogon",
    multValue: dim => Decimal.pow(ImaginaryUpgrade(8).effectOrDefault(1),
      dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => ImaginaryUpgrade(8).canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("imaginary"),
  },
  pelle: {
    name: "Pelle Rift Effects",
    multValue: dim => {
      const mult = DC.D1.timesEffectsOf(PelleRifts.recursion.milestones[1]);
      const maxActiveDim = MultiplierTabHelper.activeDimCount("ID");
      // This only affects ID1
      const decayMult = ((dim ? dim === 1 : maxActiveDim >= 1)
        ? PelleRifts.decay.milestones[0].effectOrDefault(1)
        : DC.D1);
      return Decimal.pow(mult, dim ? 1 : maxActiveDim).times(decayMult);
    },
    powValue: () => PelleRifts.paradox.effectOrDefault(DC.D1).toNumber(),
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  },
  iap: {
    name: "Shop Tab Purchases",
    multValue: dim => Decimal.pow(ShopPurchase.allDimPurchases.currentMult,
      dim ? 1 : MultiplierTabHelper.activeDimCount("ID")),
    isActive: () => ShopPurchaseData.totalSTD > 0,
    icon: MultiplierTabIcons.IAP,
  },

  powerConversion: {
    name: "Infinity Power Conversion",
    powValue: () => InfinityDimensions.powerConversionRate,
    isActive: () => Currency.infinityPower.value.gt(1) && !EternityChallenge(9).isRunning,
    icon: MultiplierTabIcons.IPOW_CONVERSION,
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
    powValue: 0.5,
    isActive: () => PelleStrikes.powerGalaxies.hasStrike,
    icon: MultiplierTabIcons.PELLE,
  }
};
