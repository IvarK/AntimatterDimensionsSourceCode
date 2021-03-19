"use strict";

class TimeDimensionAutobuyerState extends IntervaledAutobuyerState {
  constructor(tier) {
    super();
    this._tier = tier;
  }

  get name() {
    return `${TimeDimension(this._tier).displayName} Time Dimension`;
  }

  get data() {
    return player.auto.timeDims[this._tier - 1];
  }

  get interval() {
    return 1000 / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return RealityUpgrade(13).isBought;
  }

  tick() {
    const tier = this._tier;
    if (!TimeDimension(tier).isAvailableForPurchase) return;
    super.tick();
    if (Currency.eternityPoints.exponent >= 10) {
      buyMaxTimeDimension(tier);
    } else {
      buySingleTimeDimension(tier);
    }
  }
}

TimeDimensionAutobuyerState.index = Array.range(1, 8).map(tier => new TimeDimensionAutobuyerState(tier));

Autobuyer.timeDimension = tier => TimeDimensionAutobuyerState.index[tier - 1];
Autobuyer.timeDimension.index = TimeDimensionAutobuyerState.index;
