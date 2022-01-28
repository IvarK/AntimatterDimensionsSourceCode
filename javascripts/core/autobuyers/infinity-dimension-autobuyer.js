import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer.js";

class InfinityDimensionAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get name() {
    return InfinityDimension(this.tier).displayName;
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

  tick() {
    if (EternityChallenge(8).isRunning) return;
    if (buyMaxInfDims(this.tier)) super.tick();
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Infinity Dimension"; }
}

Autobuyer.infinityDimension = InfinityDimensionAutobuyerState.createAccessor();
