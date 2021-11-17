import { GameDatabase } from "../../game-database.js";

GameDatabase.eternity.timeStudies.dilation = [
  {
    id: 1,
    description: "Unlock Time Dilation",
    cost: 5000,
    requirement: () => {
      if (Ra.has(RA_UNLOCKS.AUTO_DILATION_UNLOCK) && Currency.timeTheorems.max.gte(13000) && !isInCelestialReality()) {
        return true;
      }
      const tsRequirement = [231, 232, 233, 234].some(id => TimeStudy(id).isBought);
      if (Perk.bypassECDilation.isBought) return tsRequirement;
      const ecRequirement = EternityChallenge(11).isFullyCompleted && EternityChallenge(12).isFullyCompleted;
      const ttRequirement = Currency.timeTheorems.max.gte(13000);
      return tsRequirement && ecRequirement && ttRequirement;
    }
  },
  {
    id: 2,
    description: "Unlock the 5th Time Dimension",
    cost: 1e6,
    requirement: () => PlayerProgress.dilationUnlocked()
  },
  {
    id: 3,
    description: "Unlock the 6th Time Dimension",
    cost: 1e7,
    requirement: () => TimeStudy.timeDimension(5).isBought
  },
  {
    id: 4,
    description: "Unlock the 7th Time Dimension",
    cost: 1e8,
    requirement: () => TimeStudy.timeDimension(6).isBought
  },
  {
    id: 5,
    description: "Unlock the 8th Time Dimension",
    cost: 1e9,
    requirement: () => TimeStudy.timeDimension(7).isBought
  },
  {
    id: 6,
    description: "Unlock Reality",
    cost: () => 1,
    requirement: () => TimeStudy.timeDimension(8).isBought &&
      player.records.thisReality.maxEP.exponent >= 4000 &&
      (Perk.firstPerk.isBought ? true : Achievements.preReality.every(a => a.isUnlocked))
  }
];
