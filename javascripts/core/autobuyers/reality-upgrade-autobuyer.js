import { Autobuyer, AutobuyerState } from "./autobuyer.js";

class RealityUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return RealityUpgrade(this.id).config.name;
  }

  get data() {
    return player.auto.realityUpgrades[this.id - 1];
  }

  get isUnlocked() {
    return Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied;
  }

  tick() {
    RealityUpgrade(this.id).purchase();
  }

  static get entryCount() { return 5; }
  static get autobuyerGroupName() { return "Reality Upgrade"; }
}

Autobuyer.realityUpgrade = RealityUpgradeAutobuyerState.createAccessor();
