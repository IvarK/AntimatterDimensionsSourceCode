"use strict";

const V_REDUCTION_MODE = {
  SUBTRACTION: 1,
  DIVISION: 2
};

GameDatabase.celestials.v = {
  mainUnlock: {
    realities: 10000,
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
      description: value => `Unlock Reality with at most ${-value} ${pluralize("glyph", -value)} equipped.`,
      // This achievement has internally negated values since the check is always greater than
      values: [-5, -4, -3, -2, -1, 0],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -Glyphs.activeList.length,
      formatRecord: x => (x >= -5 ? formatInt(-x) : "Not reached"),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 1,
      name: "AntiStellar",
      description: value => `Have ${formatInt(value)} total galaxies from all types.`,
      values: [4000, 4300, 4600, 4900, 5200, 5500],
      condition: () => V.isRunning,
      currentValue: () => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies,
      formatRecord: x => formatInt(x),
      shardReduction: () => Math.floor(300 * V.tierReduction),
      maxShardReduction: goal => goal - 4000,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: value => `Get ${format(Decimal.pow10(value))} IP in Eternity Challenge 7.`,
      values: [6e5, 7.2e5, 8.4e5, 9.6e5, 1.08e6, 1.2e6],
      condition: () => V.isRunning && EternityChallenge(7).isRunning,
      currentValue: () => player.infinityPoints.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: () => 1.2e5 * V.tierReduction,
      maxShardReduction: goal => goal - 6e5,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 3,
      name: "Young Boy",
      description: value => `Get ${format(Decimal.pow10(value))} Antimatter in Eternity Challenge 12 without
        unlocking Time Dilation.`,
      values: [400e6, 450e6, 500e6, 600e6, 700e6, 800e6],
      condition: () => V.isRunning && EternityChallenge(12).isRunning && !PlayerProgress.dilationUnlocked(),
      currentValue: () => player.antimatter.log10(),
      formatRecord: x => format(Decimal.pow10(x)),
      shardReduction: () => 50e6 * V.tierReduction,
      maxShardReduction: goal => goal - 400e6,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: value => `Get ${format(Decimal.pow10(value))} EP.`,
      values: [7000, 7600, 8200, 8800, 9400, 10000],
      condition: () => V.isRunning,
      currentValue: () => player.eternityPoints.log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: () => 600 * V.tierReduction,
      maxShardReduction: goal => goal - 7000,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 5,
      name: "Matterception",
      description: value => `Get ${formatInt(value)} Dimensional Boosts while dilating time, inside EC5.`,
      values: [51, 52, 53, 54, 55, 56],
      condition: () => V.isRunning && player.dilation.active && EternityChallenge(5).isRunning,
      currentValue: () => DimBoost.purchasedBoosts,
      formatRecord: x => formatInt(x),
      shardReduction: () => Math.floor(V.tierReduction),
      maxShardReduction: () => 4,
      nextReduction: x => 200000 * x,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 6,
      name: "Requiem for a Glyph",
      description: value => `Unlock Reality with at most ${-value} glyphs equipped for the entire reality.
        <div ach-tooltip="Each equipped cursed glyph counts as -3 glyphs">
          <i class="fas fa-question-circle"></i>
        </div>`,
      // This achievement has internally negated values since the check is always greater than
      values: [2, 4, 6, 8, 10],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -player.celestials.v.maxGlyphsThisRun,
      formatRecord: x => formatInt(-x),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 7,
      name: "Post-destination",
      description: value => `Get ${formatInt(200000)} TT with a /${format(Decimal.pow10(value), 2, 2)}
        Black Hole or slower, without discharging or entering EC12.`,
      values: [50, 100, 150, 200, 250],
      condition: () => V.isRunning,
      currentValue: () => (player.timestudy.theorem.toNumber() > 200000
        ? -Math.log10(player.minNegativeBlackHoleThisReality)
        : 0),
      formatRecord: x => `1 / ${format(Math.pow(10, x))}`,
      shardReduction: () => 50 * V.tierReduction,
      maxShardReduction: goal => goal - 25,
      mode: V_REDUCTION_MODE.DIVISION,
      isHard: true
    },
    {
      id: 8,
      name: "Shutter Glyph",
      description: value => `Reach a glyph of level ${formatInt(value)}.`,
      values: [6000, 6500, 7000, 7500, 8000],
      condition: () => V.isRunning,
      currentValue: () => gainedGlyphLevel().actualLevel,
      formatRecord: x => formatInt(x),
      shardReduction: () => Math.floor(500 * V.tierReduction),
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
