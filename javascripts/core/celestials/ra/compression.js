"use strict";

function toggleCompression() {
  if (player.timeShards.lt(new Decimal("1e5000000")) && !Ra.isCompressed) {
    return;
  }
  if (Ra.isCompressed) {
    rewardEntanglement();
  }
  eternity(false, false, { switchingDilation: true });
  player.dilation.active = false;
  Ra.isCompressed = !Ra.isCompressed;
}

// Updates entanglement
function rewardEntanglement() {
  const newEntanglement = entanglementThisRun();
  Ra.entanglement = Math.max(Ra.entanglement, newEntanglement);
}

// Returns how much entanglement the current run will give
function entanglementThisRun() {
  if (!Ra.isCompressed) {
    return 0;
  }
  const value = player.antimatter;
  return 308 * Math.clamp((Math.pow(value.log10() / 2e5, 0.4) - 1) / 10, 0, 1);
}

// Returns amount of entanglement gained this run, used only for display purposes
function getEntanglementGain() {
  return Math.max(0, entanglementThisRun() - Ra.entanglement);
}

// Returns the mimimum antimatter to gain entanglement
function minAntimatterForEntanglement() {
  if (Ra.entanglement === 100) {
    return Decimal.pow10(9e15);
  }
  return Decimal.pow10(2e5 * Math.pow(1 + Ra.entanglement / 30.8, 2.5));
}

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
