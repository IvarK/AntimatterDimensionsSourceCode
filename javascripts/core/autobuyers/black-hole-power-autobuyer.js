"use strict";

class BlackHolePowerAutobuyerState extends AutobuyerState {
  constructor(blackHole) {
    super();
    this._blackHole = blackHole;
  }

  get data() {
    return player.auto.blackHolePower[this._blackHole - 1];
  }

  get name() {
    return `Black Hole ${this._blackHole} Power`;
  }

  get isUnlocked() {
    return Ra.has(RA_UNLOCKS.AUTO_BLACK_HOLE_POWER);
  }

  tick() {
    const blackHole = this._blackHole;
    BlackHole(blackHole).powerUpgrade.purchase();
  }
}

BlackHolePowerAutobuyerState.index = Array.range(1, 2).map(blackHole => new BlackHolePowerAutobuyerState(blackHole));

Autobuyer.blackHolePower = blackHole => BlackHolePowerAutobuyerState.index[blackHole - 1];
Autobuyer.blackHolePower.array = BlackHolePowerAutobuyerState.index;
