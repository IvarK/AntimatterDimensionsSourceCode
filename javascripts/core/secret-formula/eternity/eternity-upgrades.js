"use strict";

GameDatabase.eternity.upgrades = {
  idMultEP: {
    id: 1,
    cost: 5,
    description: "Infinity Dimensions multiplier based on unspent EP (x+1)",
    effect: () => player.eternityPoints.plus(1),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  idMultEternities: {
    id: 2,
    cost: 10,
    description: () => `Infinity Dimension multiplier based on Eternities ((x/200)^log4(2x), softcap at ${shorten(1e5)})`,
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
    formatEffect: value => `${shortenMoney(value)}x`
  },
  idMultICRecords: {
    id: 3,
    cost: 5e4,
    description: "Infinity Dimensions multiplier based on sum of Infinity Challenge times",
    effect() {
      const sumOfRecords = Math.max(
        Time.infinityChallengeSum.totalMilliseconds,
        Effects.min(750, Achievement(112))
      );
      return Decimal.pow(2, 30000 / sumOfRecords);
    },
    formatEffect: value => `${shortenMoney(value)}x`
  },
  tdMultAchs: {
    id: 4,
    cost: 1e16,
    description: "Your achievement bonus affects Time Dimensions",
    effect: () => Player.achievementPower,
    formatEffect: value => `${shortenMoney(value)}x`
  },
  tdMultTheorems: {
    id: 5,
    cost: 1e40,
    description: "Time Dimensions are multiplied by your unspent Time Theorems",
    effect: () => Decimal.max(player.timestudy.theorem, 1),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  tdMultRealTime: {
    id: 6,
    cost: 1e50,
    description: "Time Dimensions are multiplied by days played",
    effect: () => Time.totalTimePlayed.totalDays,
    formatEffect: value => `${shortenMoney(value)}x`
  }
};
