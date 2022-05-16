import { GameDatabase } from "../game-database";

GameDatabase.celestials.pelle.upgrades = (function() {
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
  return {
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
      description: "Gain back Autobuyers for Antimatter Dimensions 1-4",
      cost: 1e5,
      formatCost,
    },
    dimBoostAutobuyer: {
      id: 1,
      description: "Gain back the Autobuyer for Dimension Boosts",
      cost: 5e5,
      formatCost,
    },
    keepAutobuyers: {
      id: 2,
      description: "Keep your Autobuyer upgrades on Armageddon",
      cost: 5e6,
      formatCost,
    },
    antimatterDimAutobuyers2: {
      id: 3,
      description: "Gain back Autobuyers for Antimatter Dimensions 5-8",
      cost: 2.5e7,
      formatCost,
    },
    galaxyAutobuyer: {
      id: 4,
      description: "Gain back the Autobuyer for Antimatter Galaxies",
      cost: 1e8,
      formatCost,
    },
    tickspeedAutobuyer: {
      id: 5,
      description: "Gain back the Autobuyer for Tickspeed",
      cost: 1e9,
      formatCost,
    },
    keepInfinityUpgrades: {
      id: 6,
      description: "Keep Infinity Upgrades on Armageddon",
      cost: 1e10,
      formatCost,
    },
    keepBreakInfinityUpgrades: {
      id: 7,
      description: "Keep Break Infinity Upgrades on Armageddon",
      cost: 1e12,
      formatCost,
    },
    IDAutobuyers: {
      id: 8,
      description: "Gain back Infinity Dimension Autobuyers",
      cost: 1e14,
      formatCost,
    },
    keepInfinityChallenges: {
      id: 9,
      description: "You keep your Infinity Challenge unlocks and completions through Armageddons",
      cost: 1e15,
      formatCost,
    },
    replicantiAutobuyers: {
      id: 10,
      description: "Gain back Replicanti Upgrade Autobuyers",
      cost: 1e17,
      formatCost,
    },
    replicantiGalaxyNoReset: {
      id: 11,
      description: "Replicanti Galaxies don't reset on Infinity",
      cost: 1e19,
      formatCost,
    },
    eternitiesNoReset: {
      id: 12,
      description: "Eternities do not reset on Armageddon",
      cost: 1e20,
      formatCost,
    },
    timeStudiesNoReset: {
      id: 13,
      description: "Time Studies and Theorems do not reset on Armageddon",
      cost: 1e21,
      formatCost,
    },
    replicantiStayUnlocked: {
      id: 14,
      description: "Replicanti stays unlocked on Armageddon",
      cost: 1e22,
      formatCost,
    },
    keepEternityUpgrades: {
      id: 15,
      description: "Keep Eternity Upgrades on Armageddon",
      cost: 1e24,
      formatCost,
    },
    TDAutobuyers: {
      id: 16,
      description: "Gain back Time Dimension Autobuyers",
      cost: 1e25,
      formatCost,
    },
    keepEternityChallenges: {
      id: 17,
      description: "You keep your Eternity Challenge completions through Armageddons",
      cost: 1e26,
      formatCost,
    },
    dimBoostResetsNothing: {
      id: 18,
      description: "Dimension Boosts no longer reset anything",
      cost: 1e30,
      formatCost,
    },
    dilationUpgradesNoReset: {
      id: 19,
      description: "Keep Dilation Upgrades on Armageddon",
      cost: 1e45,
      formatCost,
    },
    tachyonParticlesNoReset: {
      id: 20,
      description: "Keep Tachyon Particles on Armageddon",
      cost: 1e50,
      formatCost,
    }
  };
}());
