"use strict";

GameDatabase.celestials.compression = {
  freeBoost: {
    id: 0,
    description: "Generate free dimboosts based on free galaxy count",
    secondary: () => `${shorten(10000)} free galaxies`,
    cost: 5,
    resource: () => player.dilation.freeGalaxies,
    threshold: () => 10000,
    effect: () => Math.floor(Math.pow(Math.clampMin(player.dilation.freeGalaxies - 10000, 0), 1.2))
  },
  improvedDTMult: {
    id: 1,
    description: "Improve the rebuyable DT multiplier to 2.2x",
    secondary: () => `${shorten(new Decimal("1e1100"))} Dilated Time`,
    cost: 36,
    resource: () => player.dilation.dilatedTime,
    threshold: () => new Decimal("1e1100"),
    effect: () => 2.2
  },
  replicantiSpeedFromDB: {
    id: 2,
    description: "Free dimboosts improve replicanti speed",
    secondary: () => `${shorten(new Decimal("1e1500000"))} Replicanti`,
    cost: 20,
    resource: () => player.replicanti.amount,
    threshold: () => new Decimal("1e1500000"),
    effect: () => Math.pow(player.celestials.ra.compression.freeDimboost, 3)
  },
  strongerDilationGalaxies: {
    id: 3,
    description: "Galaxies are stronger within dilation and compression",
    secondary: () => `${shorten(13000)} total galaxies`,
    cost: 15,
    resource: () => undefined,
    threshold: () => 13000,
  },
  freeGalaxySoftcap: {
    id: 4,
    description: "Increase the 2x free galaxy cap to 10,000 galaxies",
    secondary: () => `${shorten(Decimal.pow10(1e11))} Antimatter`,
    cost: 100,
    resource: () => player.antimatter,
    threshold: () => Decimal.pow10(1e11),
  },
  freeGalaxyScaling: {
    id: 5,
    description: "Improve the free galaxy threshold formula",
    secondary: () => "Free galaxy threshold below 1.325",
    cost: 30,
    resource: () => undefined,
    threshold: () => 1.325,
  },
  infDimSoftcap: {
    id: 6,
    description: "ID softcap increases based on free galaxies past 10,000",
    secondary: () => "^7.5 Infinity power conversion",
    cost: 24,
    resource: () => undefined,
    threshold: () => 7.5,
    effect: () => 100 * Math.clampMin(player.dilation.freeGalaxies - 10000, 0)
  },
  moreEntanglement: {
    id: 7,
    description: "Gain 30% more entanglement",
    secondary: () => "???",
    resource: () => undefined,
    cost: 45,
    effect: () => 1.3
  },
  matterBoost: {
    id: 8,
    description: "Dilated time improves matter dimension production speed",
    secondary: () => "10 Matter",
    cost: 33,
    resource: () => Laitela.matter,
    threshold: () => 10,
    effect: () => Math.clampMin(player.dilation.dilatedTime.log10() / 1000, 1)
  },
};
