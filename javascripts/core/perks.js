"use strict";

class PerkState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    /**
     * @type {PerkState[]}
     */
    this.connectedPerks = [];
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

const Perk = (function() {
  const db = GameDatabase.reality.perks;
  return {
    firstPerk: new PerkState(db.firstPerk),
    startAM1: new PerkState(db.startAM1),
    startAM2: new PerkState(db.startAM2),
    startIP1: new PerkState(db.startIP1),
    startIP2: new PerkState(db.startIP2),
    startEP1: new PerkState(db.startEP1),
    startEP2: new PerkState(db.startEP2),
    startEP3: new PerkState(db.startEP3),
    startTP: new PerkState(db.startTP),
    dimboostNonReset: new PerkState(db.dimboostNonReset),
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
    autocompleteEC4: new PerkState(db.autocompleteEC4),
    autocompleteEC5: new PerkState(db.autocompleteEC5),
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
    autobuyerTT1: new PerkState(db.autobuyerTT1),
    autobuyerTT2: new PerkState(db.autobuyerTT2),
    autobuyerTT3: new PerkState(db.autobuyerTT3),
    autobuyerTT4: new PerkState(db.autobuyerTT4),
    achievementGroup1: new PerkState(db.achievementGroup1),
    achievementGroup2: new PerkState(db.achievementGroup2),
    achievementGroup3: new PerkState(db.achievementGroup3),
    achievementGroup4: new PerkState(db.achievementGroup4),
    achievementGroup5: new PerkState(db.achievementGroup5),
    achievementGroup6: new PerkState(db.achievementGroup6)
  };
}());

const Perks = {
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

function checkPerkValidity() {
  if (player.reality.perks.every(id => Perks.find(id) !== undefined)) return;
  dev.respecPerks();
  if (player.reality.perkPoints > Perks.all.length) {
    dev.buyAllPerks();
    Modal.message.show("Some of your Perks were invalid, but you auto-bought all valid perks.");
  } else {
    Modal.message.show("Some of your Perks were invalid, so your Perks have been reset and your Perk Points refunded.");
  }
}
