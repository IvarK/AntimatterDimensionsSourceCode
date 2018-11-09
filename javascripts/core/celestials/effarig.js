
var effarigQuotes = [
  "We've been observing you",
  "You have shown promise with your bending of the reality",
  "We are the Celestials, and we want you to join us.",
  "My name is Effarig, the Celestial Of Reality",
  "Prove your worth."
]

var Effarig = {
  timePoured: 0,
  pourRM(diff) {
    this.timePoured += diff
    let rm = player.reality.realityMachines
    let rmPoured = Math.min(1e6 * Math.pow(this.timePoured, 2), rm)
    this.rmStore += rmPoured
    player.reality.realityMachines = rm.minus(rmPoured)
  },
  get rmStore() {
    return player.celestials.effarig.rmStore
  },
  set rmStore(amount) {
    player.celestials.effarig.rmStore = amount
  },
  get fill() {
    return Math.pow(this.rmStore, 0.15) / Math.pow(1e15, 0.15)
  },
  get rmMultiplier() {
    return Math.max(Math.pow(this.rmStore, 0.1), 1)
  },
  get quote() {
    return effarigQuotes[player.celestials.effarig.quoteIdx]
  },
  nextQuote() {
    if (player.celestials.effarig.quoteIdx !== effarigQuotes.length - 1) player.celestials.effarig.quoteIdx++
  }
}
