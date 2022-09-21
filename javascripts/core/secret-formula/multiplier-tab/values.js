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
      return TimeDimensions.all.filter(td => td.isProducing).length;
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
      color: () => "var(--color-antimatter)",
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
      color: () => "var(--color-antimatter)",
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
      color: () => GameDatabase.reality.glyphTypes.power.color,
    },
    sacrifice: {
      name: dim => (dim ? "AD 8 from Sacrifice" : "Sacrifice Multiplier"),
      multValue: dim => ((!dim || dim === 8) ? Sacrifice.totalBoost : DC.D1),
      isActive: dim => (!dim || dim === 8) && Sacrifice.totalBoost.gt(1),
      color: () => "var(--color-antimatter)",
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
      color: () => "var(--color-v--base)",
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
      color: () => "var(--color-infinity)",
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
      color: () => "var(--color-infinity)",
    },
    infinityPower: {
      name: dim => (dim ? `AD ${dim} from Infinity Power` : "Total from Infinity Power"),
      multValue: dim => {
        const mult = Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate).max(1);
        return Decimal.pow(mult, dim ? 1 : activeDimCount("antimatter"));
      },
      isActive: () => Currency.infinityPower.value.gt(1) && !EternityChallenge(9).isRunning,
      color: () => "var(--color-infinity)",
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
      color: () => "var(--color-infinity)",
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
      color: () => "var(--color-eternity)",
    },
    eternityChallenge: {
      name: dim => (dim ? `AD ${dim} from Eternity Challenges` : "Total from Eternity Challenges"),
      multValue: dim => Decimal.pow(EternityChallenge(10).effectValue, dim ? 1 : activeDimCount("antimatter")),
      isActive: () => EternityChallenge(10).isRunning,
      color: () => "var(--color-eternity)",
    },
    glyph: {
      name: dim => (dim ? `AD ${dim} from Glyph Effects` : "Total from Glyph Effects"),
      multValue: dim => {
        const mult = getAdjustedGlyphEffect("powermult");
        return Decimal.pow(mult, dim ? 1 : activeDimCount("antimatter"));
      },
      powValue: () => getAdjustedGlyphEffect("powerpow") * getAdjustedGlyphEffect("effarigdimensions"),
      isActive: () => PlayerProgress.realityUnlocked(),
      color: () => "var(--color-reality)",
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
      color: () => "var(--color-ra-pet--effarig)",
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
      color: () => "var(--color-infinity)",
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
      color: () => "var(--color-infinity)",
    },
    replicanti: {
      name: dim => (dim ? `ID ${dim} from Replicanti` : "Total from Replicanti"),
      multValue: dim => Decimal.pow(replicantiMult(), dim ? 1 : activeDimCount("infinity")),
      isActive: () => Replicanti.areUnlocked,
      color: () => GameDatabase.reality.glyphTypes.replication.color,
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
      color: () => "var(--color-v--base)",
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
      color: () => "var(--color-eternity)",
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
      color: () => "var(--color-infinity)",
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
      isActive: () => EternityChallenge(2).isCompleted,
      color: () => "var(--color-eternity)",
    },
    glyph: {
      name: dim => (dim ? `ID ${dim} from Glyph Effects` : "Total from Glyph Effects"),
      powValue: () => getAdjustedGlyphEffect("infinitypow") * getAdjustedGlyphEffect("effarigdimensions"),
      isActive: () => PlayerProgress.realityUnlocked(),
      color: () => "var(--color-reality)",
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
      color: () => "var(--color-ra-pet--effarig)",
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

  TD: {
    total: {
      name: dim => (dim ? `Total TD ${dim} Multiplier` : "All TD Multipliers"),
      multValue: dim => (dim
        ? TimeDimension(dim).multiplier
        : TimeDimensions.all
          .filter(td => td.isProducing)
          .map(td => td.multiplier)
          .reduce((x, y) => x.times(y), DC.D1)),
      isActive: dim => TimeDimension(dim ?? 1).isProducing,
      color: () => "var(--color-eternity)",
    },
    purchase: {
      name: dim => (dim ? `TD ${dim} from Purchases` : "Total from Purchases"),
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
      color: () => "var(--color-eternity)",
    },
    achievement: {
      name: dim => (dim ? `TD ${dim} from Achievements` : "Total from Achievements"),
      multValue: dim => {
        const baseMult = DC.D1.timesEffectsOf(
          Achievement(105),
          Achievement(128),
          EternityUpgrade.tdMultAchs,
        );
        return Decimal.pow(baseMult, dim ? 1 : activeDimCount("time"));
      },
      isActive: () => Achievement(75).canBeApplied,
      color: () => "var(--color-v--base)",
    },
    timeStudy: {
      name: dim => (dim
        ? `TD ${dim} from Time Studies and Eternity Upgrades`
        : "Total from Time Studies and Eternity Upgrades"),
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
        for (let tier = 1; tier <= activeDimCount("time"); tier++) {
          totalMult = totalMult.times(dimMults[tier]).times(allMult);
        }
        return totalMult;
      },
      isActive: () => Achievement(75).canBeApplied,
      color: () => "var(--color-eternity)",
    },
    eternityChallenge: {
      name: dim => (dim ? `TD ${dim} from Eternity Challenges` : "Total from Eternity Challenges"),
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
        return Decimal.pow(allMult, dim ? 1 : activeDimCount("time"));
      },
      isActive: () => EternityChallenge(1).isCompleted,
      color: () => "var(--color-eternity)",
    },
    glyph: {
      name: dim => (dim ? `TD ${dim} from Glyph Effects` : "Total from Glyph Effects"),
      powValue: () => getAdjustedGlyphEffect("timepow") * getAdjustedGlyphEffect("effarigdimensions"),
      isActive: () => PlayerProgress.realityUnlocked(),
      color: () => "var(--color-reality)",
    },
    alchemy: {
      name: dim => {
        const imStr = MachineHandler.isIMUnlocked ? " and Imaginary Upgrades" : "";
        return dim ? `TD ${dim} from Glyph Alchemy${imStr}` : `Total from Glyph Alchemy${imStr}`;
      },
      multValue: dim => {
        const mult = DC.D1.timesEffectsOf(
          AlchemyResource.dimensionality,
          ImaginaryUpgrade(11),
        );
        return Decimal.pow(mult, dim ? 1 : activeDimCount("time"));
      },
      powValue: () => AlchemyResource.time.effectOrDefault(1) * Ra.momentumValue,
      isActive: () => Ra.unlocks.unlockGlyphAlchemy.canBeApplied,
      color: () => "var(--color-v--base)",
    },
    other: {
      name: dim => (dim ? `TD ${dim} from Other sources` : "Total from Other sources"),
      multValue: dim => {
        const mult = new Decimal(ShopPurchase.allDimPurchases.currentMult).timesEffectsOf(
          Replicanti.areUnlocked && Replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
          Pelle.isDoomed ? null : RealityUpgrade(22),
          PelleRifts.chaos
        );
        const maxActiveDim = activeDimCount("time");
        return Decimal.pow(mult, dim ? 1 : maxActiveDim);
      },
      powValue: () => PelleRifts.paradox.effectOrDefault(1),
      isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    },
  },

  IP: {
    total: {
      name: () => "Total IP Gained",
      isBase: () => true,
      multValue: () => gainedInfinityPoints(),
      isActive: () => player.break,
    },
    base: {
      name: () => "Base Infinity Points",
      isBase: () => true,
      multValue: () => {
        const div = Effects.min(
          308,
          Achievement(103),
          TimeStudy(111)
        );
        return Decimal.pow10(player.records.thisInfinity.maxAM.log10() / div - 0.75);
      },
      isActive: () => player.break,
      color: () => "var(--color-infinity)",
    },
    infinityUpgrade: {
      name: () => "Repeatable Infinity Upgrade",
      multValue: () => InfinityUpgrade.ipMult.effectOrDefault(1),
      isActive: () => player.break && !Pelle.isDoomed,
      color: () => "var(--color-infinity)",
    },
    achievement: {
      name: () => "Achievements",
      multValue: () => DC.D1.timesEffectsOf(
        Achievement(85),
        Achievement(93),
        Achievement(116),
        Achievement(125),
        Achievement(141).effects.ipGain,
      ),
      isActive: () => player.break && !Pelle.isDoomed,
      color: () => "var(--color-v--base)",
    },
    timeStudy: {
      name: () => "Time Studies",
      multValue: () => DC.D1.timesEffectsOf(
        TimeStudy(41),
        TimeStudy(51),
        TimeStudy(141),
        TimeStudy(142),
        TimeStudy(143),
      ),
      isActive: () => player.break && !Pelle.isDoomed,
      color: () => "var(--color-eternity)",
    },
    dilationUpgrade: {
      name: () => "Dilation Upgrades",
      multValue: () => DilationUpgrade.ipMultDT.effectOrDefault(1),
      isActive: () => player.break && !Pelle.isDoomed && DilationUpgrade.ipMultDT.canBeApplied,
      color: () => "var(--color-dilation)",
    },
    glyph: {
      name: () => (Ra.unlocks.unlockGlyphAlchemy.canBeApplied
        ? "Equipped Glyphs and Glyph Alchemy"
        : "Equipped Glyphs"),
      multValue: () => Replicanti.amount.powEffectOf(AlchemyResource.exponential)
        .times(getAdjustedGlyphEffect("infinityIP")),
      powValue: () => (GlyphAlteration.isAdded("infinity") ? getSecondaryGlyphEffect("infinityIP") : 1),
      isActive: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
      color: () => "var(--color-reality)",
    },
    other: {
      name: () => "IP Multipliers from Other sources",
      multValue: () => DC.D1.times(ShopPurchase.IPPurchases.currentMult)
        .timesEffectsOf(PelleRifts.vacuum)
        .times(Pelle.specialGlyphEffect.infinity),
      isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    },
  },

  EP: {
    total: {
      name: () => "Total EP Gained",
      isBase: () => true,
      multValue: () => gainedEternityPoints(),
      isActive: () => PlayerProgress.eternityUnlocked(),
    },
    base: {
      name: () => "Base Eternity Points",
      isBase: () => true,
      multValue: () => DC.D5.pow(player.records.thisEternity.maxIP.plus(
        gainedInfinityPoints()).log10() / (308 - PelleRifts.recursion.effectValue.toNumber()) - 0.7),
      isActive: () => PlayerProgress.eternityUnlocked(),
      color: () => "var(--color-eternity)",
    },
    eternityUpgrade: {
      name: () => "Repeatable Eternity Upgrade",
      multValue: () => EternityUpgrade.epMult.effectOrDefault(1),
      isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
      color: () => "var(--color-eternity)",
    },
    timeStudy: {
      name: () => "Time Studies",
      multValue: () => DC.D1.timesEffectsOf(
        TimeStudy(61),
        TimeStudy(122),
        TimeStudy(121),
        TimeStudy(123),
      ),
      isActive: () => PlayerProgress.eternityUnlocked() && !Pelle.isDoomed,
      color: () => "var(--color-eternity)",
    },
    glyph: {
      name: () => "Equipped Glyphs and Reality Upgrades",
      multValue: () => DC.D1.timesEffectsOf(
        RealityUpgrade(12),
        GlyphEffect.epMult
      ),
      powValue: () => (GlyphAlteration.isAdded("time") ? getSecondaryGlyphEffect("timeEP") : 1),
      isActive: () => PlayerProgress.realityUnlocked(),
      color: () => "var(--color-reality)",
    },
    other: {
      name: () => "IP Multipliers from Other sources",
      multValue: () => DC.D1.times(ShopPurchase.EPPurchases.currentMult)
        .timesEffectsOf(PelleRifts.vacuum.milestones[2])
        .times(Pelle.specialGlyphEffect.time),
      isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    },
  }
};
