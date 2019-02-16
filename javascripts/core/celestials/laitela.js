
const LAITELA_UNLOCKS = {

}

const laitelaRunUnlockThresholds = ["1e4000", "1e4500", "1e5000"].map( u => new Decimal(u))


const Laitela = {

  handleRunUnlocks() {
    if (!Laitela.isRunning) return
    for (let i = 1; i <= 3; i++) {
      let d = MatterDimension(i + 1)
      if (d.amount == 0 && player.eternityPoints.gte(laitelaRunUnlockThresholds[i - 1])) d.amount++;
    } 
  },

  has(info) {
    return player.celestials.laitela.unlocks.includes(info.id)
  },
  startRun() {
    if (MatterDimension(1).amount == 0) MatterDimension(1).amount++;
    player.celestials.laitela.run = startRealityOver();
  },
  get isRunning() {
    return player.celestials.laitela.run;
  }
}