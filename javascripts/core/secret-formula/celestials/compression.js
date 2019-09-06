"use strict";

GameDatabase.celestials.compression = {
  freeBoost: {
    id: 0,
    description: "Get free dimboosts based on free galaxy count",
    secondary: () => `${shortenSmallInteger(10000)} free galaxies`,
    cost: 2,
    resource: () => player.dilation.freeGalaxies,
    threshold: () => 10000,
    currentDisplay: () => shortenSmallInteger(player.dilation.freeGalaxies),
    invertedCondition: false,
    effect: () => Math.pow(Math.clampMin(player.dilation.freeGalaxies - 10000, 0), 1.6) + 50000,
    effectDisplay: x => `${shortenSmallInteger(Math.floor(x))} additional dimboosts`
  },
  improvedDTMult: {
    id: 1,
    description: () => `Improve the rebuyable DT multiplier to ${shorten(2.2, 1, 1)}x`,
    secondary: () => `${shorten(new Decimal("1e1400"))} Dilated Time`,
    cost: 21,
    resource: () => player.dilation.dilatedTime,
    threshold: () => new Decimal("1e1400"),
    currentDisplay: () => shorten(player.dilation.dilatedTime, 2, 2),
    invertedCondition: false,
    effect: () => 2.2
  },
  replicantiSpeedFromDB: {
    id: 2,
    description: "Free dimboosts improve replicanti speed",
    secondary: () => `${shorten(new Decimal("1e1500000"))} Replicanti`,
    cost: 20,
    resource: () => player.replicanti.amount,
    threshold: () => new Decimal("1e1500000"),
    currentDisplay: () => shorten(player.replicanti.amount),
    invertedCondition: false,
    effect: () => Math.pow(1 + DimBoost.freeBoosts, 25),
    effectDisplay: x => `${shorten(x, 2, 2)}x`
  },
  strongerDilationGalaxies: {
    id: 3,
    // Note that this actually applies per level of dilation applied in compression
    description: "Galaxies are twice as strong when dilated",
    secondary: () => `${shortenSmallInteger(13000)} total galaxies`,
    cost: 15,
    resource: () => player.galaxies + Replicanti.galaxies.total + player.dilation.freeGalaxies,
    threshold: () => 13000,
    currentDisplay: () => shortenSmallInteger(player.galaxies + Replicanti.galaxies.total +
      player.dilation.freeGalaxies),
    invertedCondition: false,
    effect: () => 2
  },
  freeGalaxySoftcap: {
    id: 4,
    description: () => `Increase the ${shortenSmallInteger(2)}x free galaxy cap
      to ${shortenSmallInteger(10000)} galaxies`,
    secondary: () => `${shorten(Decimal.pow10(5e11), 2, 2)} Antimatter`,
    cost: 100,
    resource: () => player.antimatter,
    threshold: () => Decimal.pow10(5e11),
    currentDisplay: () => shorten(player.antimatter, 2, 2),
    invertedCondition: false,
    effect: () => 10000
  },
  freeGalaxyScaling: {
    id: 5,
    description: "Improve the free galaxy threshold scaling",
    secondary: () => `Free galaxy threshold below ${shorten(1.325, 3, 3)}`,
    cost: 45,
    resource: () => getFreeGalaxyMultBeforeCompression(),
    threshold: () => 1.325,
    currentDisplay: () => shorten(getFreeGalaxyMult(), 2, 3),
    invertedCondition: true,
    effect: () => 0.1 * Math.sqrt(player.dilation.baseFreeGalaxies / 20000)
  },
  infDimSoftcap: {
    id: 6,
    description: () => `ID softcap increases based on free galaxies past ${shortenSmallInteger(10000)}`,
    secondary: () => `^${shorten(7.3, 1, 1)} Infinity power conversion`,
    cost: 24,
    resource: () => getInfinityConversionRate(),
    threshold: () => 7.3,
    currentDisplay: () => shorten(getInfinityConversionRate(), 2, 3),
    invertedCondition: false,
    effect: () => 100 * Math.clampMin(player.dilation.freeGalaxies - 10000, 0),
    effectDisplay: x => `${Math.floor(x)} higher softcap`  
  },
  moreEntanglement: {
    id: 7,
    description: "Gain 40% more entanglement",
    secondary: () => "No 8th time dimensions",
    cost: 48,
    resource: () => TimeDimension(8).amount,
    threshold: () => 0.5,
    currentDisplay: () => shortenSmallInteger(TimeDimension(8).amount),
    invertedCondition: true,
    effect: () => 1.4
  },
  matterBoost: {
    id: 8,
    description: "Dilated time improves dark matter dimension production speed",
    secondary: () => `${shortenSmallInteger(10)} dark matter`,
    cost: 33,
    resource: () => Laitela.matter,
    threshold: () => 10,
    currentDisplay: () => shorten(Laitela.matter, 2, 1),
    invertedCondition: false,
    effect: () => Math.clampMin(player.dilation.dilatedTime.log10() / 1000, 1),
    effectDisplay: x => `${shorten(x, 2, 2)}x`  
  },
};
