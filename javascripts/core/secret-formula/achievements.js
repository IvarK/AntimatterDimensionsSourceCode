GameDatabase.achievements = [
  {
    id: 21,
    effect: () => 100
  },
  {
    id: 37,
    effect: () => 1000
  },
  {
    id: 54,
    effect: () => 2e5
  },
  {
    id: 55,
    effect: () => 1e10
  },
  {
    id: 78,
    effect: () => 1e25
  },
  {
    id: 85,
    effect: () => 4
  },
  {
    id: 87,
    effect: () => 250,
    effectCondition: () => Time.thisInfinity.totalSeconds > 5
  },
  {
    id: 93,
    effect: () => 4
  },
  {
    id: 101,
    effect: () => 1.01
  },
  {
    id: 103,
    effect: () => 307.8
  },
  {
    id: 112,
    effect: () => 610
  },
  {
    id: 116,
    effect: () => Decimal.pow(2, Math.log10(Player.totalInfinitied + 1))
  },
  {
    id: 125,
    effect: function() {
      // All "this inf time" or "best inf time" mults are * 10
      const thisInfinity = Time.thisInfinity.totalSeconds * 10 + 1;
      return Decimal.pow(2, Math.log(thisInfinity) * Math.pow(thisInfinity, 0.11));
    }
  },
  {
    id: 132,
    effect: () => Math.max(Math.pow(player.galaxies, 0.04), 1)
  },
  {
    id: 141,
    effect: () => 4
  },
  {
    id: 142,
    effect: () => 1.5
  },
];