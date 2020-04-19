"use strict";

GameDatabase.infinity.breakUpgrades = (function() {
  function rebuyable(config) {
    const maxUpgrades = config.maxUpgrades;
    return {
      id: config.id,
      cost: () => config.initialCost * Math.pow(config.costIncrease, player.infinityRebuyables[config.id]),
      maxUpgrades,
      description: config.description,
      effect: () => player.infinityRebuyables[config.id],
      formatEffect: value => (value === maxUpgrades
        ? `Default: ${formatX(10)} | Currently: ${formatX(10 - value)}`
        : `Default: ${formatX(10)} | Currently: ${formatX(10 - value)} Next: ${formatX(10 - value - 1)}`
      ),
      staticEffect: true,
      formatCost: value => format(value, 2, 0)
    };
  }

  return {
    totalAMMult: {
      id: "totalMult",
      cost: 1e4,
      description: "Normal dimensions gain a multiplier based on total antimatter produced",
      effect: () => Math.pow(player.totalAntimatter.exponent + 1, 0.5),
      formatEffect: value => formatX(value, 2, 2)
    },
    currentAMMult: {
      id: "currentMult",
      cost: 5e4,
      description: "Normal dimensions gain a multiplier based on current antimatter",
      effect: () => Math.pow(player.antimatter.exponent + 1, 0.5),
      formatEffect: value => formatX(value, 2, 2)
    },
    galaxyBoost: {
      id: "postGalaxy",
      cost: 5e11,
      description: "Galaxies are 50% stronger",
      effect: 1.5
    },
    infinitiedMult: {
      id: "infinitiedMult",
      cost: 1e5,
      description: "Normal dimensions gain a multiplier based on infinitied stat",
      effect: () => 1 + Player.totalInfinitied.pLog10() * 10,
      formatEffect: value => formatX(value, 2, 2)
    },
    achievementMult: {
      id: "achievementMult",
      cost: 1e6,
      description: "Normal dimensions gain a multiplier based on achievements completed",
      effect: () => Math.max(Math.pow((Achievements.effectiveCount - 30), 3) / 40, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
    slowestChallengeMult: {
      id: "challengeMult",
      cost: 1e7,
      description: "Normal dimensions gain a multiplier based on slowest challenge run",
      effect: () => Decimal.max(50 / Time.worstChallenge.totalMinutes, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
    infinitiedGen: {
      id: "infinitiedGeneration",
      cost: 2e7,
      description: "Passively generate infinitied stat based on your fastest infinity",
      effect: () => player.bestInfinityTime,
      formatEffect: value => {
        const period = value >= 999999999999
          ? "hundred or so years"
          : Time.bestInfinity.times(5);
        return `1 Infinity every ${period}`;
      }
    },
    bulkDimBoost: {
      id: "bulkBoost",
      cost: 5e9,
      description: "Option to bulk buy Dimension Boosts"
    },
    autobuyerSpeed: {
      id: "autoBuyerUpgrade",
      cost: 1e15,
      description: "Autobuyers work twice as fast"
    },
    tickspeedCostMult: rebuyable({
      id: 0,
      initialCost: 3e6,
      costIncrease: 5,
      maxUpgrades: 8,
      description: "Reduce post-infinity tickspeed cost multiplier scaling",

    }),
    dimCostMult: rebuyable({
      id: 1,
      initialCost: 1e8,
      costIncrease: 5e3,
      maxUpgrades: 7,
      description: "Reduce post-infinity Normal Dimension cost multiplier scaling"
    }),
    ipGen: {
      cost: () => player.offlineProdCost,
      description: () => {
        let generation = `Generate ${player.offlineProd}%`;
        if (!BreakInfinityUpgrade.ipGen.isMaxed) {
          generation += ` ➜ ${player.offlineProd + 5}%`;
        }
        return `${generation} of your best IP/min from last 10 infinities, works offline`;
      },
      // Cutting corners: this is not actual effect (player.offlineProd is), but
      // it is actual IPPM that is displyed on upgrade
      effect: () => Player.bestRunIPPM.times(player.offlineProd / 100),
      formatEffect: value => `${format(value, 2, 1)} IP/min`
    }
  };
}());
