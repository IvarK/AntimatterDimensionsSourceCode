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
        .filter(ad => ad.productionPerSecond.neq(0))
        .map(ad => ad.multiplier)
        .reduce((x, y) => x.times(y), DC.D1)),
    // Check this
    isActive: () => true,
  },
  buy10AD: {
    name: dim => (dim
      ? `AD ${dim} Mult. from purchases`
      : "Total AD Mult. from purchases"),
    type: MULTIPLIER_TAB_TYPE.MULTIPLIER,
    value: dim => {
      const getBuy10 = ad => (Laitela.continuumActive
        ? AntimatterDimension(ad).continuumValue
        : Math.floor(AntimatterDimension(ad).bought / 10)
      );
      if (dim) return Decimal.pow(AntimatterDimensions.buyTenMultiplier, getBuy10(dim));
      return AntimatterDimensions.all
        .filter(ad => ad.productionPerSecond.neq(0))
        .map(ad => Decimal.pow(AntimatterDimensions.buyTenMultiplier, getBuy10(ad.tier)))
        .reduce((x, y) => x.times(y), DC.D1);
    },
    // Check this
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
        .filter(ad => ad.productionPerSecond.neq(0))
        .map(ad => DimBoost.multiplierToNDTier(ad.tier))
        .reduce((x, y) => x.times(y), DC.D1)),
    // Check this
    isActive: () => true,
  },
};
