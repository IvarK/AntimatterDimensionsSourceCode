const formatCost = c => format(c, 2);

const rebuyable = config => {
  const { id, description, cost, effect, formatEffect, currency, currencyLabel } = config;
  return {
    id,
    description,
    cost: () => cost(player.celestials.pelle.rebuyables[id]),
    formatCost,
    effect: (x = player.celestials.pelle.rebuyables[id]) => effect(x),
    formatEffect,
    currency,
    currencyLabel
  };
};

export const pelleGalaxyGeneratorUpgrades = {
  additive: rebuyable({
    id: "galaxyGeneratorAdditive",
    description: "Increase base Galaxy generation by 2",
    cost: x => Math.pow(3, x),
    effect: x => x * 2,
    formatEffect: x => `${format(x, 2, 2)}/s`,
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "Galaxy"
  }),
  multiplicative: rebuyable({
    id: "galaxyGeneratorMultiplicative",
    description: "Multiply Galaxy generation",
    cost: x => Math.pow(10, x),
    effect: x => Decimal.pow(2.5, x),
    formatEffect: x => formatX(x, 2, 1),
    currency: () => Currency.galaxyGeneratorGalaxies,
    currencyLabel: "Galaxy"
  }),
  antimatterMult: rebuyable({
    id: "galaxyGeneratorAntimatterMult",
    description: "Multiply Galaxy generation",
    cost: x => Decimal.pow("1e100000000", 10 ** x),
    effect: x => Decimal.pow(2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.antimatter,
    currencyLabel: "Antimatter"
  }),
  IPMult: rebuyable({
    id: "galaxyGeneratorIPMult",
    description: "Multiply Galaxy generation",
    cost: x => Decimal.pow("1e2000000", 100 ** x),
    effect: x => Decimal.pow(2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.infinityPoints,
    currencyLabel: "Infinity Point"
  }),
  EPMult: rebuyable({
    id: "galaxyGeneratorEPMult",
    description: "Multiply Galaxy generation",
    cost: x => Decimal.pow("1e10000", 1000 ** x),
    effect: x => Decimal.pow(2, x),
    formatEffect: x => formatX(x, 2),
    currency: () => Currency.eternityPoints,
    currencyLabel: "Eternity Point"
  }),
};
