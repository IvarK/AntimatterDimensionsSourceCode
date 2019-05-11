"use strict";

const RA_UNLOCKS = {
  CHARGE: {
    id: 0,
    description: "Get Teresa to level 2",
    reward: "Unlock charging of Infinity upgrades",
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
    description: "Get Teresa to level 30",
    reward: "Unlock Lai'tela, the Celestial of Dimensions",
    requirement: () => player.celestials.ra.level >= 30,
    onObtaining: () => MatterDimension(1).amount++,
  }
};

const Ra = {
  get expMultiplier() {
    return this.realityReward;
  },
  giveExp(amount) {
    player.celestials.ra.exp += amount;
    while (this.percentageToNextLevel >= 1) {
      player.celestials.ra.exp -= this.requiredExp;
      player.celestials.ra.level++;
      GameUI.notify.success(`Teresa has leveled up to level ${player.celestials.ra.level}!`);
      this.checkForUnlocks();
    }
  },
  gainedExp(level, auto = false) {
    let gain = Math.pow(2, level / 500 - 10);
    if (Ra.has(RA_UNLOCKS.XP_BOOST)) {
      if (player.celestials.ra.activeMode && !auto) gain *= 4;
      else if (!player.celestials.ra.activeMode && auto) gain *= 2;
    }
    return Math.ceil(gain * this.expMultiplier);
  },
  checkForUnlocks() {
    for (const i in RA_UNLOCKS) {
      const unl = RA_UNLOCKS[i];
      if (unl.requirement() && !this.has(unl)) {
        player.celestials.ra.unlocks.push(unl.id);
        if (unl.onObtaining) unl.onObtaining();
      }
    }
  },
  has(info) {
    return player.celestials.ra.unlocks.includes(info.id);
  },
  startRun() {
    player.celestials.ra.run = startRealityOver();
  },
  toggleMode() {
    player.celestials.ra.activeMode = !player.celestials.ra.activeMode;
  },
  get requiredExp() {
    return Math.floor(5000 * Math.pow(1.2, player.celestials.ra.level - 1));
  },
  get percentageToNextLevel() {
    return player.celestials.ra.exp / this.requiredExp;
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get totalCharges() {
    return Math.floor((player.celestials.ra.level + 1) / 3);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.size;
  },
  get chargeUnlocked() {
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]) && player.celestials.ra.level > 1;
  },
  get realityReward() {
    return Math.max(player.celestials.ra.maxEpGained.e / 1e4, 1);
  }
};
