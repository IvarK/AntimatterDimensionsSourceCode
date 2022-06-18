import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

GameDatabase.celestials.pelle.strikes = {
  infinity: {
    id: 1,
    requirementDescription: "Reach Infinity",
    penaltyDescription: () => `Antimatter Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
    rewardDescription: () => `Unlock ${Pelle.modalTools.wordCycle(PelleRifts.vacuum.name)}`,
    rift: () => PelleRifts.vacuum
  },
  powerGalaxies: {
    id: 2,
    requirementDescription: "Power-up Galaxies",
    penaltyDescription: () => `Infinity Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
    rewardDescription: () => `Unlock ${Pelle.modalTools.wordCycle(PelleRifts.decay.name)}`,
    rift: () => PelleRifts.decay
  },
  eternity: {
    id: 3,
    requirementDescription: "Reach Eternity",
    penaltyDescription: () => `Replicanti speed scales harsher after ${format(DC.E2000)}`,
    rewardDescription: () => `Unlock ${Pelle.modalTools.wordCycle(PelleRifts.chaos.name)}`,
    rift: () => PelleRifts.chaos
  },
  ECs: {
    id: 4,
    requirementDescription: () => `Reach ${formatInt(115)} TT`,
    penaltyDescription: "Vacuum IP multiplier is reduced in Eternity Challenges",
    rewardDescription: () => `Unlock ${Pelle.modalTools.wordCycle(PelleRifts.recursion.name)}`,
    rift: () => PelleRifts.recursion
  },
  dilation: {
    id: 5,
    requirementDescription: "Dilate Time",
    penaltyDescription: "Time Dilation nerfs are always active",
    rewardDescription: () => `Unlock ${Pelle.modalTools.wordCycle(PelleRifts.paradox.name)}`,
    rift: () => PelleRifts.paradox
  }
};
