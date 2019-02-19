
var teresaQuotes = [
  "We've been observing you",
  "You have shown promise with your bending of the reality",
  "We are the Celestials, and we want you to join us.",
  "My name is Teresa, the Celestial Of Reality",
  "Prove your worth.",
  "I'll let you inside my Reality, mortal. Don't get crushed by it.",
  "You've proven your worth mortal, if you wish to join us you need to start over...",
  "Why are you still here... You were supposed to vanish... You are still no match for us.",
  "I hope the others succeed where I have failed."
]

const TERESA_UNLOCKS = {
  RUN: {
    id: 0,
    price: 5e12,
    description: "unlock Teresa's reality.",
  },
  EPGEN: {
    id: 1,
    price: 1e18,
    description: "unlock Teresa's EP generation.",
  },
  EFFARIG: {
    id: 2,
    price: 5e21,
    description: "unlock Effarig, Celestial of Ancient Relics.",
  },
  SHOP: {
    id: 3,
    price: 1e24,
    description: "unlock Perk Point Shop.",
  },
}

var Teresa = {
  timePoured: 0,
  unlockInfo: TERESA_UNLOCKS,
  lastUnlock: "SHOP",
  pourRM(diff) {
    if (this.rmstore >= 1e24) return
    this.timePoured += diff
    let rm = player.reality.realityMachines;
    let rmPoured = Math.min((this.rmStore + 1e6) * 0.01 * Math.pow(this.timePoured, 2), rm.toNumber())
    this.rmStore += Math.min(rmPoured, 1e24 - this.rmStore)
    player.reality.realityMachines = rm.minus(rmPoured)
    this.checkForUnlocks()
  },
  checkForUnlocks() {
    Object.values(Teresa.unlockInfo).map((info) => {
      if (!this.has(info) && this.rmStore >= info.price) {
        player.celestials.teresa.unlocks.push(info.id);
      }
    });
  },
  has(info) {
    if (!info.hasOwnProperty("id")) throw("Pass in the whole TERESA UNLOCK object")
    return player.celestials.teresa.unlocks.includes(info.id)
  },
  startRun() {
    player.celestials.teresa.run = startRealityOver();
  },
  buyGlyphLevelPower() {
    let cost = Math.pow( 2, Math.log(player.celestials.teresa.glyphLevelMult) / Math.log(1.05) )
    if (player.reality.pp < cost) return false
    player.celestials.teresa.glyphLevelMult *= 1.05
    player.reality.pp -= cost
  },
  buyRmMult() {
    let cost = player.celestials.teresa.rmMult
    if (player.reality.pp < cost) return false
    player.celestials.teresa.rmMult *= 2
    player.reality.pp -= cost
  },
  buyDtBulk() {
    let cost = player.celestials.teresa.dtBulk * 100
    if (player.reality.pp < cost) return false
    player.celestials.teresa.dtBulk *= 2
    player.reality.pp -= cost
  },
  get rmStore() {
    return player.celestials.teresa.rmStore
  },
  set rmStore(amount) {
    player.celestials.teresa.rmStore = amount
  },
  get fill() {
    return Math.min(Math.log10(this.rmStore) / 24, 1)
  },
  get rmMultiplier() {
    return Math.max(Math.pow(this.rmStore, 0.1), 1)
  },
  get runRewardMultiplier() {
    return Decimal.max(Decimal.pow(player.celestials.teresa.bestRunAM.e / 5e8, 1 + Math.pow(Math.log10(player.realities), 1.5)), 1).toNumber()
  },
  get quote() {
    return teresaQuotes[player.celestials.teresa.quoteIdx]
  },
  nextQuote() {
    if (player.celestials.teresa.quoteIdx < 4 + player.celestials.teresa.unlocks.length) player.celestials.teresa.quoteIdx++
  },
  get isRunning() {
    return player.celestials.teresa.run;
  }
};
