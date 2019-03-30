GameDatabase.reality.upgrades = (function() {
  const rebuyable = props => {
    props.cost = () => getCostWithLinearCostScaling(
      player.reality.rebuyables[props.id],
      1e30,
      props.initialCost,
      props.costMult,
      props.costMult / 10
    );
    const { effect } = props;
    props.effect = () => Math.pow(effect, player.reality.rebuyables[props.id]);
    props.formatEffect = value => formatX(value, 2, 2);
    props.formatCost = value => shorten(value, 2, 0);
    return props;
  };
  const isFirstEternity = () => player.realities > 0 && Player.gainedEternities === 0;
  const isFirstInfinity = () => isFirstEternity() && player.infinitied.eq(0);
  return [
    rebuyable({
      id: 1,
      initialCost: 1,
      costMult: 30,
      description: "You gain Dilated Time 3 times faster",
      effect: 3
    }),
    rebuyable({
      id: 2,
      initialCost: 2,
      costMult: 30,
      description: "You gain Replicanti 3 times faster",
      effect: 3
    }),
    rebuyable({
      id: 3,
      initialCost: 2,
      costMult: 30,
      description: "You gain 3 times more Eternities",
      effect: 3
    }),
    rebuyable({
      id: 4,
      initialCost: 3,
      costMult: 30,
      description: "You gain 3 times more Tachyon Particles",
      effect: 3
    }),
    rebuyable({
      id: 5,
      initialCost: 4,
      costMult: 50,
      description: "You gain 5 times more Infinities",
      effect: 5
    }),
    {
      id: 6,
      cost: 15,
      requirement: "Reach first Eternity without getting any RGs during that Eternity",
      checkRequirement: () => player.reality.upgReqChecks[0] && isFirstEternity(),
      description: "Replicanti gain is boosted from RGs",
      effect: () => 1 + (player.replicanti.galaxies / 50),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      id: 7,
      cost: 15,
      requirement: "Reach first Infinity with just 1 galaxy",
      checkRequirement: () => player.galaxies <= 1 && isFirstInfinity(),
      description: "Infinitied stat gain is boosted from Antimatter Galaxies",
      effect: () => 1 + (player.galaxies / 30),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      id: 8,
      cost: 15,
      requirement: "Have the first 13 rows of achievements when you Infinity the first time",
      checkRequirement: () =>
        isFirstInfinity() &&
        nextAchIn() === 0 &&
        Array.range(1, 13)
          .map(row => Achievements.row(row))
          .every(row => row.every(ach => ach.isUnlocked)),
      description: "Tachyon Particle gain is multiplied based on achievement multiplier",
      effect: () => player.achPow.pow(getAdjustedGlyphEffect("effarigachievement")).sqrt(),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      id: 9,
      cost: 15,
      requirement: "Reality with only a single glyph with a level 3 or higher equipped.",
      checkRequirement: () => Glyphs.activeList.length === 1 && Glyphs.activeList[0].level >= 3,
      description: "Gain another glyph slot",
      effect: () => 1
    },
    {
      id: 10,
      cost: 15,
      requirement: () => `Do your first Eternity with ${shorten("1e400")} IP`,
      checkRequirement: () => player.infinityPoints.exponent >= 400 && isFirstEternity(),
      description: "Start with 100 Eternities"
    },
    {
      id: 11,
      cost: 50,
      requirement: "1,000,000,000,000 banked Infinities",
      checkRequirement: () => player.realities > 0 && player.infinitiedBank.exponent >= 12,
      description: "Gain 10% of the Infinities you would gain by Infinitying each second.",
      effect: () => gainedInfinities().times(0.1),
      formatEffect: value => `${shorten(value)} per second`
    },
    {
      id: 12,
      cost: 50,
      requirement: () => `${shorten(1e70)} EP without EC1`,
      checkRequirement: () => player.eternityPoints.exponent >= 70 && EternityChallenge(1).completions === 0,
      description: "EP mult based on Realities and TT",
      effect: () => player.timestudy.theorem.minus(1e3).clampMin(2).pow(Math.log2(player.realities)).clampMin(1),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      id: 13,
      cost: 50,
      requirement: () => `${shorten("1e4000")} EP without TD5`,
      checkRequirement: () => player.eternityPoints.exponent >= 4000 && TimeDimension(5).amount.equals(0),
      description: "More Eternity autobuyer options, EP multiplier autobuyer, Time Dimension autobuyers"
    },
    {
      id: 14,
      cost: 50,
      requirement: "1,000,000 Eternities",
      checkRequirement: () => player.realities > 0 && player.eternities >= 1e6,
      description: "Gain Eternities per second equal to your Realities",
      effect: () => player.realities,
      formatEffect: value => `${shorten(value)} per second`
    },
    {
      id: 15,
      cost: 50,
      requirement: () => `Reach ${shorten(1e10)} EP without purchasing the 5xEP upgrade`,
      checkRequirement: () => player.eternityPoints.exponent >= 10 && player.epmultUpgrades === 0,
      description: "Multiply TP gain based on EP mult",
      effect: () => Math.max(Math.sqrt(Decimal.log10(EternityUpgrade.epMult.effectValue)) / 3, 1),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      id: 16,
      cost: 1500,
      requirement: "Reality with 4 glyphs with uncommon or better rarity",
      checkRequirement: () => Glyphs.activeList.countWhere(g => g.strength >= 1.5) === 4,
      description: "Improve the glyph rarity formula",
      effect: () => 1.3,
      formatCost: value => shorten(value, 1, 0)
    },
    {
      id: 17,
      cost: 1500,
      requirement: "Reality with 4 glyphs, with each having at least 2 effects",
      checkRequirement: () => Glyphs.activeList.countWhere(g => Object.keys(g.effects).length >= 2) === 4,
      description: "50% chance to get +1 effect on glyphs",
      formatCost: value => shorten(value, 1, 0)
    },
    {
      id: 18,
      cost: 1500,
      requirement: "Reality with 4 level 10 or higher glyphs equipped.",
      checkRequirement: () => Glyphs.activeList.countWhere(g => g.level >= 10) === 4,
      description: "Eternities affect glyph level",
      effect: () => Math.max(Math.sqrt(Math.log10(player.eternities)) * 0.45, 1),
      formatCost: value => shorten(value, 1, 0)
    },
    {
      id: 19,
      cost: 1500,
      requirement: "Have a total of 30 or more glyphs",
      checkRequirement: () => Glyphs.active.concat(Glyphs.inventory).countWhere(g => g) >= 30,
      description: "You can sacrifice glyphs for permanent bonuses (Shift + click)",
      formatCost: value => shorten(value, 1, 0)
    },
    {
      id: 20,
      cost: 1500,
      requirement: "2 years total play time",
      checkRequirement: () => Time.totalTimePlayed.totalYears >= 2,
      description: "You can have 2 black holes",
      formatCost: value => shorten(value, 1, 0)
    },
    {
      id: 21,
      cost: 100000,
      requirement: "2800 total galaxies from all types",
      checkRequirement: () => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies >= 2800,
      description: "Remote galaxy scaling is removed"
    },
    {
      id: 22,
      cost: 100000,
      requirement: () => `${shorten("1e28000")} time shards`,
      checkRequirement: () => player.timeShards.exponent >= 28000,
      description: "Growing bonus to TD based on days spent in this Reality",
      effect: () => Decimal.pow10(Math.pow(1 + 2 * Math.log10(Time.thisReality.totalDays + 1), 1.6)),
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      id: 23,
      cost: 100000,
      requirement: "Reality in under 15 minutes",
      checkRequirement: () => Time.thisReality.totalMinutes < 15,
      description: "Replicanti gain is boosted from your fastest reality",
      effect: () => 15 / Math.clamp(Time.bestReality.totalMinutes, 1 / 60, 15),
      cap: 900,
      formatEffect: value => formatX(value, 2, 2)
    },
    {
      id: 24,
      cost: 100000,
      requirement: "Reality for 5000 RM without glyphs",
      checkRequirement: () => gainedRealityMachines().gte(5000) && Glyphs.activeList.length === 0,
      description: "Gain another glyph slot",
      effect: () => 1
    },
    {
      id: 25,
      cost: 100000,
      requirement: () => `${shorten("1e10500")} EP`,
      checkRequirement: () => player.eternityPoints.exponent >= 10500,
      description: "Reality autobuyer"
    },
  ];
}());
