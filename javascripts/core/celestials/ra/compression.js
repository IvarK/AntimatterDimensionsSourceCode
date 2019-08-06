"use strict";

function toggleCompression() {
  if (player.timeShards.lt(new Decimal("1e3500000")) && !Ra.isCompressed) {
    return;
  }
  if (Ra.isCompressed) {
    rewardEntanglement();
  }
  eternity(false, false, { switchingDilation: true });
  player.dilation.active = false;
  Ra.isCompressed = !Ra.isCompressed;
}

function totalEntanglement() {
  return Ra.entanglement + Ra.spentEntanglement;
}

// Updates entanglement
function rewardEntanglement() {
  const newEntanglement = entanglementThisRun();
  Ra.entanglement = Math.max(Ra.entanglement, newEntanglement - Ra.spentEntanglement);
}

// Returns how much entanglement the current run will give
function entanglementThisRun() {
  if (!Ra.isCompressed) {
    return 0;
  }
  const value = player.antimatter;
  const entanglementMult = Effects.max(1, CompressionUpgrade.moreEntanglement);
  return 308 * Math.clamp((Math.pow(value.log10() / 2e5, 0.4) - 1) / 10 * entanglementMult, 0, 1);
}

// Returns amount of entanglement gained this run, used only for display purposes
function getEntanglementGain() {
  return Math.max(0, entanglementThisRun() - totalEntanglement());
}

// Returns the mimimum antimatter to gain entanglement, only used for display
function minAntimatterForEntanglement() {
  if (Ra.entanglement === 100) {
    return Decimal.pow10(9e15);
  }
  const entanglementMult = Effects.max(1, CompressionUpgrade.moreEntanglement);
  return Decimal.pow10(2e5 * Math.pow(1 + totalEntanglement() / (30.8 * entanglementMult), 2.5));
}

class CompressionUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.entanglement;
  }

  get set() {
    return player.celestials.ra.compression.upgrades;
  }

  get canBeApplied() {
    // eslint-disable-next-line no-bitwise
    const requirementFulfilled = new Decimal(this.config.resource()).gte(this.config.threshold()) ^
      this.config.invertedCondition;
    return this.isBought && requirementFulfilled;
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
