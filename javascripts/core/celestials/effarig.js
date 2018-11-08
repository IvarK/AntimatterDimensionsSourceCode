
var Effarig = {
  timePoured: 0,
  pourRM(diff) {
    this.timePoured += diff
    let rmPoured = Math.min(1e6 * Math.pow(this.timePoured, 2), player.reality.realityMachines)
    player.celestials.effarig.rmStore += rmPoured
    player.reality.realityMachines -= rmPoured
  }
}