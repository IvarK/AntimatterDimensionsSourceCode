"use strict";

GameDatabase.celestials.pelle = {
  upgrades: {
    antimatterDimBaseMult: {
      id: 1,
      description: "4x to all Antimatter Dimension multipliers",
      cost: 10,
      currency: "remnants",
      effect: 4
    },
    antimatterDimAutobuyers1: {
      id: 2,
      description: "Gain back autobuyers for Antimatter Dimensions 1 and 2",
      cost: 10,
      currency: "remnants"
    },
    starterRemnantMult: {
      id: 3,
      description: "Multiply Remnant gain by 1.5",
      cost: 10,
      currency: "remnants",
      effect: 1.5
    },
    remnantGainLimitMult: {
      id: 4,
      description: "Multiply Remnant gain limit by 1.5 for each upgrade bought",
      cost: 10,
      currency: "remnants",
      effect: () => 1.5 ** PelleUpgrade.all.filter(u => u.isBought).length,
      formatEffect: x => formatX(x, 2, 2)
    },
    antimatterDimAutobuyers2: {
      id: 5,
      description: "Gain back autobuyers for Antimatter Dimensions 3 and 4",
      cost: 50,
      currency: "remnants"
    },
    dimensionPurchaseMultiplier: {
      id: 6,
      description: "Dimension purchase multiplier is 1.5x bigger",
      cost: 50,
      currency: "remnants",
      effect: 1.5
    },
    longerArmageddon: {
      id: 7,
      description: "Armageddon lasts 2x as much",
      cost: 50,
      currency: "remnants",
      effect: 2
    },
    remnantsBasedOnArmageddon: {
      id: 8,
      description: "Get more remnants based on armageddon length",
      cost: 50,
      currency: "remnants",
      effect: () => Pelle.armageddonInterval.dividedBy(5000).pow(1.05),
      formatEffect: x => formatX(x, 2, 2)
    },
    dimBoostAutobuyer: {
      id: 9,
      description: "Get back Dimensional Boost Autobuyer",
      cost: 250,
      currency: "remnants",
      effect: 2
    },
    firstDimBoost: {
      id: 10,
      description: () => `First antimatter dimension is ${formatX(1000)} stronger`,
      cost: 250,
      currency: "remnants",
      effect: 1000
    },
    IPGain: {
      id: 11,
      description: () => `You can gain IP again, but the gain is raised to ${formatPow(0.3, 1, 1)}`,
      cost: 250,
      currency: "remnants",
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
  }
};