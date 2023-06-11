import { DC } from "../../constants";

export const eternityUpgrades = {
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
      ((x/${formatInt(200)})^log4(${formatInt(2)}x), softcap at ${format(1e5)} Eternities)`,
    effect() {
      const log4 = Math.log4;
      const eterPreCap = Currency.eternities.value.clampMax(1e5).toNumber();
      const base = eterPreCap / 200 + 1;
      const pow = Math.log(eterPreCap * 2 + 1) / log4;
      const multPreCap = Math.pow(base, pow);
      const eterPostCap = Currency.eternities.value.sub(1e5);
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
    // The cap limits this at a lower value, but we also need an explicit cap here because very old versions have
    // allowed EC12 to make all the challenge records sum to zero (causing a division by zero here)
    effect: () => DC.D2.pow(30 / Math.clampMin(Time.infinityChallengeSum.totalSeconds, 0.1)),
    cap: DC.D2P30D0_61,
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
    effect: () => Decimal.max(Currency.timeTheorems.value, 1),
    formatEffect: value => formatX(value, 2, 1)
  },
  tdMultRealTime: {
    id: 6,
    cost: 1e50,
    description: () => (Pelle.isDoomed
      ? "Time Dimensions are multiplied by days played in this Armageddon"
      : "Time Dimensions are multiplied by days played"
    ),
    effect: () => (Pelle.isDoomed ? 1 + Time.thisReality.totalDays : Math.max(Time.totalTimePlayed.totalDays, 1)),
    formatEffect: value => formatX(value, 2, 1)
  }
};
