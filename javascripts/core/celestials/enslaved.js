
const ENSLAVED_UNLOCKS = {
  RUN: {
    id: 0,
    price: 1000 * 60 * 60 * 24 * 365 * 1e6, // Million years
    description: "Unlock The Enslaved One's reality.",
  },

}

Enslaved = {
  toggleStore() {
    player.celestials.enslaved.isStoring = !player.celestials.enslaved.isStoring
  },
  useStoredTime() {
    gameLoop(player.celestials.enslaved.stored, true)
    player.celestials.enslaved.stored = 0
  },
  has(info) {
    player.celestials.enslaved.unlocks.includes(info.id)
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
}