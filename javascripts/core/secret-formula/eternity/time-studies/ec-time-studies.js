"use strict";

GameDatabase.eternity.timeStudies.ec = [
  {
    id: 1,
    cost: 30,
    requirement: {
      resource: "Eternities",
      current: () => player.eternities,
      required: completions => 20000 + completions * 20000
    }
  },
  {
    id: 2,
    cost: 35,
    requirement: {
      resource: "Tickspeed upgrades gained from time dimensions",
      current: () => player.totalTickGained,
      required: completions => 1300 + completions * 150
    }
  },
  {
    id: 3,
    cost: 40,
    requirement: {
      resource: "8th dimensions",
      current: () => player.eightAmount,
      required: completions => 17300 + completions * 1250
    }
  },
  {
    id: 4,
    cost: 70,
    requirement: {
      resource: "infinities",
      current: () => Player.totalInfinitied,
      required: completions => 1e8 + completions * 5e7
    }
  },
  {
    id: 5,
    cost: 130,
    requirement: {
      resource: "antimatter galaxies",
      current: () => player.galaxies,
      required: completions => 160 + completions * 14
    }
  },
  {
    id: 6,
    cost: 85,
    requirement: {
      resource: "replicanti galaxies",
      current: () => player.replicanti.galaxies,
      required: completions => 40 + completions * 5
    }
  },
  {
    id: 7,
    cost: 115,
    requirement: {
      resource: "antimatter",
      current: () => player.money,
      required: completions => new Decimal("1e300000").pow(completions).times("1e500000")
    }
  },
  {
    id: 8,
    cost: 115,
    requirement: {
      resource: "IP",
      current: () => player.infinityPoints,
      required: completions => new Decimal("1e1000").pow(completions).times("1e4000")
    }
  },
  {
    id: 9,
    cost: 415,
    requirement: {
      resource: "infinity power",
      current: () => player.infinityPower,
      required: completions => new Decimal("1e2000").pow(completions).times("1e17500")
    }
  },
  {
    id: 10,
    cost: 550,
    requirement: {
      resource: "EP",
      current: () => player.eternityPoints,
      required: completions => new Decimal("1e20").pow(completions).times("1e100")
    }
  },
  {
    id: 11,
    cost: 1
  },
  {
    id: 12,
    cost: 1
  }
];