"use strict";

GameDatabase.shopPurchases = {
  dimPurchases: {
    key: "dimPurchases",
    cost: 30,
    description: "Double all your normal dimension multipliers (dimensions 1-8). Forever.",
    multiplier: purchases => Math.pow(2, purchases)
  },
  IPPurchases: {
    key: "IPPurchases",
    cost: 40,
    description: "Double your IP gain from all sources. (additive) ",
    multiplier: purchases => (purchases === 0 ? 1 : 2 * purchases),
  },
  EPPurchases: {
    key: "EPPurchases",
    cost: 50,
    description: "Triple your EP gain from all sources. (additive) ",
    multiplier: purchases => (purchases === 0 ? 1 : 3 * purchases),
  },
  allDimPurchases: {
    key: "allDimPurchases",
    cost: 60,
    description: "Double ALL the dimension multipliers (Normal, Infinity, Time) (multiplicative until 32x). Forever. ",
    multiplier: purchases => (purchases > 4 ? 32 * (purchases - 4) : Math.pow(2, purchases)),
  }
};