
const ENSLAVED_UNLOCKS = {
  RUN: {
    id: 0,
    price: 1000 * 60 * 60 * 24 * 365 * 1e6, // Million years
    description: "Unlock The Enslaved One's reality.",
  },

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