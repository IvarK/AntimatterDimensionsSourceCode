
// Key is the perk in question, value is a list of perks that are connected to that perk
const CONNECTED_PERKS = {
  1: [0],
  2: [1, 32],
  3: [2],
  4: [0],
  11: [0],
  12: [11],
  13: [24],
  14: [11],
  15: [12, 13],
  21: [0],
  22: [21, 23],
  23: [22, 24],
  24: [23, 13],
  31: [4, 32],
  32: [31, 2],
  41: [0],
  42: [41],
  43: [42],
  44: [43],
  45: [44],
  46: [45],
  47: [46],
  48: [47],
  49: [48],
  410: [49],
  411: [410],
  412: [411],
}

const PERK_NODES = [{id: 0, label: "0", color: getNodeColor(0, 1), title: "You can now choose from 3 different glyphs on reality."}, //DONE
{id: 1, label: "1", color: getNodeColor(1, 1), title: "+5 base Automator rows."}, //DONE
{id: 2, label: "2", color: getNodeColor(2, 1), title: "+10 base Automator rows."}, //DONE
{id: 3, label: "3", color: getNodeColor(3, 1), title: "Improve the automator row per reality scaling."}, //DONE
{id: 4, label: "4", color: getNodeColor(4, 1), title: "EC1 requirement removed from study 181"}, //DONE
{id: 11, label: "11", color: getNodeColor(11, 1), title: "The 2nd rebuyable dilation upgrade no longer resets your dilated time."}, //DONE
{id: 12, label: "12", color: getNodeColor(12, 1), title: "Rebuyable dilation upgrade autobuyers."},
{id: 13, label: "13", color: getNodeColor(13, 1), title: "Remove the unlock requirement for Time Dilation."},
{id: 14, label: "14", color: getNodeColor(14, 1), title: "Gain second row of dilation upgrades on dilation unlock."},
{id: 15, label: "15", color: getNodeColor(15, 1), title: "Gain third row of dilation upgrades on dilation unlock."},
{id: 21, label: "21", color: getNodeColor(21, 1), title: "+1 to base glyph level."},
{id: 22, label: "22", color: getNodeColor(22, 1), title: "+1 glyph choice on reality."},
{id: 23, label: "23", color: getNodeColor(23, 1), title: "+5% minimum glyph rarity."},
{id: 24, label: "24", color: getNodeColor(24, 1), title: "+1 to base glyph level."},
{id: 31, label: "31", color: getNodeColor(31, 1), title: "Remove the secondary requirements for unlocking eternity challenges."},
{id: 32, label: "32", color: getNodeColor(32, 1), title: "You can complete multiple tiers of eternity challenges at once if you reach the goal for a higher completion of that challenge."},
{id: 41, label: "41", color: getNodeColor(41, 1), title: "Start with 1st achievement row after reality."},
{id: 42, label: "42", color: getNodeColor(42, 1), title: "Start with 2nd achievement row after reality."},
{id: 43, label: "43", color: getNodeColor(43, 1), title: "Start with 3rd achievement row after reality."},
{id: 44, label: "44", color: getNodeColor(44, 1), title: "Start with 4th achievement row after reality."},
{id: 45, label: "45", color: getNodeColor(45, 1), title: "Start with 5th achievement row after reality."},
{id: 46, label: "46", color: getNodeColor(46, 1), title: "Start with 6th achievement row after reality."},
{id: 47, label: "47", color: getNodeColor(47, 1), title: "Start with 7th achievement row after reality."},
{id: 48, label: "48", color: getNodeColor(48, 1), title: "Start with 8th achievement row after reality."},
{id: 49, label: "49", color: getNodeColor(49, 1), title: "Start with 9th achievement row after reality."},
{id: 410, label: "410", color: getNodeColor(410, 1), title: "Start with 10th achievement row after reality."},
{id: 411, label: "411", color: getNodeColor(411, 1), title: "Start with 11th achievement row after reality."},
{id: 412, label: "412", color: getNodeColor(412, 1), title: "Start with 12th achievement row after reality."},]

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

  player.reality.perks.push(id)
  player.reality.pp -= cost
  drawPerkNetwork()
}