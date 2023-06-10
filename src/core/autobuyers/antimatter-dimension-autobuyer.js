import { DC } from "../constants";

import { UpgradeableAutobuyerState } from "./autobuyer";

export class AntimatterDimensionAutobuyerState extends UpgradeableAutobuyerState {
  get tier() {
    return this.id;
  }

  get name() {
    return AntimatterDimension(this.tier).shortDisplayName;
  }

  get fullName() {
    return `${this.name} Antimatter Dimension`;
  }

  get data() {
    return player.auto.antimatterDims.all[this.tier - 1];
  }

  get baseInterval() {
    return Player.defaultStart.auto.antimatterDims.all[this.tier - 1].interval;
  }

  get isUnlocked() {
    if (Pelle.isDisabled(`antimatterDimAutobuyer${this.tier}`)) return false;
    return this.data.isBought || this.canBeUpgraded;
  }

  get isBought() {
    return this.data.isBought;
  }

  get antimatterCost() {
    return DC.E10.pow(this.tier - 1).times(DC.E40);
  }

  get canBeBought() {
    return !Pelle.isDisabled(`antimatterDimAutobuyer${this.tier}`);
  }

  get canBeUpgraded() {
    return NormalChallenge(this.tier).isCompleted;
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

  // We don't want to directly call super.canTick here because the game logic works really weirdly in terms of
  // interactions between individual and group AD autobuyers. The UI can change and certain settings can become
  // unmodifiable in some conditions. This is basically the lowest-effort solution to support legacy behavior
  // because the proper alternatve of an AD autobuyer refactor to untangle this mess is likely not worth the effort
  get canTick() {
    // AD autobuyer-specific logic; if the UI is collapsed then we are unable to toggle groupSetting.
    // In terms of UX for this case it makes the most sense to ignore it and pretend it's true
    const settingConfig = player.auto.antimatterDims;
    const individualSetting = settingConfig.all[this.tier - 1];
    const groupSetting = settingConfig.isActive;
    const thisSetting = individualSetting && (Autobuyer.antimatterDimension.collapseDisplay ? groupSetting : true);

    // General availability
    const dim = AntimatterDimension(this.tier);
    const hasAutobuyer = dim.isAvailableForPurchase && dim.isAffordable;

    // From IntervaledAutobuyerState.canTick
    const intervalTick = this.timeSinceLastTick >= this.interval;

    // From AutobuyerState.canTick (ignores this.constructor.isActive because that's accounted for in thisSetting)
    const autoTick = player.auto.autobuyersOn && this.isActive && (this.isUnlocked || this.isBought);

    return thisSetting && hasAutobuyer && intervalTick && autoTick;
  }

  tick() {
    super.tick();
    const tier = this.tier;
    switch (this.mode) {
      case AUTOBUYER_MODE.BUY_SINGLE:
        buyOneDimension(tier);
        break;
      case AUTOBUYER_MODE.BUY_10:
        buyMaxDimension(tier, this.bulk);
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
    return Perk.antimatterNoReset.canBeApplied ? PRESTIGE_EVENT.ANTIMATTER_GALAXY : PRESTIGE_EVENT.DIMENSION_BOOST;
  }

  reset() {
    super.reset();
    if (EternityMilestone.keepAutobuyers.isReached || PelleUpgrade.keepAutobuyers.canBeApplied) return;
    this.data.isUnlocked = false;
    this.data.isBought = false;
    this.data.bulk = 1;
    TabNotification.newAutobuyer.clearTrigger();
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Antimatter Dimension"; }

  // These are toggled on and off from the group autobuyer checkbox
  static get isActive() { return player.auto.antimatterDims.isActive; }
  static set isActive(value) { player.auto.antimatterDims.isActive = value; }

  static createAccessor() {
    const accessor = super.createAccessor();
    Object.defineProperties(accessor, {
      allBought: { get: () => accessor.zeroIndexed.every(x => x.isBought) },
      // We can get away with this since allUnlimitedBulk is the same for all AD autos
      allUnlimitedBulk: { get: () => accessor.zeroIndexed[0].hasUnlimitedBulk },
      bulkCap: { get: () => accessor.zeroIndexed[0].bulkCap },
      collapseDisplay: { get: () => accessor.allMaxedInterval && accessor.allUnlocked && accessor.allUnlimitedBulk }
    });
    return accessor;
  }
}
