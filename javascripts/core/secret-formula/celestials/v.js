GameDatabase.celestials.v = {
  mainUnlock: {
    realities: 10000,
    eternities: 1e60,
    infinities: 1e150,
    dilatedTime: 1e250,
    replicanti: new Decimal("1e250000")
  },
  runUnlocks: [
    {
      id: 0,
      name: "Running Man",
      description: "Complete all challenges within {value} seconds from starting reality (real time).",
      values: [18, 15, 12, 10, 7, 5],
      condition: x => EternityChallenge.completedTiers() === 60 && Time.thisRealityRealTime.totalSeconds < x
    },
    {
      id: 1,
      name: "AntiStellar",
      description: "Have {value} total galaxies from all types.",
      values: [2500, 2750, 3000, 3250, 3500, 3750],
      condition: (x) => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies > x,
      format: x => x
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: "Get {value} IP at Eternity Challenge 7.",
      values: ["1e250000", "1e270000", "1e290000", "1e310000", "1e330000", "1e350000"].map(v => new Decimal(v)),
      condition: x => EternityChallenge(7).isRunning && player.infinityPoints.gte(x)
    },
    {
      id: 3,
      name: "Young Boy",
      description: "Get {value} Antimatter at Eternity Challenge 12.",
      values: ["1e275000000", "1e300000000", "1e325000000", "1e350000000", "1e375000000", "1e400000000"].map(v => new Decimal(v)),
      condition: x => EternityChallenge(12).isRunning && player.money.gte(x)
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: "Get {value} EP.",
      values: ["1e2000", "1e2400", "1e2800", "1e3200", "1e3600", "1e4000"].map(v => new Decimal(v)),
      condition: x => player.eternityPoints.gte(x)
    },
    {
      id: 5,
      name: "Matterception",
      description: "Get {value} Dimensional Boosts while dilating time, inside EC5.",
      values: [35, 38, 41, 44, 47, 50],
      condition: x => player.dilation.active && EternityChallenge(5).isRunning && player.resets >= x
    }
  ]
};