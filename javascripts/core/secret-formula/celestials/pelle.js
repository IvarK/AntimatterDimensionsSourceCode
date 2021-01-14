"use strict";

GameDatabase.celestials.pelle = {
  upgrades: {
    famineUnlock: {
      id: 1,
      description: "Unlock Famine",
      cost: 2e3,
      currency: "unstableMatter"
    },
    longerArmageddon: {
      id: 2,
      description: "Armageddon happens every 5 seconds",
      cost: 1e4,
      currency: "unstableMatter"
    },
    timeMultToUnstable: {
      id: 3,
      description: "Get more unstable matter based on Armageddon duration",
      cost: 20,
      currency: "famine",
      effect: () => player.records.thisReality.realTime / 500 ** 1.1,
      formatEffect: x => formatX(x, 2, 2)
    },
    ipGain: {
      id: 4,
      description: "You can gain IP on Infinity again",
      cost: 3e4,
      currency: "unstableMatter"
    }
  },
  rebuyables: {
    permanentTickspeed: {
      id: "permanentTickspeed",
      cost: () => (player.celestials.pelle.rebuyables.permanentTickspeed + 1) * 5,
      description: "Gain a permanent tickspeed upgrade",
      currency: "famine",
    },
    permanentDimensionBoosts: {
      id: "permanentDimensionBoosts",
      cost: () => (player.celestials.pelle.rebuyables.permanentDimensionBoosts + 1) * 25,
      description: "Gain a permanent Dimension Boost",
      currency: "pestilence",
    },
    permanentGalaxies: {
      id: "permanentGalaxies",
      cost: () => (player.celestials.pelle.rebuyables.permanentGalaxies + 1) * 100,
      description: "Gain a permanent Galaxy",
      currency: "chaos",
    }
  }
};