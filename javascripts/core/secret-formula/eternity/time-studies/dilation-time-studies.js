"use strict";

GameDatabase.eternity.timeStudies.dilation = [
  {
    id: 1,
    description: "Unlock Time Dilation",
    cost: 5000,
    requirement: () => {
      const tsRequirement = [231, 232, 233, 234].some(id => TimeStudy(id).isBought);
      if (Perk.bypassECDilation.isBought) return tsRequirement;
      const ecRequirement = EternityChallenge(11).isFullyCompleted && EternityChallenge(12).isFullyCompleted;
      const ttRequirement = player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost()).gte(13000);
      return tsRequirement && ecRequirement && ttRequirement;
    }
  },
  {
    id: 2,
    description: "Unlock the 5th Time Dimension",
    cost: 1000000,
    requirement: () => PlayerProgress.dilationUnlocked()
  },
  {
    id: 3,
    description: "Unlock the 6th Time Dimension",
    cost: 10000000,
    requirement: () => TimeStudy.timeDimension(5).isBought
  },
  {
    id: 4,
    description: "Unlock the 7th Time Dimension",
    cost: 100000000,
    requirement: () => TimeStudy.timeDimension(6).isBought
  },
  {
    id: 5,
    description: "Unlock the 8th Time Dimension",
    cost: 1000000000,
    requirement: () => TimeStudy.timeDimension(7).isBought
  },
  {
    id: 6,
    description: "Unlock Reality",
    cost: () => (player.realities > 0 ? 0 : 5000000000),
    requirement: () => TimeStudy.timeDimension(8).isBought &&
      player.eternityPoints.gte("1e4000") &&
      (player.realities > 0 ? true : Achievements.preReality.every(a => a.isUnlocked))
  }
];
