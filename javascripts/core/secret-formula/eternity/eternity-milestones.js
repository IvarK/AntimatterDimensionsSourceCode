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
      if (!player.options.offlineProgress) return `This milestone would give offline EP generation, but offline progress
        is currently disabled.`;
      return `While offline, gain ${formatPercents(0.25)} of your best Eternity Points per minute from previous
        Eternities. (Currently ${format(EPmin, 2, 2)} EP/min)`;
    },
    activeCondition: () => `Active as long as neither of the other offline milestones
      (${formatInt(200)} or ${formatInt(1000)}) are also active.`
  },
  autoIC: {
    eternities: 7,
    reward: "You complete Infinity Challenges as soon as you unlock them (and keep the Dimensional Sacrifice Autobuyer)"
  },
  keepBreakUpgrades: {
    eternities: 8,
    reward: "You start Eternity with all Break Infinity Upgrades"
  },
  autobuyMaxGalaxies: {
    eternities: 9,
    reward: "Unlock the buy max Antimatter Galaxies Autobuyer mode"
  },
  unlockReplicanti: {
    eternities: 10,
    reward: "You start with Replicanti unlocked"
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
  replicantiNoReset: {
    eternities: 40,
    reward: `Replicanti Galaxies no longer reset Antimatter, Antimatter Dimensions, 
      Tickspeed, Dimensional Sacrifice, or Dimension Boosts`
  },
  autobuyerReplicantiChance: {
    eternities: 50,
    reward: "Unlock the Replicanti Chance Upgrade Autobuyer"
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
      if (!player.options.offlineProgress) return `This milestone would generate eternities offline, but offline
        progress is currently disabled.`;
      const eternities = getEternitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds, true);
      // As far as I can tell, using templates here as Codefactor wants would lead to nested templates,
      // which seems messy to say the least.
      // eslint-disable-next-line prefer-template
      return `While offline, gain Eternities at ${formatPercents(0.5)} the rate of your fastest Eternity. ` +
        (eternities.gt(0) ? `(currently ${format(eternities, 2, 2)}/hour)` : "(disabled)");
    },
    activeCondition: () => `Must be outside of all Challenges and Dilation
      and the Eternity Autobuyer must be turned on and set to zero EP.`
  },
  autoInfinities: {
    eternities: 1000,
    reward: () => {
      if (!player.options.offlineProgress) return `This milestone would generate infinities offline, but offline
        progress is currently disabled.`;
      const infinities = getInfinitiedMilestoneReward(TimeSpan.fromHours(1).totalMilliseconds, true);
      // eslint-disable-next-line prefer-template
      return `While offline, gain Infinities equal to ${formatPercents(0.5)}
        your best Infinities/hour this Eternity. ` +
        (infinities.gt(0) ? `(currently ${format(infinities, 2, 2)}/hour)` : "(disabled)");
    },
    activeCondition: () => `Must be outside of Normal/Infinity Challenges and outside of EC4 and EC12,
      the Infinity Autobuyer must be turned on and set to time mode with less than ${formatInt(60)} seconds,
      and the Eternity Autobuyer must be turned off.`
  }
};
