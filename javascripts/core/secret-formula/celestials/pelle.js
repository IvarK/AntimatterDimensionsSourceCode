import { GameDatabase } from "../game-database.js";

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