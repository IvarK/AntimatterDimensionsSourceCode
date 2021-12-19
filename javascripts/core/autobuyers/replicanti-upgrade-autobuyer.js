import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer.js";

class ReplicantiUpgradeAutobuyerState extends IntervaledAutobuyerState {
  get _upgradeName() { return ["chance", "interval", "galaxies"][this.tier - 1]; }

  get name() {
    return `Replicanti ${[`Chance`, `Interval`, `Max Galaxies`][this.tier - 1]}`;
  }

  get data() {
    return player.auto.replicantiUpgrades[this.tier - 1];
  }

  get interval() {
    return 1000 * Perk.autobuyerFasterReplicanti.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return ReplicantiUpgrade[this._upgradeName].autobuyerMilestone.isReached;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    if (EternityChallenge(8).isRunning) return;
    super.tick();
    ReplicantiUpgrade[this._upgradeName].autobuyerTick();
  }

  static get entryCount() { return 3; }
  static get autobuyerGroupName() { return "Replicanti Upgrade"; }
}

Autobuyer.replicantiUpgrade = ReplicantiUpgradeAutobuyerState.createAccessor();
