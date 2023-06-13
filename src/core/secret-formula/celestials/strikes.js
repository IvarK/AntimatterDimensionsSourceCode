import { DC } from "../../constants";
import wordShift from "../../word-shift";

export const pelleStrikes = {
  infinity: {
    id: 1,
    requirementDescription: "Reach Infinity",
    penaltyDescription: () => `Antimatter Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
    rewardDescription: () => `Unlock ${wordShift.wordCycle(PelleRifts.vacuum.name)}
      and get a permanent Infinity Autobuyer`,
    rift: () => PelleRifts.vacuum
  },
  powerGalaxies: {
    id: 2,
    requirementDescription: "Power-up Galaxies",
    penaltyDescription: () => `Infinity Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
    rewardDescription: () => `Unlock ${wordShift.wordCycle(PelleRifts.decay.name)}`,
    rift: () => PelleRifts.decay
  },
  eternity: {
    id: 3,
    requirementDescription: "Reach Eternity",
    penaltyDescription: () => `Replicanti speed slows down even more above ${format(DC.E2000)}`,
    rewardDescription: () => `Unlock ${wordShift.wordCycle(PelleRifts.chaos.name)}`,
    rift: () => PelleRifts.chaos
  },
  ECs: {
    id: 4,
    requirementDescription: () => `Reach ${formatInt(115)} TT`,
    penaltyDescription: () => `In Eternity Challenges, ${wordShift.wordCycle(PelleRifts.vacuum.name)}
      IP multiplier is only ${formatPercents(0.3)} as strong and capped at ${formatPercents(0.15)}
      of the goal`,
    rewardDescription: () => `Unlock ${wordShift.wordCycle(PelleRifts.recursion.name)}`,
    rift: () => PelleRifts.recursion
  },
  dilation: {
    id: 5,
    requirementDescription: "Dilate Time",
    penaltyDescription: "Time Dilation is permanently active",
    rewardDescription: () => `Keep the Time Dilation study across Armageddon, boost Remnant gain, and unlock
      ${wordShift.wordCycle(PelleRifts.paradox.name)}`,
    rift: () => PelleRifts.paradox
  }
};
