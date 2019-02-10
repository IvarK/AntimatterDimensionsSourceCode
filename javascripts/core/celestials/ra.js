

const Ra = {

  giveExp(amount) {
    player.celestials.ra.exp += amount
    if (this.percentageToNextLevel >= 1) {
      player.celestials.ra.exp -= this.requiredExp
      player.celestials.ra.level++
      GameUI.notify.success(`Teresa has leveled up to level ${player.celestials.ra.level}!`);
    }
  },
  gainedExp(level) {
    return Math.ceil(Math.pow(2, level/1000 - 3))
  },
  get requiredExp() {
    return 50 * Math.pow(1.4, player.celestials.ra.level - 1)
  },
  get percentageToNextLevel() {
    return player.celestials.ra.exp / this.requiredExp
  },
  get isRunning() {
    return player.celestials.v.run;
  },
  get superChargedUpgrades() {
    return Math.floor((player.celestials.ra.level+1)/3)
  },
  get superChargeUnlocked() {
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]) && player.celestials.ra.level > 1
  }
}