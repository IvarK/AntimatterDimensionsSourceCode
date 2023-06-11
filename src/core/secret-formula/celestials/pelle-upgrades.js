const formatCost = c => format(c, 2);
// eslint-disable-next-line max-params
const expWithIncreasedScale = (base1, base2, incScale, coeff, x) =>
  Decimal.pow(base1, x).times(Decimal.pow(base2, x - incScale).max(1)).times(coeff);

const rebuyable = config => {
  const { id, description, cost, effect, formatEffect, cap } = config;
  return {
    id,
    description,
    cost: () => expWithIncreasedScale(...cost, player.celestials.pelle.rebuyables[id]),
    formatCost,
    cap,
    effect: (x = player.celestials.pelle.rebuyables[id]) => effect(x),
    formatEffect,
    rebuyable: true
  };
};

export const pelleUpgrades = {
  antimatterDimensionMult: rebuyable({
    id: "antimatterDimensionMult",
    description: "Gain a multiplier to Antimatter Dimensions",
    cost: [10, 1e3, 41, 100],
    effect: x => Pelle.antimatterDimensionMult(x),
    formatEffect: x => formatX(x, 2, 2),
    cap: 44
  }),
  timeSpeedMult: rebuyable({
    id: "timeSpeedMult",
    description: "Gain a multiplier to game speed",
    cost: [20, 1e3, 30, 1e5],
    effect: x => Decimal.pow(1.3, x),
    formatEffect: x => formatX(x, 2, 2),
    cap: 35
  }),
  glyphLevels: rebuyable({
    id: "glyphLevels",
    description: "Increase the Glyph level allowed in Pelle",
    cost: [30, 1e3, 25, 1e15],
    effect: x => Math.floor(((3 * (x + 1)) - 2) ** 1.6),
    formatEffect: x => formatInt(x),
    cap: 26
  }),
  infConversion: rebuyable({
    id: "infConversion",
    description: "Increase Infinity Power conversion rate",
    cost: [40, 1e3, 20, 1e18],
    effect: x => (x * 3.5) ** 0.37,
    formatEffect: x => `+${format(x, 2, 2)}`,
    cap: 21
  }),
  galaxyPower: rebuyable({
    id: "galaxyPower",
    description: "Multiply Galaxy power",
    cost: [1000, 1e3, 10, 1e30],
    effect: x => 1 + x / 50,
    formatEffect: x => formatX(x, 2, 2),
    cap: 9
  }),
  antimatterDimAutobuyers1: {
    id: 0,
    description: "Get permanent Autobuyers for Antimatter Dimensions 1-4",
    cost: 1e5,
    formatCost,
  },
  dimBoostAutobuyer: {
    id: 1,
    description: "Get a permanent Autobuyer for Dimension Boosts",
    cost: 5e5,
    formatCost,
  },
  keepAutobuyers: {
    id: 2,
    description: "Autobuyer upgrades no longer reset on Armageddon",
    cost: 5e6,
    formatCost,
  },
  antimatterDimAutobuyers2: {
    id: 3,
    description: "Get permanent Autobuyers for Antimatter Dimensions 5-8",
    cost: 2.5e7,
    formatCost,
  },
  galaxyAutobuyer: {
    id: 4,
    description: "Get a permanent Autobuyer for Antimatter Galaxies",
    cost: 1e8,
    formatCost,
  },
  tickspeedAutobuyer: {
    id: 5,
    description: "Get a permanent Autobuyer for Tickspeed upgrades",
    cost: 1e9,
    formatCost,
  },
  keepInfinityUpgrades: {
    id: 6,
    description: "Infinity Upgrades no longer reset on Armageddon",
    cost: 1e10,
    formatCost,
  },
  dimBoostResetsNothing: {
    id: 7,
    description: "Dimension Boosts no longer reset anything",
    cost: 1e11,
    formatCost,
  },
  keepBreakInfinityUpgrades: {
    id: 8,
    description: "Break Infinity Upgrades no longer reset on Armageddon",
    cost: 1e12,
    formatCost,
  },
  IDAutobuyers: {
    id: 9,
    description: "Get permanent Autobuyers for Infinity Dimensions",
    cost: 1e14,
    formatCost,
  },
  keepInfinityChallenges: {
    id: 10,
    description: "Infinity Challenge unlocks and completions no longer reset on Armageddon",
    cost: 1e15,
    formatCost,
  },
  galaxyNoResetDimboost: {
    id: 11,
    description: "Galaxies no longer reset Dimension Boosts",
    cost: 1e16,
    formatCost
  },
  replicantiAutobuyers: {
    id: 12,
    description: "Get permanent Autobuyers for Replicanti Upgrades",
    cost: 1e17,
    formatCost,
  },
  replicantiGalaxyNoReset: {
    id: 13,
    description: "Replicanti Galaxies no longer reset on Infinity",
    cost: 1e19,
    formatCost,
  },
  eternitiesNoReset: {
    id: 14,
    description: "Eternities no longer reset on Armageddon",
    cost: 1e20,
    formatCost,
  },
  timeStudiesNoReset: {
    id: 15,
    description: "Time Studies and Theorems no longer reset on Armageddon",
    cost: 1e21,
    formatCost,
  },
  replicantiStayUnlocked: {
    id: 16,
    description: "Replicanti is permanently unlocked",
    cost: 1e22,
    formatCost,
  },
  keepEternityUpgrades: {
    id: 17,
    description: "Eternity Upgrades no longer reset on Armageddon",
    cost: 1e24,
    formatCost,
  },
  TDAutobuyers: {
    id: 18,
    description: "Get permanent Autobuyers for Time Dimensions",
    cost: 1e25,
    formatCost,
  },
  keepEternityChallenges: {
    id: 19,
    description: "Eternity Challenge completions no longer reset on Armageddon",
    cost: 1e26,
    formatCost,
  },
  dilationUpgradesNoReset: {
    id: 20,
    description: "Dilation Upgrades no longer reset on Armageddon",
    cost: 1e45,
    formatCost,
  },
  tachyonParticlesNoReset: {
    id: 21,
    description: "Tachyon Particles no longer reset on Armageddon",
    cost: 1e50,
    formatCost,
  }
};
