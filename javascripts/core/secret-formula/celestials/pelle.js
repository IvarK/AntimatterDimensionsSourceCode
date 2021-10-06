"use strict";

GameDatabase.celestials.pelle = {
  upgrades: {
    
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