"use strict";

const Ra = {
  // Dev/debug function for easier testing
  reset() {
    player.celestials.ra = {
      teresaLevel: 1,
      effarigLevel: 0,
      enslavedLevel: 0,
      vLevel: 0,
      teresaExp: 0,
      effarigExp: 0,
      enslavedExp: 0,
      vExp: 0,
      unlocks: [],
      run: false,
      charged: new Set(),
      quoteIdx: 0,
      lastEPGained: new Decimal(0),
      lastGlyphCount: 5,
      lastTimeTaken: 1e100,
      lastTTPurchased: 0,
      disCharge: false,
    }
  },
  /**
   * There is no checking for unlocks because all multipliers should be 1x before the boost is unlocked and
   * 0x before the celestial is unlocked.
   */ 
  giveExp() {
    const amplificationFactor = Enslaved.lockedInBoostRatio;
    this.addTeresaExp(this.gainedTeresaExp * amplificationFactor);
    this.addEffarigExp(this.gainedEffarigExp * amplificationFactor);
    this.addEnslavedExp(this.gainedEnslavedExp * amplificationFactor);
    this.addVExp(this.gainedVExp * amplificationFactor);
    this.checkForUnlocks();
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
  updateExpBoosts() {
    player.celestials.ra.lastEPGained = player.eternityPoints;
    if (this.has(RA_UNLOCKS.EFFARIG_XP)) {
      player.celestials.ra.lastGlyphCount = Glyphs.activeList.length;
    }
    if (this.has(RA_UNLOCKS.ENSLAVED_XP)) {
      player.celestials.ra.lastTimeTaken = player.thisReality;
    }
    if (this.has(RA_UNLOCKS.V_XP)) {
      player.celestials.ra.lastTTPurchased = Math.floor(player.timestudy.amcost.e / 20000) +
        Math.floor(player.timestudy.ipcost.e / 100 + 1) + Math.round(player.timestudy.epcost.log2());
    }
  },
  requiredExp(level) {
    return Math.floor(5000 * Math.pow(1.2, level - 1));
  },
  addTeresaExp(exp) {
    player.celestials.ra.teresaExp += exp;
    while (this.teresaExp > this.requiredExp(this.teresaLevel)) {
      player.celestials.ra.teresaExp -= this.requiredExp(this.teresaLevel);
      player.celestials.ra.teresaLevel++;
      GameUI.notify.success(`Teresa has leveled up to level ${this.teresaLevel}!`);
    }
  },
  addEffarigExp(exp) {
    player.celestials.ra.effarigExp += exp;
    while (this.effarigExp > this.requiredExp(this.effarigLevel)) {
      player.celestials.ra.effarigExp -= this.requiredExp(this.effarigLevel);
      player.celestials.ra.effarigLevel++;
      GameUI.notify.success(`Effarig has leveled up to level ${this.effarigLevel}!`);
    }
  },
  addEnslavedExp(exp) {
    player.celestials.ra.enslavedExp += exp;
    while (this.enslavedExp > this.requiredExp(this.enslavedLevel)) {
      player.celestials.ra.enslavedExp -= this.requiredExp(this.enslavedLevel);
      player.celestials.ra.enslavedLevel++;
      GameUI.notify.success(`Enslaved has leveled up to level ${this.enslavedLevel}!`);
    }
  },
  addVExp(exp) {
    player.celestials.ra.vExp += exp;
    while (this.vExp > this.requiredExp(this.vLevel)) {
      player.celestials.ra.vExp -= this.requiredExp(this.vLevel);
      player.celestials.ra.vLevel++;
      GameUI.notify.success(`V has leveled up to level ${this.vLevel}!`);
    }
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get teresaLevel() {
    return player.celestials.ra.teresaLevel;
  },
  get effarigLevel() {
    return player.celestials.ra.effarigLevel;
  },
  get enslavedLevel() {
    return player.celestials.ra.enslavedLevel;
  },
  get vLevel() {
    return player.celestials.ra.vLevel;
  },
  get teresaExp() {
    return player.celestials.ra.teresaExp;
  },
  get effarigExp() {
    return player.celestials.ra.effarigExp;
  },
  get enslavedExp() {
    return player.celestials.ra.enslavedExp;
  },
  get vExp() {
    return player.celestials.ra.vExp;
  },
  get totalCharges() {
    return Math.floor(this.teresaLevel / 2);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.size;
  },
  get chargeUnlocked() {
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]) && this.teresaLevel > 1;
  },
  get baseExp() {
    return Math.pow(2, gainedGlyphLevel().actualLevel / 500 - 10);
  },
  get gainedTeresaExp() {
    return Math.ceil(this.baseExp * this.teresaExpBoost);
  },
  get gainedEffarigExp() {
    return Math.ceil(this.baseExp * this.effarigExpBoost);
  },
  get gainedEnslavedExp() {
    return Math.ceil(this.baseExp * this.enslavedExpBoost);
  },
  get gainedVExp() {
    return Math.ceil(this.baseExp * this.vExpBoost);
  },
  get teresaExpBoost() {
    return Math.max(player.celestials.ra.lastEPGained.e / 1e4, 1);
  },
  get effarigExpBoost() {
    if (!this.has(RA_UNLOCKS.EFFARIG_UNLOCK)) return 0;
    return Math.pow(2, 5 - player.celestials.ra.lastGlyphCount);
  },
  // This curve is 2x at 100 sec, very steep below that (up to 50x at 1 sec) and very shallow to 1x at 1e102 sec
  get enslavedExpBoost() {
    if (!this.has(RA_UNLOCKS.ENSLAVED_UNLOCK)) return 0;
    const timeInSeconds = player.celestials.ra.lastTimeTaken / 1e3;
    return timeInSeconds < 100
      ? 100 / (2 + 1.5 * Math.max(0, Math.pow(Math.log10(timeInSeconds), 5)))
      : Math.max(1, 2.02 - Math.log10(timeInSeconds) / 100);
  },
  get vExpBoost() {
    if (!this.has(RA_UNLOCKS.V_UNLOCK)) return 0;
    return Math.max(1, Math.pow(player.celestials.ra.lastTTPurchased / 50000, 2.5));
  },
};

const RA_UNLOCKS = {
  CHARGE: {
    id: 0,
    description: "Get Teresa to level 2",
    reward: "Unlock charging of Infinity upgrades",
    requirement: () => Ra.teresaLevel >= 2
  },
  TERESA_XP: {
    id: 1,
    description: "Get Teresa to level 3",
    reward: "Unlock Ra's Reality, gain a boost to Teresa memories based on EP reached",
    requirement: () => Ra.teresaLevel >= 3
  },
  EFFARIG_UNLOCK: {
    id: 2,
    description: "Get Teresa to level 5",
    reward: "Unlock Effarig memories",
    requirement: () => Ra.teresaLevel >= 5,
    onObtaining: () => player.celestials.ra.effarigLevel = 1
  },
  AUTO_TP: {
    id: 3,
    description: "Get Teresa to level 10",
    reward: "Tachyon Particles are given immediately during dilation",
    requirement: () => Ra.teresaLevel >= 10
  },
  PERK_SHOP_INCREASE: {
    id: 4,
    description: "Get Teresa to level 15",
    reward: "Perk shop caps are raised",
    requirement: () => Ra.teresaLevel >= 15
  },
  LATER_DILATION: {
    id: 5,
    description: "Get Teresa to level 20",
    reward: "Unlock more dilation upgrades",
    requirement: () => Ra.teresaLevel >= 20
  },
  IMPROVED_GLYPHS: {
    id: 6,
    description: "Get Effarig to level 2",
    reward: "Glyph rarity is increased and you gain more glyph choices, based on Effarig level",
    requirement: () => Ra.effarigLevel >= 2,
    effect: {
      rarity: () => Ra.effarigLevel,
      choice: () => Math.floor(Ra.effarigLevel / 5),
    }
  },
  EFFARIG_XP: {
    id: 7,
    description: "Get Effarig to level 3",
    reward: "Gain a boost to Effarig memories based on number of glyphs used in Ra's Reality",
    requirement: () => Ra.effarigLevel >= 3
  },
  ENSLAVED_UNLOCK: {
    id: 8,
    description: "Get Effarig to level 5",
    reward: "Unlock Enslaved memories",
    requirement: () => Ra.effarigLevel >= 5,
    onObtaining: () => player.celestials.ra.enslavedLevel = 1
  },
  GLYPH_EFFECT_COUNT: {
    id: 9,
    description: "Get Effarig to level 10",
    reward: "Glyphs always have 4 effects (Effarig glyphs can now have more)",
    requirement: () => Ra.effarigLevel >= 10
  },
  SHARD_LEVEL_BOOST: {
    id: 10,
    description: "Get Effarig to level 15",
    reward: "Glyph level is increased based on relic shards gained",
    requirement: () => Ra.effarigLevel >= 15,
    effect: () => Math.pow(Math.log10(Math.max(Effarig.shardsGained, 1)), 2)
  },
  GLYPH_ALCHEMY: {
    id: 11,
    description: "Get Effarig to level 20",
    reward: "Unlock Glyph Alchemy",
    requirement: () => Ra.effarigLevel >= 20
  },
  IMPROVED_STORED_TIME: {
    id: 12,
    description: "Get Enslaved to level 2",
    reward: "Stored game time is amplified and stored real time is more efficient",
    requirement: () => Ra.enslavedLevel >= 2,
    effect: {
      gameTimeAmplification: () => 1 + Ra.enslavedLevel / 100,
      realTimeEfficiency: () => Ra.enslavedLevel / 100,
      realTimeCap: () => 1000 * 3600 * Ra.enslavedLevel / 2,
    }
  },
  ENSLAVED_XP: {
    id: 13,
    description: "Get Enslaved to level 3",
    reward: "Gain a boost to Enslaved memories based on game time spent in Ra's Reality",
    requirement: () => Ra.enslavedLevel >= 3
  },
  V_UNLOCK: {
    id: 14,
    description: "Get Enslaved to level 5",
    reward: "Unlock V memories",
    requirement: () => Ra.enslavedLevel >= 5,
    onObtaining: () => player.celestials.ra.vLevel = 1
  },
  ADJUSTABLE_STORED_TIME: {
    id: 15,
    description: "Get Enslaved to level 10",
    reward: "Rate of stored game time can be configured",
    requirement: () => Ra.enslavedLevel >= 10
  },
  PEAK_GAMESPEED: {
    id: 16,
    description: "Get Enslaved to level 15",
    reward: "[some boost] based on peak game speed in each Reality",
    requirement: () => Ra.enslavedLevel >= 15
  },
  GAMESPEED_BOOST: {
    id: 17,
    description: "Get Enslaved to level 20",
    reward: "Game speed increases based on current stored time",
    requirement: () => Ra.enslavedLevel >= 20
  },
  MORE_EC_COMPLETION: {
    id: 18,
    description: "Get V to level 2",
    reward: "Eternity Challenges can be completed additional times based on V level",
    requirement: () => Ra.vLevel >= 2
  },
  V_XP: {
    id: 19,
    description: "Get V to level 3",
    reward: "Gain a boost to V memories based on purchased TT in Ra's Reality",
    requirement: () => Ra.vLevel >= 3
  },
  V_LV5: {
    id: 20,
    description: "Get V to level 5",
    reward: "[placeholder, I missed the fact that V needs one more upgrade than the others]",
    requirement: () => Ra.vLevel >= 5
  },
  INSTANT_AUTOEC: {
    id: 21,
    description: "Get V to level 10",
    reward: "Eternity Challenges autocomplete instantly",
    requirement: () => Ra.vLevel >= 10
  },
  IMPROVED_EC: {
    id: 22,
    description: "Get V to level 15",
    reward: "Eternity Challenge rewards are improved",
    requirement: () => Ra.vLevel >= 15
  },
  UNCAPPED_EC: {
    id: 23,
    description: "Get V to level 20",
    reward: "Eternity Challenges can be completed in dilation with disabled IP multipliers for unlimited completions.",
    /**
     * This has a "hidden" requirement of Matterception 6/6 because it affects dilated ECs in a way that can probably
     * make it impossible to complete if it isn't already.  Realistically it should already be done at this point.
     */ 
    requirement: () => Ra.vLevel >= 20 && player.celestials.v.runUnlocks[5] === 6,
  },
  LAITELA_UNLOCK: {
    id: 24,
    description: "Get all celestials to level 25",
    reward: "Unlock Lai'tela, the Celestial of Dimensions",
    requirement: () => Ra.teresaLevel >= 25 && Ra.effarigLevel >= 25 && Ra.enslavedLevel >= 25 && Ra.vLevel >= 25,
    onObtaining: () => MatterDimension(1).amount = new Decimal(1),
  }
};
