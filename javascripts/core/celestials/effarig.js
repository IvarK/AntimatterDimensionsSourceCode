


var Effarig = {
  timePoured: 0,
  pourRM(diff) {
    this.timePoured += diff
    let rmPoured = Math.min(1e6 * Math.pow(this.timePoured, 2), player.reality.realityMachines)
    player.celestials.effarig.rmStore += rmPoured
    player.reality.realityMachines = player.reality.realityMachines.minus(rmPoured)
  },
  getPercentage() {
    return (Math.pow(player.celestials.effarig.rmStore, 0.15) / Math.pow(1e15, 0.15) * 100) + "%"
  },
  getRmMultiplier() {
    return Math.max(Math.pow(player.celestials.effarig.rmStore, 0.1), 1)
  }
}