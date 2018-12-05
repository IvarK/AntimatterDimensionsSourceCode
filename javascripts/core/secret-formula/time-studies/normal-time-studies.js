GameDatabase.timeStudies.normal = [
  {
    id: 11,
    cost: 1,
    effect: function() {
      const tickspeed = player.tickspeed.dividedBy(1000);
      const firstPart = tickspeed.pow(0.005).times(0.95);
      const secondPart = tickspeed.pow(0.0003).times(0.05);
      return firstPart.plus(secondPart).clampMin(Decimal.fromMantissaExponent(1, -2500));
    }
  },
  {
    id: 21,
    cost: 3,
    effect: () => Decimal.pow(player.replicanti.amount, 0.032)
  },
  {
    id: 22,
    cost: 2,
    effect: () => 1
  },
  {
    id: 31,
    cost: 3,
    effect: () => 4
  },
  {
    id: 32,
    cost: 2,
    effect: () => Math.max(player.resets, 1)
  },
  {
    id: 33,
    cost: 2
  },
  {
    id: 41,
    cost: 4,
    effect: () => Decimal.pow(1.2, player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies)
  },
  {
    id: 42,
    cost: 6,
    effect: () => 52
  },
  {
    id: 51,
    cost: 3,
    effect: () => 1e15
  },
  {
    id: 61,
    cost: 3,
    effect: () => 10
  },
  {
    id: 62,
    cost: 3,
    effect: () => 3
  },
  {
    id: 71,
    cost: 4,
    effect: () => Sacrifice.totalBoost.pow(0.25).clamp(1, "1e210000")
  },
  {
    id: 72,
    cost: 6,
    effect: () => Sacrifice.totalBoost.pow(0.04).clamp(1, "1e30000")
  },
  {
    id: 73,
    cost: 5,
    effect: () => Sacrifice.totalBoost.pow(0.005).clamp(1, "1e1300")
  },
  {
    id: 81,
    cost: 4,
    effect: () => 10
  },
  {
    id: 82,
    cost: 6,
    effect: () => Decimal.pow(1.0000109, Math.pow(player.resets, 2))
  },
  {
    id: 83,
    cost: 5,
    effect: () => Decimal.pow(1.0004, player.totalTickGained).clampMax(1e30)
  },
  {
    id: 91,
    cost: 4,
    effect: () => Decimal.pow(10, Math.min(player.thisEternity / 100, 18000) / 60)
  },
  {
    id: 92,
    cost: 5,
    effect: () => Decimal.pow(2, 600 / Math.max(player.bestEternity / 100, 20))
  },
  {
    id: 93,
    cost: 7,
    effect: () => Decimal.pow(player.totalTickGained, 0.25).clampMin(1)
  },
  {
    id: 101,
    cost: 4,
    effect: () => Decimal.max(player.replicanti.amount, 1)
  },
  {
    id: 102,
    cost: 6,
    effect: () => Decimal.pow(5, player.replicanti.galaxies)
  },
  {
    id: 103,
    cost: 6,
    effect: () => Math.max(player.replicanti.galaxies, 1)
  },
  {
    id: 111,
    cost: 12,
    effect: () => 285
  },
  {
    id: 121,
    cost: 9,
    effect: () => (253 - averageEp.dividedBy(player.epmult.times(10)).clamp(3, 248)) / 5
  },
  {
    id: 122,
    cost: 9,
    effect: () => 35
  },
  {
    id: 123,
    cost: 9,
    effect: () => Math.sqrt(1.39 * Time.thisEternity.totalSeconds)
  },
  {
    id: 131,
    cost: 5,
    effect: () => Math.floor(player.replicanti.gal / 2)
  },
  {
    id: 132,
    cost: 5,
    effect: () => player.replicanti.galaxies * 0.4
  },
  {
    id: 133,
    cost: 5,
    effect: () => player.replicanti.galaxies / 2
  },
  {
    id: 141,
    cost: 4,
    effect: () => Decimal.divide(1e45, thisInfinityMult()).clampMin(1)
  },
  {
    id: 142,
    cost: 4,
    effect: () => 1e25
  },
  {
    id: 143,
    cost: 4,
    effect: () => thisInfinityMult()
  },
  {
    id: 151,
    cost: 8,
    effect: () => 1e4
  },
  {
    id: 161,
    cost: 7,
    effect: () => new Decimal("1e616")
  },
  {
    id: 162,
    cost: 7,
    effect: () => 1e11
  },
  {
    id: 171,
    cost: 15,
    effect: () => 1.25
  },
  {
    id: 181,
    cost: 200,
    effect: () => gainedInfinityPoints().times(Time.deltaTime / 100)
  },
  {
    id: 191,
    cost: 400,
    effect: () => Math.floor(player.infinitied * 0.05)
  },
  {
    id: 192,
    cost: 730
  },
  {
    id: 193,
    cost: 300,
    effect: () => Decimal.pow(1.03, player.eternities).clampMax("1e13000")
  },
  {
    id: 201,
    cost: 900
  },
  {
    id: 211,
    cost: 120,
    effect: () => 5
  },
  {
    id: 212,
    cost: 150,
    effect: () => Math.min(Math.pow(player.timeShards.clampMin(2).log2(), 0.005), 1.1)
  },
  {
    id: 213,
    cost: 200,
    effect: () => 20
  },
  {
    id: 214,
    cost: 120,
    effect: function() {
      const totalBoost = Sacrifice.totalBoost;
      const firstPart = totalBoost.pow(8).clampMax("1e46000");
      const secondPart = totalBoost.pow(1.1).clampMax("1e125000");
      return firstPart.times(secondPart);
    }
  },
  {
    id: 221,
    cost: 900,
    effect: () => Decimal.pow(1.0025, player.resets)
  },
  {
    id: 222,
    cost: 900,
    effect: () => 2
  },
  {
    id: 223,
    cost: 900,
    effect: () => 7
  },
  {
    id: 224,
    cost: 900,
    effect: () => Math.floor(player.resets / 2000)
  },
  {
    id: 225,
    cost: 900,
    effect: () => Math.floor(Replicanti.amount.exponent / 1000)
  },
  {
    id: 226,
    cost: 900,
    effect: () => Math.floor(player.replicanti.gal / 15)
  },
  {
    id: 227,
    cost: 900,
    effect: () => Math.max(Math.pow(Sacrifice.totalBoost.log10(), 10), 1)
  },
  {
    id: 228,
    cost: 900,
    effect: () => player.firstAmount.dividedBy(player.sacrificed.clampMin(1)).pow(0.013).clampMin(1)
  },
  {
    id: 231,
    cost: 500,
    effect: () => Decimal.pow(player.resets, 0.3).clampMin(1)
  },
  {
    id: 232,
    cost: 500,
    effect: () => Math.pow(1 + player.galaxies / 1000, 0.2)
  },
  {
    id: 233,
    cost: 500,
    effect: () => Replicanti.amount.pow(0.3)
  },
  {
    id: 234,
    cost: 500,
    effect: () => Sacrifice.totalBoost
  },
];

// For studies 141 and 143
const thisInfinityMult = () => {
  // All "this inf time" or "best inf time" mults are * 10
  const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
  return Decimal.pow(15, Math.log(thisInfinity) * Math.pow(thisInfinity, 0.125));
};