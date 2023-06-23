import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.reality.rebuyables[props.id],
    1e30,
    props.initialCost,
    props.costMult,
    props.costMult / 10,
    DC.E309,
    1e3,
    props.initialCost * props.costMult
  );
  const { effect } = props;
  props.effect = () => Math.pow(
    effect + ImaginaryUpgrade(props.id).effectOrDefault(0),
    player.reality.rebuyables[props.id] * getAdjustedGlyphEffect("realityrow1pow"));
  props.description = () => props.textTemplate.replace("{value}",
    ImaginaryUpgrade(props.id).effectValue === 0
      ? formatInt(effect)
      : format(effect + ImaginaryUpgrade(props.id).effectValue, 2, 2));
  props.formatEffect = value => formatX(value, 2, 0);
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const realityUpgrades = [
  rebuyable({
    name: "Temporal Amplifier",
    id: 1,
    initialCost: 1,
    costMult: 30,
    textTemplate: "You gain Dilated Time {value} times faster",
    effect: 3
  }),
  rebuyable({
    name: "Replicative Amplifier",
    id: 2,
    initialCost: 1,
    costMult: 30,
    textTemplate: "You gain Replicanti {value} times faster",
    effect: 3
  }),
  rebuyable({
    name: "Eternal Amplifier",
    id: 3,
    initialCost: 2,
    costMult: 30,
    textTemplate: "You gain {value} times more Eternities",
    effect: 3
  }),
  rebuyable({
    name: "Superluminal Amplifier",
    id: 4,
    initialCost: 2,
    costMult: 30,
    textTemplate: "You gain {value} times more Tachyon Particles",
    effect: 3
  }),
  rebuyable({
    name: "Boundless Amplifier",
    id: 5,
    initialCost: 3,
    costMult: 50,
    textTemplate: "You gain {value} times more Infinities",
    effect: 5
  }),
  {
    name: "Cosmically Duplicate",
    id: 6,
    cost: 15,
    requirement: "Complete your first manual Eternity without using Replicanti Galaxies",
    // Note that while noRG resets on eternity, the reality-level check will be false after the first eternity.
    // The noRG variable is eternity-level as it's also used for an achievement check
    hasFailed: () => !(player.requirementChecks.eternity.noRG && player.requirementChecks.reality.noEternities),
    checkRequirement: () => player.requirementChecks.eternity.noRG && player.requirementChecks.reality.noEternities,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    lockEvent: "gain a Replicanti Galaxy",
    description: "Replicanti speed is multiplied based on Replicanti Galaxies",
    effect: () => 1 + Replicanti.galaxies.total / 50,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Innumerably Construct",
    id: 7,
    cost: 15,
    requirement: "Complete your first Infinity with at most 1 Antimatter Galaxy",
    hasFailed: () => !(player.galaxies <= 1 && player.requirementChecks.reality.noInfinities),
    checkRequirement: () => player.galaxies <= 1 && player.requirementChecks.reality.noInfinities,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    canLock: true,
    lockEvent: "gain another Antimatter Galaxy",
    description: "Infinity gain is boosted from Antimatter Galaxy count",
    effect: () => 1 + player.galaxies / 30,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Paradoxically Attain",
    id: 8,
    cost: 15,
    requirement: "Manually Eternity without any automatic Achievements",
    hasFailed: () => player.reality.gainedAutoAchievements,
    checkRequirement: () => !player.reality.gainedAutoAchievements,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    // We don't have lockEvent because the modal can never show up for this upgrade
    description: "Tachyon Particle gain is boosted based on Achievement multiplier",
    effect: () => Math.sqrt(Achievements.power),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Linguistically Expand",
    id: 9,
    cost: 15,
    requirement: () => `Eternity for ${format("1e4000")} Eternity Points using
      only a single Glyph which must be level ${formatInt(3)}+.`,
    hasFailed: () => {
      const invalidEquippedGlyphs = Glyphs.activeWithoutCompanion.length > 1 ||
        (Glyphs.activeWithoutCompanion.length === 1 && Glyphs.activeWithoutCompanion[0].level < 3);
      const hasValidGlyphInInventory = Glyphs.inventory.countWhere(g => g && g.level >= 3) > 0;
      return invalidEquippedGlyphs || (Glyphs.activeWithoutCompanion.length === 0 && !hasValidGlyphInInventory);
    },
    checkRequirement: () => Currency.eternityPoints.exponent >= 4000 &&
      Glyphs.activeWithoutCompanion.length === 1 && Glyphs.activeWithoutCompanion[0].level >= 3,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    // There are two locking events - equipping a glyph with too low a level, and equipping a second glyph
    description: "Gain another Glyph slot",
    effect: () => 1
  },
  {
    name: "Existentially Prolong",
    id: 10,
    cost: 15,
    requirement: () => `Complete your first manual Eternity with at least ${formatPostBreak(DC.E400)} Infinity Points`,
    hasFailed: () => !player.requirementChecks.reality.noEternities,
    checkRequirement: () => Currency.infinityPoints.exponent >= 400 &&
      player.requirementChecks.reality.noEternities,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    canLock: true,
    lockEvent: "Eternity",
    bypassLock: () => Currency.infinityPoints.exponent >= 400,
    description: () => `Start every Reality with ${formatInt(100)} Eternities (also applies to current Reality)`,
    automatorPoints: 15,
    shortDescription: () => `Start with ${formatInt(100)} Eternities`,
    effect: () => 100
  },
  {
    name: "The Boundless Flow",
    id: 11,
    cost: 50,
    requirement: () => `${format(Currency.infinitiesBanked.value, 2)}/${format(DC.E12)} Banked Infinities`,
    checkRequirement: () => Currency.infinitiesBanked.exponent >= 12,
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_FIRST_UNLOCKED],
    description: "Every second, gain 10% of the Infinities you would normally gain by Infinitying",
    automatorPoints: 5,
    shortDescription: () => `Continuous Infinity generation`,
    effect: () => gainedInfinities().times(0.1),
    formatEffect: value => `${format(value)} per second`
  },
  {
    name: "The Knowing Existence",
    id: 12,
    cost: 50,
    requirement: () => `Eternity for ${format(DC.E70)} Eternity Points without completing Eternity Challenge 1`,
    hasFailed: () => EternityChallenge(1).completions !== 0,
    checkRequirement: () => Currency.eternityPoints.exponent >= 70 && EternityChallenge(1).completions === 0,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: "complete Eternity Challenge 1",
    description: "Eternity Point multiplier based on Reality and Time Theorem count",
    effect: () => Currency.timeTheorems.value
      .minus(DC.E3).clampMin(2)
      .pow(Math.log2(Math.min(Currency.realities.value, 1e4))).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "The Telemechanical Process",
    id: 13,
    cost: 50,
    requirement: () => `Eternity for ${format(DC.E4000)} Eternity Points without Time Dim. 5-8`,
    hasFailed: () => !Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
    checkRequirement: () => Currency.eternityPoints.exponent >= 4000 &&
      Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: "purchase a Time Dimension above the 4th TD",
    description: () => `Improve Eternity Autobuyer and unlock autobuyers for Time Dimensions and ${formatX(5)} EP`,
    automatorPoints: 10,
    shortDescription: () => `TD and ${formatX(5)} EP Autobuyers, improved Eternity Autobuyer`,
  },
  {
    name: "The Eternal Flow",
    id: 14,
    cost: 50,
    requirement: () => `${format(Currency.eternities.value, 2)}/${format(1e7)} Eternities`,
    checkRequirement: () => Currency.eternities.gte(1e7),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_FIRST_UNLOCKED],
    description: "Gain Eternities per second equal to your Reality count",
    automatorPoints: 5,
    shortDescription: () => `Continuous Eternity generation`,
    effect: () => Currency.realities.value * Ra.unlocks.continuousTTBoost.effects.eternity.effectOrDefault(1),
    formatEffect: value => `${format(value)} per second`
  },
  {
    name: "The Paradoxical Forever",
    id: 15,
    cost: 50,
    requirement: () => `Have ${format(DC.E10)} Eternity Points without purchasing
      the ${formatX(5)} Eternity Point upgrade`,
    hasFailed: () => player.epmultUpgrades !== 0,
    checkRequirement: () => Currency.eternityPoints.exponent >= 10 && player.epmultUpgrades === 0,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    canLock: true,
    lockEvent: () => `purchase a ${formatX(5)} EP upgrade`,
    description: () => `Boost Tachyon Particle gain based on ${formatX(5)} Eternity Point multiplier`,
    effect: () => Math.max(Math.sqrt(Decimal.log10(EternityUpgrade.epMult.effectValue)) / 9, 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Disparity of Rarity",
    id: 16,
    cost: 1500,
    requirement: () => `Reality with ${formatInt(4)} Glyphs equipped of uncommon or better rarity
      (${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && g.strength >= 1.5))} equipped)`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.strength >= 1.5);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => g.strength >= 1.5);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => g.strength >= 1.5) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Improve the Glyph rarity formula",
    effect: 1.3,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Duplicity of Potency",
    id: 17,
    cost: 1500,
    requirement: () => `Reality with ${formatInt(4)} Glyphs equipped, each having at least ${formatInt(2)} effects
      (${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && countValuesFromBitmask(g.effects) >= 2))}
      equipped)`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && countValuesFromBitmask(g.effects) >= 2);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => countValuesFromBitmask(g.effects) >= 2);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => countValuesFromBitmask(g.effects) >= 2) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: () => `${formatPercents(0.5)} chance to get an additional effect on Glyphs`,
    effect: 0.5,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Measure of Forever",
    id: 18,
    cost: 1500,
    requirement: () => `Reality with ${formatInt(4)} Glyphs equipped, each at level ${formatInt(10)} or higher
      (${formatInt(Glyphs.activeWithoutCompanion.countWhere(g => g && g.level >= 10))} equipped)`,
    hasFailed: () => {
      const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.level >= 10);
      const equipped = Glyphs.activeWithoutCompanion.countWhere(g => g.level >= 10);
      const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
      return equipped + Math.min(availableGlyphs, availableSlots) < 4;
    },
    checkRequirement: () => Glyphs.activeWithoutCompanion.countWhere(g => g.level >= 10) === 4,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Eternity count boosts Glyph level",
    effect: () => Math.max(Math.sqrt(Currency.eternities.value.plus(1).log10()) * 0.45, 1),
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Scour to Empower",
    id: 19,
    cost: 1500,
    requirement: () => `Have a total of ${formatInt(30)} or more Glyphs at once
      (You have ${formatInt(Glyphs.allGlyphs.countWhere(g => g.type !== "companion"))})`,
    hasFailed: () => Glyphs.allGlyphs.countWhere(g => g.type !== "companion") < 30,
    checkRequirement: () => Glyphs.allGlyphs.countWhere(g => g.type !== "companion") >= 30,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "You can sacrifice Glyphs for permanent bonuses (Shift + click)",
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Parity of Singularity",
    id: 20,
    cost: 1500,
    requirement: () => `${formatInt(100)} days total play time after unlocking the Black Hole
      (Currently: ${Time.timeSinceBlackHole.toStringShort(false)})`,
    hasFailed: () => !BlackHole(1).isUnlocked && Currency.realityMachines.lt(100),
    checkRequirement: () => Time.timeSinceBlackHole.totalDays >= 100 && BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Unlock another Black Hole",
    automatorPoints: 10,
    shortDescription: () => `Second Black Hole`,
    formatCost: value => format(value, 1, 0)
  },
  {
    name: "Cosmic Conglomerate",
    id: 21,
    cost: 100000,
    requirement: () => `${formatInt(Replicanti.galaxies.total + player.galaxies +
      player.dilation.totalTachyonGalaxies)}/${formatInt(2800)} total Galaxies from all types`,
    checkRequirement: () =>
      Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies >= 2800,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `Remote Antimatter Galaxy scaling is moved to ${formatInt(1e5)} galaxies`,
    effect: 1e5
  },
  {
    name: "Temporal Transcendence",
    id: 22,
    cost: 100000,
    requirement: () => `${format(Currency.timeShards.value, 1)}/${format(DC.E28000)} Time Shards`,
    checkRequirement: () => Currency.timeShards.exponent >= 28000,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: "Time Dimension multiplier based on days spent in this Reality",
    effect: () => Decimal.pow10(Math.pow(1 + 2 * Math.log10(Time.thisReality.totalDays + 1), 1.6)),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Replicative Rapidity",
    id: 23,
    cost: 100000,
    requirement: () => `Reality in under ${formatInt(15)} minutes of game time
      (Fastest: ${Time.bestReality.toStringShort()})`,
    hasFailed: () => Time.thisReality.totalMinutes >= 15,
    checkRequirement: () => Time.thisReality.totalMinutes < 15,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Replicanti speed is boosted based on your fastest game-time Reality",
    effect: () => 15 / Math.clamp(Time.bestReality.totalMinutes, 1 / 12, 15),
    cap: 180,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Synthetic Symbolism",
    id: 24,
    cost: 100000,
    requirement: () => `Reality for ${formatInt(5000)} Reality Machines without equipped Glyphs`,
    hasFailed: () => Glyphs.activeWithoutCompanion.length > 0,
    checkRequirement: () => MachineHandler.gainedRealityMachines.gte(5000) &&
      Glyphs.activeWithoutCompanion.length === 0,
    canLock: true,
    lockEvent: "equip a non-Companion Glyph",
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    description: "Gain another Glyph slot",
    effect: () => 1
  },
  {
    name: "Effortless Existence",
    id: 25,
    cost: 100000,
    requirement: () => `Reach ${format(DC.E11111)} EP (Best: ${format(player.records.bestReality.bestEP, 2)} EP)`,
    checkRequirement: () => player.records.bestReality.bestEP.exponent >= 11111,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    description: "Unlock the Reality autobuyer and Automator command",
    automatorPoints: 100,
    shortDescription: () => `Reality Autobuyer`,
  },
];
