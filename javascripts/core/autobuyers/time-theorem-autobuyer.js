"use strict";

Autobuyer.timeTheorem = new class TimeTheoremAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get interval() {
    const period = Effects.min(
      Number.POSITIVE_INFINITY,
      Perk.autobuyerTT1,
      Perk.autobuyerTT2,
      Perk.autobuyerTT3,
      Perk.autobuyerTT4
    );
    return TimeSpan.fromSeconds(period).totalMilliseconds / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return Perk.autobuyerTT1.isBought;
  }

  tick() {
    TimeTheorems.buyMax(true);
  }
}();
