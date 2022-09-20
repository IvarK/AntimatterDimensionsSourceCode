import { DC } from "../../../core/constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

// Helper method for counting enabled dimensions
function activeDimCount(type) {
  switch (type) {
    case "antimatter":
      return AntimatterDimensions.all.filter(ad => ad.isProducing).length;
    case "infinity":
      return InfinityDimensions.all.filter(id => id.isProducing).length;
    case "time":
      return 0;
    default:
      throw new Error("Unrecognized Dimension type in Multiplier tab GameDB entry");
  }
}

GameDatabase.multiplierTabValues = {
  AD: {
    total: {
      name: dim => (dim ? `Total AD ${dim} Multiplier` : "All AD Multipliers"),
      multValue: dim => (dim
        ? AntimatterDimension(dim).multiplier
        : AntimatterDimensions.all
          .filter(ad => ad.isProducing)
          .map(ad => ad.multiplier)
          .reduce((x, y) => x.times(y), DC.D1)),
      isActive: dim => AntimatterDimension(dim ?? 1).isProducing,
    },
    purchase: {
      name: dim => (dim ? `AD ${dim} from Purchases` : "Total from Purchases"),
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
    },
    dimboost: {
      name: dim => (dim ? `AD ${dim} from Dimboosts` : "Total from Dimboosts"),
      multValue: dim => (dim
        ? DimBoost.multiplierToNDTier(dim)
        : AntimatterDimensions.all
          .filter(ad => ad.isProducing)
          .map(ad => DimBoost.multiplierToNDTier(ad.tier))
          .reduce((x, y) => x.times(y), DC.D1)),
      isActive: () => true,
    },
    sacrifice: {
      name: dim => (dim ? "AD 8 from Sacrifice" : "Sacrifice Multiplier"),
      multValue: dim => ((!dim || dim === 8) ? Sacrifice.totalBoost : DC.D1),
      isActive: dim => (!dim || dim === 8) && Sacrifice.totalBoost.gt(1),
    },
    achievement: {
      name: dim => (dim ? `AD ${dim} from Achievements` : "Total from Achievements"),
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
        for (let tier = 1; tier <= activeDimCount("antimatter"); tier++) {
          totalMult = totalMult.times(dimMults[tier]).times(allMult);
        }
        return totalMult;
      },
      powValue: () => Achievement(183).effectOrDefault(1),
      isActive: () => true,
    },
    infinityUpgrade: {
      name: dim => (dim ? `AD ${dim} from Infinity Upgrades` : "Total from Infinity Upgrades"),
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
        for (let tier = 1; tier <= activeDimCount("antimatter"); tier++) {
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
        return allPow * Math.exp(dimPow.slice(1).map(n => Math.log(n)).sum() / activeDimCount("antimatter"));
      },
      isActive: () => PlayerProgress.infinityUnlocked(),
    },
    breakInfinityUpgrade: {
      name: dim => (dim ? `AD ${dim} from Break Infinity Upgrades` : "Total from Break Infinity Upgrades"),
      multValue: dim => {
        const mult = DC.D1.timesEffectsOf(
          BreakInfinityUpgrade.totalAMMult,
          BreakInfinityUpgrade.currentAMMult,
          BreakInfinityUpgrade.achievementMult,
          BreakInfinityUpgrade.slowestChallengeMult,
          BreakInfinityUpgrade.infinitiedMult
        );
        return Decimal.pow(mult, dim ? 1 : activeDimCount("antimatter"));
      },
      isActive: () => player.break,
    },
    infinityPower: {
      name: dim => (dim ? `AD ${dim} from Infinity Power` : "Total from Infinity Power"),
      multValue: dim => {
        const mult = Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate).max(1);
        return Decimal.pow(mult, dim ? 1 : activeDimCount("antimatter"));
      },
      isActive: () => Currency.infinityPower.value.gt(1) && !EternityChallenge(9).isRunning,
    },
    infinityChallenge: {
      name: dim => (dim ? `AD ${dim} from Infinity Challenges` : "Total from Infinity Challenges"),
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
        for (let tier = 1; tier <= activeDimCount("antimatter"); tier++) {
          totalMult = totalMult.times(dimMults[tier]).times(allMult);
        }
        return totalMult;
      },
      powValue: () => (InfinityChallenge(4).isCompleted ? InfinityChallenge(4).reward.effectValue : 1),
      isActive: () => player.break,
    },
    timeStudy: {
      name: dim => (dim ? `AD ${dim} from Time Studies` : "Total from Time Studies"),
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
        for (let tier = 1; tier <= activeDimCount("antimatter"); tier++) {
          totalMult = totalMult.times(dimMults[tier]).times(allMult);
        }
        return totalMult;
      },
      isActive: () => PlayerProgress.eternityUnlocked(),
    },
    eternityChallenge: {
      name: dim => (dim ? `AD ${dim} from Eternity Challenges` : "Total from Eternity Challenges"),
      multValue: dim => Decimal.pow(EternityChallenge(10).effectValue, dim ? 1 : activeDimCount("antimatter")),
      isActive: () => EternityChallenge(10).isRunning,
    },
    glyph: {
      name: dim => (dim ? `AD ${dim} from Glyph Effects` : "Total from Glyph Effects"),
      multValue: dim => {
        const mult = getAdjustedGlyphEffect("powermult");
        return Decimal.pow(mult, dim ? 1 : activeDimCount("antimatter"));
      },
      powValue: () => getAdjustedGlyphEffect("powerpow") * getAdjustedGlyphEffect("effarigdimensions"),
      isActive: () => PlayerProgress.realityUnlocked(),
    },
    alchemy: {
      name: dim => (dim ? `AD ${dim} from Glyph Alchemy` : "Total from Glyph Alchemy"),
      multValue: dim => {
        const mult = AlchemyResource.dimensionality.effectOrDefault(1)
          .times(Currency.realityMachines.value.powEffectOf(AlchemyResource.force));
        return Decimal.pow(mult, dim ? 1 : activeDimCount("antimatter"));
      },
      powValue: () => AlchemyResource.power.effectOrDefault(1) * Ra.momentumValue,
      isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    },
    other: {
      name: dim => (dim ? `AD ${dim} from Other sources` : "Total from Other sources"),
      multValue: dim => {
        const mult = ShopPurchase.dimPurchases.currentMult * ShopPurchase.allDimPurchases.currentMult;
        return Decimal.pow(mult, dim ? 1 : activeDimCount("antimatter"));
      },
      powValue: () => VUnlocks.adPow.effectOrDefault(1) * PelleRifts.paradox.effectOrDefault(1),
      isActive: () => player.IAP.totalSTD > 0 || PlayerProgress.realityUnlocked(),
    },
  },

  ID: {
    total: {
      name: dim => (dim ? `Total ID ${dim} Multiplier` : "All ID Multipliers"),
      multValue: dim => (dim
        ? InfinityDimension(dim).multiplier
        : InfinityDimensions.all
          .filter(id => id.isProducing)
          .map(id => id.multiplier)
          .reduce((x, y) => x.times(y), DC.D1)),
      isActive: dim => InfinityDimension(dim ?? 1).isProducing,
    },
    purchase: {
      name: dim => (dim ? `ID ${dim} from Purchases` : "Total from Purchases"),
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
    },
    replicanti: {
      name: dim => (dim ? `ID ${dim} from Replicanti` : "Total from Replicanti"),
      multValue: dim => Decimal.pow(replicantiMult(), dim ? 1 : activeDimCount("infinity")),
      isActive: () => Replicanti.areUnlocked,
    },
    achievement: {
      name: dim => (dim ? `ID ${dim} from Achievements` : "Total from Achievements"),
      multValue: dim => {
        const baseMult = new Decimal(Achievement(75).effectOrDefault(1));
        if (dim) return dim === 1 ? baseMult.times(Achievement(94).effectOrDefault(1)) : baseMult;
        const maxActiveDim = activeDimCount("infinity");
        return Decimal.pow(baseMult, maxActiveDim).times(maxActiveDim > 0 ? Achievement(94).effectOrDefault(1) : DC.D1);
      },
      isActive: () => Achievement(75).canBeApplied,
    },
    timeStudy: {
      name: dim => (dim
        ? `ID ${dim} from Time Studies and Eternity Upgrades`
        : "Total from Time Studies and Eternity Upgrades"),
      multValue: dim => {
        const allMult = DC.D1.timesEffectsOf(
          TimeStudy(82),
          TimeStudy(92),
          TimeStudy(162),
          EternityUpgrade.idMultEP,
          EternityUpgrade.idMultEternities,
          EternityUpgrade.idMultICRecords,
        );
        if (dim) return dim === 4 ? allMult.times(TimeStudy(72).effectOrDefault(1)) : allMult;
        const maxActiveDim = activeDimCount("infinity");
        return Decimal.pow(allMult, maxActiveDim).times(maxActiveDim >= 4 ? TimeStudy(72).effectOrDefault(1) : DC.D1);
      },
      isActive: () => Achievement(75).canBeApplied,
    },
    infinityChallenge: {
      name: dim => (dim ? `ID ${dim} from Infinity Challenges` : "Total from Infinity Challenges"),
      multValue: dim => {
        const allMult = DC.D1.timesEffectsOf(
          InfinityChallenge(1).reward,
          InfinityChallenge(6).reward,
        );
        return Decimal.pow(allMult, dim ? 1 : activeDimCount("infinity"));
      },
      isActive: () => InfinityChallenge(1).isCompleted,
    },
    eternityChallenge: {
      name: dim => (dim ? `ID ${dim} from Eternity Challenges` : "Total from Eternity Challenges"),
      multValue: dim => {
        const allMult = DC.D1.timesEffectsOf(
          EternityChallenge(4).reward,
          EternityChallenge(9).reward,
        );
        if (dim) return dim === 1 ? allMult.times(EternityChallenge(2).reward.effectOrDefault(1)) : allMult;
        const maxActiveDim = activeDimCount("infinity");
        return Decimal.pow(allMult, maxActiveDim)
          .times(maxActiveDim >= 1 ? EternityChallenge(2).reward.effectOrDefault(1) : DC.D1);
      },
      isActive: () => InfinityChallenge(1).isCompleted,
    },
    glyph: {
      name: dim => (dim ? `ID ${dim} from Glyph Effects` : "Total from Glyph Effects"),
      powValue: () => getAdjustedGlyphEffect("infinitypow") * getAdjustedGlyphEffect("effarigdimensions"),
      isActive: () => PlayerProgress.realityUnlocked(),
    },
    alchemy: {
      name: dim => {
        const imStr = MachineHandler.isIMUnlocked ? " and Imaginary Upgrades" : "";
        return dim ? `ID ${dim} from Glyph Alchemy${imStr}` : `Total from Glyph Alchemy${imStr}`;
      },
      multValue: dim => {
        const mult = DC.D1.timesEffectsOf(
          AlchemyResource.dimensionality,
          ImaginaryUpgrade(8),
        );
        return Decimal.pow(mult, dim ? 1 : activeDimCount("infinity"));
      },
      powValue: () => AlchemyResource.infinity.effectOrDefault(1) * Ra.momentumValue,
      isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
    },
    other: {
      name: dim => (dim ? `ID ${dim} from Other sources` : "Total from Other sources"),
      multValue: dim => {
        const mult = new Decimal(ShopPurchase.allDimPurchases.currentMult).timesEffectsOf(
          PelleRifts.recursion.milestones[1]
        );
        const maxActiveDim = activeDimCount("infinity");
        return Decimal.pow(mult, dim ? 1 : maxActiveDim)
          .times(maxActiveDim >= 1 ? PelleRifts.decay.milestones[0].effectOrDefault(1) : DC.D1);
      },
      powValue: () => PelleRifts.paradox.effectOrDefault(1),
      isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    },
  },
};
