
const LAITELA_UNLOCKS = {
  PELLE: {
    id: 0,
    price: 308,
    description: "Unlock Pelle, the Celestial of Antimatter",
  },
  TD: {
    id: 1,
    price: 1e10,
    description: "Reduce Time Dimension cost multipliers by 20%"
  },
  TD2: {
    id: 2,
    price: 1e15,
    description: "Reduce Time Dimension cost scaling past 1e6000 EP"
  },
  ID: {
    id: 3,
    price: 1e25,
    description: "Increase Infinity Dimensions conversion amount",
    value: () => Laitela.idConversionEffect,
    format: x => "+" + x.toFixed(2)
  }
}

const laitelaRunUnlockThresholds = ["1e4000", "1e4500", "1e5000"].map(u => new Decimal(u))


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
  canBuyUnlock(info) {
    if (player.celestials.laitela.matter < info.price) return false
    if (this.has(info)) return false
    return true
  },
  buyUnlock(info) {
    if (!this.canBuyUnlock) return false
    player.celestials.laitela.matter -= info.price
    player.celestials.laitela.unlocks.push(info.id)
  },
  startRun() {
    if (MatterDimension(1).amount == 0) MatterDimension(1).amount++;
    player.celestials.laitela.run = startRealityOver();
  },
  get isRunning() {
    return player.celestials.laitela.run;
  },
  get nextMatterDimensionThreshold() {
    for (let i = 1; i <= 3; i++) {
      let d = MatterDimension(i + 1)
      if (d.amount == 0 ) return `Next dimension at ${shorten(laitelaRunUnlockThresholds[i - 1])} EP`
    }
    return ""
  },
  get matterEffectToDimensionMultDecrease() {
    return Math.pow(0.99, Math.log10(Math.max(player.celestials.laitela.matter, 1)))
  },
  get matterEffectPercentage() {
    return ((1 - this.matterEffectToDimensionMultDecrease) * 100).toFixed(2) + "%"
  },
  get idConversionEffect() {
    return Math.sqrt(Math.log10(Math.max(player.celestials.laitela.matter, 1)))
  }
}
