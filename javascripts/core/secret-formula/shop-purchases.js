"use strict";

GameDatabase.shopPurchases = {
  dimMult: {
    key: "dimMult",
    cost: 30,
    description: "Double all your normal dimension multipliers (dimensions 1-8). Forever.",
    multFn: prev => prev * 2
  },
  IPMult: {
    key: "IPMult",
    cost: 40,
    description: "Double your IP gain from all sources. (additive) ",
    multFn: prev => (prev === 1 ? 2 : prev + 2)
  },
  EPMult: {
    key: "EPMult",
    cost: 50,
    description: "Triple your EP gain from all sources. (additive) ",
    multFn: prev => (prev === 1 ? 3 : prev + 3)
  },
  allDimMult: {
    key: "allDimMult",
    cost: 60,
    description: "Double ALL the dimension multipliers (Normal, Infinity, Time) (multiplicative until 32x). Forever. ",
    multFn: prev => (prev < 32 ? prev * 2 : prev + 32)
  }
};