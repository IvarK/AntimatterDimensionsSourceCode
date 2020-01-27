"use strict";

GameDatabase.challenges.infinity = [
  {
    id: 1,
    description: "All previous challenges (except tickspeed challenge and automatic big crunch challenge) at once.",
    goal: new Decimal("1e850"),
    isQuickResettable: true,
    reward: {
      description: "1.3x on all Infinity Dimensions for each Infinity Challenge completed",
      effect: () => Math.pow(1.3, InfinityChallenges.completed.length),
      formatEffect: value => formatX(value, 1, 1)
    },
    unlockAM: new Decimal("1e2000"),
  },
  {
    id: 2,
    description: () => `Automatically sacrifice every ${formatInt(8)} ticks once you have an 8th Dimension.`,
    goal: new Decimal("1e10500"),
    isQuickResettable: false,
    reward: {
      description: "Sacrifice autobuyer and more powerful sacrifice"
    },
    unlockAM: new Decimal("1e5000"),
  },
  {
    id: 3,
    description: "Tickspeed interval decrease is always 0%. For every tickspeed purchase, you instead get a static " +
      "multiplier on all normal dimensions which increases with Antimatter Galaxies.",
    goal: new Decimal("1e5000"),
    isQuickResettable: false,
    effect: () => Decimal.pow(1.05 + (player.galaxies * 0.005), player.totalTickBought),
    formatEffect: value => formatX(value, 2, 2),
    reward: {
      description: "Static multiplier on each tickspeed purchase based on Antimatter Galaxies",
      effect: () => Decimal.pow(1.05 + (player.galaxies * 0.005), player.totalTickBought),
      formatEffect: value => formatX(value, 2, 2),
    },
    unlockAM: new Decimal("1e12000"),
  },
  {
    id: 4,
    description: () => `Only the latest bought dimension's production is normal, all other dimensions produce less
      (${formatPow(0.25, 2, 2)}).`,
    goal: new Decimal("1e13000"),
    isQuickResettable: true,
    effect: 0.25,
    reward: {
      description: "All normal dimension multipliers become multiplier^1.05",
      effect: 1.05
    },
    unlockAM: new Decimal("1e14000"),
  },
  {
    id: 5,
    description: "When buying dimensions 1-4, dimensions with costs smaller or equal increase in cost. " +
      "When buying dimensions 5-8, dimensions with costs larger or equal increase in cost. " +
      "When buying tickspeed, dimensions with the same cost increase.",
    goal: new Decimal("1e16500"),
    isQuickResettable: true,
    reward: {
      description: "Galaxies are 10% more powerful and reduce the requirements for them and Dimension Boosts by 1",
      effect: 1.1
    },
    unlockAM: new Decimal("1e18000"),
  },
  {
    id: 6,
    description: () => `Once you have at least ${formatInt(1)} 2nd Dimension, exponentially rising matter
      divides the multiplier on all of your dimensions.`,
    goal: new Decimal("2e22222"),
    isQuickResettable: true,
    effect: () => player.matter.clampMin(1),
    formatEffect: value => formatX(value, 1, 2),
    reward: {
      description: "Tickspeed affects Infinity Dimensions with reduced effect",
      effect: () => Decimal.divide(1000, Tickspeed.current).pow(0.0005),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: new Decimal("1e20000"),
  },
  {
    id: 7,
    description: () => `You can't get Antimatter Galaxies, but Dimension Boost multiplier
      ${format(2.5, 1, 1)}x ➜ ${formatInt(10)}x`,
    goal: new Decimal("1e10000"),
    isQuickResettable: false,
    effect: 10,
    reward: {
      description: "Dimension Boost multiplier 2.5x ➜ 4x",
      effect: 4
    },
    unlockAM: new Decimal("1e23000"),
  },
  {
    id: 8,
    description: "Your production is at 100% after purchasing anything, after that it rapidly drops down.",
    goal: new Decimal("1e27000"),
    isQuickResettable: true,
    effect: () => Decimal.pow(0.8446303389034288,
      Math.max(0, player.thisInfinityTime - player.thisInfinityLastBuyTime)),
    reward: {
      description: "You get a multiplier to dimensions 2-7 based on 1st and 8th dimension multipliers.",
      effect: () => NormalDimension(1).multiplier.times(NormalDimension(8).multiplier).pow(0.02),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: new Decimal("1e28000"),
  },
];
