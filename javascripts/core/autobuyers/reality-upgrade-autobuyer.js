"use strict";

class RealityUpgradeAutobuyerState extends AutobuyerState {
  constructor(upgrade) {
    super();
    this._upgrade = upgrade;
  }

  get name() {
    const upgrade = this._upgrade;
    return RealityUpgrade(upgrade).config.name;
  }

  get data() {
    return player.auto.realityUpgrades[this._upgrade - 1];
  }

  get isUnlocked() {
    return Ra.has(RA_UNLOCKS.AUTO_RU_AND_INSTANT_EC);
  }

  tick() {
    const upgrade = this._upgrade;
    RealityUpgrade(upgrade).purchase();
  }
}

RealityUpgradeAutobuyerState.index = Array.range(1, 5).map(upgrade => new RealityUpgradeAutobuyerState(upgrade));

Autobuyer.realityUpgrade = upgrade => RealityUpgradeAutobuyerState.index[upgrade - 1];
Autobuyer.realityUpgrade.array = RealityUpgradeAutobuyerState.index;
Autobuyer.realityUpgrade.array.name = "Reality Upgrade";
