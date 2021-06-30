"use strict";

GameDatabase.reality.imaginaryUpgrades = (function() {
  const rebuyable = props => {
    props.cost = () => props.initialCost * props.costMult ** player.reality.imaginaryRebuyables[props.id];
    const { effect } = props;
    if (props.isDecimal) props.effect = () => Decimal.pow(effect, player.reality.imaginaryRebuyables[props.id]);
    else props.effect = () => effect * player.reality.imaginaryRebuyables[props.id];
    if (!props.formatEffect) props.formatEffect = value => `+${format(value, 2, 2)}`;
    props.formatCost = value => format(value, 2, 0);
    return props;
  };
  return [
    rebuyable({
      name: "Temporal Intensifier",
      id: 1,
      initialCost: 3,
      costMult: 60,
      description: () => `Increase Temporal Amplifier multipler by +${format(0.15, 2, 2)}`,
      effect: 0.15
    }),
    rebuyable({
      name: "Replicative Intensifier",
      id: 2,
      initialCost: 4,
      costMult: 60,
      description: () => `Increase Replicative Amplifier multipler by +${format(0.15, 2, 2)}`,
      effect: 0.15
    }),
    rebuyable({
      name: "Eternal Intensifier",
      id: 3,
      initialCost: 1,
      costMult: 40,
      description: () => `Increase Eternal Amplifier multipler by +${format(0.4, 2, 2)}`,
      effect: 0.4
    }),
    rebuyable({
      name: "Superluminal Intensifier",
      id: 4,
      initialCost: 5,
      costMult: 80,
      description: () => `Increase Superluminal Amplifier multipler by +${format(0.15, 2, 2)}`,
      effect: 0.15
    }),
    rebuyable({
      name: "Boundless Intensifier",
      id: 5,
      initialCost: 1,
      costMult: 30,
      description: () => `Increase Boundless Amplifier multipler by +${format(0.6, 2, 2)}`,
      effect: 0.6
    }),
    rebuyable({
      name: "?????",
      id: 6,
      initialCost: 1e4,
      costMult: 500,
      description: () => `Increase the RM cap by ${formatX(1e100)}`,
      effect: 1e100,
      formatEffect: value => formatX(value),
      isDecimal: true
    }),
    rebuyable({
      name: "?????",
      id: 7,
      initialCost: 2e5,
      costMult: 500,
      description: () => `Delay glyph level instability by +${formatInt(200)}`,
      effect: 200,
      formatEffect: value => `+${formatInt(value)}`
    }),
    rebuyable({
      name: "?????",
      id: 8,
      initialCost: 1e7,
      costMult: 2e3,
      description: () => `Multiply Infinity Dimensions by ${format("1e100000")}`,
      effect: new Decimal("1e100000"),
      formatEffect: value => `${formatX(value)}`,
      isDecimal: true
    }),
    rebuyable({
      name: "?????",
      id: 9,
      initialCost: 4e10,
      costMult: 8e3,
      description: () => `Some production buff?`,
      effect: 100,
      formatEffect: value => `+${formatInt(value)}`
    }),
    rebuyable({
      name: "?????",
      id: 10,
      initialCost: 2e13,
      costMult: 3e4,
      description: () => `Multiply Singularity gain by ${formatInt(2)}`,
      effect: new Decimal(2),
      formatEffect: value => `${formatX(value, 2)}`,
      // Decimal so that it stacks multiplicatively, gets cast back to Number when used
      isDecimal: true
    }),
    {
      name: "?????",
      id: 11,
      cost: 5e5,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "[Ra 1]",
    },
    {
      name: "?????",
      id: 12,
      cost: 5e5,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "Gain free Dimboosts based on iM rebuyable count",
      effect: () => 1e4 * ImaginaryUpgrades.totalRebuyables,
    },
    {
      name: "?????",
      id: 13,
      cost: 5e5,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "Increase iM Cap based on iM upgrades purchased",
      effect: () => 1 + ImaginaryUpgrades.totalRebuyables / 10 + ImaginaryUpgrades.totalSinglePurchase / 2,
      formatEffect: value => `${formatX(value, 2, 1)}`,
    },
    {
      name: "?????",
      id: 14,
      cost: 5e5,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "[Ra 4]",
    },
    {
      name: "?????",
      id: 15,
      cost: 1e8,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "[Ra 5]",

    },
    {
      name: "?????",
      id: 16,
      cost: 1e8,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "Convert Antimatter Dimensions to Continuum and unlock Lai'tela, Celestial of Dimensions",
    },
    {
      name: "?????",
      id: 17,
      cost: 2e10,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "Unlock the 2nd Dark Matter Dimension",
    },
    {
      name: "?????",
      id: 18,
      cost: 2e10,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "Unlock the 3rd Dark Matter Dimension",
    },
    {
      name: "?????",
      id: 19,
      cost: 2e10,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "Unlock the 4th Dark Matter Dimension",
    },
    {
      name: "?????",
      id: 20,
      cost: 4e12,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Unlock Dark Matter Annihilation",
    },
    {
      name: "?????",
      id: 21,
      cost: 3e15,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Unlock Autobuyers for repeatable iM upgrades",
    },
    {
      name: "?????",
      id: 22,
      cost: 1e20,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: () => `Imaginary Machines generate ${formatInt(6)} times faster`,
      effect: 6,
    },
    {
      name: "?????",
      id: 23,
      cost: 1e20,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Gain more Singularities based on Tesseract count",
      effect: () => player.celestials.enslaved.tesseracts ** 4,
    },
    {
      name: "?????",
      id: 24,
      cost: 1e20,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "[Lai'tela boost 4]",
    },
    {
      // TODO Functionality for this needs to be implemented later as Pelle doesn't exist on this branch yet
      name: "?????",
      id: 25,
      cost: 1e30,
      requirement: () => `[NYI]`,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "Unlock Pelle, Celestial of Antimatter",
    },
  ];
}());
