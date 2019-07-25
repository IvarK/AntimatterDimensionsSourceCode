"use strict";

GameDatabase.celestials.compression = {
  freeBoost: {
    id: 0,
    description: "Gain free dimboosts based on free galaxy count",
    cost: 2,
    active: () => false,
    effect: () => Math.floor(Math.pow(Math.clampMin(player.dilation.freeGalaxies - 10000, 0), 1.2))
  },
  improvedDTMult: {
    id: 1,
    description: "Improve the rebuyable DT multiplier to 2.2x",
    cost: 12,
    active: () => false,
    effect: () => 2.2
  },
  replicantiSpeedFromDB: {
    id: 2,
    description: "Free dimboosts improve replicanti speed",
    cost: 7,
    active: () => false,
    effect: () => Math.pow(player.celestials.ra.compression.freeDimboost, 3)
  },
  strongerDilationGalaxies: {
    id: 3,
    description: "Galaxies are stronger within dilation",
    cost: 5,
    active: () => false,
  },
  freeGalaxySoftcap: {
    id: 4,
    description: "Increase the 2x free galaxy softcap to 10,000 galaxies",
    cost: 30,
    active: () => false,
  },
  freeGalaxyScaling: {
    id: 5,
    description: "Improve the free galaxy threshold formula",
    cost: 10,
    active: () => false,
  },
  infDimSoftcap: {
    id: 6,
    description: "ID softcap increases based on free galaxies past 10,000",
    cost: 8,
    active: () => false,
    effect: () => 100 * Math.clampMin(player.dilation.freeGalaxies - 10000, 0)
  },
  moreEntanglement: {
    id: 7,
    description: "Gain 30% more entanglement",
    cost: 15,
    active: () => false,
    effect: () => 1.3
  },
  matterBoost: {
    id: 8,
    description: Ra.has(RA_UNLOCKS.LAITELA_UNLOCK)
      ? "Dilated time improves matter dimension production speed"
      : "?????",
    cost: 11,
    active: () => false,
    effect: () => Math.clampMin(player.dilation.dilatedTime.log10() / 1000, 1)
  },
};

class CompressionUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.entanglement;
  }

  get set() {
    return player.celestials.ra.compression.upgrades;
  }
}

const CompressionUpgrade = (function() {
  const db = GameDatabase.celestials.compression;
  return {
    freeBoost: new CompressionUpgradeState(db.freeBoost),
    improvedDTMult: new CompressionUpgradeState(db.improvedDTMult),
    replicantiSpeedFromDB: new CompressionUpgradeState(db.replicantiSpeedFromDB),
    strongerDilationGalaxies: new CompressionUpgradeState(db.strongerDilationGalaxies),
    freeGalaxySoftcap: new CompressionUpgradeState(db.freeGalaxySoftcap),
    freeGalaxyScaling: new CompressionUpgradeState(db.freeGalaxyScaling),
    infDimSoftcap: new CompressionUpgradeState(db.infDimSoftcap),
    moreEntanglement: new CompressionUpgradeState(db.moreEntanglement),
    matterBoost: new CompressionUpgradeState(db.matterBoost)
  };
})();
