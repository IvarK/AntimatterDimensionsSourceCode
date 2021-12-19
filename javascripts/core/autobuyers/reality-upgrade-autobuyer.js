import { Autobuyer, AutobuyerState } from "./autobuyer.js";

class RealityUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return RealityUpgrade(this.tier).config.name;
  }

  get data() {
    return player.auto.realityUpgrades[this.tier - 1];
  }

  get isUnlocked() {
    return Ra.has(RA_UNLOCKS.AUTO_RU_AND_INSTANT_EC);
  }

  tick() {
    RealityUpgrade(this.tier).purchase();
  }

  static get entryCount() { return 5; }
  static get autobuyerGroupName() { return "Reality Upgrade"; }
}

Autobuyer.realityUpgrade = RealityUpgradeAutobuyerState.createAccessor();
