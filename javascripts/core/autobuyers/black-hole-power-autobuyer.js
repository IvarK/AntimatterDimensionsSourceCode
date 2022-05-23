import { Autobuyer, AutobuyerState } from "./autobuyer";

class BlackHolePowerAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.blackHolePower[this.id - 1];
  }

  get name() {
    return `Black Hole ${this.id} Power`;
  }

  get isUnlocked() {
    return Ra.unlocks.blackHolePowerAutobuyers.canBeApplied;
  }

  tick() {
    BlackHole(this.id).powerUpgrade.purchase();
  }

  static get entryCount() { return 2; }
  static get autobuyerGroupName() { return "Black Hole Power"; }
}

Autobuyer.blackHolePower = BlackHolePowerAutobuyerState.createAccessor();
