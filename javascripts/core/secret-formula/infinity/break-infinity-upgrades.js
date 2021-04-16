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
      effect: () => Math.pow(player.records.totalAntimatter.exponent + 1, 0.5),
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
      description: () => `All Galaxies are ${formatPercents(0.5)} stronger`,
      effect: 1.5
    },
    infinitiedMult: {
      id: "infinitiedMult",
      cost: 1e5,
      description: "Antimatter Dimensions gain a multiplier based on Infinitied stat",
      effect: () => 1 + Currency.infinitiesTotal.value.pLog10() * 10,
      formatEffect: value => formatX(value, 2, 2)
    },
    achievementMult: {
      id: "achievementMult",
      cost: 1e6,
      description: "Additional multiplier to Antimatter Dimensions based on Achievements completed",
      effect: () => Math.max(Math.pow((Achievements.effectiveCount - 30), 3) / 40, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
    slowestChallengeMult: {
      id: "challengeMult",
      cost: 1e7,
      description: "Antimatter Dimensions gain a multiplier based on slowest challenge run",
      effect: () => Decimal.clampMin(50 / Time.worstChallenge.totalMinutes, 1),
      formatEffect: value => formatX(value, 2, 2),
      hasCap: true,
      cap: new Decimal(3e4)
    },
    infinitiedGen: {
      id: "infinitiedGeneration",
      cost: 2e7,
      description: "Passively generate Infinitied stat based on your fastest Infinity",
      effect: () => player.records.bestInfinity.time,
      formatEffect: value => {
        if (value === Number.MAX_VALUE) return "No Infinity generation";
        let infinities = new Decimal(1);
        infinities = infinities.timesEffectsOf(
          RealityUpgrade(5),
          RealityUpgrade(7)
        );
        infinities = infinities.times(getAdjustedGlyphEffect("infinityinfmult"));
        infinities = infinities.times(RA_UNLOCKS.TT_BOOST.effect.infinity());
        return `${format(infinities)}
          ${pluralize("Infinity", infinities, "Infinities")}
          every ${Time.bestInfinity.times(5).toStringShort()}`;
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
      description: "Autobuyers unlocked or improved by Normal Challenges work twice as fast"
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
        return `${generation} of your best IP/min from last 10 Infinities, works offline`;
      },
      formatEffect: value => `${format(value, 2, 1)} IP/min`,
      title: true
    })
  };
}());
