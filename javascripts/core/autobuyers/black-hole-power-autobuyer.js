import { Autobuyer, AutobuyerState } from "./autobuyer";

class BlackHolePowerAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.blackHolePower.all[this.id - 1];
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
  static get isActive() { return player.auto.blackHolePower.isActive; }
  static set isActive(value) { player.auto.blackHolePower.isActive = value; }
}

Autobuyer.blackHolePower = BlackHolePowerAutobuyerState.createAccessor();
