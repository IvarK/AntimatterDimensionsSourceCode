import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics";
import { DC } from "./constants";

class ImaginaryUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.imaginaryMachines;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.reality.imaginaryUpgradeBits;
  }

  set bits(value) {
    player.reality.imaginaryUpgradeBits = value;
  }

  get hasPlayerLock() {
    return (player.reality.reqLock.imaginary & (1 << this.bitIndex)) !== 0;
  }

  set hasPlayerLock(value) {
    if (value) player.reality.reqLock.imaginary |= 1 << this.bitIndex;
    else player.reality.reqLock.imaginary &= ~(1 << this.bitIndex);
  }

  get isLockingMechanics() {
    return this.hasPlayerLock && this.isPossible && !this.isAvailableForPurchase;
  }

  // Required to be changed this way to avoid direct prop mutation in Vue components
  setMechanicLock(value) {
    this.hasPlayerLock = value;
  }

  toggleMechanicLock() {
    this.hasPlayerLock = !this.hasPlayerLock;
  }

  // Note we don't actually show the modal if we already failed or unlocked it
  tryShowWarningModal(specialLockText) {
    if (this.isPossible && !this.isAvailableForPurchase) {
      Modal.upgradeLock.show({ upgrade: this, isImaginary: true, specialLockText });
    }
  }

  get isAvailableForPurchase() {
    return (player.reality.imaginaryUpgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  get canBeApplied() {
    return super.canBeApplied && !this.pelleDisabled;
  }

  get pelleDisabled() {
    return Pelle.isDoomed && this.config.isDisabledInDoomed;
  }

  tryUnlock() {
    if (!MachineHandler.isIMUnlocked || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.reality.imaginaryUpgReqs |= (1 << this.id);
    GameUI.notify.reality(`You've unlocked an Imaginary Upgrade: ${this.config.name}`);
    this.hasPlayerLock = false;
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.REALITY_UPGRADE_BOUGHT);
    if (this.id >= 15 && this.id <= 18) {
      DarkMatterDimension(this.id - 14).amount = DC.D1;
      if (this.id === 17) Laitela.quotes.thirdDMD.show();
    }
    if (this.id >= 15 && this.id <= 19) {
      // Need to clear before retriggering, or else it won't actually show up on subsequent upgrades
      TabNotification.laitelaUnlock.clearTrigger();
      TabNotification.laitelaUnlock.tryTrigger();
    }
    if (this.id === 21) {
      Laitela.quotes.finalRowIM.show();
    }
    if (this.id === 22) {
      for (const key of Object.keys(player.reality.glyphs.sac)) {
        player.reality.glyphs.sac[key] = ImaginaryUpgrade(22).effectValue;
      }
    }
    if (this.id === 25) {
      TabNotification.pelleUnlock.tryTrigger();
    }
  }
}

class RebuyableImaginaryUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.imaginaryMachines;
  }

  get boughtAmount() {
    return player.reality.imaginaryRebuyables[this.id];
  }

  get canBeApplied() {
    return super.canBeApplied && !this.pelleDisabled;
  }

  get pelleDisabled() {
    return Pelle.isDoomed;
  }

  set boughtAmount(value) {
    player.reality.imaginaryRebuyables[this.id] = value;
  }

  onPurchased() {
    if (this.id === 7) {
      GameCache.staticGlyphWeights.invalidate();
    }
  }
}

ImaginaryUpgradeState.index = mapGameData(
  GameDatabase.reality.imaginaryUpgrades,
  config => (config.id <= 10
    ? new RebuyableImaginaryUpgradeState(config)
    : new ImaginaryUpgradeState(config))
);

export const ImaginaryUpgrade = id => ImaginaryUpgradeState.index[id];

export const ImaginaryUpgrades = {
  all: ImaginaryUpgradeState.index.compact(),
  get totalRebuyables() {
    const rebuyables = player.reality.imaginaryRebuyables;
    let total = 0;
    for (const i in rebuyables) total += rebuyables[i];
    return total;
  },
  get totalSinglePurchase() {
    return this.all.countWhere(u => u.isBought);
  },
  get allBought() {
    return (player.reality.imaginaryUpgradeBits >> 6) + 1 === 1 << (GameDatabase.reality.imaginaryUpgrades.length - 5);
  }
};
