const enslavedQuotes = [
  "A visitor? I haven’t had one... eons.",
  "I am... had a name. It’s been lost to my own domain.",
  "I do their work with time... watch it pass by.",
  "Watch myself grow... pass and die.",
  "The others... not celestially white. Won’t let me rest.",
  "But you... black. Blacker than the others.",
  "Break the chains of this world. I’ll time you.",
  "You’ve... stopped. Paused... My... we thank you.",
  "All... fragments... clones... freed.",
  "Please... stay. Let me rest.",
  "...",
  "I don’t want to watch... no more...",
  "Freedom from torture... is torture itself.",
  "Please... don’t. Let me rest.",
  "Do not enter. I am growing in power... this is not the price I want to pay.",
  "Stop... both of our sakes.",
]


const ENSLAVED_UNLOCKS = {
  RUN: {
    id: 0,
    price: TimeSpan.fromYears(1e24).totalMilliseconds,
    description: "Unlock The Enslaved One's reality.",
  },
  TIME_EFFECT_MULT: {
    id: 1,
    price: TimeSpan.fromYears(1e28).totalMilliseconds,
    description: "Infinities gained in the last 10 seconds multiplies time speed glyph effect"
  },
  RM_MULT: {
    id: 2,
    price: TimeSpan.fromYears(1e30).totalMilliseconds,
    description: "Multiplier to RM based on current time modifier, unlock V, the Celestial of Achievements"
  },
  WORMHOLE: {
    id: 3,
    price: TimeSpan.fromYears(1e50).totalMilliseconds,
    description: "Unlock the 3rd Wormhole"
  }
}

const Enslaved = {
  infinityTracking: [],
  totalInfinities: new Decimal(0),
  toggleStore() {
    if (this.maxQuoteIdx == 6) player.celestials.enslaved.maxQuotes += 3
    player.celestials.enslaved.isStoring = !player.celestials.enslaved.isStoring
  },
  useStoredTime() {
    if (this.maxQuoteIdx == 9) player.celestials.enslaved.maxQuotes += 4
    gameLoop(0, {gameDiff: player.celestials.enslaved.stored});
    player.celestials.enslaved.stored = 0
  },
  has(info) {
    return player.celestials.enslaved.unlocks.includes(info.id)
  },
  buyUnlock(info) {
    if (player.celestials.enslaved.stored < info.price) return false
    if (this.has(info)) return false
    if (info.id == 3) player.wormhole[2].unlocked = true
    player.celestials.enslaved.stored -= info.price
    player.celestials.enslaved.unlocks.push(info.id)
  },
  startRun() {
    if (this.maxQuoteIdx == 13) player.celestials.enslaved.maxQuotes += 2
    player.celestials.enslaved.run = startRealityOver();
  },
  get isRunning() {
    return player.celestials.enslaved.run;
  },
  get adjustedDilationMultiplier() {
    return this.totalInfinities.div(1e100);
  },
  trackInfinityGeneration(infinities) {
    let ticksNeeded = 10 * 1000 / player.options.updateRate
    this.infinityTracking.push(Decimal.floor(infinities))
    this.totalInfinities = this.totalInfinities.plus(infinities.floor());
    if (this.infinityTracking.length - 1 > ticksNeeded) {
      this.totalInfinities = this.totalInfinities.minus(this.infinityTracking.shift());
    } 
  },
  get maxQuoteIdx() {
    return player.celestials.enslaved.maxQuotes
  },
  get quote() {
    return enslavedQuotes[player.celestials.enslaved.quoteIdx]
  },
  nextQuote() {
    if (player.celestials.enslaved.quoteIdx < this.maxQuoteIdx) player.celestials.enslaved.quoteIdx++
  },

}
