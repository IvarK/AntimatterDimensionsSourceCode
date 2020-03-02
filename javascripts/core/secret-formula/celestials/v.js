"use strict";

const V_REDUCTION_MODE = {
  SUBTRACTION: 1,
  DIVISION: 2
};

GameDatabase.celestials.v = {
  mainUnlock: {
    realities: 10000,
    totalGlyphSacrifice: 1e32,
    eternities: 1e70,
    infinities: 1e160,
    dilatedTime: new Decimal("1e320"),
    replicanti: new Decimal("1e320000"),
    rm: 1e60,
  },
  runUnlocks: [
    {
      id: 0,
      name: "Glyph Knight",
      description: value => `Unlock reality with at most ${value} ${pluralize("glyph", value)} equipped.`,
      values: [5, 4, 3, 2, 1, 0],
      condition: x => TimeStudy.reality.isBought && Glyphs.activeList.length <= x,
      currentValue: () => (TimeStudy.reality.isBought ? 6 - Glyphs.activeList.length : 0),
      formatRecord: x => (x === 0 ? "N/A" : formatInt(6 - x)),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 1,
      name: "AntiStellar",
      description: value => `Have ${formatInt(value)} total galaxies from all types.`,
      values: [4000, 4300, 4600, 4900, 5200, 5500],
      condition: x => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies >= x,
      currentValue: () => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies,
      formatRecord: x => formatInt(x),
      shardReduction: () => Math.floor(300 * (player.celestials.v.ppSpent / 200000)),
      maxShardReduction: goal => goal - 4000,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: value => `Get ${format(value)} IP in Eternity Challenge 7.`,
      values: [6e5, 7.2e5, 8.4e5, 9.6e5, 1.08e6, 1.2e6].map(Decimal.pow10),
      condition: x => EternityChallenge(7).isRunning && player.infinityPoints.gte(x),
      currentValue: () => (EternityChallenge(7).isRunning ? player.infinityPoints.exponent : 0),
      formatRecord: x => (x === 0 ? formatInt(0) : format(Decimal.pow10(x))),
      shardReduction: () => Decimal.pow10(1.2e5 * (player.celestials.v.ppSpent / 200000)),
      maxShardReduction: goal => goal.dividedBy(Decimal.pow10(6e5)),
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 3,
      name: "Young Boy",
      description: value => `Get ${format(value)} Antimatter in Eternity Challenge 12 without
        unlocking Time Dilation.`,
      values: [400e6, 450e6, 500e6, 600e6, 700e6, 800e6].map(Decimal.pow10),
      condition: x => EternityChallenge(12).isRunning && player.antimatter.gte(x) && !PlayerProgress.dilationUnlocked(),
      currentValue: () => ((EternityChallenge(12).isRunning && !PlayerProgress.dilationUnlocked())
        ? player.antimatter.exponent
        : 0),
      formatRecord: x => (x === 0 ? formatInt(0) : format(Decimal.pow10(x))),
      shardReduction: () => Decimal.pow10(50e6 * (player.celestials.v.ppSpent / 200000)),
      maxShardReduction: goal => goal.dividedBy(Decimal.pow10(400e6)),
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: value => `Get ${format(value)} EP.`,
      values: ["1e7000", "1e7600", "1e8200", "1e8800", "1e9400", "1e10000"].map(v => new Decimal(v)),
      condition: x => player.eternityPoints.gte(x),
      currentValue: () => player.eternityPoints.exponent,
      formatRecord: x => (x === 0 ? formatInt(0) : format(Decimal.pow10(x))),
      shardReduction: () => Decimal.pow10(600 * (player.celestials.v.ppSpent / 200000)),
      maxShardReduction: goal => goal.dividedBy(Decimal.pow10(7000)),
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 5,
      name: "Matterception",
      description: value => `Get ${formatInt(value)} Dimensional Boosts while dilating time, inside EC5.`,
      values: [51, 52, 53, 54, 55, 56],
      condition: x => player.dilation.active && EternityChallenge(5).isRunning && DimBoost.purchasedBoosts >= x,
      currentValue: () => (player.dilation.active && EternityChallenge(5).isRunning ? DimBoost.purchasedBoosts : 0),
      formatRecord: x => formatInt(x),
      shardReduction: () => Math.floor(player.celestials.v.ppSpent / 200000),
      maxShardReduction: () => 4,
      nextReduction: x => 200000 * x,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 6,
      name: "Requiem for a Glyph",
      description: value =>
        `Unlock reality with at least ${formatInt(value)} cursed ${pluralize("glyph", value)}`,
      values: [1, 2, 3, 4, 5],
      condition: x => TimeStudy.reality.isBought && player.celestials.v.cursedThisRun >= x,
      currentValue: () => (TimeStudy.reality.isBought ? player.celestials.v.cursedThisRun : 0),
      formatRecord: x => formatInt(x),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 7,
      name: "Post-destination",
      description: value =>
        `Get ${formatInt(Math.floor(Math.pow(value, 2.3)))} TT with a 
          /${format(Decimal.pow10(value), 2, 2)} black hole`,
      values: [50, 100, 150, 200, 300],
      condition: x => player.timestudy.theorem.gt(Math.floor(Math.pow(x, 2.3))) &&
        Decimal.pow10(x).recip().toNumber() >= player.minNegativeBlackHoleThisReality,
      currentValue: x => (Decimal.pow10(x).recip().toNumber() >= player.minNegativeBlackHoleThisReality
        ? player.timestudy.theorem.toNumber()
        : 0),
      formatRecord: x => formatInt(x),
      shardReduction: () => 5 * Math.log10(1 + player.celestials.v.ppSpent),
      maxShardReduction: () => 50,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 8,
      name: "Shutter Glyph",
      description: value => `Reach a glyph of level ${value}`,
      values: [3500, 4000, 5000, 5500, 6500],
      condition: x => gainedGlyphLevel().actualLevel >= x,
      currentValue: () => gainedGlyphLevel().actualLevel,
      formatRecord: x => formatInt(x),
      shardReduction: () => 20 * Math.log10(1 + player.celestials.v.ppSpent),
      maxShardReduction: () => 500,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    }
  ],
  triadStudies: [
    {
      id: 1,
      STCost: 12,
      requirement: [221, 222, 231],
      description: "Study 231 powers up the effect of study 221",
      effect: () => TimeStudy(221).effectValue.pow(TimeStudy(231).effectValue.minus(1)).clampMin(1),
      formatEffect: value => formatX(value, 2, 1),
      unlocked: () => Ra.pets.v.level >= 5
    },
    {
      id: 2,
      STCost: 12,
      requirement: [223, 224, 232],
      description: "Multiply the distant galaxy scaling threshold by 2x",
      effect: 2,
      unlocked: () => Ra.pets.v.level >= 10
    },
    {
      id: 3,
      STCost: 12,
      requirement: [225, 226, 233],
      description: "Your extra RGs are multiplied by 1.5x",
      effect: 1.5,
      unlocked: () => Ra.pets.v.level >= 15
    },
    {
      id: 4,
      STCost: 12,
      requirement: [227, 228, 234],
      description: "Sacrifice boosts all normal dimensions.",
      effect: () => Sacrifice.totalBoost,
      formatEffect: value => formatX(value, 2, 1),
      unlocked: () => Ra.pets.v.level >= 20
    }
  ]
};
