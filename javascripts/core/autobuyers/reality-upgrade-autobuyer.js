"use strict";

class RealityUpgradeAutobuyerState extends AutobuyerState {
  constructor(upgrade) {
    super();
    this._upgrade = upgrade;
  }

  get data() {
    return player.auto.realityUpgrades[this._upgrade - 1];
  }

  get isUnlocked() {
    return Ra.has(RA_UNLOCKS.AUTO_REALITY_UPGRADES);
  }

  tick() {
    const upgrade = this._upgrade;
    RealityUpgrade(upgrade).purchase();
  }
}

RealityUpgradeAutobuyerState.index = Array.range(1, 5).map(upgrade => new RealityUpgradeAutobuyerState(upgrade));

Autobuyer.realityUpgrades = upgrade => RealityUpgradeAutobuyerState.index[upgrade - 1];
