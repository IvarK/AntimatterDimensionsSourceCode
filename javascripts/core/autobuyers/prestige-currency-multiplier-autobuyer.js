"use strict";

Autobuyer.ipMult = new class IPMultAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.ipMultBuyer;
  }

  get name() {
    return `Infinity Point Multiplier`;
  }

  get isUnlocked() {
    return EternityMilestone.autobuyerIPMult.isReached;
  }

  tick() {
    InfinityUpgrade.ipMult.buyMax();
  }
}();

Autobuyer.epMult = new class EPMultAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.epMultBuyer;
  }

  get name() {
    return `Eternity Point Multiplier`;
  }

  get isUnlocked() {
    return RealityUpgrade(13).isBought;
  }

  tick() {
    EternityUpgrade.epMult.buyMax();
  }
}();
