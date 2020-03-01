"use strict";

class RaPetState {
  /**
   * @abstract
   */
  get data() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get name() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get requiredUnlock() { throw new NotImplementedError(); }

  get isUnlocked() {
    return this.requiredUnlock === undefined || Ra.has(this.requiredUnlock);
  }

  get level() {
    return this.data.level;
  }

  set level(value) {
    this.data.level = value;
  }

  get exp() {
    return this.data.exp;
  }

  set exp(value) {
    this.data.exp = value;
  }
  
  get memoryChunks() {
    return this.data.memoryChunks;
  }

  set memoryChunks(value) {
    this.data.memoryChunks = value;
  }

  get requiredExp() {
    return Ra.requiredExpForLevel(this.level);
  }
  
  /**
   * @abstract
   */
  get rawMemoryChunksPerSecond() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get color() { throw new NotImplementedError(); }
  
  get memoryChunksPerSecond() {
    let res = this.canGetMemoryChunks ? this.rawMemoryChunksPerSecond : 0;
    if (this.hasRecollection) res *= 2;
    return res;
  }
  
  get canGetMemoryChunks() {
    return this.isUnlocked && Ra.isRunning;
  }
  
  get hasRecollection() {
    return Ra.petWithRecollection === this.name;
  }
  
  tick(realDiff) {
    const seconds = realDiff / 1000;
    const newMemoryChunks = seconds * this.memoryChunksPerSecond;
    // Adding memories from half of the gained chunks this tick results in the best mathematical behavior
    // for very long simulated ticks
    const newMemories = seconds * (this.memoryChunks + newMemoryChunks / 2) * Ra.productionPerMemoryChunk();
    this.memoryChunks += newMemoryChunks;
    this.addExp(newMemories);
  }

  addExp(exp) {
    this.exp += exp;
    while (this.exp >= this.requiredExp) {
      this.exp -= this.requiredExp;
      this.level++;
      GameUI.notify.success(`${this.name} has leveled up to level ${this.level}!`);
      // All Ra unlocks require a pet to gain a level so it suffices to do this here.
      Ra.checkForUnlocks();
    }
  }

  reset() {
    this.data.level = 1;
    this.data.exp = 0;
    this.data.memoryChunks = 0;
  }
}

const Ra = {
  pets: {
    teresa: new class TeresaRaPetState extends RaPetState {
      get name() { return "Teresa"; }
      get data() { return player.celestials.ra.pets.teresa; }
      get requiredUnlock() { return undefined; }
      get rawMemoryChunksPerSecond() { return Math.pow(player.eternityPoints.pLog10() / 1e4, 3); }
      get memoryProductionMultiplier() { return 1 + Math.pow(player.reality.realityMachines.pLog10() / 100, 0.5); }
      get color() { return "#86ea84"; }
    }(),
    effarig: new class EffarigRaPetState extends RaPetState {
      get name() { return "Effarig"; }
      get data() { return player.celestials.ra.pets.effarig; }
      get requiredUnlock() { return RA_UNLOCKS.EFFARIG_UNLOCK; }
      get rawMemoryChunksPerSecond() { return Math.pow(Effarig.shardsGained, 0.1); }
      get memoryProductionMultiplier() { return 1 + player.bestGlyphLevel / 7000; }
      get color() { return "#ea8585"; }
    }(),
    enslaved: new class EnslavedRaPetState extends RaPetState {
      get name() { return "Enslaved"; }
      get data() { return player.celestials.ra.pets.enslaved; }
      get requiredUnlock() { return RA_UNLOCKS.ENSLAVED_UNLOCK; }
      get rawMemoryChunksPerSecond() { return Math.pow(player.timeShards.pLog10() / 3e5, 2); }
      get memoryProductionMultiplier() { return 1 + Math.log10(player.totalTimePlayed) / 200; }
      get color() { return "#ead584"; }
    }(),
    v: new class VRaPetState extends RaPetState {
      get name() { return "V"; }
      get data() { return player.celestials.ra.pets.v; }
      get requiredUnlock() { return RA_UNLOCKS.V_UNLOCK; }
      get rawMemoryChunksPerSecond() { return Math.pow(player.infinityPower.pLog10() / 1e7, 1.5); }
      get memoryProductionMultiplier() { return 1 + Ra.totalPetLevel / 50; }
      get color() { return "#f1aa7f"; }
    }(),
  },
  // Dev/debug function for easier testing
  reset() {
    const data = player.celestials.ra;
    data.unlockBits = 0;
    data.run = false;
    data.charged = new Set();
    data.quoteIdx = 0;
    data.disCharge = false;
    data.peakGamespeed = 1;
    for (const pet of Ra.pets.all) pet.reset();
  },
  // Scans through all glyphs and fills base resources to the maximum allowed by the cap
  // TODO update/delete this function when we get back to alchemy, it's outdated since it's not linear any more
  fillAlchemyResources() {
    for (const resource of AlchemyResources.base) {
      resource.amount = Math.min(this.alchemyResourceCap, player.bestGlyphLevel);
    }
  },
  tick(realDiff) {
    for (const pet of Ra.pets.all) pet.tick(realDiff);
  },
  productionPerMemoryChunk() {
    let res = 1;
    for (const pet of Ra.pets.all) {
      if (pet.isUnlocked) res *= pet.memoryProductionMultiplier;
    }
    return res;
  },
  requiredExpForLevel(level) {
    const adjustedLevel = level + Math.pow(level, 2) / 10;
    return Math.floor(Math.pow(adjustedLevel, 4) * 1e5);
  },
  // Calculates the cumulative exp needed for a level starting from nothing.
  // TODO mathematically optimize this once Ra exp curves and balancing are finalized
  totalExpForLevel(maxLevel) {
    let runningTotal = 0;
    for (let lv = 2; lv <= maxLevel; lv++) runningTotal += this.requiredExpForLevel(lv);
    return runningTotal;
  },
  get totalPetLevel() {
    return this.pets.all.map(pet => (pet.isUnlocked ? pet.level : 0)).sum();
  },
  checkForUnlocks() {
    for (const unl of Object.values(RA_UNLOCKS)) {
      // eslint-disable-next-line no-bitwise
      if (unl.pet.level >= unl.level && !this.has(unl)) player.celestials.ra.unlockBits |= (1 << unl.id);
    }
    if (this.totalPetLevel >= 20 && !this.has(RA_RECOLLECTION_UNLOCK)) {
      // eslint-disable-next-line no-bitwise
      player.celestials.ra.unlockBits |= (1 << RA_RECOLLECTION_UNLOCK.id);
    }
    if (this.totalPetLevel >= 80 && !this.has(RA_LAITELA_UNLOCK)) {
      // eslint-disable-next-line no-bitwise
      player.celestials.ra.unlockBits |= (1 << RA_LAITELA_UNLOCK.id);
      MatterDimension(1).amount = new Decimal(1);
    }
  },
  has(info) {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.ra.unlockBits & (1 << info.id));
  },
  startRun() {
    player.celestials.ra.run = startRealityOver() || player.celestials.ra.run;
  },
  toggleMode() {
    player.celestials.ra.activeMode = !player.celestials.ra.activeMode;
  },
  gamespeedDTMult() {
    if (!Ra.has(RA_UNLOCKS.PEAK_GAMESPEED)) return 1;
    return Math.max(Math.pow(Math.log10(player.celestials.ra.peakGamespeed) - 90, 3), 1);
  },
  // This gets widely used in lots of places since the relevant upgrade is "all forms of continuous non-dimension
  // production", which in this case is infinities, eternities, replicanti, dilated time, and time theorem generation.
  // It also includes the 1% IP time study, Teresa's 1% EP upgrade, and the charged RM generation upgrade. Note that
  // removing the hardcap of 10 may cause runaways.
  theoremBoostFactor() {
    if (!Ra.has(RA_UNLOCKS.TT_BOOST)) return 0;
    return Math.min(10, Math.max(0, player.timestudy.theorem.pLog10() - 350) / 50);
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get totalCharges() {
    return Math.min(12, Math.floor(Ra.pets.teresa.level / 2));
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.size;
  },
  get chargeUnlocked() {
    return V.has(V_UNLOCKS.RA_UNLOCK) && Ra.pets.teresa.level > 1;
  },
  get petWithRecollection() {
    return player.celestials.ra.petWithRecollection;
  },
  set petWithRecollection(name) {
    player.celestials.ra.petWithRecollection = name;
  },
  applyAlchemyReactions() {
    if (!Ra.has(RA_UNLOCKS.EFFARIG_UNLOCK)) return;
    const sortedReactions = AlchemyReactions.all
      .compact()
      .sort((r1, r2) => r2.priority - r1.priority);
    for (const reaction of sortedReactions) {
      reaction.combineReagents();
    }
  },
  updateAlchemyFlow() {
    const expAvgFactor = player.options.updateRate / 1000;
    for (const resource of AlchemyResources.all) {
      resource.flow = (1 - expAvgFactor) * resource.flow + expAvgFactor * (resource.amount - resource.before);
      resource.before = resource.amount;
    }
  },
  get alchemyResourceCap() {
    return 1000000;
  }
};

const GlyphAlteration = {
  // Adding a secondary effect to some effects
  get additionThreshold() {
    return 1e36;
  },
  // One-time massive boost of a single effect
  get empowermentThreshold() {
    return 1e43;
  },
  // Scaling boost from sacrifice quantity
  get boostingThreshold() {
    return 1e60;
  },
  getSacrificePower(type) {
    const sacPower = player.reality.glyphs.sac[type];
    if (sacPower === undefined) {
      throw new Error("Unknown sacrifice type");
    }
    return sacPower;
  },
  get isUnlocked() {
    return Ra.has(RA_UNLOCKS.ALTERED_GLYPHS);
  },
  isAdded(type) {
    return this.isUnlocked && this.getSacrificePower(type) >= this.additionThreshold;
  },
  isEmpowered(type) {
    return this.isUnlocked && this.getSacrificePower(type) >= this.empowermentThreshold;
  },
  isBoosted(type) {
    return this.isUnlocked && this.getSacrificePower(type) >= this.boostingThreshold;
  },
  sacrificeBoost(type) {
    return Math.log10(Math.max(this.getSacrificePower(type) / this.boostingThreshold, 1)) / 2;
  },
  getAdditionColor(type) {
    return this.isAdded(type)
      ? "#CCCCCC"
      : undefined;
  },
  getEmpowermentColor(type) {
    return this.isEmpowered(type)
      ? "#EEEE30"
      : undefined;
  },
  getBoostColor(type) {
    return this.isBoosted(type)
      ? "#60DDDD"
      : undefined;
  },
};

/**
 * @type {RaPetState[]}
 */
Ra.pets.all = [Ra.pets.teresa, Ra.pets.effarig, Ra.pets.enslaved, Ra.pets.v];

const RA_UNLOCKS = {
  CHARGE: {
    id: 0,
    description: "Get Teresa to level 2",
    reward: "Unlock charging of Infinity upgrades (one every 2 levels)",
    pet: Ra.pets.teresa,
    level: 2,
    displayIcon: `<span class="fas fa-infinity"></span>`
  },
  TERESA_XP: {
    id: 1,
    description: "Get Teresa to level 5",
    reward: "All memory chunks produce more memories based on RM",
    pet: Ra.pets.teresa,
    level: 5,
    displayIcon: `Δ`
  },
  AUTO_TP: {
    id: 2,
    description: "Get Teresa to level 25",
    reward: "Tachyon Particles are given immediately during dilation",
    pet: Ra.pets.teresa,
    level: 25,
    displayIcon: `<span class="fas fa-atom"></span>`
  },
  EFFARIG_UNLOCK: {
    id: 3,
    description: "Get Teresa to level 10",
    reward: "Unlock Effarig's memories",
    pet: Ra.pets.teresa,
    level: 10,
    displayIcon: `Ϙ`
  },
  PERK_SHOP_INCREASE: {
    id: 4,
    description: "Get Teresa to level 15",
    reward: "Perk shop caps are raised",
    pet: Ra.pets.teresa,
    level: 15,
    displayIcon: `<span class="fas fa-project-diagram"></span>`
  },
  ALTERED_GLYPHS: {
    id: 5,
    description: "Get Teresa to level 8",
    reward: "Unlock Altered Glyphs",
    pet: Ra.pets.teresa,
    level: 8,
    displayIcon: `<span class="fas fa-bolt"></span>`
  },
  GLYPH_ALCHEMY: {
    id: 6,
    description: "Get Effarig to level 2",
    reward: "Unlock Glyph Alchemy (one resource per level)",
    pet: Ra.pets.effarig,
    level: 2,
    displayIcon: `<span class="fas fa-vial"></span>`
  },
  EFFARIG_XP: {
    id: 7,
    description: "Get Effarig to level 5",
    reward: "All memory chunks produce more memories based on highest glyph level",
    pet: Ra.pets.effarig,
    level: 5,
    displayIcon: `<span class="fas fa-clone"></span>`
  },
  GLYPH_EFFECT_COUNT: {
    id: 8,
    description: "Get Effarig to level 8",
    reward: "Glyphs always have 4 effects (Effarig glyphs can now have more)",
    pet: Ra.pets.effarig,
    level: 8,
    displayIcon: `<span class="fas fa-braille"></span>`
  },
  ENSLAVED_UNLOCK: {
    id: 9,
    description: "Get Effarig to level 10",
    reward: "Unlock Enslaved's memories",
    pet: Ra.pets.effarig,
    level: 10,
    displayIcon: `<span class="fas fa-link"></span>`
  },
  SHARD_LEVEL_BOOST: {
    id: 10,
    description: "Get Effarig to level 15",
    reward: "Glyph level is increased based on relic shards gained",
    effect: () => 100 * Math.pow(Math.log10(Math.max(Effarig.shardsGained, 1)), 2),
    pet: Ra.pets.effarig,
    level: 15,
    displayIcon: `<span class="fas fa-fire"></span>`
  },
  AUTO_BLACK_HOLE_POWER: {
    id: 11,
    description: "Get Effarig to level 25",
    reward: "Black hole power upgrades are bought automatically",
    pet: Ra.pets.effarig,
    level: 25,
    displayIcon: `<span class="fas fa-circle"></span>`
  },
  IMPROVED_STORED_TIME: {
    id: 12,
    description: "Get Enslaved to level 2",
    reward: "Stored game time is amplified and you can store more real time (scales with level)",
    effect: {
      gameTimeAmplification: () => 1 + Math.clampMax(Ra.pets.enslaved.level, 25) / 100,
      realTimeEfficiency: () => Ra.pets.enslaved.level / 50,
      realTimeCap: () => 1000 * 3600 * (Ra.pets.enslaved.level + Math.clampMin(Ra.pets.enslaved.level - 25, 0)) / 2,
    },
    pet: Ra.pets.enslaved,
    level: 2,
    displayIcon: `<span class="fas fa-history"></span>`
  },
  ENSLAVED_XP: {
    id: 13,
    description: "Get Enslaved to level 5",
    reward: "All memory chunks produce more memories based on total time played",
    pet: Ra.pets.enslaved,
    level: 5,
    displayIcon: `<span class="fas fa-stopwatch"></span>`
  },
  ADJUSTABLE_STORED_TIME: {
    id: 14,
    description: "Get Enslaved to level 8",
    reward: "Stored game time can be rate-adjusted and automatically released",
    pet: Ra.pets.enslaved,
    level: 8,
    displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`
  },
  V_UNLOCK: {
    id: 15,
    description: "Get Enslaved to level 10",
    reward: "Unlock V's memories.",
    pet: Ra.pets.enslaved,
    level: 10,
    displayIcon: `⌬`
  },
  PEAK_GAMESPEED: {
    id: 16,
    description: "Get Enslaved to level 15",
    reward: "Gain more Dilated Time based on peak game speed in each Reality",
    pet: Ra.pets.enslaved,
    level: 15,
    displayIcon: `<span class="fas fa-tachometer-alt"></span>`
  },
  TIME_COMPRESSION: {
    id: 17,
    description: "Get Enslaved to level 25",
    reward: "Unlock Time Compression",
    pet: Ra.pets.enslaved,
    level: 25,
    displayIcon: `<span class="fas fa-compress-arrows-alt"></span>`
  },
  HARD_V: {
    id: 18,
    description: "Get V to level 8",
    reward: "Unlock more V-achievements.",
    pet: Ra.pets.v,
    level: 8,
    displayIcon: `<span class="fas fa-trophy"></span>`
  },
  V_XP: {
    id: 19,
    description: "Get V to level 5",
    reward: "All memory chunks produce more memories based on total pet level, unlock a Triad study every 5 levels",
    pet: Ra.pets.v,
    level: 5,
    displayIcon: `<span class="fas fa-book"></span>`
  },
  INSTANT_AUTOEC: {
    id: 20,
    description: "Get V to level 2",
    reward: "Auto-EC happens instantly and Dilation is unlocked automatically at 17000 Time Theorems",
    pet: Ra.pets.v,
    level: 2,
    displayIcon: `<span class="fas fa-fast-forward"></span>`
  },
  TT_BOOST: {
    id: 21,
    description: "Get V to level 10",
    reward: "Time Theorems boost all forms of continuous non-dimension production",
    effect: {
      ttGen: () => Math.pow(10, 5 * Ra.theoremBoostFactor()),
      eternity: () => Math.pow(10, 2 * Ra.theoremBoostFactor()),
      infinity: () => Math.pow(10, 15 * Ra.theoremBoostFactor()),
      replicanti: () => Math.pow(10, 20 * Ra.theoremBoostFactor()),
      dilatedTime: () => Math.pow(10, 3 * Ra.theoremBoostFactor()),
      autoPrestige: () => 1 + 2.4 * Ra.theoremBoostFactor()
    },
    pet: Ra.pets.v,
    level: 10,
    displayIcon: `<span class="fas fa-university"></span>`
  },
  TT_ACHIEVEMENT: {
    id: 22,
    description: "Get V to level 15",
    reward: "Achievement multiplier applies to Time Theorem generation",
    effect: () => Achievements.power,
    pet: Ra.pets.v,
    level: 15,
    displayIcon: `<span class="fas fa-graduation-cap"></span>`
  },
  AUTO_REALITY_UPGRADES: {
    id: 23,
    description: "Get V to level 25",
    reward: "The rebuyable reality upgrades are bought automatically",
    pet: Ra.pets.v,
    level: 25,
    displayIcon: `<span class="fas fa-sync-alt"></span>`
  }
};

const RA_RECOLLECTION_UNLOCK = {
  id: 25,
  description: "Get 20 total celestial levels",
  reward: "Unlock Recollection",
};

const RA_LAITELA_UNLOCK = {
  id: 24,
  description: "Get 80 total celestial levels",
  reward: "Unlock Lai'tela, the Celestial of Dimensions",
};
