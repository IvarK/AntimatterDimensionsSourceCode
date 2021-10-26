"use strict";

Autobuyer.timeTheorem = new class TimeTheoremAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get name() {
    return `Time Theorem`;
  }

  get interval() {
    if (!Perk.ttBuySingle.isBought) return Number.POSITIVE_INFINITY;
    // Activates every tick
    return 0;
  }

  get isUnlocked() {
    return Perk.ttBuySingle.isBought;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  tick() {
    super.tick();
    TimeTheorems.buyMax(true, Perk.ttBuyMax.isBought);
  }
}();
