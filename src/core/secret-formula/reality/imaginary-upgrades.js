import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => props.initialCost * Math.pow(props.costMult, player.reality.imaginaryRebuyables[props.id]);
  const { effect } = props;
  if (props.isDecimal) props.effect = () => Decimal.pow(effect, player.reality.imaginaryRebuyables[props.id]);
  else props.effect = () => effect * player.reality.imaginaryRebuyables[props.id];
  if (!props.formatEffect) props.formatEffect = value => `+${format(value, 2, 2)}`;
  props.formatCost = value => format(value, 2, 0);
  return props;
};

export const imaginaryUpgrades = [
  rebuyable({
    name: "Temporal Intensifier",
    id: 1,
    initialCost: 3,
    costMult: 60,
    description: () => `Increase Temporal Amplifier multiplier by +${format(0.15, 2, 2)}`,
    effect: 0.15
  }),
  rebuyable({
    name: "Replicative Intensifier",
    id: 2,
    initialCost: 4,
    costMult: 60,
    description: () => `Increase Replicative Amplifier multiplier by +${format(0.15, 2, 2)}`,
    effect: 0.15
  }),
  rebuyable({
    name: "Eternal Intensifier",
    id: 3,
    initialCost: 1,
    costMult: 40,
    description: () => `Increase Eternal Amplifier multiplier by +${format(0.4, 2, 2)}`,
    effect: 0.4
  }),
  rebuyable({
    name: "Superluminal Intensifier",
    id: 4,
    initialCost: 5,
    costMult: 80,
    description: () => `Increase Superluminal Amplifier multiplier by +${format(0.15, 2, 2)}`,
    effect: 0.15
  }),
  rebuyable({
    name: "Boundless Intensifier",
    id: 5,
    initialCost: 1,
    costMult: 30,
    description: () => `Increase Boundless Amplifier multiplier by +${format(0.6, 2, 2)}`,
    effect: 0.6
  }),
  rebuyable({
    name: "Elliptic Materiality",
    id: 6,
    initialCost: 1e4,
    costMult: 500,
    description: () => `Increase the Reality Machine cap by ${formatX(1e100)}`,
    effect: 1e100,
    formatEffect: value => `${formatX(value)}`,
    isDecimal: true
  }),
  rebuyable({
    name: "Runic Assurance",
    id: 7,
    initialCost: 2e5,
    costMult: 500,
    description: () => `Delay Glyph Instability starting level by ${formatInt(200)}`,
    effect: 200,
    formatEffect: value => `+${formatInt(value)} levels`
  }),
  rebuyable({
    name: "Hyperbolic Apeirogon",
    id: 8,
    initialCost: 1e7,
    costMult: 800,
    description: () => `Multiply Infinity Dimensions by ${format("1e100000")}`,
    effect: DC.E100000,
    formatEffect: value => `${formatX(value)}`,
    isDecimal: true
  }),
  rebuyable({
    name: "Cosmic Filament",
    id: 9,
    initialCost: 1e9,
    costMult: 1000,
    description: () => `Increase Galaxy strength`,
    effect: 0.03,
    formatEffect: value => `+${formatPercents(value)}`,
  }),
  rebuyable({
    name: "Entropic Condensing",
    id: 10,
    initialCost: 8e9,
    costMult: 2000,
    description: () => `Increase Singularity gain`,
    effect: 1,
    formatEffect: value => `${formatX(1 + value, 2)}`
  }),
  {
    name: "Suspicion of Interference",
    id: 11,
    cost: 5e7,
    requirement: () => `${format(1e90)} total Relic Shards
      (You have ${format(player.celestials.effarig.relicShards, 2)})`,
    hasFailed: () => false,
    checkRequirement: () => player.celestials.effarig.relicShards >= 1e90,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    description: "Time Dimension power based on total antimatter",
    effect: () => 1 + Math.log10(player.records.totalAntimatter.log10()) / 100,
    formatEffect: value => `${formatPow(value, 0, 4)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Consequences of Illusions",
    id: 12,
    cost: 5e7,
    requirement: () => `Make a level ${formatInt(9000)} Glyph with a single Glyph level factor weight at
    ${formatInt(100)}`,
    hasFailed: () => false,
    checkRequirement: () => Object.values(player.celestials.effarig.glyphWeights).some(w => w === 100) &&
      gainedGlyphLevel().actualLevel >= 9000,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Gain free Dimboosts based on Imaginary rebuyable count",
    effect: () => 2e4 * ImaginaryUpgrades.totalRebuyables,
    formatEffect: value => `${format(value, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Transience of Information",
    id: 13,
    cost: 5e7,
    requirement: () => `Reach ${format(Number.MAX_VALUE, 2)} projected Reality Machines within
      The Nameless Ones' Reality`,
    hasFailed: () => !Enslaved.isRunning,
    // This is for consistency with the UI, which displays an amplified "projected RM" value on the reality button
    checkRequirement: () => Enslaved.isRunning &&
      MachineHandler.uncappedRM.times(simulatedRealityCount(false) + 1).gte(Number.MAX_VALUE),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Increase Imaginary Machine Cap based on Imaginary Upgrades purchased",
    effect: () => 1 + ImaginaryUpgrades.totalRebuyables / 20 + ImaginaryUpgrades.totalSinglePurchase / 2,
    formatEffect: value => `${formatX(value, 2, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Recollection of Intrusion",
    id: 14,
    cost: 3.5e8,
    formatCost: x => format(x, 1),
    requirement: () => `Reach a tickspeed of ${format("1e75000000000")} / sec within Eternity Challenge 5`,
    hasFailed: () => false,
    checkRequirement: () => EternityChallenge(5).isRunning && Tickspeed.perSecond.exponent >= 7.5e10,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Raise all Dimension per-purchase multipliers to ${formatPow(1.5, 0, 1)}`,
    effect: 1.5,
    isDisabledInDoomed: true
  },
  {
    name: "Fabrication of Ideals",
    id: 15,
    cost: 1e9,
    requirement: () => `Reach ${format("1e1500000000000")} antimatter without
      ever having any 1st Infinity Dimensions`,
    hasFailed: () => player.requirementChecks.reality.maxID1.gt(0),
    checkRequirement: () => player.requirementChecks.reality.maxID1.eq(0) && player.antimatter.exponent >= 1.5e12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    // This upgrade lock acts in multiple different conditions, but isn't 100% foolproof and also blocks a few edge
    // cases which technically should be allowed but would be hard to communicate in-game. Forbidden actions are:
    // - Purchasing any ID (edge case: this is acceptable for ID2-8 inside EC2 or EC10)
    // - Purchasing any TD with any amount of EC7 completions (edge case: acceptable within EC1 or EC10)
    // - Entering EC7 with any amount of purchased TD
    description: () => `${
      Pelle.isDoomed ? "Unlock" : "Convert Antimatter Dimensions to Continuum and unlock"
    } Lai'tela, Celestial of Dimensions`,
  },
  {
    name: "Massless Momentum",
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
    name: "Chiral Oscillation",
    id: 17,
    cost: 6e9,
    requirement: () => `Automatically condense at least ${formatInt(20)} Singularities at once`,
    hasFailed: () => false,
    checkRequirement: () => Singularity.singularitiesGained >= 20 &&
      Currency.darkEnergy.gte(Singularity.cap * SingularityMilestone.autoCondense.effectOrDefault(Infinity)),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE,
    description: "Unlock the 3rd Dark Matter Dimension",
  },
  {
    name: "Dimensional Symmetry",
    id: 18,
    cost: 1.5e10,
    formatCost: x => format(x, 1),
    requirement: () => `Have ${formatInt(80000)} total Galaxies`,
    hasFailed: () => false,
    checkRequirement: () => Replicanti.galaxies.total + player.galaxies +
      player.dilation.totalTachyonGalaxies >= 80000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock the 4th Dark Matter Dimension",
  },
  {
    name: "Deterministic Radiation",
    id: 19,
    cost: 2.8e10,
    formatCost: x => format(x, 1),
    requirement: () => `Reach ${formatInt(3.85e6)} Tickspeed Continuum without ever having more than
      ${formatInt(8)} Time Studies in this Reality`,
    hasFailed: () => player.requirementChecks.reality.maxStudies > 8,
    checkRequirement: () => player.requirementChecks.reality.maxStudies <= 8 &&
      Tickspeed.continuumValue >= 3.85e6,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: () => `purchase more than ${formatInt(8)} Time Studies`,
    description: "Unlock Dark Matter Annihilation"
  },
  {
    name: "Vacuum Acceleration",
    id: 20,
    cost: 3e12,
    requirement: () => `Have a Continuum increase of at least ${formatPercents(1)}`,
    hasFailed: () => false,
    checkRequirement: () => Laitela.matterExtraPurchaseFactor >= 2,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Unlock Autobuyers for repeatable Imaginary Upgrades and generate Imaginary Machines
      ${formatInt(10)} times faster`,
    effect: 10,
    isDisabledInDoomed: true
  },
  {
    name: "Existential Elimination",
    id: 21,
    cost: 1e13,
    requirement: () => `Reach ${format("1e7400000000000")} antimatter with Continuum disabled for the entire Reality`,
    hasFailed: () => !player.requirementChecks.reality.noContinuum,
    checkRequirement: () => player.requirementChecks.reality.noContinuum &&
      Currency.antimatter.value.log10() >= 7.4e12,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "enable Continuum",
    description: "Annihilation multiplier gain is improved based on Imaginary Machines",
    effect: () => Math.clampMin(Math.pow(Math.log10(Currency.imaginaryMachines.value) - 10, 3), 1),
    formatEffect: value => `${formatX(value, 2, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Total Termination",
    id: 22,
    cost: 1.5e14,
    formatCost: x => format(x, 1),
    requirement: () => `Reach ${format("1e150000000000")} antimatter in Effarig's Reality with
      at least ${formatInt(4)} Cursed Glyphs equipped`,
    // Note: 4 cursed glyphs is -12 glyph count, but equipping a positive glyph in the last slot is allowed
    hasFailed: () => !Effarig.isRunning || player.requirementChecks.reality.maxGlyphs > -10,
    checkRequirement: () => Effarig.isRunning && player.requirementChecks.reality.maxGlyphs < -10 &&
      Currency.antimatter.value.exponent >= 1.5e11,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `All Glyph Sacrifice totals are increased to ${format(1e100)}`,
    effect: 1e100,
    isDisabledInDoomed: true
  },
  {
    name: "Planar Purification",
    id: 23,
    cost: 6e14,
    requirement: () => `Reach Glyph level ${formatInt(20000)} in Ra's Reality with
      at most ${formatInt(0)} Glyphs equipped`,
    hasFailed: () => !Ra.isRunning || player.requirementChecks.reality.maxGlyphs > 0,
    checkRequirement: () => Ra.isRunning && player.requirementChecks.reality.maxGlyphs <= 0 &&
      gainedGlyphLevel().actualLevel >= 20000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Increase free Dimboost count based on Tesseract count",
    effect: () => Math.floor(0.25 * Math.pow(Tesseracts.effectiveCount, 2)),
    formatEffect: value => `${formatX(value)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Absolute Annulment",
    id: 24,
    cost: 6e14,
    // We unfortunately don't have the UI space to be more descriptive on this button without causing text overflow,
    // so hopefully the additional modals (from the upgrade lock) will mostly communicate the idea that this is under
    // the same conditions as hard V's Post-destination
    requirement: () => `Have ${formatInt(13000)} Antimatter Galaxies in Ra's Reality
      with a fully inverted Black Hole`,
    hasFailed: () => !Ra.isRunning || player.requirementChecks.reality.slowestBH > 1e-300,
    checkRequirement: () => Ra.isRunning && player.requirementChecks.reality.slowestBH <= 1e-300 &&
      player.galaxies >= 13000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    // Three locking events: uninvert, discharge, and entering (but not auto-completing) EC12
    description: "Increase free Dimboost strength based on Singularity count",
    effect: () => Decimal.pow(player.celestials.laitela.singularities, 300),
    formatEffect: value => `${formatX(value, 2, 1)}`,
    isDisabledInDoomed: true
  },
  {
    name: "Omnipresent Obliteration",
    id: 25,
    cost: 1.6e15,
    formatCost: x => format(x, 1),
    requirement: () => `Reach Reality in Lai'tela's Reality with all Dimensions disabled and
      at least ${formatInt(4)} empty Glyph slots`,
    hasFailed: () => !Laitela.isRunning || Laitela.maxAllowedDimension !== 0 ||
      Glyphs.activeWithoutCompanion.length > 1,
    checkRequirement: () => Laitela.isRunning && Laitela.maxAllowedDimension === 0 &&
      Glyphs.activeWithoutCompanion.length <= 1 && TimeStudy.reality.isBought,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    canLock: true,
    lockEvent: "equip another non-Companion Glyph",
    description: "Unlock Pelle, Celestial of Antimatter",
  },
];
