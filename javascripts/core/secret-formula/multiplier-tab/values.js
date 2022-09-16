import { DC } from "../../../core/constants";
import { GameDatabase } from "../game-database";

export const MULTIPLIER_TAB_TYPE = {
  SUM: 0,
  MULTIPLIER: 1,
  POWER: 2
};

GameDatabase.multiplierTabValues = {
  // Pre-Infinity Effects for dimensions
  totalAD: {
    name: dim => (dim
      ? `Total AD ${dim} Mult.`
      : "All AD Mult."),
    type: MULTIPLIER_TAB_TYPE.MULTIPLIER,
    value: dim => (dim
      ? AntimatterDimension(dim).multiplier
      : AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => ad.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: dim => AntimatterDimension(dim ?? 1).isProducing,
  },
  buy10AD: {
    name: dim => (dim
      ? `AD ${dim} Mult. from Purchases`
      : "Total AD Mult. from Purchases"),
    type: MULTIPLIER_TAB_TYPE.MULTIPLIER,
    value: dim => {
      const getBuy10 = ad => (Laitela.continuumActive
        ? AntimatterDimension(ad).continuumValue
        : Math.floor(AntimatterDimension(ad).bought / 10)
      );
      if (dim) return Decimal.pow(AntimatterDimensions.buyTenMultiplier, getBuy10(dim));
      return AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => Decimal.pow(AntimatterDimensions.buyTenMultiplier, getBuy10(ad.tier)))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    isActive: () => !EternityChallenge(11).isRunning,
  },
  dimboostAD: {
    name: dim => (dim
      ? `AD ${dim} Mult. from Dimboosts`
      : "Total AD Mult. from Dimboosts"),
    type: MULTIPLIER_TAB_TYPE.MULTIPLIER,
    value: dim => (dim
      ? DimBoost.multiplierToNDTier(dim)
      : AntimatterDimensions.all
        .filter(ad => ad.isProducing)
        .map(ad => DimBoost.multiplierToNDTier(ad.tier))
        .reduce((x, y) => x.times(y), DC.D1)),
    isActive: () => true,
  },
  sacrifice: {
    name: () => `AD 8 Mult. from Sacrifice`,
    type: MULTIPLIER_TAB_TYPE.MULTIPLIER,
    value: () => Sacrifice.totalBoost,
    isActive: () => Sacrifice.totalBoost.gt(1),
  },
  achievementAD: {
    name: dim => (dim
      ? `AD ${dim} Mult. from Achievements`
      : "Total AD Mult. from Achievements"),
    type: MULTIPLIER_TAB_TYPE.MULTIPLIER,
    value: dim => {
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
      const maxActiveDim = AntimatterDimensions.all.filter(ad => ad.isProducing).length;
      let totalMult = DC.D1;
      for (let tier = 1; tier <= maxActiveDim; tier++) totalMult = totalMult.times(dimMults[tier]).times(allMult);
      return totalMult;
    },
    isActive: () => true,
  }
};
