
// Key is the perk in question, value is a list of perks that are connected to that perk
const CONNECTED_PERKS = {
  1: [0],
  2: [1],
  3: [0],
  4: [3],
  5: [0],
  6: [5]
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