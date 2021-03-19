"use strict";

GameDatabase.eternity.upgrades = {
  idMultEP: {
    id: 1,
    cost: 5,
    description: () => `Infinity Dimensions multiplier based on unspent Eternity Points (x+${formatInt(1)})`,
    effect: () => Currency.eternityPoints.value.plus(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  idMultEternities: {
    id: 2,
    cost: 10,
    description: () => `Infinity Dimension multiplier based on Eternities
      ((x/${formatInt(200)})^log4(${formatInt(2)}x), softcap at ${format(1e5)})`,
    effect() {
      const log4 = Math.log4;
      const eterPreCap = player.eternities.clampMax(1e5).toNumber();
      const base = eterPreCap / 200 + 1;
      const pow = Math.log(eterPreCap * 2 + 1) / log4;
      const multPreCap = Math.pow(base, pow);
      const eterPostCap = player.eternities.sub(1e5);
      const mult1 = eterPostCap.divide(200).plus(1);
      const mult2 = eterPostCap.times(2).plus(1).log(Math.E) / log4;
      const multPostCap = mult1.times(mult2).clampMin(1);
      return multPostCap.times(multPreCap);
    },
    formatEffect: value => formatX(value, 2, 1)
  },
  idMultICRecords: {
    id: 3,
    cost: 5e4,
    description: "Infinity Dimensions multiplier based on sum of Infinity Challenge times",
    effect: () => Decimal.pow(2, 30 / Time.infinityChallengeSum.totalSeconds),
    cap: Decimal.pow(2, 30 / 0.61),
    formatEffect: value => formatX(value, 2, 1)
  },
  tdMultAchs: {
    id: 4,
    cost: 1e16,
    description: "Your Achievement bonus affects Time Dimensions",
    effect: () => Achievements.power,
    formatEffect: value => formatX(value, 2, 1)
  },
  tdMultTheorems: {
    id: 5,
    cost: 1e40,
    description: "Time Dimensions are multiplied by your unspent Time Theorems",
    effect: () => Decimal.max(player.timestudy.theorem, 1),
    formatEffect: value => formatX(value, 2, 1)
  },
  tdMultRealTime: {
    id: 6,
    cost: 1e50,
    description: "Time Dimensions are multiplied by days played",
    effect: () => Time.totalTimePlayed.totalDays,
    formatEffect: value => formatX(value, 2, 1)
  }
};
