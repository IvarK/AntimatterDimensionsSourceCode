import { Autobuyer, AutobuyerState } from "./autobuyer.js";

class ImaginaryUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return ImaginaryUpgrade(this.tier).config.name;
  }

  get data() {
    return player.auto.imaginaryUpgrades[this.tier - 1];
  }

  get isUnlocked() {
    return ImaginaryUpgrade(20).isBought;
  }

  tick() {
    ImaginaryUpgrade(this.tier).purchase();
  }

  static get entryCount() { return 10; }
  static get autobuyerGroupName() { return "Imaginary Upgrade"; }
}

Autobuyer.imaginaryUpgrade = ImaginaryUpgradeAutobuyerState.createAccessor();
