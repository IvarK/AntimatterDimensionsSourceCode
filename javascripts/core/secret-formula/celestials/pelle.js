"use strict";

GameDatabase.celestials.pelle = {
  upgrades: {
    famineUnlock: {
      id: 1,
      description: "Unlock Famine",
      cost: 25,
      currency: "unstableMatter"
    },
    longerArmageddon: {
      id: 2,
      description: "Armageddon happens every 5 seconds",
      cost: 200,
      currency: "unstableMatter"
    },
    timeMultToUnstable: {
      id: 3,
      description: "Get more unstable matter based on Armageddon duration",
      cost: 20,
      currency: "famine",
      effect: () => (player.records.thisReality.realTime / 500) ** 1.1,
      formatEffect: x => formatX(x, 2, 2)
    },
    ipGain: {
      id: 4,
      description: "You can gain IP on Infinity again",
      cost: 1e4,
      currency: "unstableMatter"
    },
    achievementsBack: {
      id: 5,
      description: "You gain back the disabled achievement rewards",
      cost: 100,
      currency: "famine"
    },
    famineRebuyable: {
      id: 6,
      description: "You can spend famine on permanent tickspeed",
      cost: 3e4,
      currency: "unstableMatter"
    },
    retainIP: {
      id: 7,
      description: "You retain IP on Armageddon",
      cost: 200,
      currency: "famine"
    },
    nerfedIPMult: {
      id: 8,
      description: "Get back your IP multipliers, but their effects are raised to the power of 0.3",
      cost: 1e5,
      currency: "unstableMatter"
    },
    famineGain: {
      id: 9,
      description: "Famine gain is twice as fast and produce twice as much",
      cost: 300,
      currency: "famine"
    },
    infDimRetain: {
      id: 10,
      description: "Infinity Dimensions aren't reset on Armageddon",
      cost: 500,
      currency: "famine"
    },
    doubleArmageddon: {
      id: 11,
      description: "Armageddon takes twice as long",
      cost: 2e5,
      currency: "unstableMatter"
    },
    nerfedGalaxies: {
      id: 12,
      description: "You can buy galaxies, but they are only 1/3rd as effective",
      cost: 1000,
      currency: "famine"
    },
    infinitiedGain: {
      id: 13,
      description: "You gain back the ability to gain multiple infinitied stat per Infinity",
      cost: 1e23,
      currency: "infinityPoints"
    },
    morePermanentTickspeed: {
      id: 14,
      description: "Gain 3x more permanent tickspeed upgrades from Famine buyable",
      cost: 5e5,
      currency: "unstableMatter"
    },
    moreFamine: {
      id: 15,
      description: "Gain 5x more Famine",
      cost: 1e50,
      currency: "infinityPoints"
    },
    antimatterGalaxyBoost: {
      id: 16,
      description: "Galaxies are 10% more effective",
      cost: new Decimal("1e20000"),
      currency: "antimatter",
      effect: 1.1
    },
    pestilenceUnlock: {
      id: 17,
      description: "Unlock Pestilence",
      cost: 3e3,
      currency: "famine"
    },
    passivePrestigeGain: {
      id: 18,
      description: "Gain back infinitied stat generation",
      cost: Number.MAX_VALUE,
      currency: "infinityPoints"
    },
    epGain: {
      id: 19,
      description: "You can gain eternity points",
      cost: new Decimal("1e100000"),
      currency: "antimatter"
    },
    studiesUnlock: {
      id: 20,
      description: "You can buy Time Studies with Time Theorems, but they cost 3x as much",
      cost: 1e5,
      currency: "famine"
    },
    pestilenceRebuyable: {
      id: 21,
      description: "You can buy permanent dimension boosts with Pestilence",
      cost: 100,
      currency: "pestilence"
    }
  },
  rebuyables: {
    permanentTickspeed: {
      id: "permanentTickspeed",
      cost: () => {
        let base = (player.celestials.pelle.rebuyables.permanentTickspeed + 1) * 15;
        if (player.celestials.pelle.rebuyables.permanentTickspeed > 50) {
          base *= Math.pow(1.5, player.celestials.pelle.rebuyables.permanentTickspeed - 50)
        }
        return base;
      },
      description: () => `Gain ${PelleUpgrade.morePermanentTickspeed.canBeApplied ? 30 : 10} permanent tickspeed upgrades`,
      currency: "famine",
      effect: () => {
        let base = player.celestials.pelle.rebuyables.permanentTickspeed * 10
        if (PelleUpgrade.morePermanentTickspeed.canBeApplied) base *= 3;
        return base;
      },
      formatEffect: x => format(x, 2, 0)
    },
    permanentDimensionBoosts: {
      id: "permanentDimensionBoosts",
      cost: () => (player.celestials.pelle.rebuyables.permanentDimensionBoosts + 1) * 25,
      description: "Gain 2 permanent Dimension Boosts",
      currency: "pestilence",
      effect: () => player.celestials.pelle.rebuyables.permanentDimensionBoosts * 2
    },
    permanentGalaxies: {
      id: "permanentGalaxies",
      cost: () => (player.celestials.pelle.rebuyables.permanentGalaxies + 1) * 100,
      description: "Gain a permanent Galaxy",
      currency: "chaos",
      effect: () => player.celestials.pelle.rebuyables.permanentGalaxies
    }
  }
};