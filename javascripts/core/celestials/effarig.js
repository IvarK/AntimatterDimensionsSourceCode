
var effarigQuotes = [
  "We've been observing you",
  "You have shown promise with your bending of the reality",
  "We are the Celestials, and we want you to join us.",
  "My name is Effarig, the Celestial Of Reality",
  "Prove your worth.",
  "I'll let you inside my Reality, mortal. Don't get crushed by it.",
  "You've proven your worth mortal, if you wish to join us you need to start over...",
  "Why are you still here... You were supposed to vanish... You are still no match for us though."
]

const EFFARIG_UNLOCKS = {
  RUN: {
    id: 0,
    price: 5e12,
    description: "unlock Effarig's reality.",
  },
  EPGEN: {
    id: 1,
    price: 1e18,
    description: "unlock Effarig's EP generation.",
  },
  TERESA: {
    id: 2,
    price: 5e21,
    description: "unlock Teresa, Celestial of Ancient Relics.",
  },
  SHOP: {
    id: 3,
    price: 1e24,
    description: "unlock Perk Point Shop.",
  },
}

var Effarig = {
  timePoured: 0,
  unlockInfo: EFFARIG_UNLOCKS,
  lastUnlock: "SHOP",
  pourRM(diff) {
    this.timePoured += diff
    let rm = player.reality.realityMachines
    let rmPoured = Math.min((this.rmStore + 1e6) * 0.01 * Math.pow(this.timePoured, 2), rm)
    this.rmStore += rmPoured
    player.reality.realityMachines = rm.minus(rmPoured)
    this.checkForUnlocks()
  },
  checkForUnlocks() {
    Object.values(Effarig.unlockInfo).map((info) => {
      if (!this.has(info.id) && this.rmStore >= info.price) {
        player.celestials.effarig.unlocks.push(info.id);
      }
    });
  },
  has(id) {
    return player.celestials.effarig.unlocks.includes(id)
  },
  startRun() {
    startRealityOver()
    player.celestials.effarig.run = true
  },
  buyGlyphLevelPower() {
    let cost = Math.pow( 2, Math.log(player.celestials.effarig.glyphLevelMult) / Math.log(1.05) )
    if (player.reality.pp < cost) return false
    player.celestials.effarig.glyphLevelMult *= 1.05
    player.reality.pp -= cost
  },
  buyRmMult() {
    let cost = player.celestials.effarig.rmMult
    if (player.reality.pp < cost) return false
    player.celestials.effarig.rmMult *= 2
    player.reality.pp -= cost
  },
  get rmStore() {
    return player.celestials.effarig.rmStore
  },
  set rmStore(amount) {
    player.celestials.effarig.rmStore = amount
  },
  get fill() {
    return Math.log10(this.rmStore) / 24
  },
  get rmMultiplier() {
    return Math.max(Math.pow(this.rmStore, 0.1), 1)
  },
  get runRewardMultiplier() {
    return Decimal.max(Decimal.pow(player.celestials.effarig.bestRunAM.e / 5e8, 1 + Math.pow(Math.log10(player.realities), 1.5)), 1)
  },
  get quote() {
    return effarigQuotes[player.celestials.effarig.quoteIdx]
  },
  nextQuote() {
    if (player.celestials.effarig.quoteIdx < 4 + player.celestials.effarig.unlocks.length) player.celestials.effarig.quoteIdx++
  }
}
