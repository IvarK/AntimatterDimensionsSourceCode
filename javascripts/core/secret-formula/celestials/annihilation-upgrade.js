"use strict";

GameDatabase.annihilationUpgrades = {
  realityReward: {
    id: "realityReward",
    description: "Boost Lai'tela reality reward",
    startCost: 10,
    costMult: 6,
    effect: x => 1 + x * 0.1,
    effectFormat: x => `x^${x}`
  },
  intervalPower: {
    id: "intervalPower",
    description: "Dark Matter dimensions interval upgrade is stronger",
    startCost: 40,
    costMult: 10,
    effect: x => x * 0.01,
    effectFormat: x => `${11 + x * 100}%`
  },
  infConversion: {
    id: "infConversion",
    description: "Increase Infinity Dimensions conversion amount",
    startCost: 300,
    costMult: 10,
    effect: x => x * 0.03,
    effectFormat: x => `+${x}`
  },
  freeTickDecrease: {
    id: "freeTickDecrease",
    description: "Decrease free tickspeed cost multiplier",
    startCost: 1000,
    costMult: 10,
    effect: x => Math.pow(0.99, x),
    effectFormat: x => `x${x.toFixed(2)}`
  },
  dimPow: {
    id: "dimPow",
    description: "Power all dimension multipliers",
    startCost: 50000,
    costMult: 8,
    effect: x => 1 + x * 0.05,
    effectFormat: x => `x^${x}`
  }
};