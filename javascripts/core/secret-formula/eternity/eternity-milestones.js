"use strict";

GameDatabase.eternity.milestones = {
  autobuyerIPMult: {
    eternities: 1,
    reward: "Unlock the Infinity Point multiplier autobuyer"
  },
  keepAutobuyers: {
    eternities: 2,
    reward: "You start Eternity with all Normal Challenges complete, all normal autobuyers, and infinity broken"
  },
  autobuyerReplicantiGalaxy: {
    eternities: 3,
    reward: "Unlock the Replicanti Galaxy Autobuyer"
  },
  keepInfinityUpgrades: {
    eternities: 4,
    reward: "You start Eternity with all Infinity Upgrades"
  },
  bigCrunchModes: {
    eternities: 5,
    reward: "Unlock more Big Crunch Autobuyer options"
  },
  autoEP: {
    eternities: 6,
    reward: () => {
      const EPmin = getOfflineEPGain(TimeSpan.fromMinutes(1).totalMilliseconds);
      return `While offline, gain ${formatPercents(0.25)} of your best Eternity Points per minute from previous
      Eternities. (Currently ${format(EPmin, 2, 2)} EP/min)`;
    },
  },
  autoIC: {
    eternities: 7,
    reward: "You complete Infinity Challenges as soon as you unlock them (and keep the Dimensional Sacrifice Autobuyer)"
  },
  keepBreakUpgrades: {
    eternities: 8,
    reward: "You keep your Break Infinity Upgrades on Eternity"
  },
  autobuyMaxGalaxies: {
    eternities: 9,
    reward: "Unlock the buy max Antimatter Galaxies Autobuyer mode"
  },
  autobuyMaxDimboosts: {
    eternities: 10,
    reward: "Unlock the buy max Dimension Boost Autobuyer mode"
  },
  autobuyerID1: {
    eternities: 11,
    reward: "Unlock the 1st Infinity Dimension Autobuyer"
  },
  autobuyerID2: {
    eternities: 12,
    reward: "Unlock the 2nd Infinity Dimension Autobuyer"
  },
  autobuyerID3: {
    eternities: 13,
    reward: "Unlock the 3rd Infinity Dimension Autobuyer"
  },
  autobuyerID4: {
    eternities: 14,
    reward: "Unlock the 4th Infinity Dimension Autobuyer"
  },
  autobuyerID5: {
    eternities: 15,
    reward: "Unlock the 5th Infinity Dimension Autobuyer"
  },
  autobuyerID6: {
    eternities: 16,
    reward: "Unlock the 6th Infinity Dimension Autobuyer"
  },
  autobuyerID7: {
    eternities: 17,
    reward: "Unlock the 7th Infinity Dimension Autobuyer"
  },
  autobuyerID8: {
    eternities: 18,
    reward: "Unlock the 8th Infinity Dimension Autobuyer"
  },
  autoUnlockID: {
    eternities: 25,
    reward: "You automatically unlock Infinity Dimensions upon reaching them"
  },
  unlockAllND: {
    eternities: 30,
    reward: "Start with all Antimatter Dimensions available for purchase"
  },
  autobuyerReplicantiChance: {
    eternities: 40,
    reward: "Unlock the Replicanti Chance Upgrade Autobuyer"
  },
  unlockReplicanti: {
    eternities: 50,
    reward: "You start with Replicanti unlocked"
  },
  autobuyerReplicantiInterval: {
    eternities: 60,
    reward: "Unlock the Replicanti Interval Upgrade Autobuyer"
  },
  autobuyerReplicantiMaxGalaxies: {
    eternities: 80,
    reward: "Unlock the Max Replicanti Galaxy Upgrade Autobuyer"
  },
  autobuyerEternity: {
    eternities: 100,
    reward: "Unlock autobuyer for Eternities."
  },
  autoEternities: {
    eternities: 200,
    reward: () => {
      const eternities = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds, true);
      // As far as I can tell, using templates here as Codefactor wants would lead to nested templates,
      // which seems messy to say the least.
      // eslint-disable-next-line prefer-template
      return `While offline, gain Eternities at ${formatPercents(0.5)} the rate of your fastest Eternity. ` +
        (eternities.gt(0) ? `(currently ${format(eternities, 2, 2)}/hour)` : "(disabled)");
    },
  },
  autoInfinities: {
    eternities: 1000,
    reward: () => {
      const infinities = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds, true);
      // eslint-disable-next-line prefer-template
      return `While offline, gain Infinitied stat equal to ${formatPercents(0.5)}
        your best Infinitied stat/hour this Eternity. ` +
        (infinities.gt(0) ? `(currently ${format(infinities, 2, 2)}/hour)` : "(disabled)");
    },
  }
};
