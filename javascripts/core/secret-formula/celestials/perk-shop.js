"use strict";

GameDatabase.celestials.perkShop = (function() {
  function rebuyableCost(initialCost, increment, id) {
    return initialCost * Math.pow(increment, player.celestials.teresa.perkShop[id]);
  }
  function rebuyable(config) {
    return {
      id: config.id,
      cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
      cap: config.cap,
      costCap: config.costCap,
      description: config.description,
      effect: () => config.effect(player.celestials.teresa.perkShop[config.id]),
      formatEffect: config.formatEffect,
      formatCost: config.formatCost,
      rebuyable: true
    };
  }
  return {
    glyphLevel: rebuyable({
      id: 0,
      initialCost: 1,
      increment: 2,
      description: () => `Increase glyph levels by ${formatPercents(0.05)}`,
      effect: bought => Math.pow(1.05, bought),
      formatEffect: value => formatX(value, 2, 2),
      formatCost: value => format(value, 2, 0),
      costCap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? 1048576 : 2048),
      cap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? Math.pow(1.05, 20) : Math.pow(1.05, 11))
    }),
    rmMult: rebuyable({
      id: 1,
      initialCost: 1,
      increment: 2,
      description: "Double Reality Machine gain",
      effect: bought => Math.pow(2, bought),
      formatEffect: value => formatX(value, 2, 0),
      formatCost: value => format(value, 2, 0),
      costCap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? 1048576 : 2048),
      cap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? 1048576 : 2048)
    }),
    bulkDilation: rebuyable({
      id: 2,
      initialCost: 100,
      increment: 2,
      description: "Buy twice as many Dilation Upgrades at once.",
      effect: bought => Math.pow(2, bought),
      formatEffect: value => formatX(value, 2, 0),
      formatCost: value => format(value, 2, 0),
      costCap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? 1638400 : 1600),
      cap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? 16384 : 16),
    }),
    autoSpeed: rebuyable({
      id: 3,
      initialCost: 1000,
      increment: 2,
      description: () => `Infinity Dimension, Time Dimension, Time Theorem, Dilation,
      and Replicanti autobuyers are ${formatX(2)} faster.`,
      effect: bought => Math.pow(2, bought),
      formatEffect: value => formatX(value, 2, 0),
      formatCost: value => format(value, 2, 0),
      costCap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? 64000 : 4000),
      cap: () => (Ra.has(RA_UNLOCKS.PERK_SHOP_INCREASE) ? 64 : 4)
    }),
    musicGlyph: rebuyable({
      id: 4,
      initialCost: 1,
      increment: 1,
      description: () => `Receive a music glyph of a random type that is ${formatPercents(0.8)} of your highest level.
        (Try clicking it!)`,
      effect: bought => Decimal.pow(3, bought),
      formatCost: value => format(value, 2, 0),
      costCap: () => Number.MAX_VALUE,
      cap: () => Number.MAX_VALUE
    }),
  };
}());
