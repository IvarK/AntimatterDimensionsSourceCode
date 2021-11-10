import { Autobuyer, IntervaledAutobuyerState } from "./autobuyer.js";

class DilationUpgradeAutobuyerState extends IntervaledAutobuyerState {
  constructor(upgrade) {
    super();
    this._upgrade = upgrade;
    this._upgradeName = ["dtGain", "galaxyThreshold", "tachyonGain"][this._upgrade - 1];
  }

  get data() {
    return player.auto.dilationUpgrades[this._upgrade - 1];
  }

  get name() {
    return [`Dilated Time Multiplier`, `Tachyon Galaxy Threshold`, "Tachyon Particle Multiplier"][this._upgrade - 1];
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
}

DilationUpgradeAutobuyerState.index = Array.range(1, 3).map(upgrade => new DilationUpgradeAutobuyerState(upgrade));

Autobuyer.dilationUpgrade = upgrade => DilationUpgradeAutobuyerState.index[upgrade - 1];
Autobuyer.dilationUpgrade.array = DilationUpgradeAutobuyerState.index;
Autobuyer.dilationUpgrade.array.name = "Dilation Upgrade";
