GameDatabase.timeStudies.normal = [
  {
    id: 11,
    cost: 1,
    description: "Tickspeed affects 1st Time Dimension with reduced effect",
    effect: () => {
      const tickspeed = player.tickspeed.dividedBy(1000);
      const firstPart = tickspeed.pow(0.005).times(0.95);
      const secondPart = tickspeed.pow(0.0003).times(0.05);
      return firstPart.plus(secondPart).clampMin(Decimal.fromMantissaExponent(1, -2500));
    },
    formatEffect: value => `${shortenMoney(new Decimal(1).dividedBy(value))}x`
  },
  {
    id: 21,
    cost: 3,
    description: "Replicanti multiplier formula is better (log2(x)^2) → (x^0.032)",
    effect: () => Decimal.pow(player.replicanti.amount, 0.032)
  },
  {
    id: 22,
    cost: 2,
    description: "Replicanti interval limit 50ms → 1ms",
    effect: () => 1
  },
  {
    id: 31,
    cost: 3,
    description: "Powers up bonuses that are based on your infinitied stat (to the power of 4)",
    effect: () => 4
  },
  {
    id: 32,
    cost: 2,
    description: () => `You gain ${TimeStudy(32).effectValue}x more infinitied stat (based on Dimension Boosts)`,
    effect: () => Math.max(player.resets, 1)
  },
  {
    id: 33,
    cost: 2,
    description: "You keep half of your Replicanti galaxies on Infinity"
  },
  {
    id: 41,
    cost: 4,
    description: "Each galaxy gives a 1.2x multiplier on IP gained.",
    effect: () => Decimal.pow(1.2, player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 42,
    cost: 6,
    description: "Galaxy requirement goes up 52 8ths instead of 60.",
    effect: () => 52
  },
  {
    id: 51,
    cost: 3,
    description: () => `You gain ${shortenCosts(1e15)}x more IP`,
    effect: () => 1e15
  },
  {
    id: 61,
    cost: 3,
    description: "You gain 10x more EP",
    effect: () => 10
  },
  {
    id: 62,
    cost: 3,
    description: "You gain replicanti 3 times faster",
    effect: () => 3
  },
  {
    id: 71,
    cost: 4,
    description: "Sacrifice affects all other normal dimensions with reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.25).clamp(1, "1e210000"),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 72,
    cost: 6,
    description: "Sacrifice affects 4th Infinity Dimension with greatly reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.04).clamp(1, "1e30000"),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 73,
    cost: 5,
    description: "Sacrifice affects 3rd Time Dimension with greatly reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.005).clamp(1, "1e1300"),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 81,
    cost: 4,
    description: "Dimension Boost power becomes 10x",
    effect: () => 10
  },
  {
    id: 82,
    cost: 6,
    description: "Dimension Boosts affect Infinity Dimensions",
    effect: () => Decimal.pow(1.0000109, Math.pow(player.resets, 2)),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 83,
    cost: 5,
    description: "Dimension Boosts gain a multiplier based on tick upgrades gained from TDs",
    effect: () => Decimal.pow(1.0004, player.totalTickGained).clampMax(1e30),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 91,
    cost: 4,
    description: "Normal dimensions gain a multiplier based on time spent this eternity",
    effect: () => Decimal.pow(10, Math.min(player.thisEternity / 100, 18000) / 60),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 92,
    cost: 5,
    description: "Infinity dimensions gain a multiplier based on fastest eternity time",
    effect: () => Decimal.pow(2, 600 / Math.max(player.bestEternity / 100, 20)),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 93,
    cost: 7,
    description: "Time dimensions gain a multiplier based on tick upgrades gained",
    effect: () => Decimal.pow(player.totalTickGained, 0.25).clampMin(1),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 101,
    cost: 4,
    description: "Replicanti give a multiplier to normal dims equal to their amount.",
    effect: () => Decimal.max(player.replicanti.amount, 1),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 102,
    cost: 6,
    description: "Replicanti galaxies boost replicanti multiplier",
    effect: () => Decimal.pow(5, player.replicanti.galaxies),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 103,
    cost: 6,
    description: "Time dimensions gain a multiplier equal to replicanti galaxy amount",
    effect: () => Math.max(player.replicanti.galaxies, 1),
    formatEffect: value => `${value.toNumber()}x`
  },
  {
    id: 111,
    cost: 12,
    description: "Make the IP formula better",
    effect: () => 285
  },
  {
    id: 121,
    cost: 9,
    description: () => Perk(72).isBought ?
      "You gain 50x more EP" :
      "The worse your average EP/min is, the more EP you get",
    effect: () => (253 - averageEp.dividedBy(player.epmult.times(10)).clamp(3, 248)) / 5,
    formatEffect: value => Perk(72).isBought ? undefined : `${value.toNumber()}x`
  },
  {
    id: 122,
    cost: 9,
    description: "You gain 35x more EP",
    effect: () => 35
  },
  {
    id: 123,
    cost: 9,
    description: "You gain more EP based on time spent this Eternity",
    effect: () => {
      let thisEternity = Time.thisEternity;
      Perk(73).applyEffect(effect => thisEternity = thisEternity.add(effect));
      return Math.sqrt(1.39 * thisEternity);
    },
    formatEffect: value => `${value.toFixed(1)}x`
  },
  {
    id: 131,
    cost: 5,
    description: "Automatic Replicanti galaxies are disabled, but you can get 50% more",
    effect: () => Math.floor(player.replicanti.gal / 2)
  },
  {
    id: 132,
    cost: 5,
    description: "Replicanti galaxies are 40% more effective",
    effect: () => player.replicanti.galaxies * 0.4
  },
  {
    id: 133,
    cost: 5,
    description: "Replicanti are 10x slower until infinity, but their galaxies are 50% stronger",
    effect: () => player.replicanti.galaxies / 2
  },
  {
    id: 141,
    cost: 4,
    description: "Multiplier to IP, which decays over this Infinity",
    effect: () => Decimal.divide(1e45, _TS_thisInfinityMult()).clampMin(1),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 142,
    cost: 4,
    description: () => `You gain ${shortenCosts(1e25)}x more IP`,
    effect: () => 1e25
  },
  {
    id: 143,
    cost: 4,
    description: "Multiplier to IP, which increases over this Infinity",
    effect: () => _TS_thisInfinityMult(),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 151,
    cost: 8,
    description: () => `${shortenCosts(1e4)}x multiplier on all Time Dimensions`,
    effect: () => 1e4
  },
  {
    id: 161,
    cost: 7,
    description: () => `${shortenCosts(new Decimal("1e616"))}x multiplier on all Normal Dimensions`,
    effect: () => new Decimal("1e616")
  },
  {
    id: 162,
    cost: 7,
    description: () => `${shortenCosts(1e11)}x multiplier on all Infinity Dimensions`,
    effect: () => 1e11
  },
  {
    id: 171,
    cost: 15,
    description: "Time shard requirement for the next tickspeed upgrade goes up slower",
    effect: () => 1.25
  },
  {
    id: 181,
    cost: 200,
    description: "You gain 1% of your IP gained on crunch each second",
    effect: () => gainedInfinityPoints().times(Time.deltaTime / 100)
  },
  {
    id: 191,
    cost: 400,
    description: "After Eternity you permanently keep 5% of your Infinities",
    effect: () => Math.floor(player.infinitied * 0.05)
  },
  {
    id: 192,
    cost: 730,
    description: () =>
      `You can get beyond ${shortenMoney(Number.MAX_VALUE)} ` +
      "Replicanti, but the interval is increased the more you have"
  },
  {
    id: 193,
    cost: 300,
    description: "Normal Dimension boost based on Eternities",
    effect: () => Decimal.pow(1.03, player.eternities).clampMax("1e13000"),
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 201,
    cost: 900,
    description: "Pick another path from the first split"
  },
  {
    id: 211,
    cost: 120,
    description: "Dimension Boost requirement scaling is reduced by 5",
    effect: () => 5
  },
  {
    id: 212,
    cost: 150,
    description: "Galaxies are more effective based on your time shards",
    effect: () => Math.min(Math.pow(player.timeShards.clampMin(2).log2(), 0.005), 1.1)
  },
  {
    id: 213,
    cost: 200,
    description: "You gain Replicanti 20 times faster",
    effect: () => 20
  },
  {
    id: 214,
    cost: 120,
    description: "Sacrifice boosts the 8th Dimension even more",
    effect: () => {
      const totalBoost = Sacrifice.totalBoost;
      const firstPart = totalBoost.pow(8).clampMax("1e46000");
      const secondPart = totalBoost.pow(1.1).clampMax("1e125000");
      return firstPart.times(secondPart);
    },
    formatEffect: value => `${shortenMoney(value)}x`
  },
  {
    id: 221,
    cost: 900,
    description: "Time Dimensions gain a multiplier based on Dimension Boosts",
    effect: () => Decimal.pow(1.0025, player.resets)
  },
  {
    id: 222,
    cost: 900,
    description: "Dimension Boost costs scale by another 2 less",
    effect: () => 2
  },
  {
    id: 223,
    cost: 900,
    description: "Galaxy cost scaling starts 7 galaxies later",
    effect: () => 7
  },
  {
    id: 224,
    cost: 900,
    description: "Galaxy cost scaling starts 1 galaxy later for every 2000 Dimension Boosts",
    effect: () => Math.floor(player.resets / 2000)
  },
  {
    id: 225,
    cost: 900,
    description: "You gain extra RGs based on your Replicanti amount",
    effect: () => Math.floor(Replicanti.amount.exponent / 1000),
    formatEffect: value => `+${value} RG`
  },
  {
    id: 226,
    cost: 900,
    description: "You gain extra RGs based on your max RGs",
    effect: () => Math.floor(player.replicanti.gal / 15),
    formatEffect: value => `+${value} RG`
  },
  {
    id: 227,
    cost: 900,
    description: "Sacrifice affects the 4th Time Dimension with reduced effect",
    effect: () => Math.max(Math.pow(Sacrifice.totalBoost.log10(), 10), 1)
  },
  {
    id: 228,
    cost: 900,
    description: "Sacrifice scales better",
    effect: () => 0.013
  },
  {
    id: 231,
    cost: 500,
    description: "Dimension Boosts are more effective based on their amount",
    effect: () => Decimal.pow(player.resets, 0.3).clampMin(1)
  },
  {
    id: 232,
    cost: 500,
    description: "Galaxies are more effective based on Antimatter Galaxies",
    effect: () => Math.pow(1 + player.galaxies / 1000, 0.2)
  },
  {
    id: 233,
    cost: 500,
    description: "Max Replicanti galaxy upgrade cost is reduced based on your Replicanti amount",
    effect: () => Replicanti.amount.pow(0.3)
  },
  {
    id: 234,
    cost: 500,
    description: "Sacrifice boosts First Dimension",
    effect: () => Sacrifice.totalBoost
  },
];

// For studies 141 and 143
const _TS_thisInfinityMult = () => {
  // All "this inf time" or "best inf time" mults are * 10
  const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
  return Decimal.pow(15, Math.log(thisInfinity) * Math.pow(thisInfinity, 0.125));
};