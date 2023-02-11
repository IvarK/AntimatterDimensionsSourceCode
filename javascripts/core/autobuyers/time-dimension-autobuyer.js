import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer";

class TimeDimensionAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get name() {
    return TimeDimension(this.tier).shortDisplayName;
  }

  get fullName() {
    return `${this.name} Time Dimension`;
  }

  get data() {
    return player.auto.timeDims.all[this.tier - 1];
  }

  get interval() {
    return 1000 / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return RealityUpgrade(13).isBought && (!Pelle.isDoomed || PelleUpgrade.TDAutobuyers.canBeApplied);
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    applyEU2();
    Autobuyer.epMult.tick();
    const tier = this.tier;
    if (!TimeDimension(tier).isAvailableForPurchase) return;
    super.tick();
    if (Currency.eternityPoints.exponent >= 10) {
      buyMaxTimeDimension(tier);
    } else {
      buySingleTimeDimension(tier);
    }
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Time Dimension"; }
  static get isActive() { return player.auto.timeDims.isActive; }
  static set isActive(value) { player.auto.timeDims.isActive = value; }
}

Autobuyer.timeDimension = TimeDimensionAutobuyerState.createAccessor();
