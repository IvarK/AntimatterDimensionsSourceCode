import { SetPurchasableMechanicState } from "./game-mechanics";

class PerkState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    /**
     * @type {PerkState[]}
     */
    this.connectedPerks = [];
  }

  get automatorPoints() {
    return this.config.automatorPoints ? this.config.automatorPoints : 0;
  }

  get label() {
    return this.config.label;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get currency() {
    return Currency.perkPoints;
  }

  get set() {
    return player.reality.perks;
  }

  get cost() {
    return 1;
  }

  get isAvailableForPurchase() {
    return this.id === 0 || this.connectedPerks.some(p => p.isBought);
  }

  get canBeApplied() {
    return this.isBought && !(Pelle.isDoomed && Pelle.uselessPerks.includes(this.id));
  }

  initializeConnections() {
    this.connectedPerks = GameDatabase.reality.perkConnections[this.id].map(id => Perks.find(id));
  }

  onPurchased() {
    if (this.config.bumpCurrency !== undefined) this.config.bumpCurrency();
    if (this.label === "EU1" && Currency.eternities.gt(0)) applyEU1();
    if (this.label === "ACHNR") {
      if (Achievements.preReality.some(a => !a.isUnlocked)) player.reality.gainedAutoAchievements = true;
      for (const achievement of Achievements.preReality) {
        achievement.unlock(true);
      }
    }
    GameCache.achievementPeriod.invalidate();
    GameCache.buyablePerks.invalidate();
    EventHub.dispatch(GAME_EVENT.PERK_BOUGHT);
  }
}

export const Perk = mapGameDataToObject(
  GameDatabase.reality.perks,
  config => new PerkState(config)
);

export const Perks = {
  all: Perk.all,
  /**
   * @param {number} id
   * @returns {PerkState}
   */
  find(id) {
    return Perks.all.find(p => p.id === id);
  }
};

for (const perk of Perks.all) {
  perk.initializeConnections();
}

export function checkPerkValidity() {
  if (player.reality.perks.every(id => Perks.find(id) !== undefined)) return;
  dev.respecPerks();
  if (Currency.perkPoints.gte(Perks.all.length)) {
    dev.buyAllPerks();
    Modal.message.show("Some of your Perks were invalid, but you auto-bought all valid perks.");
  } else {
    Modal.message.show("Some of your Perks were invalid, so your Perks have been reset and your Perk Points refunded.");
  }
}
