import { Autobuyer, AutobuyerState } from "./autobuyer.js";

class ImaginaryUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return ImaginaryUpgrade(this.id).config.name;
  }

  get data() {
    return player.auto.imaginaryUpgrades[this.id - 1];
  }

  get isUnlocked() {
    return ImaginaryUpgrade(20).isBought;
  }

  tick() {
    ImaginaryUpgrade(this.id).purchase();
  }

  static get entryCount() { return 10; }
  static get autobuyerGroupName() { return "Imaginary Upgrade"; }
}

Autobuyer.imaginaryUpgrade = ImaginaryUpgradeAutobuyerState.createAccessor();
