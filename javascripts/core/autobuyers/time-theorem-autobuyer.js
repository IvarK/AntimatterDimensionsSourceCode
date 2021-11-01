"use strict";

Autobuyer.timeTheorem = new class TimeTheoremAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get name() {
    return `Time Theorem`;
  }

  get isUnlocked() {
    return Perk.ttBuySingle.isBought;
  }

  tick() {
    return Perk.ttBuyMax.isBought ? TimeTheorems.buyMax(true) : TimeTheorems.buyOneOfEach();
  }
}();
