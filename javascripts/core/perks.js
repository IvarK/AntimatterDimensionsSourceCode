
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