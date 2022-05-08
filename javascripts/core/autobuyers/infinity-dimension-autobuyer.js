import { InfinityDimensions } from "../globals";

import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer";

class InfinityDimensionAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get dimension() {
    return InfinityDimension(this.tier);
  }

  get name() {
    return this.dimension.displayName;
  }

  get fullName() {
    return `${this.name} Infinity Dimension`;
  }

  get data() {
    return player.auto.infinityDims[this.tier - 1];
  }

  get interval() {
    return 1000 * Perk.autobuyerFasterID.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return EternityMilestone.autobuyerID(this.tier).isReached || PelleUpgrade.IDAutobuyers.canBeApplied;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  get canTick() {
    return InfinityDimensions.canAutobuy() && this.dimension.isAvailableForPurchase && super.canTick;
  }

  tick() {
    super.tick();
    this.dimension.buyMax();
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Infinity Dimension"; }
}

Autobuyer.infinityDimension = InfinityDimensionAutobuyerState.createAccessor();
