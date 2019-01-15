
// Key is the perk in question, value is a list of perks that are connected to that perk
const CONNECTED_PERKS = {
  0: [1, 4, 11, 21, 41, 51],
  1: [0, 2],
  2: [1, 3, 32],
  3: [2, 5],
  4: [0, 31],
  5: [3, 6],
  6: [5, 7],
  7: [6, 8],
  8: [7],
  11: [0, 12, 14, 71],
  12: [11, 15, 61],
  13: [24, 15, 72],
  14: [11],
  15: [12, 13],
  21: [0, 22],
  22: [21, 23],
  23: [22, 24, 73],
  24: [23, 13],
  31: [4, 32, 33],
  32: [2, 31, 81, 91],
  33: [31, 34],
  34: [33, 35],
  35: [34, 36],
  36: [35, 37],
  37: [36],
  41: [0, 42],
  42: [41, 43],
  43: [42, 44],
  44: [43, 45],
  45: [44, 46],
  46: [45, 47],
  47: [46, 48],
  48: [47, 49],
  49: [48, 410],
  410: [49, 411],
  411: [410, 412],
  412: [411, 413],
  413: [412],
  51: [0, 52, 53],
  52: [51],
  53: [51, 54, 55],
  54: [53],
  55: [53, 56],
  56: [55, 57],
  57: [56],
  61: [12, 62, 63],
  62: [61],
  63: [61, 64],
  64: [63, 65, 66],
  65: [64],
  66: [64],
  67: [61],
  71: [11, 72, 73, 74, 75],
  72: [71, 13],
  73: [71, 23],
  81: [32, 82],
  82: [81],
  74: [71],
  75: [71],
  91: [32, 92],
  92: [91, 93],
  93: [92, 94],
  94: [93, 95],
  95: [94],
}

function verifyConnectedPerks() {
  for (key in CONNECTED_PERKS) {
    CONNECTED_PERKS[key].map(function(id) {
      if (!CONNECTED_PERKS.hasOwnProperty(id)) {
        console.log("CONNECTED_PERK " + key + " references unknown id " + id);
      } else if (!CONNECTED_PERKS[id].includes(parseInt(key))) {
        console.log("CONNECTED_PERKS error: " + key + " " + id);
      }
    })
  }
}
verifyConnectedPerks();

function hasConnectedPerk(id) {
  if (id == 0) return true
  return CONNECTED_PERKS[id].some(hasPerk)
}

function hasPerk(id) {
  return player.reality.perks.includes(id)
}

function canBuyPerk(id, cost) {
  if (cost > player.reality.pp) return false
  if (hasPerk(id) || !hasConnectedPerk(id)) return false
  return true
}

function buyPerk(id, cost) {
  if (cost > player.reality.pp) return false
  if (hasPerk(id) || !hasConnectedPerk(id)) return false

  player.reality.perks.push(id);
  Perks.updateAchSkipCount();
  updateAutomatorRows();
  player.reality.pp -= cost
  document.getElementById("pp").textContent = "You have " + player.reality.pp + " Perk Point" + ((player.reality.pp === 1) ? "." : "s.")
  if (player.reality.perks.length == Object.keys(CONNECTED_PERKS).length) giveAchievement("Perks of living")
}

class PerkState {
  constructor(config) {
    this._id = config.id;
    this._effect = config.effect;
  }

  get isBought() {
    return player.reality.perks.includes(this._id);
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
    return id >= 41 && id <= 49 || id >= 410 && id <= 413;
  }
}

Perks.achSkipCount = 0;