import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics";

class RealityUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get automatorPoints() {
    return this.config.automatorPoints ? this.config.automatorPoints : 0;
  }

  get name() {
    return this.config.name;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.realityMachines;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.reality.upgradeBits;
  }

  set bits(value) {
    player.reality.upgradeBits = value;
  }

  get hasPlayerLock() {
    return (player.reality.reqLock.reality & (1 << this.bitIndex)) !== 0;
  }

  set hasPlayerLock(value) {
    if (value) player.reality.reqLock.reality |= 1 << this.bitIndex;
    else player.reality.reqLock.reality &= ~(1 << this.bitIndex);
  }

  get isLockingMechanics() {
    const shouldBypass = this.config.bypassLock?.() ?? false;
    return this.hasPlayerLock && this.isPossible && !shouldBypass && !this.isAvailableForPurchase;
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
      Modal.upgradeLock.show({ upgrade: this, isImaginary: false, specialLockText });
    }
  }

  get isAvailableForPurchase() {
    return (player.reality.upgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    const realityReached = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
    if (!realityReached || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.reality.upgReqs |= (1 << this.id);
    GameUI.notify.reality(`You've unlocked a Reality Upgrade: ${this.config.name}`);
    this.hasPlayerLock = false;
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.REALITY_UPGRADE_BOUGHT);
    const id = this.id;
    if (id === 9 || id === 24) {
      Glyphs.refreshActive();
    }
    if (id === 10) {
      applyRUPG10();
      playerInfinityUpgradesOnReset();
      EventHub.dispatch(GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT);
    }
    if (id === 20 && player.blackHole[0].unlocked) {
      player.blackHole[1].unlocked = true;
    }
    GameCache.staticGlyphWeights.invalidate();
  }
}

class RebuyableRealityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.realityMachines;
  }

  get boughtAmount() {
    return player.reality.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.reality.rebuyables[this.id] = value;
  }
}

RealityUpgradeState.index = mapGameData(
  GameDatabase.reality.upgrades,
  config => (config.id < 6
    ? new RebuyableRealityUpgradeState(config)
    : new RealityUpgradeState(config))
);

/**
 * @param {number} id
 * @return {RealityUpgradeState|RebuyableRealityUpgradeState}
 */
export const RealityUpgrade = id => RealityUpgradeState.index[id];

export const RealityUpgrades = {
  /**
   * @type {(RealityUpgradeState|RebuyableRealityUpgradeState)[]}
   */
  all: RealityUpgradeState.index.compact(),
  get allBought() {
    return (player.reality.upgradeBits >> 6) + 1 === 1 << (GameDatabase.reality.upgrades.length - 5);
  }
};
