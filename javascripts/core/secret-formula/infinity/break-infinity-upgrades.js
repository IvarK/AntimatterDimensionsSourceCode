"use strict";

GameDatabase.infinity.breakUpgrades = (function() {
  function rebuyable(config) {
    const effectFunction = config.effect || (x => x);
    return {
      id: config.id,
      cost: () => config.initialCost * Math.pow(config.costIncrease, player.infinityRebuyables[config.id]),
      maxUpgrades: config.maxUpgrades,
      description: config.description,
      effect: () => effectFunction(player.infinityRebuyables[config.id]),
      formatEffect: config.formatEffect || (value => (value === config.maxUpgrades
        ? `Default: ${formatX(10)} | Currently: ${formatX(10 - value)}`
        : `Default: ${formatX(10)} | Currently: ${formatX(10 - value)} Next: ${formatX(10 - value - 1)}`
      )),
      formatCost: value => format(value, 2, 0),
      noTitle: !config.title
    };
  }

  return {
    totalAMMult: {
      id: "totalMult",
      cost: 1e4,
      description: "Antimatter Dimensions gain a multiplier based on total antimatter produced",
      effect: () => Math.pow(player.totalAntimatter.exponent + 1, 0.5),
      formatEffect: value => formatX(value, 2, 2)
    },
    currentAMMult: {
      id: "currentMult",
      cost: 5e4,
      description: "Antimatter Dimensions gain a multiplier based on current antimatter",
      effect: () => Math.pow(Currency.antimatter.exponent + 1, 0.5),
      formatEffect: value => formatX(value, 2, 2)
    },
    galaxyBoost: {
      id: "postGalaxy",
      cost: 5e11,
      description: () => `Galaxies are ${formatPercents(0.5)} stronger`,
      effect: 1.5
    },
    infinitiedMult: {
      id: "infinitiedMult",
      cost: 1e5,
      description: "Antimatter Dimensions gain a multiplier based on Infinitied stat",
      effect: () => 1 + Player.totalInfinitied.pLog10() * 10,
      formatEffect: value => formatX(value, 2, 2)
    },
    achievementMult: {
      id: "achievementMult",
      cost: 1e6,
      description: "Antimatter Dimensions gain a multiplier based on achievements completed",
      effect: () => Math.max(Math.pow((Achievements.effectiveCount - 30), 3) / 40, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
    slowestChallengeMult: {
      id: "challengeMult",
      cost: 1e7,
      description: "Antimatter Dimensions gain a multiplier based on slowest challenge run",
      effect: () => Decimal.max(50 / Time.worstChallenge.totalMinutes, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
    infinitiedGen: {
      id: "infinitiedGeneration",
      cost: 2e7,
      description: "Passively generate Infinitied stat based on your fastest Infinity",
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
      description: "Autobuyers purchased with antimatter or unlocked from Normal Challenges work twice as fast"
    },
    tickspeedCostMult: rebuyable({
      id: 0,
      initialCost: 1e6,
      costIncrease: 5,
      maxUpgrades: 8,
      description: "Reduce post-infinity tickspeed cost multiplier scaling",
      title: false,
    }),
    dimCostMult: rebuyable({
      id: 1,
      initialCost: 1e7,
      costIncrease: 5e3,
      maxUpgrades: 7,
      description: "Reduce post-infinity Antimatter Dimension cost multiplier scaling",
      title: false,
    }),
    ipGen: rebuyable({
      id: 2,
      initialCost: 1e7,
      costIncrease: 10,
      maxUpgrades: 10,
      effect: value => Player.bestRunIPPM.times(value / 20),
      description: () => {
        let generation = `Generate ${formatInt(5 * player.infinityRebuyables[2])}%`;
        if (!BreakInfinityUpgrade.ipGen.isCapped) {
          generation += ` ➜ ${formatInt(5 * (1 + player.infinityRebuyables[2]))}%`;
        }
        return `${generation} of your best IP/min from last 10 infinities, works offline`;
      },
      formatEffect: value => `${format(value, 2, 1)} IP/min`,
      title: true
    })
  };
}());
