import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer.js";

class DilationUpgradeAutobuyerState extends IntervaledAutobuyerState {
  get _upgradeName() { return ["dtGain", "galaxyThreshold", "tachyonGain"][this.id - 1]; }

  get data() {
    return player.auto.dilationUpgrades[this.id - 1];
  }

  get name() {
    return [`Dilated Time Multiplier`, `Tachyon Galaxy Threshold`, "Tachyon Particle Multiplier"][this.id - 1];
  }

  get interval() {
    return 1000 * Perk.autobuyerFasterDilation.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return Perk.autobuyerDilation.isEffectActive;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  get bulk() {
    return PerkShopUpgrade.bulkDilation.effectOrDefault(1);
  }

  tick() {
    super.tick();
    const upgradeName = this._upgradeName;
    DilationUpgrade[upgradeName].purchase(this.bulk);
  }

  static get entryCount() { return 3; }
  static get autobuyerGroupName() { return "Dilation Upgrade"; }
}

Autobuyer.dilationUpgrade = DilationUpgradeAutobuyerState.createAccessor();
