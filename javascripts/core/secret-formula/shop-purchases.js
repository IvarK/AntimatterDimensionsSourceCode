import { GameDatabase } from "./game-database.js";

GameDatabase.shopPurchases = {
  dimPurchases: {
    key: "dimPurchases",
    cost: 30,
    description: "Double all your Antimatter Dimension multipliers. Forever.",
    multiplier: purchases => Math.pow(2, purchases)
  },
  IPPurchases: {
    key: "IPPurchases",
    cost: 40,
    description: "Double your Infinity Point gain from all sources. (additive) ",
    multiplier: purchases => (purchases === 0 ? 1 : 2 * purchases),
  },
  EPPurchases: {
    key: "EPPurchases",
    cost: 50,
    description: "Triple your Eternity Point gain from all sources. (additive) ",
    multiplier: purchases => (purchases === 0 ? 1 : 3 * purchases),
  },
  allDimPurchases: {
    key: "allDimPurchases",
    cost: 60,
    description: "Double ALL Dimension multipliers (Antimatter, Infinity, Time) (multiplicative until 32x). Forever. ",
    multiplier: purchases => (purchases > 4 ? 32 * (purchases - 4) : Math.pow(2, purchases)),
  }
};
