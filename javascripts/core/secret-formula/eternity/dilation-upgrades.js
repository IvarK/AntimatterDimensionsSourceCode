import { GameDatabase } from "../game-database.js";
import { DC } from "../../constants.js";

GameDatabase.eternity.dilation = (function() {
  function rebuyableCost(initialCost, increment, id) {
    return Decimal.multiply(initialCost, Decimal.pow(increment, player.dilation.rebuyables[id]));
  }
  function rebuyable(config) {
    return {
      id: config.id,
      cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
      initialCost: config.initialCost,
      increment: config.increment,
      description: config.description,
      effect: () => config.effect(player.dilation.rebuyables[config.id]),
      formatEffect: config.formatEffect,
      formatCost: config.formatCost,
      purchaseCap: config.purchaseCap,
      reachedCap: () => player.dilation.rebuyables[config.id] >= config.purchaseCap,
      rebuyable: true
    };
  }
  return {
    dtGain: rebuyable({
      id: 1,
      initialCost: 1e5,
      increment: 10,
      description: () =>
        (SingularityMilestone.dilatedTimeFromSingularities.isUnlocked
          ? `${formatX(2 * SingularityMilestone.dilatedTimeFromSingularities.effectValue, 2, 2)} Dilated Time gain.`
          : "Double Dilated Time gain."),
      effect: bought => {
        const base = SingularityMilestone.dilatedTimeFromSingularities.isUnlocked
          ? 2 * SingularityMilestone.dilatedTimeFromSingularities.effectValue
          : 2;
        return Decimal.pow(base, bought);
      },
      formatEffect: value => formatX(value, 2),
      formatCost: value => format(value, 2),
      purchaseCap: Number.MAX_VALUE
    }),
    galaxyThreshold: rebuyable({
      id: 2,
      initialCost: 1e6,
      increment: 100,
      description: () =>
        (Perk.bypassTGReset.isBought
          ? "Reset Tachyon Galaxies, but lower their threshold"
          : "Reset Dilated Time and Tachyon Galaxies, but lower their threshold"),
      // The 38th purchase is at 1e80, and is the last purchase.
      effect: bought => (bought < 38 ? Math.pow(0.8, bought) : 0),
      formatEffect: effect => {
        if (effect === 0) return `${formatX(getTachyonGalaxyMult(effect), 4, 4)}`;
        const nextEffect = effect === Math.pow(0.8, 37) ? 0 : 0.8 * effect;
        return `${formatX(getTachyonGalaxyMult(effect), 4, 4)} ➜
          Next: ${formatX(getTachyonGalaxyMult(nextEffect), 4, 4)}`;
      },
      formatCost: value => format(value, 2),
      purchaseCap: 38
    }),
    tachyonGain: rebuyable({
      id: 3,
      initialCost: 1e7,
      increment: 20,
      description: () => (Enslaved.isRunning
        ? `Multiply the amount of Tachyon Particles gained by ${Math.pow(3, Enslaved.tachyonNerf).toFixed(2)}`
        : "Triple the amount of Tachyon Particles gained."),
      effect: bought => DC.D3.pow(bought),
      formatEffect: value => formatX(value, 2),
      formatCost: value => format(value, 2),
      purchaseCap: Number.MAX_VALUE
    }),
    doubleGalaxies: {
      id: 4,
      cost: 5e6,
      description: () => `Gain twice as many Tachyon Galaxies, up to ${formatInt(1000)}.`,
      effect: 2
    },
    tdMultReplicanti: {
      id: 5,
      cost: 1e9,
      description: () => {
        const rep10 = replicantiMult().pLog10();
        let multiplier = "0.1";
        if (rep10 > 9000) {
          const ratio = DilationUpgrade.tdMultReplicanti.effectValue.pLog10() / rep10;
          if (ratio < 0.095) {
            multiplier = ratio.toFixed(2);
          }
        }
        return `Time Dimensions are affected by Replicanti multiplier ${formatPow(multiplier, 1, 3)}, reduced
          effect above ${formatX(DC.E9000)}`;
      },
      effect: () => {
        let rep10 = replicantiMult().pLog10() * 0.1;
        rep10 = rep10 > 9000 ? 9000 + 0.5 * (rep10 - 9000) : rep10;
        return Decimal.pow10(rep10);
      },
      formatEffect: value => formatX(value, 2, 1)
    },
    ndMultDT: {
      id: 6,
      cost: 5e7,
      description: "Antimatter Dimension multiplier based on Dilated Time, unaffected by Time Dilation.",
      effect: () => Currency.dilatedTime.value.pow(308).clampMin(1),
      formatEffect: value => formatX(value, 2, 1)
    },
    ipMultDT: {
      id: 7,
      cost: 2e12,
      description: "Gain a multiplier to Infinity Points based on Dilated Time.",
      effect: () => Currency.dilatedTime.value.pow(1000).clampMin(1),
      formatEffect: value => formatX(value, 2, 1),
      cap: () => Effarig.eternityCap
    },
    timeStudySplit: {
      id: 8,
      cost: 1e10,
      description: "You can buy all three Time Study paths from the Dimension Split."
    },
    dilationPenalty: {
      id: 9,
      cost: 1e11,
      description: () => `Reduce the Dilation penalty. (${formatPow(1.05, 2, 2)} after reduction)`,
      effect: 1.05,
    },
    ttGenerator: {
      id: 10,
      cost: 1e15,
      description: "Generate Time Theorems based on Tachyon Particles.",
      effect: () => Currency.tachyonParticles.value.div(20000),
      formatEffect: value => `${format(value, 2, 1)}/sec`
    },
    dtGainPelle: rebuyable({
      id: 11,
      initialCost: 1e14,
      increment: 100,
      pelleOnly: true,
      description: () => `Multiply Dilated Time gain by ${format(5)}.`,
      effect: bought => Decimal.pow(5, bought),
      formatEffect: value => formatX(value, 2),
      formatCost: value => format(value, 2),
      purchaseCap: Number.MAX_VALUE
    }),
    galaxyMultiplier: rebuyable({
      id: 12,
      initialCost: 1e15,
      increment: 1000,
      pelleOnly: true,
      description: () => "Multiply Tachyon Galaxies gained.",
      effect: bought => bought + 1,
      formatEffect: value => `${formatX(value, 2)} ➜ ${formatX(value + 1, 2)}`,
      formatCost: value => format(value, 2),
      purchaseCap: Number.MAX_VALUE
    }),
    tickspeedPower: rebuyable({
      id: 13,
      initialCost: 1e16,
      increment: 1e4,
      pelleOnly: true,
      description: () => `Gain a power to tickspeed effect.`,
      effect: bought => 1 + bought * 0.03,
      formatEffect: value => `${formatPow(value, 2, 2)} ➜ ${formatPow(value + 0.03, 2, 2)}`,
      formatCost: value => format(value, 2),
      purchaseCap: Number.MAX_VALUE
    }),
    galaxyThresholdPelle: {
      id: 14,
      cost: 1e45,
      description: "Cubic root Tachyon Galaxy threshold.",
      effect: 1 / 3
    },
    flatDilationMult: {
      id: 15,
      cost: 1e55,
      description: () => `Gain more Dilated Time based on EP.`,
      effect: () => 1e9 ** Math.min(((player.eternityPoints.log10() - 1500) / 2500) ** 1.2, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
  };
}());
