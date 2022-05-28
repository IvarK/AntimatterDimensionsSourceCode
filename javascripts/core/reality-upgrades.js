import { BitPurchasableMechanicState, RebuyableMechanicState } from "./game-mechanics/index";

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

  get isAvailableForPurchase() {
    // eslint-disable-next-line no-bitwise
    return (player.reality.upgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    const realityReached = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
    if (!realityReached || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    // eslint-disable-next-line no-bitwise
    player.reality.upgReqs |= (1 << this.id);
    GameUI.notify.reality(`You've unlocked a Reality Upgrade: ${this.config.name}`);
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
    // eslint-disable-next-line no-bitwise
    return (player.reality.upgradeBits >> 6) + 1 === 1 << (GameDatabase.reality.upgrades.length - 5);
  }
};
