
const ENSLAVED_UNLOCKS = {
  RUN: {
    id: 0,
    price: TimeSpan.fromYears(1e20).totalMilliseconds,
    description: "Unlock The Enslaved One's reality.",
  },
  TIME_EFFECT_MULT: {
    id: 1,
    price: TimeSpan.fromYears(1e24).totalMilliseconds,
    description: "Infinities gained in the last 10 seconds multiplies time speed glyph effect"
  }

}

Enslaved = {
  infinityTracking: [],
  totalInfinities: 0,
  toggleStore() {
    player.celestials.enslaved.isStoring = !player.celestials.enslaved.isStoring
  },
  useStoredTime() {
    gameLoop(player.celestials.enslaved.stored, true)
    player.celestials.enslaved.stored = 0
  },
  has(info) {
    return player.celestials.enslaved.unlocks.includes(info.id)
  },
  buyUnlock(info) {
    if (player.celestials.enslaved.stored < info.price) return false
    if (this.has(info)) return false

    player.celestials.enslaved.stored -= info.price
    player.celestials.enslaved.unlocks.push(info.id)
  },
  startRun() {
    player.celestials.enslaved.run = startRealityOver();
  },
  trackInfinityGeneration(infinities) {
    let ticksNeeded = 10 * 1000 / player.options.updateRate
    this.infinityTracking.push(Math.floor(infinities))
    this.totalInfinities += Math.floor(infinities)
    if (this.infinityTracking.length - 1 > ticksNeeded) {
      this.totalInfinities -= this.infinityTracking.shift()
    } 
  },

}
