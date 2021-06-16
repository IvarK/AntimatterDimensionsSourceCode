"use strict";

GameDatabase.eternity.timeStudies.ec = [
  {
    id: 1,
    cost: 30,
    requirement: {
      resource: "Eternities",
      current: () => Currency.eternities.value,
      required: completions => new Decimal(20000 + completions * 20000),
      formatValue: formatInt
    }
  },
  {
    id: 2,
    cost: 35,
    requirement: {
      resource: "Tickspeed upgrades from Time Dimensions",
      current: () => player.totalTickGained,
      required: completions => 1300 + completions * 150,
      formatValue: formatInt
    }
  },
  {
    id: 3,
    cost: 40,
    requirement: {
      resource: "8th Antimatter Dimensions",
      current: () => AntimatterDimension(8).amount,
      required: completions => new Decimal(17300 + completions * 1250),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 4,
    cost: 70,
    requirement: {
      resource: "Infinities",
      current: () => Currency.infinitiesTotal.value,
      required: completions => new Decimal(1e8 + completions * 5e7),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 5,
    cost: 130,
    requirement: {
      resource: "Antimatter Galaxies",
      current: () => player.galaxies,
      required: completions => 160 + completions * 14,
      formatValue: formatInt
    }
  },
  {
    id: 6,
    cost: 85,
    requirement: {
      resource: "Replicanti Galaxies",
      current: () => player.replicanti.galaxies,
      required: completions => 40 + completions * 5,
      formatValue: formatInt
    }
  },
  {
    id: 7,
    cost: 115,
    requirement: {
      resource: "antimatter",
      current: () => Currency.antimatter.value,
      required: completions => new Decimal("1e300000").pow(completions).times("1e500000"),
      formatValue: value => format(value)
    }
  },
  {
    id: 8,
    cost: 115,
    requirement: {
      resource: "Infinity Points",
      current: () => Currency.infinityPoints.value,
      required: completions => new Decimal("1e1000").pow(completions).times("1e4000"),
      formatValue: value => format(value)
    }
  },
  {
    id: 9,
    cost: 415,
    requirement: {
      resource: "Infinity Power",
      current: () => Currency.infinityPower.value,
      required: completions => new Decimal("1e2000").pow(completions).times("1e17500"),
      formatValue: value => format(value)
    }
  },
  {
    id: 10,
    cost: 550,
    requirement: {
      resource: "Eternity Points",
      current: () => Currency.eternityPoints.value,
      required: completions => new Decimal("1e20").pow(completions).times("1e100"),
      formatValue: value => format(value)
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
