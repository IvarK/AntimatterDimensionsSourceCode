"use strict";

class ReplicantiUpgradeAutobuyerState extends IntervaledAutobuyerState {
  constructor(upgrade) {
    super();
    this._upgrade = upgrade;
    this._upgradeName = ["chance", "interval", "galaxies"][this._upgrade - 1];
  }

  get data() {
    return player.auto.replicantiUpgrades[this._upgrade - 1];
  }

  get interval() {
    return 1000 * Perk.autobuyerFasterReplicanti.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return ReplicantiUpgrade[this._upgradeName].autobuyerMilestone.isReached;
  }

  tick() {
    const upgradeName = this._upgradeName;
    if (EternityChallenge(8).isRunning) return;
    ReplicantiUpgrade[upgradeName].autobuyerTick();
  }
}

ReplicantiUpgradeAutobuyerState.index = Array.range(1, 3).map(upgrade => new ReplicantiUpgradeAutobuyerState(upgrade));

Autobuyer.replicantiUpgrade = upgrade => ReplicantiUpgradeAutobuyerState.index[upgrade - 1];
