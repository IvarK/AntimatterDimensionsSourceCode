import { Autobuyer, UpgradeableAutobuyerState } from "./autobuyer.js";
import { DC } from "../constants.js";

class AntimatterDimensionAutobuyerState extends UpgradeableAutobuyerState {
  get name() {
    return AntimatterDimension(this.tier).displayName;
  }

  get fullName() {
    return `${this.name} Antimatter Dimension`;
  }

  get data() {
    return player.auto.antimatterDims[this.tier - 1];
  }

  get baseInterval() {
    return Player.defaultStart.auto.antimatterDims[this.tier - 1].interval;
  }

  get isUnlocked() {
    return NormalChallenge(this.tier).isCompleted;
  }

  get isBought() {
    return this.data.isBought;
  }

  get antimatterCost() {
    return DC.E10.pow(this.tier - 1).times(DC.E40);
  }

  get canBeBought() {
    return true;
  }

  get disabledByContinuum() {
    return Laitela.continuumActive;
  }

  get bulk() {
    // Use 1e100 to avoid issues with Infinity.
    return this.hasUnlimitedBulk ? 1e100 : Math.clampMax(this.data.bulk, this.bulkCap);
  }

  get hasUnlimitedBulk() {
    return Achievement(61).isUnlocked;
  }

  get bulkCap() {
    return 512;
  }

  get hasMaxedBulk() {
    return this.bulk >= this.bulkCap;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get canUnlockSlowVersion() {
    return player.records.thisEternity.maxAM.gte(this.antimatterCost);
  }

  toggleMode() {
    this.mode = [
      AUTOBUYER_MODE.BUY_SINGLE,
      AUTOBUYER_MODE.BUY_10
    ]
      .nextSibling(this.mode);
  }

  get canTick() {
    const dim = AntimatterDimension(this.tier);
    return dim.isAvailableForPurchase && dim.isAffordable && super.canTick;
  }

  tick() {
    super.tick();
    const tier = this.tier;
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        buyOneDimension(tier);
        break;
      case AUTOBUYER_MODE.BUY_10:
        buyMaxDimension(tier, player.auto.bulkOn ? this.bulk : 1);
        break;
    }
  }

  upgradeBulk() {
    if (this.hasMaxedBulk) return;
    if (!Currency.infinityPoints.purchase(this.cost)) return;
    this.data.bulk = Math.clampMax(this.bulk * 2, this.bulkCap);
    this.data.cost = Math.ceil(2.4 * this.cost);
    Achievement(61).tryUnlock();
    GameUI.update();
  }

  purchase() {
    if (!this.canUnlockSlowVersion) return;
    this.data.isBought = true;
  }

  get resetTickOn() {
    return Perk.antimatterNoReset.isBought ? PRESTIGE_EVENT.ANTIMATTER_GALAXY : PRESTIGE_EVENT.DIMENSION_BOOST;
  }

  reset() {
    super.reset();
    if (EternityMilestone.keepAutobuyers.isReached) return;
    this.data.isUnlocked = false;
    this.data.isBought = false;
    this.data.bulk = 1;
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Antimatter Dimension"; }
  static createAccessor() {
    const accessor = super.createAccessor();
    /** @returns {boolean} */
    accessor.allBought = () => accessor.zeroIndexed.some(x => x.isBought);
    /** @returns {boolean} */
    accessor.allUnlimitedBulk = () => accessor.zeroIndexed.some(x => x.hasUnlimitedBulk);
    return accessor;
  }
}

Autobuyer.antimatterDimension = AntimatterDimensionAutobuyerState.createAccessor();
