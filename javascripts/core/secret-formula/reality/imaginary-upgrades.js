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
      costMult: 800,
      description: () => `Multiply Infinity Dimensions by ${format("1e100000")}`,
      effect: new Decimal("1e100000"),
      formatEffect: value => `${formatX(value)}`,
      isDecimal: true
    }),
    rebuyable({
      name: "?????",
      id: 9,
      initialCost: 1e9,
      costMult: 1000,
      description: () => `Increase Galaxy strength`,
      effect: 0.03,
      formatEffect: value => `+${formatPercents(value)}`
    }),
    rebuyable({
      name: "?????",
      id: 10,
      initialCost: 8e9,
      costMult: 2000,
      description: () => `Increase Singularity gain`,
      effect: 1,
      formatEffect: value => `${formatX(1 + value, 2)}`,
    }),
    {
      name: "?????",
      id: 11,
      cost: 5e5,
      requirement: () => `${format(1e91)} total Relic Shards
        (You have ${format(player.celestials.effarig.relicShards, 2)})`,
      hasFailed: () => false,
      checkRequirement: () => player.celestials.effarig.relicShards >= 1e91,
      checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
      description: "Time Dimension power based on total antimatter",
      effect: () => 1 + Math.log10(player.records.totalAntimatter.log10()) / 100,
      formatEffect: value => `${formatPow(value, 0, 4)}`,
    },
    {
      name: "?????",
      id: 12,
      cost: 5e7,
      requirement: () => `Make a level ${formatInt(9000)} Glyph with a single glyph weight at ${formatInt(100)}`,
      hasFailed: () => false,
      checkRequirement: () => Object.values(player.celestials.effarig.glyphWeights).some(w => w === 100) && 
        gainedGlyphLevel().actualLevel >= 9000,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "Gain free Dimboosts based on iM rebuyable count",
      effect: () => 2e4 * ImaginaryUpgrades.totalRebuyables,
      formatEffect: value => `${format(value, 1)}`,
    },
    {
      name: "?????",
      id: 13,
      cost: 5e7,
      requirement: () => `Reach ${format(Number.MAX_VALUE, 2)} projected RM within The Enslaved Ones' Reality`,
      hasFailed: () => !Enslaved.isRunning,
      checkRequirement: () => Enslaved.isRunning && MachineHandler.uncappedRM.gte(Number.MAX_VALUE),
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Increase iM Cap based on iM upgrades purchased",
      effect: () => 1 + ImaginaryUpgrades.totalRebuyables / 20 + ImaginaryUpgrades.totalSinglePurchase / 2,
      formatEffect: value => `${formatX(value, 2, 1)}`,
    },
    {
      name: "?????",
      id: 14,
      cost: 4e8,
      requirement: () => `Reach a tickspeed of ${format("1e10000000")} / sec without exceeding ${formatInt(100)}
        total galaxies`,
      hasFailed: () => player.achievementChecks.maxGalaxiesThisReality >= 100,
      checkRequirement: () => player.achievementChecks.maxGalaxiesThisReality < 100 &&
        Tickspeed.perSecond.exponent >= 1e7,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: () => `Raise all dimension per-purchase multipliers to ${formatPow(1.5, 0, 1)}`,
      effect: 1.5
    },
    {
      name: "?????",
      id: 15,
      cost: 1e9,
      requirement: () => `Reach ${format("1e1500000000000")} antimatter without having any Infinity Dimensions`,
      hasFailed: () => player.achievementChecks.maxID1ThisReality.gt(0),
      checkRequirement: () => player.achievementChecks.maxID1ThisReality.eq(0) && player.antimatter.exponent >= 1.5e12,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Convert Antimatter Dimensions to Continuum and unlock Lai'tela, Celestial of Dimensions",
    },
    {
      name: "?????",
      id: 16,
      cost: 3.5e9,
      formatCost: x => format(x, 1),
      requirement: () => `Destabilize Lai'tela's Reality in under ${formatInt(30)} seconds twice`,
      hasFailed: () => false,
      checkRequirement: () => Laitela.maxAllowedDimension <= 6,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Unlock the 2nd Dark Matter Dimension",
    },
    {
      name: "?????",
      id: 17,
      cost: 6e9,
      requirement: () => `Automatically condense at least ${formatInt(20)} Singularities at once`,
      hasFailed: () => false,
      checkRequirement: () => Singularity.singularitiesGained >= 20 &&
        Currency.darkEnergy.gte(Singularity.cap * SingularityMilestone.autoCondense.effectValue),
      checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE,
      description: "Unlock the 3rd Dark Matter Dimension",
    },
    {
      name: "?????",
      id: 18,
      cost: 1.5e10,
      formatCost: x => format(x, 1),
      requirement: () => `Have ${formatInt(80000)} total galaxies`,
      hasFailed: () => false,
      checkRequirement: () => Replicanti.galaxies.total + player.galaxies +
        player.dilation.totalTachyonGalaxies >= 80000,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Unlock the 4th Dark Matter Dimension",
    },
    {
      name: "?????",
      id: 19,
      cost: 2.8e10,
      formatCost: x => format(x, 1),
      requirement: () => `Reach ${formatInt(3.85e6)} Tickspeed Continuum without having more than
        ${formatInt(8)} Time Studies`,
      hasFailed: () => player.achievementChecks.maxStudiesThisReality > 8,
      checkRequirement: () => player.achievementChecks.maxStudiesThisReality <= 8 &&
        Tickspeed.continuumValue >= 3.85e6,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Unlock Dark Matter Annihilation",
    },
    {
      name: "?????",
      id: 20,
      cost: 3e15,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "Unlock Autobuyers for repeatable iM upgrades",
    },
    {
      name: "?????",
      id: 21,
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
      id: 22,
      cost: 1e20,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "Annihilation multiplier affects Dark Energy at a reduced rate",
    },
    {
      name: "?????",
      id: 23,
      cost: 1e20,
      requirement: () => `[NYI]`,
      hasFailed: () => false,
      checkRequirement: () => false,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "[FDB 2]",
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
      description: "[FDB 3]",
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
