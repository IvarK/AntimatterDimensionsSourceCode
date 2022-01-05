export const Speedrun = {
  // Speedruns are initially paused until startRun is called, which happens as soon as the player purchases a AD or
  // uses the Konami code. Until then, they're free to do whatever they want with the UI
  startRun() {
    if (player.speedrun.hasStarted) return;
    player.speedrun.hasStarted = true;
    player.speedrun.startDate = Date.now();
    player.lastUpdate = Date.now();
  },
  isPausedAtStart() {
    return player.speedrun.isActive && !player.speedrun.hasStarted;
  },
};
