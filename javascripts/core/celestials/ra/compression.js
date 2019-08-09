"use strict";

const TimeCompression = {
  get timeShardRequirement() {
    return new Decimal("1e3500000");
  },

  toggle() {
    if (player.timeShards.lt(this.timeShardRequirement) && !Ra.isCompressed) {
      return;
    }
    if (Ra.isCompressed) {
      this.rewardEntanglement();
    }
    eternity(false, false, { switchingDilation: true });
    player.dilation.active = false;
    Ra.isCompressed = !Ra.isCompressed;
  },

  get totalEntanglement() {
    return Ra.entanglement + Ra.spentEntanglement;
  },

  // Updates entanglement
  rewardEntanglement() {
    const newEntanglement = TimeCompression.entanglementThisRun;
    Ra.entanglement = Math.max(Ra.entanglement, newEntanglement - Ra.spentEntanglement);
  },

  // Returns how much entanglement the current run will give
  get entanglementThisRun() {
    if (!Ra.isCompressed) {
      return 0;
    }
    const value = player.antimatter;
    const entanglementMult = Effects.max(1, CompressionUpgrade.moreEntanglement);
    return 308 * Math.clamp((Math.pow(value.log10() / 2e5, 0.4) - 1) / 10 * entanglementMult, 0, 1);
  },

  // Returns amount of entanglement gained this run, used only for display purposes
  get entanglementGain() {
    return Math.max(0, this.entanglementThisRun - this.totalEntanglement);
  },

  // Returns the mimimum antimatter to gain entanglement, only used for display
  get minAntimatterForEntanglement() {
    if (this.totalEntanglement === 308) {
      return Decimal.pow10(9e15);
    }
    const entanglementMult = Effects.max(1, CompressionUpgrade.moreEntanglement);
    return Decimal.pow10(2e5 * Math.pow(1 + this.totalEntanglement / (30.8 * entanglementMult), 2.5));
  }
}

class CompressionUpgradeState extends BitPurchasableMechanicState {
  get currency() {
    return Currency.entanglement;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.celestials.ra.compression.upgradeBits;
  }

  set bits(value) {
    player.celestials.ra.compression.upgradeBits = value;
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

const CompressionUpgrades = {
  all: Object.values(CompressionUpgrade),
  respec() {
    Ra.entanglement += Ra.spentEntanglement;
    player.celestials.ra.compression.upgradeBits = 0;
    player.celestials.ra.compression.respec = false;
  }
};
