"use strict";

Autobuyer.timeTheorem = new class TimeTheoremAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get name() {
    return `Time Theorem`;
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
    return Perk.autobuyerTT1.isBought && !Pelle.isDoomed;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  tick() {
    super.tick();
    TimeTheorems.buyMax(true);
  }
}();
