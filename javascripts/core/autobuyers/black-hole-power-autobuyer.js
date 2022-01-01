import { Autobuyer, AutobuyerState } from "./autobuyer.js";

class BlackHolePowerAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.blackHolePower[this.id - 1];
  }

  get name() {
    return `Black Hole ${this.id} Power`;
  }

  get isUnlocked() {
    return Ra.has(RA_UNLOCKS.AUTO_BLACK_HOLE_POWER);
  }

  tick() {
    BlackHole(this.id).powerUpgrade.purchase();
  }

  static get entryCount() { return 2; }
  static get autobuyerGroupName() { return "Black Hole Power"; }
}

Autobuyer.blackHolePower = BlackHolePowerAutobuyerState.createAccessor();
