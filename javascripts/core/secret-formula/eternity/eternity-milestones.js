"use strict";

GameDatabase.eternity.milestones = {
  autobuyerIPMult: {
    eternities: 1,
    reward: "Unlock IP multiplier autobuyer"
  },
  keepAutobuyers: {
    eternities: 2,
    reward: "You keep your autobuyers on Eternity"
  },
  autobuyerReplicantiGalaxy: {
    eternities: 3,
    reward: "Unlock Replicanti galaxy autobuyer"
  },
  keepInfinityUpgrades: {
    eternities: 4,
    reward: "You keep your infinity upgrades on Eternity"
  },
  bigCrunchModes: {
    eternities: 5,
    reward: "Unlock more Big Crunch autobuyer options"
  },
  autoEP: {
    eternities: 6,
    rewardFn: () => {
      const EPmin = getOfflineEPGain(TimeSpan.fromMinutes(1).totalMilliseconds)
      return `Only while offline, gain 25% of your best EP/min. Currently ${shorten(EPmin, 2, 2)} EP/min`;
    },
    reward: "Only while offline, gain 25% of your best EP/min. Currently"
  },
  autoIC: {
    eternities: 7,
    reward: "You complete Infinity Challenges as soon as you unlock them (you get sacrifice autobuyer immediately)"
  },
  keepBreakUpgrades: {
    eternities: 8,
    reward: "You keep your Breaking Infinity upgrades on Eternity"
  },
  autobuyMaxGalaxies: {
    eternities: 9,
    reward: "Unlock autobuy max Antimatter Galaxies"
  },
  autobuyMaxDimboosts: {
    eternities: 10,
    reward: "Unlock autobuy max Dimension Boosts"
  },
  autobuyerID1: {
    eternities: 11,
    reward: "Unlock autobuyer for the 1st Infinity Dimension"
  },
  autobuyerID2: {
    eternities: 12,
    reward: "Unlock autobuyer for the 2nd Infinity Dimension"
  },
  autobuyerID3: {
    eternities: 13,
    reward: "Unlock autobuyer for the 3rd Infinity Dimension"
  },
  autobuyerID4: {
    eternities: 14,
    reward: "Unlock autobuyer for the 4th Infinity Dimension"
  },
  autobuyerID5: {
    eternities: 15,
    reward: "Unlock autobuyer for the 5th Infinity Dimension"
  },
  autobuyerID6: {
    eternities: 16,
    reward: "Unlock autobuyer for the 6th Infinity Dimension"
  },
  autobuyerID7: {
    eternities: 17,
    reward: "Unlock autobuyer for the 7th Infinity Dimension"
  },
  autobuyerID8: {
    eternities: 18,
    reward: "Unlock autobuyer for the 8th Infinity Dimension"
  },
  autoUnlockID: {
    eternities: 25,
    reward: "You automatically unlock Infinity Dimensions upon reaching them"
  },
  unlockAllND: {
    eternities: 30,
    reward: "Start with all Normal Dimensions available for purchase"
  },
  autobuyerReplicantiChance: {
    eternities: 40,
    reward: "Unlock autobuyer for the Replicanti chance upgrade"
  },
  unlockReplicanti: {
    eternities: 50,
    reward: "You start with Replicanti unlocked"
  },
  autobuyerReplicantiInterval: {
    eternities: 60,
    reward: "Unlock autobuyer for the Replicanti interval upgrade"
  },
  autobuyerReplicantiMaxGalaxies: {
    eternities: 80,
    reward: "Unlock autobuyer for the Replicanti galaxy upgrade"
  },
  autobuyerEternity: {
    eternities: 100,
    rewardFn: () => {
      const eternities = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds);
      return `Unlock autobuyer for Eternities. 
      Only while offline, gain eternities based on the last 10 eternities. 
      Currently ${shorten(eternities, 2, 2)}/hour`;
    },
  },
  autoInfinities: {
    eternities: 1000,
    rewardFn: () => {
      const infinities = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds);
      return `Only while offline, 
      gain infinities based on the last 10 infinities. Currently ${shorten(infinities, 2, 2)}/hour`;
    },
  }
};