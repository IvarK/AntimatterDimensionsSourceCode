import { Autobuyer, AutobuyerState } from "./autobuyer.js";

class BlackHolePowerAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.blackHolePower[this.tier - 1];
  }

  get name() {
    return `Black Hole ${this.tier} Power`;
  }

  get isUnlocked() {
    return Ra.has(RA_UNLOCKS.AUTO_BLACK_HOLE_POWER);
  }

  tick() {
    BlackHole(this.tier).powerUpgrade.purchase();
  }

  static get entryCount() { return 2; }
  static get autobuyerGroupName() { return "Black Hole Power"; }
}

Autobuyer.blackHolePower = BlackHolePowerAutobuyerState.createAccessor();
