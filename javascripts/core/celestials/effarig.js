
var effarigQuotes = [
  "We've been observing you",
  "You have shown promise with your bending of the reality",
  "We are the Celestials, and we want you to join us.",
  "My name is Effarig, the Celestial Of Reality",
  "Prove your worth.",
  "I'll let you inside my Reality, mortal. Don't get crushed by it."
]

const EFFARIG_UNLOCKS = {
  RUN: 0,
  EPGEN: 1
}

var Effarig = {
  timePoured: 0,
  pourRM(diff) {
    this.timePoured += diff
    let rm = player.reality.realityMachines
    let rmPoured = Math.min((this.rmStore + 1e6) * 0.01 * Math.pow(this.timePoured, 2), rm)
    this.rmStore += rmPoured
    player.reality.realityMachines = rm.minus(rmPoured)
    this.checkForUnlocks()
  },
  checkForUnlocks() {
    if (!this.has(EFFARIG_UNLOCKS.RUN) && this.rmStore > 5e12) player.celestials.effarig.unlocks.push(EFFARIG_UNLOCKS.RUN)
    else if (!this.has(EFFARIG_UNLOCKS.EPGEN) && this.rmStore > 1e15) player.celestials.effarig.unlocks.push(EFFARIG_UNLOCKS.EPGEN)
  },
  has(id) {
    return player.celestials.effarig.unlocks.includes(id)
  },
  startRun() {
    startRealityOver()
    player.celestials.effarig.run = true
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
    return Decimal.max(Decimal.pow(player.celestials.effarig.bestRunAM.e / 5e8, Math.pow(player.realities, 0.3)), 1)
  },
  get quote() {
    return effarigQuotes[player.celestials.effarig.quoteIdx]
  },
  nextQuote() {
    if (player.celestials.effarig.quoteIdx < 4 + player.celestials.effarig.unlocks.length) player.celestials.effarig.quoteIdx++
  }
}
