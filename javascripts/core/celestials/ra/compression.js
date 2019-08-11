"use strict";

const TimeCompression = {
  get timeShardRequirement() {
    return new Decimal("1e3500000");
  },
  toggle() {
    if (player.timeShards.lt(this.timeShardRequirement) && !this.isActive) {
      return;
    }
    if (this.isActive) {
      this.rewardEntanglement();
    }
    eternity(false, false, { switchingDilation: true });
    player.dilation.active = false;
    this.isActive = !this.isActive;
  },
  get entanglement() {
    return player.celestials.ra.compression.entanglement;
  },
  set entanglement(value) {
    player.celestials.ra.compression.entanglement = value;
  },
  get totalEntanglement() {
    return this.entanglement + this.spentEntanglement;
  },
  rewardEntanglement() {
    this.entanglement = Math.max(this.entanglement, this.entanglementThisRun - this.spentEntanglement);
  },
  get spentEntanglement() {
    return CompressionUpgrades.all
      .filter(u => u.isBought)
      .map(u => u.cost)
      .sum();
  },
  get entanglementThisRun() {
    if (!this.isActive) {
      return 0;
    }
    const entanglementMult = Effects.max(1, CompressionUpgrade.moreEntanglement);
    return 308 * Math.clamp((Math.pow(player.antimatter.log10() / 2e5, 0.4) - 1) / 10 * entanglementMult, 0, 1);
  },
  get compressionDepth() {
    return 2;
  },
  get isActive() {
    return player.celestials.ra.compression.active;
  },
  set isActive(value) {
    player.celestials.ra.compression.active = value;
  },
};

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
    TimeCompression.entanglement += TimeCompression.spentEntanglement;
    player.celestials.ra.compression.upgradeBits = 0;
    player.celestials.ra.compression.respec = false;
  }
};
