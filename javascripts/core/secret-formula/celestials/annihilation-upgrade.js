"use strict";

GameDatabase.annihilationUpgrades = {
  realityReward: {
    id: "realityReward",
    description: "Boost Lai'tela reality reward",
    startCost: 10,
    costMult: 6,
    effect: x => 1 + x * 0.1,
    effectFormat: x => `${formatPow(x, 3, 3)}`
  },
  intervalPower: {
    id: "intervalPower",
    description: "Dark Matter dimensions interval upgrade is stronger",
    startCost: 40,
    costMult: 10,
    effect: x => x * 0.01,
    effectFormat: x => `${11 + x * 100}%`
  },
  darkEnergyMult: {
    id: "darkEnergyMult",
    description: "You gain more Dark Energy",
    startCost: 300,
    costMult: 8,
    effect: x => Math.pow(1.20, x),
    effectFormat: x => `${format(x, 2, 2)}x`
  },
  infConversion: {
    id: "infConversion",
    description: "Increase Infinity Dimensions conversion amount",
    startCost: 1500,
    costMult: 10,
    effect: x => x * 0.03,
    effectFormat: x => `+${x}`
  },
  freeTickDecrease: {
    id: "freeTickDecrease",
    description: "Decrease free tickspeed cost multiplier",
    startCost: 9000,
    costMult: 10,
    effect: x => Math.pow(0.99, x),
    effectFormat: x => `x${x.toFixed(2)}`
  },
  dimCostMult: {
    id: "dimCostMult",
    description: "Dimension cost multipliers increase slower",
    startCost: 600000,
    costMult: 8,
    effect: x => Math.pow(0.985, x),
    effectFormat: x => `${((1 - x) * 100).toFixed(2)}%`
  }
};

GameDatabase.darkEnergyUpgrade = {
  matterDimensionMult: {
    id: 1,
    description: "Multiply Dark Matter Dimension production based on Dark Energy",
    cost: 30,
    effect: () => Math.log10(player.celestials.laitela.darkEnergy + 1) * 1.5 + 1,
    effectFormat: x => `Currently: ${format(x, 2, 2)}x`
  },
  annihilationUpgradeCostReduction: {
    id: 2,
    description: "Divide all Higgs Boson upgrade costs by 3",
    cost: 70,
    effect: () => 3,
    effectFormat: () => ""
  },
  bosonMult: {
    id: 3,
    description: "Gain more Higgs Bosons based on current amount",
    cost: 400,
    effect: () => player.celestials.laitela.higgs.plus(1).log10() * 0.75 + 1,
    effectFormat: x => `Currently: ${format(x, 2, 2)}x`
  },
  realityPenaltyReduction: {
    id: 4,
    description: "Reduce the Laitela Reality penalty",
    cost: 2000,
    effect: () => 2,
    effectFormat: () => ""
  },
  reactionPower: {
    id: 5,
    description: "Glyph Alchemy reactions are more efficient based on Dark Energy",
    cost: 10000,
    effect: () => Math.log10(player.celestials.laitela.darkEnergy + 1) * 0.75 + 1,
    effectFormat: x => `Currently: ${format(x, 2, 2)}x`
  },
  darkEnergy6: {
    id: 6,
    description: "Dummy upgrade to replace compression upgrade which was deleted",
    cost: 50000,
    effectFormat: x => `Currently: ${format(x, 2, 2)}x`
  }
};
