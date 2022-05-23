import { DC } from "../../constants";
import { GameDatabase } from "../game-database";

GameDatabase.celestials.pelle.strikes = {
  infinity: {
    id: 1,
    requirementDescription: "Reach Infinity",
    penaltyDescription: () => `Antimatter Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
    rewardDescription: "Unlock Famine",
    rift: () => PelleRifts.famine
  },
  powerGalaxies: {
    id: 2,
    requirementDescription: "Power-up Galaxies",
    penaltyDescription: () => `Infinity Dimensions are raised to ${formatPow(0.5, 1, 1)}`,
    rewardDescription: "Unlock Pestilence",
    rift: () => PelleRifts.pestilence
  },
  eternity: {
    id: 3,
    requirementDescription: "Reach Eternity",
    penaltyDescription: () => `Replicanti speed scales harsher after ${format(DC.E2000)}`,
    rewardDescription: "Unlock Chaos",
    rift: () => PelleRifts.chaos
  },
  ECs: {
    id: 4,
    requirementDescription: () => `Reach ${formatInt(115)} TT`,
    penaltyDescription: "Famine IP multiplier is reduced in Eternity Challenges",
    rewardDescription: "Unlock War",
    rift: () => PelleRifts.war
  },
  dilation: {
    id: 5,
    requirementDescription: "Dilate Time",
    penaltyDescription: "Time Dilation nerfs are always active",
    rewardDescription: "Unlock Death",
    rift: () => PelleRifts.death
  }
};
