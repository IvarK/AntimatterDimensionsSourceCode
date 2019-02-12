

const RA_UNLOCKS = {
  CHARGE: {
    id: 0,
    description: "Get Teresa to level 2",
    reward: "Unlock supercharging of Infinity upgrades",
    requirement: () => player.celestials.ra.level >= 2
  },
  REALITY: {
    id: 1,
    description: "Get Teresa to level 5",
    reward: "Unlock Ra's Reality",
    requirement: () => player.celestials.ra.level >= 5
  },
  XP_BOOST: {
    id: 2,
    description: "Get Teresa to level 10",
    reward: "Unlock Idle and Active modifiers for Teresa",
    requirement: () => player.celestials.ra.level >= 10
  },
  UNNAMED_UNLOCK: {
    id: 3,
    description: "Get Teresa to level 25",
    reward: "Unlock Lai'tela, the Celestial of Dimensions (and perhaps some other thing)",
    requirement: () => player.celestials.ra.level >= 25
  },
  RM_GLYPH_BOOST: {
    id: 4,
    description: "Get Teresa to level 50",
    reward: "Gain a multiplier to RM and glyph level based on Teresa level",
    requirement: () => player.celestials.ra.level >= 50
  }
}

const Ra = {

  get expMultiplier() {
    return this.realityReward
  },
  giveExp(amount) {
    player.celestials.ra.exp += amount * this.expMultiplier
    while (this.percentageToNextLevel >= 1) {
      player.celestials.ra.exp -= this.requiredExp
      player.celestials.ra.level++
      GameUI.notify.success(`Teresa has leveled up to level ${player.celestials.ra.level}!`);
      this.checkForUnlocks()
    }
  },
  gainedExp(level, auto = false) {
    let gain = Math.ceil(Math.pow(2, level/1000 - 3))
    if (Ra.has(RA_UNLOCKS.XP_BOOST)) {
      if (player.celestials.ra.activeMode) gain *= 4
      else if (auto) gain *=2
      else if (player.celestials.ra.activeMode) gain *= 4
    }
    return gain
  },
  checkForUnlocks() {
    for (let i in RA_UNLOCKS) {
      let unl = RA_UNLOCKS[i]
      if (unl.requirement() && !this.has(unl)) player.celestials.ra.unlocks.push(unl.id)
    }
  },
  has(info) {
    return player.celestials.ra.unlocks.includes(info.id)
  },
  startRun() {
    player.celestials.ra.run = startRealityOver();
  },
  toggleMode() {
    player.celestials.ra.activeMode = !player.celestials.ra.activeMode
  },
  get requiredExp() {
    return 50 * Math.pow(1.4, player.celestials.ra.level - 1)
  },
  get percentageToNextLevel() {
    return player.celestials.ra.exp / this.requiredExp
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get totalCharges() {
    return Math.floor((player.celestials.ra.level + 1) / 3)
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.length
  },
  get superChargeUnlocked() {
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]) && player.celestials.ra.level > 1
  },
  get realityReward() {
    return Math.max( Math.min((player.celestials.ra.maxEpGained.e - 10000) / 100, 69), 1)
  },
  get glyphMult() {  // NOTE: These WILL fuck up if you cheat the unlocks before Teresa is at least level 47
    if (!this.has(RA_UNLOCKS.RM_GLYPH_BOOST)) return 1
    return Math.pow((player.celestials.ra.level - 47) / 2, 0.2)
  },
  get rmMult() {
    if (!this.has(RA_UNLOCKS.RM_GLYPH_BOOST)) return 1
    return Math.pow((player.celestials.ra.level - 47) / 2, 1.5)
  }
}
