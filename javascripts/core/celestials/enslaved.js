

Enslaved = {
  toggleStore() {
    player.celestials.enslaved.store = !player.celestials.enslaved.store
  },
  useStoredTime() {
    gameLoop(player.celestials.enslaved.stored, true)
    player.celestials.enslaved.stored = 0
  }
}