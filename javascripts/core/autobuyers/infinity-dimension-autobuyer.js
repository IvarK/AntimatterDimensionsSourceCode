"use strict";

class InfinityDimensionAutobuyerState extends IntervaledAutobuyerState {
  constructor(tier) {
    super();
    this._tier = tier;
  }

  get name() {
    return InfinityDimension(this._tier).displayName;
  }

  get fullName() {
    return `${this.name} Infinity Dimension`;
  }

  get data() {
    return player.auto.infinityDims[this._tier - 1];
  }

  get interval() {
    return 1000 * Perk.autobuyerFasterID.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return EternityMilestone.autobuyerID(this._tier).isReached;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const tier = this._tier;
    if (!InfinityDimension(tier).isAvailableForPurchase || EternityChallenge(8).isRunning) return;
    super.tick();
    buyManyInfinityDimension(tier);
    buyMaxInfDims(tier);
  }
}

InfinityDimensionAutobuyerState.index = Array.range(1, 8).map(tier => new InfinityDimensionAutobuyerState(tier));

Autobuyer.infinityDimension = tier => InfinityDimensionAutobuyerState.index[tier - 1];
Autobuyer.infinityDimension.index = InfinityDimensionAutobuyerState.index;
Autobuyer.infinityDimension.index.name = "Infinity Dimension";
