"use strict";

class ImaginaryUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
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

  get isAvailableForPurchase() {
    // eslint-disable-next-line no-bitwise
    return (player.reality.imaginaryUpgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  get canBeApplied() {
    return super.canBeApplied && !Pelle.isDisabled("imaginaryUpgrades");
  }

  tryUnlock() {
    if (this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    // eslint-disable-next-line no-bitwise
    player.reality.imaginaryUpgReqs |= (1 << this.id);
    GameUI.notify.reality(`You've unlocked an Imaginary Upgrade: ${this.config.name}`);
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.REALITY_UPGRADE_BOUGHT);
    if (this.id >= 15 && this.id <= 18) {
      MatterDimension(this.id - 14).amount = new Decimal(1);
      Tab.celestials.laitela.show();
    }
    if (this.id === 19) {
      Tab.celestials.laitela.show();
    }
    if (this.id === 22) {
      BASIC_GLYPH_TYPES.forEach(x => player.reality.glyphs.sac[x] = ImaginaryUpgrade(22).effectValue);
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
    return super.canBeApplied && !Pelle.isDisabled("imaginaryUpgrades");
  }

  set boughtAmount(value) {
    player.reality.imaginaryRebuyables[this.id] = value;
  }
}

ImaginaryUpgradeState.index = mapGameData(
  GameDatabase.reality.imaginaryUpgrades,
  config => (config.id <= 10
    ? new RebuyableImaginaryUpgradeState(config)
    : new ImaginaryUpgradeState(config))
);

const ImaginaryUpgrade = id => ImaginaryUpgradeState.index[id];

const ImaginaryUpgrades = {
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
    // eslint-disable-next-line no-bitwise
    return (player.reality.imaginaryUpgradeBits >> 6) + 1 === 1 << (GameDatabase.reality.imaginaryUpgrades.length - 5);
  }
};
