// WIP
GameDatabase.infinity.upgrades = {
  totalTimeMult: {
    id: "timeMult",
    cost: 1,
    effect: () => Math.pow(Time.totalTimePlayed.totalMinutes / 2, 0.15)
  },
  dim18mult: {
    id: "18Mult",
    cost: 1,
    effect: () => dimInfinityMult()
  },
  dim27mult: {
    id: "27Mult",
    cost: 1,
    effect: () => dimInfinityMult()
  },
  dim36mult: {
    id: "36Mult",
    cost: 1,
    effect: () => dimInfinityMult()
  },
  dim45mult: {
    id: "45Mult",
    cost: 1,
    effect: () => dimInfinityMult()
  },
  resetBoost: {
    id: "resetBoost",
    cost: 1,
    effect: () => 9
  },
  buy10Mult: {
    id: "dimMult",
    cost: 1,
    effect: () => 1.1
  },
  galaxyBoost: {
    id: "galaxyBoost",
    cost: 2,
    effect: () => 2
  },
  thisInfinityTimeMult: {
    id: "timeMult2",
    cost: 3,
    effect: () => Decimal.max(Math.pow(Time.thisInfinity.totalMinutes / 4, 0.25), 1)
  },
  unspentIPMult: {
    id: "unspentBonus",
    cost: 5,
    effect: () => player.infinityPoints.dividedBy(2).pow(1.5).plus(1)
  },
  dimboostMult: {
    id: "resetMult",
    cost: 7,
    effect: () => 2.5
  },
  ipGen: {
    id: "passiveGen",
    cost: 10
  },
  skipReset1: {
    id: "skipReset1",
    cost: 20
  },
  skipReset2: {
    id: "skipReset2",
    cost: 40,
  },
  skipReset3: {
    id: "skipReset3",
    cost: 80,
  },
  skipResetGalaxy: {
    id: "skipResetGalaxy",
    cost: 300,
  }
};

function dimInfinityMult() {
  return 1 + (Player.totalInfinitied * 0.2);
}