GameDatabase.infinity.breakUpgrades = {
  totalAMMult: {
    id: "totalMult",
    cost: 1e4,
    effect: () => Math.pow(player.totalmoney.exponent + 1, 0.5)
  },
  currentAMMult: {
    id: "currentMult",
    cost: 5e4,
    effect: () => Math.pow(player.money.exponent + 1, 0.5)
  },
  galaxyBoost: {
    id: "postGalaxy",
    cost: 5e11,
    effect: () => 1.5
  },
  infinitiedMult: {
    id: "infinitiedMult",
    cost: 1e5,
    effect: () => 1 + Math.log10(Player.totalInfinitied + 1) * 10
  },
  achievementMult: {
    id: "achievementMult",
    cost: 1e6,
    effect: () => Math.max(Math.pow((player.achievements.length - 30 - getSecretAchAmount()), 3) / 40, 1)
  },
  slowestChallengeMult: {
    id: "challengeMult",
    cost: 1e7,
    effect: () => Decimal.max(10 * 3000 / worstChallengeTime, 1)
  },
  infinitiedGen: {
    id: "infinitiedGeneration",
    cost: 2e7
  },
  bulkDimBoost: {
    id: "bulkBoost",
    cost: 5e9
  },
  autobuyerSpeed: {
    id: "autoBuyerUpgrade",
    cost: 1e15
  },
};