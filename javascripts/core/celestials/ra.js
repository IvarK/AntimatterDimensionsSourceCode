"use strict";

const RA_UNLOCKS = {
  CHARGE: {
    id: 0,
    description: "Get Teresa to level 2",
    reward: "Unlock charging of Infinity upgrades",
    requirement: () => player.celestials.ra.teresaLevel >= 2
  },
  TERESA_XP: {
    id: 1,
    description: "Get Teresa to level 3",
    reward: "Unlock Ra's Reality, gain a boost to Teresa memories based on EP reached",
    requirement: () => player.celestials.ra.teresaLevel >= 3
  },
  EFFARIG_UNLOCK: {
    id: 2,
    description: "Get Teresa to level 5",
    reward: "Unlock Effarig memories",
    requirement: () => player.celestials.ra.teresaLevel >= 5
  },
  AUTO_TP: {
    id: 3,
    description: "Get Teresa to level 10",
    reward: "Tachyon Particles are given immediately during dilation",
    requirement: () => player.celestials.ra.teresaLevel >= 10
  },
  PERK_SHOP_INCREASE: {
    id: 4,
    description: "Get Teresa to level 15",
    reward: "Perk shop caps are raised",
    requirement: () => player.celestials.ra.teresaLevel >= 15
  },
  LATER_DILATION: {
    id: 5,
    description: "Get Teresa to level 20",
    reward: "Unlock more dilation upgrades",
    requirement: () => player.celestials.ra.teresaLevel >= 20
  },
  IMPROVED_GLYPHS: {
    id: 6,
    description: "Get Effarig to level 2",
    reward: "Glyph rarity is increased and you gain more glyph choices, based on Effarig level",
    requirement: () => player.celestials.ra.effarigLevel >= 2
  },
  EFFARIG_XP: {
    id: 7,
    description: "Get Effarig to level 3",
    reward: "Gain a boost to Effarig memories based on number of glyphs used in Ra's Reality",
    requirement: () => player.celestials.ra.effarigLevel >= 3
  },
  ENSLAVED_UNLOCK: {
    id: 8,
    description: "Get Effarig to level 5",
    reward: "Unlock Enslaved memories",
    requirement: () => player.celestials.ra.effarigLevel >= 5
  },
  GLYPH_EFFECT_COUNT: {
    id: 9,
    description: "Get Effarig to level 10",
    reward: "Glyphs always have 4 effects (Effarig glyphs can have more)",
    requirement: () => player.celestials.ra.effarigLevel >= 10
  },
  SHARD_LEVEL_BOOST: {
    id: 10,
    description: "Get Effarig to level 15",
    reward: "Glyph level is increased based on relic shards gained",
    requirement: () => player.celestials.ra.effarigLevel >= 15
  },
  GLYPH_ALCHEMY: {
    id: 11,
    description: "Get Effarig to level 20",
    reward: "Unlock Glyph Alchemy",
    requirement: () => player.celestials.ra.effarigLevel >= 20
  },
  IMPROVED_STORED_TIME: {
    id: 12,
    description: "Get Enslaved to level 2",
    reward: "Stored game time is amplified and stored real time is more efficient",
    requirement: () => player.celestials.ra.enslavedLevel >= 2
  },
  ENSLAVED_XP: {
    id: 13,
    description: "Get Enslaved to level 3",
    reward: "Gain a boost to Enslaved memories based on game time spent in Ra's Reality",
    requirement: () => player.celestials.ra.enslavedLevel >= 3
  },
  V_UNLOCK: {
    id: 14,
    description: "Get Enslaved to level 5",
    reward: "Unlock V memories",
    requirement: () => player.celestials.ra.enslavedLevel >= 5
  },
  ADJUSTABLE_STORED_TIME: {
    id: 15,
    description: "Get Enslaved to level 10",
    reward: "Rate of stored game time can be configured",
    requirement: () => player.celestials.ra.enslavedLevel >= 10
  },
  PEAK_GAMESPEED: {
    id: 16,
    description: "Get Enslaved to level 15",
    reward: "[some boost] based on peak game speed in each Reality",
    requirement: () => player.celestials.ra.enslavedLevel >= 15
  },
  GAMESPEED_BOOST: {
    id: 17,
    description: "Get Enslaved to level 20",
    reward: "Game speed increases based on current stored time",
    requirement: () => player.celestials.ra.enslavedLevel >= 20
  },
  MORE_EC_COMPLETION: {
    id: 18,
    description: "Get V to level 2",
    reward: "Eternity Challenges can be completed additional times based on V level",
    requirement: () => player.celestials.ra.vLevel >= 2
  },
  V_XP: {
    id: 19,
    description: "Get V to level 3",
    reward: "Gain a boost to V memories based on purchased TT in Ra's Reality",
    requirement: () => player.celestials.ra.vLevel >= 3
  },
  V_LV5: {
    id: 20,
    description: "Get V to level 5",
    reward: "[placeholder, I missed the fact that V needs one more upgrade than the others]",
    requirement: () => player.celestials.ra.vLevel >= 5
  },
  INSTANT_AUTOEC: {
    id: 21,
    description: "Get V to level 10",
    reward: "Eternity Challenges autocomplete instantly",
    requirement: () => player.celestials.ra.vLevel >= 10
  },
  IMPROVED_EC: {
    id: 22,
    description: "Get V to level 15",
    reward: "Eternity Challenge rewards are improved",
    requirement: () => player.celestials.ra.vLevel >= 15
  },
  UNCAPPED_EC: {
    id: 23,
    description: "Get V to level 20",
    reward: "Eternity Challenges can be completed in dilation with disabled IP multipliers for unlimited completions.",
    requirement: () => player.celestials.ra.vLevel >= 20 && player.celestials.v.runUnlocks[5] === 6,
  },
  LAITELA_UNLOCK: {
    id: 24,
    description: "Get all celestials to level 25",
    reward: "Unlock Lai'tela, the Celestial of Dimensions",
    requirement: () => player.celestials.ra.teresaLevel >= 25 && player.celestials.ra.effarigLevel >= 25 &&
      player.celestials.ra.enslavedLevel >= 25 && player.celestials.ra.vLevel >= 25,
    onObtaining: () => MatterDimension(1).amount = new Decimal(1),
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
      player.celestials.ra.teresaLevel++;
      GameUI.notify.success(`Teresa has leveled up to level ${player.celestials.ra.teresaLevel}!`);
      this.checkForUnlocks();
    }
  },
  expMult(auto) {
    if (Ra.has(RA_UNLOCKS.XP_BOOST)) {
      if (player.celestials.ra.activeMode && !auto) return 4;
      if (!player.celestials.ra.activeMode && auto) return 2;
    }
    return 1;
  },
  gainedExp(level, auto = false) {
    const gain = Math.pow(2, level / 500 - 10) * this.expMult(auto);
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
    return Math.floor(5000 * Math.pow(1.2, player.celestials.ra.teresaLevel - 1));
  },
  get percentageToNextLevel() {
    return player.celestials.ra.exp / this.requiredExp;
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get totalCharges() {
    return Math.floor(player.celestials.ra.teresaLevel / 2);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.size;
  },
  get chargeUnlocked() {
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]) && player.celestials.ra.teresaLevel > 1;
  },
  get realityReward() {
    return Math.max(player.celestials.ra.maxEpGained.e / 1e4, 1);
  }
};
