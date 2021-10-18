"use strict";

GameDatabase.celestials.pelle = {
  upgrades: {
    antimatterDimBaseMult: {
      id: 1,
      description: "7x to all Antimatter Dimension multipliers",
      cost: 10,
      currency: "remnants",
      effect: 7
    },
    antimatterDimAutobuyers1: {
      id: 2,
      description: "Gain back autobuyers for Antimatter Dimensions 1 and 2",
      cost: 10,
      currency: "remnants"
    },
    starterRemnantMult: {
      id: 3,
      description: "Multiply Remnant gain by the number of upgrades",
      cost: 10,
      currency: "remnants",
      effect: () => player.celestials.pelle.upgrades.size,
      formatEffect: x => formatX(x, 0, 0)
    },
    remnantGainLimitMult: {
      id: 4,
      description: "Multiply Remnant gain limit by 2 for each upgrade bought",
      cost: 10,
      currency: "remnants",
      effect: () => 2 ** PelleUpgrade.all.filter(u => u.isBought).length,
      formatEffect: x => formatX(x, 2, 2)
    },
    antimatterDimAutobuyers2: {
      id: 5,
      description: "Gain back autobuyers for Antimatter Dimensions 3 and 4",
      cost: 150,
      currency: "remnants"
    },
    dimensionPurchaseMultiplier: {
      id: 6,
      description: "Dimension purchase multiplier is 1.5x bigger",
      cost: 150,
      currency: "remnants",
      effect: 1.5
    },
    longerArmageddon: {
      id: 7,
      description: "Armageddon lasts 2x as much",
      cost: 150,
      currency: "remnants",
      effect: 2
    },
    remnantsBasedOnArmageddon: {
      id: 8,
      description: "Get more remnants based on armageddon length",
      cost: 150,
      currency: "remnants",
      effect: () => Pelle.armageddonInterval.dividedBy(5000).pow(1.05),
      formatEffect: x => formatX(x, 2, 2)
    },
    dimBoostAutobuyer: {
      id: 9,
      description: "Get back Dimensional Boost Autobuyer",
      cost: 2250,
      currency: "remnants",
    },
    antimatterDimAutobuyers3: {
      id: 10,
      description: "Gain back autobuyers for Antimatter Dimensions 5 and 6",
      cost: 2250,
      currency: "remnants"
    },
    IPGain: {
      id: 11,
      description: () => `You can gain IP again`,
      cost: 2250,
      currency: "remnants",
    },
    longerArmageddonBasedOnRemnants: {
      id: 12,
      description: () => `Make armageddon last longer based on how close to the limit your remnant amount is`,
      cost: 2250,
      currency: "remnants",
      effect: () => player.celestials.pelle.remnants.div(Pelle.remnantsLimit).times(4).plus(1),
      formatEffect: x => formatX(x, 2, 2)
    },
    tickspeedAutoBuyer: {
      id: 13,
      description: "Get back Tickspeed Autobuyer",
      cost: 30000,
      currency: "remnants",
    },
    IPMults: {
      id: 14,
      description: "Get back IP multipliers, but raise their power to 0.3",
      cost: 30000,
      currency: "remnants",
    },
    antimatterDimAutobuyers4: {
      id: 15,
      description: () => `Gain back autobuyers for Antimatter Dimensions 7 and 8`,
      cost: 1.5e5,
      currency: "remnants",
      effect: 1000
    },
  },
  rebuyables: {
    permanentTickspeed: {
      id: "permanentTickspeed",
      cost: () => {
        let base = (player.celestials.pelle.rebuyables.permanentTickspeed + 1) * 15;

        if (player.celestials.pelle.rebuyables.permanentTickspeed > 50) {
          base *= Math.pow(1.5, player.celestials.pelle.rebuyables.permanentTickspeed - 50);
        }

        if (player.celestials.pelle.rebuyables.permanentTickspeed > 100) {
          base *= Math.pow(3, player.celestials.pelle.rebuyables.permanentTickspeed - 100);
        }

        return base;
      },
      description: () => `Gain ${formatX(10)} permanent tickspeed upgrades`,
      currency: "famine",
      effect: () => {
        const base = player.celestials.pelle.rebuyables.permanentTickspeed * 10;
        return base;
      },
      formatEffect: x => format(x, 2, 0)
    },
    permanentDimensionBoosts: {
      id: "permanentDimensionBoosts",
      cost: () => {
        let base = (player.celestials.pelle.rebuyables.permanentDimensionBoosts + 1) * 25;

        if (player.celestials.pelle.rebuyables.permanentDimensionBoosts > 25) {
          base *= Math.pow(1.5, player.celestials.pelle.rebuyables.permanentDimensionBoosts - 25);
        }
        
        if (player.celestials.pelle.rebuyables.permanentDimensionBoosts > 50) {
          base *= Math.pow(3, player.celestials.pelle.rebuyables.permanentDimensionBoosts - 50);
        }

        return base;
      },
      description: () => `Gain ${formatX(10)} permanent Dimension Boosts`,
      currency: "pestilence",
      effect: () => {
        const base = player.celestials.pelle.rebuyables.permanentDimensionBoosts * 10;
        return base;
      },
      formatEffect: x => format(x, 2, 0)
    },
    permanentGalaxies: {
      id: "permanentGalaxies",
      cost: () => {
        let base = (player.celestials.pelle.rebuyables.permanentGalaxies + 1) * 100;

        if (player.celestials.pelle.rebuyables.permanentGalaxies > 10) {
          base *= Math.pow(1.5, player.celestials.pelle.rebuyables.permanentGalaxies - 10);
        }
        
        if (player.celestials.pelle.rebuyables.permanentGalaxies > 20) {
          base *= Math.pow(3, player.celestials.pelle.rebuyables.permanentGalaxies - 20);
        }

        return base;
      },
      description: () => `Gain a permanent Galaxy`,
      currency: "chaos",
      effect: () => {
        const base = player.celestials.pelle.rebuyables.permanentGalaxies;
        return base;
      },
      formatEffect: x => format(x, 2, 0)
    }
  },
  strikes: {
    infinity: {
      id: 1,
      requirement: () => player.antimatter.gte(Number.MAX_VALUE),
      requirementDescription: "Reach Infinity",
      penaltyDescription: "Antimatter Dimensions are raised to power of 0.8",
      rewardDescription: "Unlock Famine"
    }
  }
};