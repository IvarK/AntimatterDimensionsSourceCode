"use strict";

class ImaginaryUpgradeAutobuyerState extends AutobuyerState {
  constructor(upgrade) {
    super();
    this._upgrade = upgrade;
  }

  get name() {
    const upgrade = this._upgrade;
    return ImaginaryUpgrade(upgrade).config.name;
  }

  get data() {
    return player.auto.imaginaryUpgrades[this._upgrade - 1];
  }

  get isUnlocked() {
    return ImaginaryUpgrade(20).isBought;
  }

  tick() {
    const upgrade = this._upgrade;
    ImaginaryUpgrade(upgrade).purchase();
  }
}

ImaginaryUpgradeAutobuyerState.index = Array.range(1, 10).map(upgrade => new ImaginaryUpgradeAutobuyerState(upgrade));

Autobuyer.imaginaryUpgrade = upgrade => ImaginaryUpgradeAutobuyerState.index[upgrade - 1];
Autobuyer.imaginaryUpgrade.array = ImaginaryUpgradeAutobuyerState.index;
Autobuyer.imaginaryUpgrade.array.name = "Imaginary Upgrade";
