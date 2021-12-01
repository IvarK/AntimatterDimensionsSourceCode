import { GameDatabase } from "../../game-database.js";

// Despite the fact that they aren't unlocked until late celestials, we still scope triads under eternity because
// they appear on the time study tab and for consistency with the other study types
GameDatabase.eternity.timeStudies.triad = [
  {
    id: 1,
    cost: 0,
    STCost: 12,
    requirement: [221, 222, 231],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [221, 222, 231],
    description: "Time Study 231 improves the effect of Time Study 221",
    effect: () => TimeStudy(221).effectValue.pow(TimeStudy(231).effectValue.minus(1)).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    unlocked: () => Ra.pets.v.level >= 5
  },
  {
    id: 2,
    cost: 0,
    STCost: 12,
    requirement: [223, 224, 232],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [223, 224, 232],
    description: () => `Distant Galaxy scaling threshold starts another ${formatInt(3000)} Antimatter Galaxies later`,
    effect: 3000,
    unlocked: () => Ra.pets.v.level >= 10
  },
  {
    id: 3,
    cost: 0,
    STCost: 12,
    requirement: [225, 226, 233],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [225, 226, 233],
    description: () => `Gain ${formatPercents(0.5)} more extra Replicanti Galaxies from Time Studies 225 and 226,
      and from Effarig's Infinity`,
    effect: 1.5,
    unlocked: () => Ra.pets.v.level >= 15
  },
  {
    id: 4,
    cost: 0,
    STCost: 12,
    requirement: [227, 228, 234],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [227, 228, 234],
    description: "Dimensional Sacrifice multiplier is squared",
    effect: 2,
    unlocked: () => Ra.pets.v.level >= 20
  }
];
