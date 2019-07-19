"use strict";

GameDatabase.celestials.v = {
  mainUnlock: {
    realities: 10000,
    eternities: 1e70,
    infinities: 1e160,
    dilatedTime: new Decimal("1e320"),
    replicanti: new Decimal("1e320000"),
    rm: new Decimal("1e60")
  },
  runUnlocks: [
    {
      id: 0,
      name: "Cool Runnings",
      description: value => `Unlock reality with at most ${value} ${pluralize("glyph", value)} equipped.`,
      values: [5, 4, 3, 2, 1, 0],
      condition: x => TimeStudy.reality.isBought && Glyphs.activeList.length <= x
    },
    {
      id: 1,
      name: "AntiStellar",
      description: value => `Have ${value} total galaxies from all types.`,
      values: [4000, 4200, 4400, 4600, 4800, 5000],
      condition: x => Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies >= x
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: value => `Get ${shorten(value)} IP in Eternity Challenge 7.`,
      values: [6e5, 7.2e5, 8.4e5, 9.6e5, 1.08e6, 1.2e6].map(Decimal.pow10),
      condition: x => EternityChallenge(7).isRunning && player.infinityPoints.gte(x)
    },
    {
      id: 3,
      name: "Young Boy",
      description: value => `Get ${shorten(value)} Antimatter in Eternity Challenge 12.`,
      values: [2e9, 2.2e9, 2.4e9, 2.6e9, 2.8e9, 3e9].map(Decimal.pow10),
      condition: x => EternityChallenge(12).isRunning && player.antimatter.gte(x)
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: value => `Get ${shorten(value)} EP.`,
      values: ["1e6000", "1e6600", "1e7200", "1e7800", "1e8400", "1e9000"].map(v => new Decimal(v)),
      condition: x => player.eternityPoints.gte(x)
    },
    {
      id: 5,
      name: "Matterception",
      description: value => `Get ${value} Dimensional Boosts while dilating time, inside EC5.`,
      values: [50, 52, 54, 56, 58, 60],
      condition: x => player.dilation.active && EternityChallenge(5).isRunning && player.resets >= x
    }
  ]
};