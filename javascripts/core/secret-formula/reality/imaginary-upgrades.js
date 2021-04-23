"use strict";

GameDatabase.reality.imaginaryUpgrades = (function() {
  const rebuyable = props => {
    props.cost = () => getHybridCostScaling(
      player.reality.rebuyables[props.id],
      1e30,
      props.initialCost,
      props.costMult,
      props.costMult / 10,
      new Decimal("1e309"),
      1e3,
      props.initialCost * props.costMult
    );
    const { effect } = props;
    props.effect = () => Math.pow(effect, player.reality.rebuyables[props.id] *
      getAdjustedGlyphEffect("realityrow1pow"));
    props.formatEffect = value => formatX(value, 2, 0);
    props.formatCost = value => format(value, 2, 0);
    return props;
  };
  return [
    rebuyable({
      name: "Temporal Intensifier",
      id: 1,
      initialCost: 1,
      costMult: 30,
      description: () => `Increase Temporal Amplifier multipler by +${format(0.02, 2, 2)}`,
      effect: 3
    }),
    rebuyable({
      name: "Replicative Intensifier",
      id: 2,
      initialCost: 1,
      costMult: 30,
      description: () => `Increase Replicative Amplifier multipler by +${format(0.1, 2, 2)}`,
      effect: 3
    }),
    rebuyable({
      name: "Eternal Intensifier",
      id: 3,
      initialCost: 2,
      costMult: 30,
      description: () => `Increase Eternal Amplifier multipler by +${format(0.3, 2, 2)}`,
      effect: 3
    }),
    rebuyable({
      name: "Superluminal Intensifier",
      id: 4,
      initialCost: 2,
      costMult: 30,
      description: () => `Increase Superluminal Amplifier multipler by +${format(0.02, 2, 2)}`,
      effect: 3
    }),
    rebuyable({
      name: "Boundless Intensifier",
      id: 5,
      initialCost: 3,
      costMult: 50,
      description: () => `Increase Boundless Amplifier multipler by +${format(0.25, 2, 2)}`,
      effect: 5
    }),
    rebuyable({
      name: "?????",
      id: 6,
      initialCost: 3,
      costMult: 50,
      description: () => `Increase the RM cap by ${formatX(1e100)}`,
      effect: 5
    }),
    rebuyable({
      name: "?????",
      id: 7,
      initialCost: 3,
      costMult: 50,
      description: () => `Delay glyph level instability by +${formatInt(200)}`,
      effect: 5
    }),
    {
      name: "?????",
      id: 8,
      cost: 15,
      requirement: "?????",
      hasFailed: () => player.reality.gainedAutoAchievements,
      checkRequirement: () => !player.reality.gainedAutoAchievements,
      checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
      description: "?????",
      effect: () => Math.sqrt(Achievements.power),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      name: "?????",
      id: 9,
      cost: 15,
      requirement: () => `?????`,
      hasFailed: () => {
        const invalidEquippedGlyphs = Glyphs.activeList.length > 1 ||
          (Glyphs.activeList.length === 1 && Glyphs.activeList[0].level < 3);
        const hasValidGlyphInInventory = Glyphs.inventory.countWhere(g => g && g.level >= 3) > 0;
        return invalidEquippedGlyphs || (Glyphs.activeList.length === 0 && !hasValidGlyphInInventory);
      },
      checkRequirement: () => Glyphs.activeList.length === 1 && Glyphs.activeList[0].level >= 3,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "?????",
      effect: () => 1
    },
    {
      name: "?????",
      id: 10,
      cost: 15,
      requirement: () => `?????`,
      hasFailed: () => !player.achievementChecks.noEternitiesThisReality,
      checkRequirement: () => Currency.infinityPoints.exponent >= 450 &&
        player.achievementChecks.noEternitiesThisReality,
      checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
      description: () => `?????`,
      effect: () => 100
    },
    {
      name: "?????",
      id: 11,
      cost: 50,
      requirement: () => `?????`,
      checkRequirement: () => Currency.infinitiesBanked.exponent >= 12,
      checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
      description: "[Some kind of Ra-Teresa QoL?]",
      effect: () => gainedInfinities().times(0.1),
      formatEffect: value => `${format(value)} per second`
    },
    {
      name: "?????",
      id: 12,
      cost: 50,
      requirement: () => `?????`,
      hasFailed: () => EternityChallenge(1).completions !== 0,
      checkRequirement: () => Currency.eternityPoints.exponent >= 70 && EternityChallenge(1).completions === 0,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "[Glyph alchemy buff]",
      effect: () => Currency.timeTheorems.value
        .minus(1e3).clampMin(2)
        .pow(Math.log2(Math.min(Currency.realities.value, 1e4))).clampMin(1),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      name: "?????",
      id: 13,
      cost: 50,
      requirement: () => `?????`,
      hasFailed: () => !Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
      checkRequirement: () => Currency.eternityPoints.exponent >= 4000 &&
        Array.range(5, 4).every(i => TimeDimension(i).amount.equals(0)),
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: () => `[Tesseract buff]`
    },
    {
      name: "?????",
      id: 14,
      cost: 50,
      requirement: () => `?????`,
      checkRequirement: () => Currency.eternities.gte(1e7),
      checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
      description: "Cursed glyphs are weakened",
      effect: () => Currency.realities.value * RA_UNLOCKS.TT_BOOST.effect.eternity(),
      formatEffect: value => `${format(value)} per second`
    },
    {
      name: "?????",
      id: 15,
      cost: 50,
      requirement: () => `?????`,
      hasFailed: () => player.epmultUpgrades !== 0,
      checkRequirement: () => Currency.eternityPoints.exponent >= 10 && player.epmultUpgrades === 0,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: () => `Convert Antimatter Dimensions to Continuum`,
      effect: () => Math.max(Math.sqrt(Decimal.log10(EternityUpgrade.epMult.effectValue)) / 3, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      name: "?????",
      id: 16,
      cost: 1500,
      requirement: () => `?????`,
      hasFailed: () => {
        const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.strength >= 1.5);
        const equipped = Glyphs.activeList.countWhere(g => g.strength >= 1.5);
        const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
        return equipped + Math.min(availableGlyphs, availableSlots) < 4;
      },
      checkRequirement: () => Glyphs.activeList.countWhere(g => g.strength >= 1.5) === 4,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "[Lai'tela 1]",
      effect: 1.3,
      formatCost: value => format(value, 1, 0)
    },
    {
      name: "?????",
      id: 17,
      cost: 1500,
      requirement: () => `?????`,
      hasFailed: () => {
        const availableGlyphs = Glyphs.inventory.countWhere(g => g && countEffectsFromBitmask(g.effects) >= 2);
        const equipped = Glyphs.activeList.countWhere(g => countEffectsFromBitmask(g.effects) >= 2);
        const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
        return equipped + Math.min(availableGlyphs, availableSlots) < 4;
      },
      checkRequirement: () => Glyphs.activeList.countWhere(g => countEffectsFromBitmask(g.effects) >= 2) === 4,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: () => `[Lai'tela 2]`,
      effect: 0.5,
      formatCost: value => format(value, 1, 0)
    },
    {
      name: "?????",
      id: 18,
      cost: 1500,
      requirement: () => `?????`,
      hasFailed: () => {
        const availableGlyphs = Glyphs.inventory.countWhere(g => g && g.level >= 10);
        const equipped = Glyphs.activeList.countWhere(g => g.level >= 10);
        const availableSlots = Glyphs.activeSlotCount - Glyphs.activeList.length;
        return equipped + Math.min(availableGlyphs, availableSlots) < 4;
      },
      checkRequirement: () => Glyphs.activeList.countWhere(g => g.level >= 10) === 4,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "[Lai'tela 3]",
      effect: () => Math.max(Math.sqrt(Currency.eternities.value.log10()) * 0.45, 1),
      formatCost: value => format(value, 1, 0)
    },
    {
      name: "?????",
      id: 19,
      cost: 1500,
      requirement: () => `?????`,
      hasFailed: () => Glyphs.allGlyphs.countWhere(g => g) < 30,
      checkRequirement: () => Glyphs.allGlyphs.countWhere(g => g) >= 30,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "[Lai'tela 4]",
      formatCost: value => format(value, 1, 0)
    },
    {
      name: "?????",
      id: 20,
      cost: 1500,
      requirement: () => `?????`,
      hasFailed: () => !BlackHole(1).isUnlocked && Currency.realityMachines.lt(100),
      checkRequirement: () => Time.totalTimePlayed.totalYears >= 1 && BlackHole(1).isUnlocked,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "[Lai'tela 5]",
      formatCost: value => format(value, 1, 0)
    },
    {
      name: "?????",
      id: 21,
      cost: 100000,
      requirement: () => `?????`,
      checkRequirement: () =>
        Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies >= 2800,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "[Pelle 1]"
    },
    {
      name: "?????",
      id: 22,
      cost: 100000,
      requirement: () => `?????`,
      checkRequirement: () => Currency.timeShards.exponent >= 28000,
      checkEvent: GAME_EVENT.GAME_TICK_AFTER,
      description: "[Pelle 2]",
      effect: () => Decimal.pow10(Math.pow(1 + 2 * Math.log10(Time.thisReality.totalDays + 1), 1.6)),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      name: "?????",
      id: 23,
      cost: 100000,
      requirement: () => `?????`,
      hasFailed: () => Time.thisReality.totalMinutes >= 15,
      checkRequirement: () => Time.thisReality.totalMinutes < 15,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "[Pelle 3]",
      effect: () => 15 / Math.clamp(Time.bestReality.totalMinutes, 1 / 12, 15),
      cap: 180,
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      name: "?????",
      id: 24,
      cost: 100000,
      requirement: () => `?????`,
      hasFailed: () => Glyphs.activeList.length > 0,
      checkRequirement: () => MachineHandler.gainedRealityMachines.gte(5000) && Glyphs.activeList.length === 0,
      checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
      description: "[Pelle 4]",
      effect: () => 1
    },
    {
      name: "?????",
      id: 25,
      cost: 100000,
      requirement: () => `?????`,
      checkRequirement: () => Currency.eternityPoints.exponent >= 11111,
      checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
      description: "[Pelle 5]"
    },
  ];
}());
