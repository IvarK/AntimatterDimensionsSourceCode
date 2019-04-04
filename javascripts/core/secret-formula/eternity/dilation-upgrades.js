GameDatabase.eternity.dilation = (function() {
  function rebuyableCost(initialCost, increment, id) {
    return Decimal.multiply(initialCost, Decimal.pow(increment, player.dilation.rebuyables[id]));
  }
  function rebuyable(config) {
    return {
      id: config.id,
      cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
      description: config.description,
      effect: () => config.effect(player.dilation.rebuyables[config.id]),
      formatEffect: config.formatEffect,
      formatCost: config.formatCost,
      rebuyable: true
    };
  }
  return {
    dtGain: rebuyable({
      id: 1,
      initialCost: 1e5,
      increment: 10,
      description: "Double Dilated Time gain.",
      effect: bought => Math.pow(2, bought),
      formatEffect: value => formatX(value, 2, 0),
      formatCost: value => shorten(value, 2, 0)
    }),
    galaxyThreshold: rebuyable({
      id: 2,
      initialCost: 1e6,
      increment: 100,
      description: () =>
        Perk.bypassDGReset.isBought ?
        "Reset Dilated Galaxies, but lower their threshold" :
        "Reset Dilated Time and Dilated Galaxies, but lower their threshold",
      effect: bought => Math.pow(0.8, bought),
      formatEffect: () => getFreeGalaxyMult().toFixed(3),
      formatCost: value => shorten(value, 2, 0)
    }),
    tachyonGain: rebuyable({
      id: 3,
      initialCost: 1e7,
      increment: 20,
      description: "Triple the amount of Tachyon Particles gained.",
      effect: bought => Decimal.pow(3, bought),
      formatEffect: value => formatX(value, 2, 0),
      formatCost: value => shorten(value, 2, 0)
    }),
    doubleGalaxies: {
      id: 4,
      cost: 5e6,
      description: "Gain twice as many free galaxies.",
      effect: 2
    },
    tdMultReplicanti: {
      id: 5,
      cost: 1e9,
      description: () => {
        let mult = replicantiMult().log10();
        const ratio = DilationUpgrade.tdMultReplicanti.effectValue.log10() / mult;
        let out = ratio > 0.095 ? "0.1" : ratio.toFixed(2);
        return `Time Dimensions are affected by Replicanti multiplier ^${out}.`
      },
      effect: () => {
        let rep10 = replicantiMult().log10() * 0.1;
        rep10 = rep10 > 9000 ? 9000 + 0.5 * (rep10 - 9000) : rep10;
        return Decimal.pow(10, rep10);
      },
      formatEffect: value => formatX(value, 2, 1)
    },
    ndMultDT: {
      id: 6,
      cost: 5e7,
      description: "Normal Dimension multiplier based on Dilated Time, unaffected by Time Dilation.",
      effect: () => player.dilation.dilatedTime.pow(308).clampMin(1),
      formatEffect: value => formatX(value, 2, 1)
    },
    ipMultDT: {
      id: 7,
      cost: 2e12,
      description: "Gain a multiplier to IP based on Dilated Time.",
      effect: () => player.dilation.dilatedTime.pow(1000).clampMin(1),
      formatEffect: value => formatX(value, 2, 1)
    },
    timeStudySplit: {
      id: 8,
      cost: 1e10,
      description: "Pick all the study paths from the first split."
    },
    dilationPenalty: {
      id: 9,
      cost: 1e11,
      description: "Reduce the Dilation penalty. (^1.05 after reduction)",
      effect: 1.05,
    },
    ttGenerator: {
      id: 10,
      cost: 1e15,
      description: "Generate Time Theorems based on Tachyon Particles.",
      effect: () => player.dilation.tachyonParticles.div(20000),
      formatEffect: value => formatX(value, 2, 1)
    }
  };
})();
