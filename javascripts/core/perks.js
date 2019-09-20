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

  get isAvailable() {
    return this.id === 0 || this.connectedPerks.some(p => p.isBought);
  }

  initializeConnections() {
    const dbConnections = GameDatabase.reality.perkConnections;
    const connections = new Set(dbConnections[this.id]);
    for (const start in dbConnections) {
      if (!dbConnections.hasOwnProperty(start)) continue;
      const startId = parseInt(start, 10);
      if (startId === this.id) continue;
      if (dbConnections[start].includes(this.id)) {
        connections.add(startId);
      }
    }
    this.connectedPerks = [...connections].map(id => Perks.find(id));
  }

  purchase() {
    if (!super.purchase()) return;
    GameCache.achSkipPerkCount.invalidate();
    GameCache.buyablePerks.invalidate();
    EventHub.dispatch(GameEvent.PERK_BOUGHT);
  }
}

const Perk = (function() {
  const db = GameDatabase.reality.perks;
  return {
    glyphChoice3: new PerkState(db.glyphChoice3),
    startAM1: new PerkState(db.startAM1),
    startAM2: new PerkState(db.startAM2),
    startIP1: new PerkState(db.startIP1),
    startIP2: new PerkState(db.startIP2),
    startEP1: new PerkState(db.startEP1),
    startEP2: new PerkState(db.startEP2),
    startEP3: new PerkState(db.startEP3),
    startTP: new PerkState(db.startTP),
    glyphLevelIncrease1: new PerkState(db.glyphLevelIncrease1),
    glyphLevelIncrease2: new PerkState(db.glyphLevelIncrease2),
    glyphChoice4: new PerkState(db.glyphChoice4),
    glyphRarityIncrease: new PerkState(db.glyphRarityIncrease),
    glyphUncommonGuarantee: new PerkState(db.glyphUncommonGuarantee),
    realityMachineGain: new PerkState(db.realityMachineGain),
    dimboostNonReset: new PerkState(db.dimboostNonReset),
    studyPassive1: new PerkState(db.studyPassive1),
    studyPassive2: new PerkState(db.studyPassive2),
    autounlockEU1: new PerkState(db.autounlockEU1),
    autounlockEU2: new PerkState(db.autounlockEU2),
    autounlockDilation1: new PerkState(db.autounlockDilation1),
    autounlockDilation2: new PerkState(db.autounlockDilation2),
    autounlockDilation3: new PerkState(db.autounlockDilation3),
    autounlockTD: new PerkState(db.autounlockTD),
    autounlockReality: new PerkState(db.autounlockReality),
    bypassIDAntimatter: new PerkState(db.bypassIDAntimatter),
    bypassDGReset: new PerkState(db.bypassDGReset),
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
    achievementRowGroup1: new PerkState(db.achievementRowGroup1),
    achievementRowGroup2: new PerkState(db.achievementRowGroup2),
    achievementRowGroup3: new PerkState(db.achievementRowGroup3),
    achievementRowGroup4: new PerkState(db.achievementRowGroup4),
    achievementRowGroup5: new PerkState(db.achievementRowGroup5),
    achievementRowGroup6: new PerkState(db.achievementRowGroup6)
  };
}());

const Perks = {
  all: Object.values(Perk),
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
  Modal.message.show("Your old Reality perks were invalid, your perks have been reset and your perk points refunded.");
}
