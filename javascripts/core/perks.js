
const PERKS = {
  GLYPH_CHOOSE3: 0,
  START_AM1: 10,
  START_AM2: 11,
  START_IP1: 12,
  START_IP2: 13,
  START_EP1: 14,
  START_EP2: 15,
  START_EP3: 16,
  START_TP: 17,
  GLYPH_LEVEL_INC1: 20,
  GLYPH_LEVEL_INC2: 21,
  GLYPH_CHOOSE4: 22,
  GLYPH_RARITY_INC: 23,
  AUTOMATION_ROW_INC1: 30,
  AUTOMATION_ROW_INC2: 31,
  AUTOMATION_ROW_SCALING: 32,
  AUTOUNLOCK_EU1: 40,
  AUTOUNLOCK_EU2: 41,
  AUTOUNLOCK_DILATION1: 42,
  AUTOUNLOCK_DILATION2: 43,
  AUTOUNLOCK_DILATION3: 44,
  AUTOUNLOCK_TD: 45,
  AUTOUNLOCK_REALITY: 46,
  BYPASS_ID_AM: 51,
  BYPASS_DG_RESET: 52,
  BYPASS_EC_DILATION: 53,
  BYPASS_EC1_LOCK: 54,
  BYPASS_EC2_LOCK: 55,
  BYPASS_EC3_LOCK: 56,
  BYPASS_EC5_LOCK: 57,
  AUTOCOMPLETE_EC1: 60,
  AUTOCOMPLETE_EC2: 61,
  AUTOCOMPLETE_EC3: 62,
  AUTOCOMPLETE_EC4: 63,
  AUTOCOMPLETE_EC5: 64,
  TS_ACTIVE_EP: 70,
  TS_IDLE_EP: 71,
  TS_EC_REQ: 72,
  TS_EC_BULK: 73,
  RETROACTIVE_TP1: 80,
  RETROACTIVE_TP2: 81,
  RETROACTIVE_TP3: 82,
  RETROACTIVE_TP4: 83,
  AUTOBUYER_DILATION: 100,
  AUTOBUYER_FASTER_ID: 101,
  AUTOBUYER_FASTER_REPLICANTI: 102,
  AUTOBUYER_FASTER_DILATION: 103,
  AUTOBUYER_TT1: 104,
  AUTOBUYER_TT2: 105,
  AUTOBUYER_TT3: 106,
  AUTOBUYER_TT4: 107,
  ACHIEVEMENT_ROW1: 201,
  ACHIEVEMENT_ROW2: 202,
  ACHIEVEMENT_ROW3: 203,
  ACHIEVEMENT_ROW4: 204,
  ACHIEVEMENT_ROW5: 205,
  ACHIEVEMENT_ROW6: 206,
  ACHIEVEMENT_ROW7: 207,
  ACHIEVEMENT_ROW8: 208,
  ACHIEVEMENT_ROW9: 209,
  ACHIEVEMENT_ROW10: 210,
  ACHIEVEMENT_ROW11: 211,
  ACHIEVEMENT_ROW12: 212,
  ACHIEVEMENT_ROW13: 213
}

const PERK_NODES = [
  {id: PERKS.GLYPH_CHOOSE3, label: "G0", title: "You can now choose from 3 different glyphs on Reality."},
  {id: PERKS.START_AM1, label: "S1", title: "Start with 100 antimatter after every reset"},
  {id: PERKS.START_AM2, label: "S2", title: "Start with 1e130 antimatter after every reset"},
  {id: PERKS.START_IP1, label: "S3", title: "Start with 2e15 IP after every Eternity and Reality"},
  {id: PERKS.START_IP2, label: "S4", title: "Start with 2e130 IP after every Eternity and Reality"},
  {id: PERKS.START_EP1, label: "S5", title: "Start with 10 EP after every Reality"},
  {id: PERKS.START_EP2, label: "S6", title: "Start with 2000 EP after every Reality"},
  {id: PERKS.START_EP3, label: "S7", title: "Start with 1e9 EP after every Reality"},
  {id: PERKS.START_TP, label: "S8", title: "Start with 10 TP after unlocking Dilation"},
  {id: PERKS.GLYPH_LEVEL_INC1, label: "G1", title: "+1 to base glyph level"},
  {id: PERKS.GLYPH_LEVEL_INC2, label: "G2", title: "+1 to base glyph level"},
  {id: PERKS.GLYPH_CHOOSE4, label: "G3", title: "+1 glyph choice on Reality"},
  {id: PERKS.GLYPH_RARITY_INC, label: "G4", title: "+5% minimum glyph rarity"},
  {id: PERKS.AUTOMATION_ROW_INC1, label: "AR1", title: "+5 automator rows"},
  {id: PERKS.AUTOMATION_ROW_INC2, label: "AR2", title: "+10 automator rows"},
  {id: PERKS.AUTOMATION_ROW_SCALING, label: "AR3", title: "Improve the Automator row per Reality scaling"},
  {id: PERKS.AUTOUNLOCK_EU1, label: "AU1", title: "Auto-unlock the first row of Eternity upgrades after first Eternity of a Reality"},
  {id: PERKS.AUTOUNLOCK_EU2, label: "AU2", title: "Auto-unlock the second row of Eternity upgrades after first Eternity of a Reality"},
  {id: PERKS.AUTOUNLOCK_DILATION1, label: "AU3", title: "Auto-unlock the second row of Dilation upgrades on Dilation unlock"},
  {id: PERKS.AUTOUNLOCK_DILATION2, label: "AU4", title: "Auto-unlock the third row of Dilation upgrades on Dilation unlock"},
  {id: PERKS.AUTOUNLOCK_DILATION3, label: "AU5", title: "Auto-unlock Dilation TT generation when you have 1e15 DT"},
  {id: PERKS.AUTOUNLOCK_TD, label: "AU6", title: "Auto-unlock Time Dimensions 5-8 when you have enough TT"},
  {id: PERKS.AUTOUNLOCK_REALITY, label: "AU7", title: "Auto-unlock Reality at e4000 EP"},
  {id: PERKS.BYPASS_ID_AM, label: "B1", title: "Infinity Dimensions no longer have antimatter requirements"},
  {id: PERKS.BYPASS_DG_RESET, label: "B2", title: "The 2nd rebuyable Dilation upgrade no longer resets your Dilated Time"},
  {id: PERKS.BYPASS_EC_DILATION, label: "B3", title: "Remove the EC11/EC12 and TT requirement for Time Dilation"},
  {id: PERKS.BYPASS_EC1_LOCK, label: "B4", title: "Remove the EC1 requirement from study 181"},
  {id: PERKS.BYPASS_EC2_LOCK, label: "B5", title: "Remove the EC2 requirement from study 181"},
  {id: PERKS.BYPASS_EC3_LOCK, label: "B6", title: "Remove the EC3 requirement from study 181"},
  {id: PERKS.BYPASS_EC5_LOCK, label: "B7", title: "Remove the EC5 requirement from study 62"},
  {id: PERKS.AUTOCOMPLETE_EC1, label: "AE1", title: "Auto-complete one EC every 6 hours"},
  {id: PERKS.AUTOCOMPLETE_EC2, label: "AE2", title: "Auto-complete one EC every 4 hours"},
  {id: PERKS.AUTOCOMPLETE_EC3, label: "AE3", title: "Auto-complete one EC every 2 hours"},
  {id: PERKS.AUTOCOMPLETE_EC4, label: "AE4", title: "Auto-complete one EC every 1 hour"},
  {id: PERKS.AUTOCOMPLETE_EC5, label: "AE5", title: "Auto-complete one EC every 30 minutes"},
  {id: PERKS.TS_ACTIVE_EP, label: "TS1", title: "Active path EP is always 50x"},
  {id: PERKS.TS_IDLE_EP, label: "TS2", title: "Idle path EP starts as if you have spent 15 minutes in this Eternity"},
  {id: PERKS.TS_EC_REQ, label: "TS3", title: "Remove non-TT requirements for unlocking Eternity Challenges"},
  {id: PERKS.TS_EC_BULK, label: "TS4", title: "You can complete multiple tiers of Eternity Challenges at once if you reach the goal for a higher completion of that challenge"},
  {id: PERKS.RETROACTIVE_TP1, label: "TP1", title: "When buying the 3xTP gain upgrade, multiply your TP by 1.5"},
  {id: PERKS.RETROACTIVE_TP2, label: "TP2", title: "When buying the 3xTP gain upgrade, multiply your TP by 2"},
  {id: PERKS.RETROACTIVE_TP3, label: "TP3", title: "When buying the 3xTP gain upgrade, multiply your TP by 2.5"},
  {id: PERKS.RETROACTIVE_TP4, label: "TP4", title: "When buying the 3xTP gain upgrade, multiply your TP by 3"},
  {id: PERKS.AUTOBUYER_DILATION, label: "AB1", title: "Unlock autobuyers for repeatable dilation upgrades"},
  {id: PERKS.AUTOBUYER_FASTER_ID, label: "AB2", title: "Infinity Dimension autobuyers work 3 times faster"},
  {id: PERKS.AUTOBUYER_FASTER_REPLICANTI, label: "AB3", title: "Replicanti autobuyers work 3 times faster"},
  {id: PERKS.AUTOBUYER_FASTER_DILATION, label: "AB4", title: "Dilation autobuyers work 3 times faster"},
  {id: PERKS.AUTOBUYER_TT1, label: "AB5", title: "Autobuy max TT every 10 seconds"},
  {id: PERKS.AUTOBUYER_TT2, label: "AB6", title: "Autobuy max TT every 5 seconds"},
  {id: PERKS.AUTOBUYER_TT3, label: "AB7", title: "Autobuy max TT every 3 seconds"},
  {id: PERKS.AUTOBUYER_TT4, label: "AB8", title: "Autobuy max TT every second"},
  {id: PERKS.ACHIEVEMENT_ROW1, label: "ACH1", title: "Start with the 1st achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW2, label: "ACH2", title: "Start with the 2nd achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW3, label: "ACH3", title: "Start with the 3rd achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW4, label: "ACH4", title: "Start with the 4th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW5, label: "ACH5", title: "Start with the 5th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW6, label: "ACH6", title: "Start with the 6th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW7, label: "ACH7", title: "Start with the 7th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW8, label: "ACH8", title: "Start with the 8th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW9, label: "ACH9", title: "Start with the 9th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW10, label: "ACH10", title: "Start with the 10th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW11, label: "ACH11", title: "Start with the 11th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW12, label: "ACH12", title: "Start with the 12th achievement row after Reality"},
  {id: PERKS.ACHIEVEMENT_ROW13, label: "ACH13", title: "Start with the 13th achievement row after Reality"},
]; 


CONNECTED_PERKS = {}
function constructEdgeList() {
  CONNECTED_PERKS[PERKS.GLYPH_CHOOSE3] =  [PERKS.ACHIEVEMENT_ROW1, PERKS.START_AM1, PERKS.GLYPH_LEVEL_INC1, PERKS.GLYPH_LEVEL_INC2, PERKS.AUTOMATION_ROW_INC1, PERKS.AUTOUNLOCK_EU1, PERKS.BYPASS_EC5_LOCK];
  CONNECTED_PERKS[PERKS.START_AM1] = [PERKS.START_AM2, PERKS.START_IP1];
  CONNECTED_PERKS[PERKS.START_AM2] = [];
  CONNECTED_PERKS[PERKS.START_IP1] = [PERKS.START_IP2, PERKS.START_EP1];
  CONNECTED_PERKS[PERKS.START_IP2] = [PERKS.BYPASS_ID_AM];
  CONNECTED_PERKS[PERKS.START_EP1] = [PERKS.START_EP2, PERKS.START_TP];
  CONNECTED_PERKS[PERKS.START_EP2] = [PERKS.START_EP3];
  CONNECTED_PERKS[PERKS.START_EP3] = [];
  CONNECTED_PERKS[PERKS.START_TP] = [PERKS.START_EP1, PERKS.RETROACTIVE_TP1];
  CONNECTED_PERKS[PERKS.GLYPH_LEVEL_INC1] = [PERKS.GLYPH_CHOOSE4];
  CONNECTED_PERKS[PERKS.GLYPH_LEVEL_INC2] = [PERKS.GLYPH_RARITY_INC];
  CONNECTED_PERKS[PERKS.GLYPH_CHOOSE4] = [PERKS.GLYPH_LEVEL_INC1, PERKS.GLYPH_RARITY_INC];
  CONNECTED_PERKS[PERKS.GLYPH_RARITY_INC] = [PERKS.GLYPH_LEVEL_INC2, PERKS.GLYPH_CHOOSE4];
  CONNECTED_PERKS[PERKS.AUTOMATION_ROW_INC1] = [PERKS.AUTOMATION_ROW_INC2, PERKS.AUTOBUYER_FASTER_ID];
  CONNECTED_PERKS[PERKS.AUTOMATION_ROW_INC2] = [PERKS.AUTOMATION_ROW_SCALING];
  CONNECTED_PERKS[PERKS.AUTOMATION_ROW_SCALING] = [];
  CONNECTED_PERKS[PERKS.AUTOUNLOCK_EU1] = [PERKS.AUTOUNLOCK_EU2];
  CONNECTED_PERKS[PERKS.AUTOUNLOCK_EU2] = [PERKS.AUTOUNLOCK_EU1, PERKS.AUTOBUYER_DILATION];
  CONNECTED_PERKS[PERKS.AUTOUNLOCK_DILATION1] = [PERKS.AUTOUNLOCK_DILATION2];
  CONNECTED_PERKS[PERKS.AUTOUNLOCK_DILATION2] = [PERKS.AUTOUNLOCK_DILATION3];
  CONNECTED_PERKS[PERKS.AUTOUNLOCK_DILATION3] = [PERKS.AUTOBUYER_FASTER_DILATION, PERKS.AUTOUNLOCK_TD];
  CONNECTED_PERKS[PERKS.AUTOUNLOCK_TD] = [PERKS.AUTOUNLOCK_REALITY];
  CONNECTED_PERKS[PERKS.AUTOUNLOCK_REALITY] = [];
  CONNECTED_PERKS[PERKS.BYPASS_ID_AM] = [];
  CONNECTED_PERKS[PERKS.BYPASS_DG_RESET] = [PERKS.AUTOBUYER_DILATION, PERKS.RETROACTIVE_TP1];
  CONNECTED_PERKS[PERKS.BYPASS_EC_DILATION] = [];
  CONNECTED_PERKS[PERKS.BYPASS_EC1_LOCK] = [PERKS.BYPASS_EC2_LOCK, PERKS.BYPASS_EC3_LOCK, PERKS.AUTOCOMPLETE_EC1];
  CONNECTED_PERKS[PERKS.BYPASS_EC2_LOCK] = [PERKS.TS_ACTIVE_EP, PERKS.BYPASS_EC1_LOCK];
  CONNECTED_PERKS[PERKS.BYPASS_EC3_LOCK] = [PERKS.TS_IDLE_EP, PERKS.BYPASS_EC1_LOCK];
  CONNECTED_PERKS[PERKS.BYPASS_EC5_LOCK] = [PERKS.TS_ACTIVE_EP, PERKS.TS_IDLE_EP];
  CONNECTED_PERKS[PERKS.AUTOCOMPLETE_EC1] = [PERKS.AUTOCOMPLETE_EC2];
  CONNECTED_PERKS[PERKS.AUTOCOMPLETE_EC2] = [PERKS.AUTOCOMPLETE_EC3];
  CONNECTED_PERKS[PERKS.AUTOCOMPLETE_EC3] = [PERKS.AUTOCOMPLETE_EC4];
  CONNECTED_PERKS[PERKS.AUTOCOMPLETE_EC4] = [PERKS.AUTOCOMPLETE_EC5];
  CONNECTED_PERKS[PERKS.AUTOCOMPLETE_EC5] = [];
  CONNECTED_PERKS[PERKS.TS_ACTIVE_EP] = [PERKS.BYPASS_EC2_LOCK, PERKS.TS_EC_REQ];
  CONNECTED_PERKS[PERKS.TS_IDLE_EP] = [PERKS.BYPASS_EC3_LOCK, PERKS.AUTOBUYER_TT1];
  CONNECTED_PERKS[PERKS.TS_EC_REQ] = [PERKS.TS_EC_BULK];
  CONNECTED_PERKS[PERKS.TS_EC_BULK] = [];
  CONNECTED_PERKS[PERKS.RETROACTIVE_TP1] = [PERKS.BYPASS_DG_RESET, PERKS.START_TP, PERKS.RETROACTIVE_TP2];
  CONNECTED_PERKS[PERKS.RETROACTIVE_TP2] = [PERKS.RETROACTIVE_TP3];
  CONNECTED_PERKS[PERKS.RETROACTIVE_TP3] = [PERKS.RETROACTIVE_TP4];
  CONNECTED_PERKS[PERKS.RETROACTIVE_TP4] = [];
  CONNECTED_PERKS[PERKS.AUTOBUYER_DILATION] = [PERKS.AUTOUNLOCK_EU2, PERKS.AUTOUNLOCK_DILATION1, PERKS.BYPASS_EC_DILATION, PERKS.BYPASS_DG_RESET];
  CONNECTED_PERKS[PERKS.AUTOBUYER_FASTER_ID] = [PERKS.AUTOBUYER_FASTER_REPLICANTI];
  CONNECTED_PERKS[PERKS.AUTOBUYER_FASTER_REPLICANTI] = [];
  CONNECTED_PERKS[PERKS.AUTOBUYER_FASTER_DILATION] = [];
  CONNECTED_PERKS[PERKS.AUTOBUYER_TT1] = [PERKS.AUTOBUYER_TT2];
  CONNECTED_PERKS[PERKS.AUTOBUYER_TT2] = [PERKS.AUTOBUYER_TT3];
  CONNECTED_PERKS[PERKS.AUTOBUYER_TT3] = [PERKS.AUTOBUYER_TT4];
  CONNECTED_PERKS[PERKS.AUTOBUYER_TT4] = [];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW1] = [PERKS.ACHIEVEMENT_ROW2];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW2] = [PERKS.ACHIEVEMENT_ROW3];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW3] = [PERKS.ACHIEVEMENT_ROW4];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW4] = [PERKS.ACHIEVEMENT_ROW5];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW5] = [PERKS.ACHIEVEMENT_ROW6];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW6] = [PERKS.ACHIEVEMENT_ROW7];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW7] = [PERKS.ACHIEVEMENT_ROW8];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW8] = [PERKS.ACHIEVEMENT_ROW9];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW9] = [PERKS.ACHIEVEMENT_ROW10];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW10] = [PERKS.ACHIEVEMENT_ROW11];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW11] = [PERKS.ACHIEVEMENT_ROW12];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW12] = [PERKS.ACHIEVEMENT_ROW13];
  CONNECTED_PERKS[PERKS.ACHIEVEMENT_ROW13] = [];
}
constructEdgeList();

// Reset perks if the current list is invalid, notify player too (should automatically "fix" older saves)
function checkForValidPerkList() {
  let perkIterator = player.reality.perks.values();
  let isDone = false;
  let isValid = true;
  while (!isDone) {
    let nextPerk = perkIterator.next();
    isDone = nextPerk.done;
    isValid = isDone ? isValid : isValid && (CONNECTED_PERKS[nextPerk.value] !== undefined);
  }
  if (!isValid) {
    dev.respecPerks()
    Modal.message.show("Your old Reality perks were invalid, your perks have been reset and your perk points refunded.");
  }
}

BUYABLE_PERKS = [];
function updateBuyablePerks() {
  if (player.reality.perks.length == 0) {
    BUYABLE_PERKS = [0];
  }
  else {
    let buyablePerks = [];
    for (perk in player.reality.perks) {
      if (player.reality.perks.hasOwnProperty(perk)) {
        let adjacentPerks = CONNECTED_PERKS[player.reality.perks[perk]];
        for (adjPerk in adjacentPerks) {
          let perkNum = adjacentPerks[adjPerk];
          if (adjacentPerks.hasOwnProperty(adjPerk) && !Perks.has(perkNum) && !buyablePerks.includes(perkNum)) {
            buyablePerks.push(perkNum);
          }
        }
      }
    }
    BUYABLE_PERKS = buyablePerks;
  }
}

function canBuyPerk(id, cost) {
  return player.reality.pp >= cost && BUYABLE_PERKS.includes(id)
}

function buyPerk(id, cost) {
  if (!canBuyPerk(id, cost)) return false
  player.reality.perks.push(id);
  Perks.updateAchSkipCount();
  updateAutomatorRows();
  player.reality.pp -= cost
  updateBuyablePerks();
  document.getElementById("pp").textContent = "You have " + player.reality.pp + " Perk Point" + ((player.reality.pp === 1) ? "." : "s.")
  if (player.reality.perks.length == Object.keys(CONNECTED_PERKS).length) giveAchievement("Perks of living")
}

class PerkState {
  constructor(config) {
    this._id = config.id;
    this._effect = config.effect;
  }

  get isBought() {
    return Perks.has(this._id);
  }

  get effectValue() {
    return this._effect();
  }

  applyEffect(applyFn) {
    if (this.isBought) {
      applyFn(this.effectValue);
    }
  }
}

PerkState.allPerks = mapGameData(
  GameDatabase.reality.perks,
  config => new PerkState(config)
);

/**
 * @param {number} id
 * @returns {PerkState}
 */
function Perk(id) {
  return PerkState.allPerks[id];
}

class Perks {
  static updateAchSkipCount() {
    Perks.achSkipCount = player.reality.perks
      .filter(perk => Perks.isAchSkipPerk(perk))
      .length;
  }

  static isAchSkipPerk(id) {
    return id >= 201 && id <= 213;
  }

  static has(id) {
    if (id === undefined) {
      throw crash("Unrecognized perk");
    }
    return player.reality.perks.includes(id);
  }
}

Perks.achSkipCount = 0;