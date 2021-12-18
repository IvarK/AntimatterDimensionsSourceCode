import { SetPurchasableMechanicState } from "./game-mechanics/index.js";

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

  initializeConnections() {
    this.connectedPerks = GameDatabase.reality.perkConnections[this.id].map(id => Perks.find(id));
  }

  onPurchased() {
    if (this.config.bumpCurrency !== undefined) this.config.bumpCurrency();
    GameCache.achievementPeriod.invalidate();
    GameCache.buyablePerks.invalidate();
    EventHub.dispatch(GAME_EVENT.PERK_BOUGHT);
  }
}

export const Perk = (function() {
  const db = GameDatabase.reality.perks;
  return {
    firstPerk: new PerkState(db.firstPerk),
    startAM: new PerkState(db.startAM),
    startIP1: new PerkState(db.startIP1),
    startIP2: new PerkState(db.startIP2),
    startEP1: new PerkState(db.startEP1),
    startEP2: new PerkState(db.startEP2),
    startEP3: new PerkState(db.startEP3),
    startTP: new PerkState(db.startTP),
    antimatterNoReset: new PerkState(db.antimatterNoReset),
    studyPassive: new PerkState(db.studyPassive),
    autounlockEU1: new PerkState(db.autounlockEU1),
    autounlockEU2: new PerkState(db.autounlockEU2),
    autounlockDilation1: new PerkState(db.autounlockDilation1),
    autounlockDilation2: new PerkState(db.autounlockDilation2),
    autounlockDilation3: new PerkState(db.autounlockDilation3),
    autounlockTD: new PerkState(db.autounlockTD),
    autounlockReality: new PerkState(db.autounlockReality),
    bypassIDAntimatter: new PerkState(db.bypassIDAntimatter),
    bypassTGReset: new PerkState(db.bypassTGReset),
    bypassECDilation: new PerkState(db.bypassECDilation),
    bypassEC1Lock: new PerkState(db.bypassEC1Lock),
    bypassEC2Lock: new PerkState(db.bypassEC2Lock),
    bypassEC3Lock: new PerkState(db.bypassEC3Lock),
    bypassEC5Lock: new PerkState(db.bypassEC5Lock),
    autocompleteEC1: new PerkState(db.autocompleteEC1),
    autocompleteEC2: new PerkState(db.autocompleteEC2),
    autocompleteEC3: new PerkState(db.autocompleteEC3),
    studyActiveEP: new PerkState(db.studyActiveEP),
    studyIdleEP: new PerkState(db.studyIdleEP),
    studyECRequirement: new PerkState(db.studyECRequirement),
    studyECBulk: new PerkState(db.studyECBulk),
    retroactiveTP1: new PerkState(db.retroactiveTP1),
    retroactiveTP2: new PerkState(db.retroactiveTP2),
    retroactiveTP3: new PerkState(db.retroactiveTP3),
    retroactiveTP4: new PerkState(db.retroactiveTP4),
    autobuyerDilation: new PerkState(db.autobuyerDilation),
    autobuyerFasterID: new PerkState(db.autobuyerFasterID),
    autobuyerFasterReplicanti: new PerkState(db.autobuyerFasterReplicanti),
    autobuyerFasterDilation: new PerkState(db.autobuyerFasterDilation),
    ttFree: new PerkState(db.ttFree),
    ttBuySingle: new PerkState(db.ttBuySingle),
    ttBuyMax: new PerkState(db.ttBuyMax),
    achievementGroup1: new PerkState(db.achievementGroup1),
    achievementGroup2: new PerkState(db.achievementGroup2),
    achievementGroup3: new PerkState(db.achievementGroup3),
    achievementGroup4: new PerkState(db.achievementGroup4),
    achievementGroup5: new PerkState(db.achievementGroup5)
  };
}());

export const Perks = {
  all: Object.values(Perk),
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
