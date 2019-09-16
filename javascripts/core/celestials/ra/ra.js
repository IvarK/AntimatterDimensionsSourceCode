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

  // The point of adjustedLevel is to effectively make the level used for the exp calculation scale upward like
  //    1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, ... , 50
  // or in other words, every 5 levels the increase-per-level in effective level increases by +1.  This increase
  // in scaling stops at level 20 because memories effectively get hardcapped via the glyph level hardcap there.
  get requiredExp() {
    if (this.level < 20) {
      const floor5 = Math.floor(this.level / 5);
      const adjustedLevel = 2.5 * floor5 * (floor5 + 1) + (this.level % 5) * (floor5 + 1);
      return Math.floor(4000 * Math.pow(1.18, adjustedLevel - 1));
    }
    if (this.level < 25) {
      return Math.floor(4000 * Math.pow(1.18, this.level + 30));
    }
    return Math.floor(4000 * Math.pow(1.18, 7 * this.level - 120));
  }

  addGainedExp(multiplier) {
    if (!this.isUnlocked) return;
    this.addExp(this.gainedExp * multiplier);
  }

  get baseExp() {
    return Math.pow(2, gainedGlyphLevel().actualLevel / 500 - 10);
  }

  get gainedExp() {
    return this.baseExp * this.expBoost;
  }

  get expBoost() {
    if (!this.isUnlocked) return 0;
    return this.expFormula(this.expBoostFactor);
  }

  get nextExpBoost() {
    if (!this.isUnlocked) return 0;
    return this.expFormula(this.nextExpBoostFactor);
  }

  /**
   * @abstract
   */
  get expBoostFactor() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set expBoostFactor(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get defaultBoostFactor() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get nextExpBoostFactor() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get color() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  expFormula(factor) { throw new NotImplementedError(); }

  updateExpBoost() {
    if (this.level < 3) return;
    this.expBoostFactor = this.nextExpBoostFactor;
  }

  addExp(exp) {
    this.exp += exp;
    while (this.exp >= this.requiredExp) {
      this.exp -= this.requiredExp;
      this.level++;
      GameUI.notify.success(`${this.name} has leveled up to level ${this.level}!`);
    }
  }

  reset() {
    this.data.level = 1;
    this.data.exp = 0;
    this.expBoostFactor = this.defaultBoostFactor;
  }
}

const Ra = {
  pets: {
    teresa: new class TeresaRaPetState extends RaPetState {
      get name() { return "Teresa"; }
      get data() { return player.celestials.ra.pets.teresa; }
      get requiredUnlock() { return undefined; }
      get expBoostFactor() { return this.data.lastEPGained; }
      set expBoostFactor(value) { this.data.lastEPGained = value; }
      get defaultBoostFactor() { return new Decimal(0); }
      get nextExpBoostFactor() { return new Decimal(player.eternityPoints); }
      get color() { return "#86ea84"; }

      expFormula(ep) {
        return Math.max(ep.log10() / 7e3, 1);
      }
    }(),
    effarig: new class EffarigRaPetState extends RaPetState {
      get name() { return "Effarig"; }
      get data() { return player.celestials.ra.pets.effarig; }
      get requiredUnlock() { return RA_UNLOCKS.EFFARIG_UNLOCK; }
      get expBoostFactor() { return this.data.lastGlyphCount; }
      set expBoostFactor(value) { this.data.lastGlyphCount = value; }
      get defaultBoostFactor() { return 5; }
      get nextExpBoostFactor() { return Glyphs.activeList.length; }
      get color() { return "#ea8585"; }

      expFormula(glyphCount) {
        return Math.pow(1.3, 5 - glyphCount);
      }
    }(),
    enslaved: new class EnslavedRaPetState extends RaPetState {
      get name() { return "Enslaved"; }
      get data() { return player.celestials.ra.pets.enslaved; }
      get requiredUnlock() { return RA_UNLOCKS.ENSLAVED_UNLOCK; }
      get expBoostFactor() { return this.data.lastTimeTaken; }
      set expBoostFactor(value) { this.data.lastTimeTaken = value; }
      get defaultBoostFactor() { return Number.MAX_VALUE; }
      get nextExpBoostFactor() { return player.thisReality; }
      get color() { return "#ead584"; }

      expFormula(milliseconds) {
        const seconds = TimeSpan.fromMilliseconds(milliseconds).totalSeconds;
        // This curve is 2x at 100, very steep below that (up to 10x at 1) and very shallow to 1x at 1e102
        return seconds < 100
          ? 40 / (4 + Math.max(0, Math.pow(Math.log10(seconds), 4)))
          : Math.max(1, 2.02 - Math.log10(seconds) / 100);
      }
    }(),
    v: new class VRaPetState extends RaPetState {
      get name() { return "V"; }
      get data() { return player.celestials.ra.pets.v; }
      get requiredUnlock() { return RA_UNLOCKS.V_UNLOCK; }
      get expBoostFactor() { return this.data.lastTTPurchased; }
      set expBoostFactor(value) { this.data.lastTTPurchased = value; }
      get defaultBoostFactor() { return 0; }
      get nextExpBoostFactor() { return TimeTheorems.totalPurchased(); }
      get color() { return "#f1aa7f"; }

      expFormula(theoremCount) {
        return Math.max(1, Math.pow(theoremCount / 50000, 0.9));
      }
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
  fillAlchemyResources() {
    const maxLevel = player.reality.glyphs.active
      .concat(player.reality.glyphs.inventory)
      .map(g => g.level)
      .max();
    for (const resource of AlchemyResources.base) {
      resource.amount = maxLevel;
    }
  },
  giveExp(multiplier) {
    for (const pet of Ra.pets.all) pet.addGainedExp(multiplier);
    this.checkForUnlocks();
  },
  checkForUnlocks() {
    for (const unl of Object.values(RA_UNLOCKS)) {
      // eslint-disable-next-line no-bitwise
      if (unl.pet.level >= unl.level && !this.has(unl)) player.celestials.ra.unlockBits |= (1 << unl.id);
    }
    if (this.pets.all.every(pet => pet.level >= 20) && !this.has(RA_LAITELA_UNLOCK)) {
      // eslint-disable-next-line no-bitwise
      player.celestials.ra.unlockBits |= (1 << 24);
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
  updateExpBoosts() {
    for (const pet of Ra.pets.all) pet.updateExpBoost();
  },
  gamespeedDTMult() {
    if (!Ra.has(RA_UNLOCKS.PEAK_GAMESPEED)) return 1;
    return Math.max(Math.pow(Math.log10(player.celestials.ra.peakGamespeed) - 90, 3), 1);
  },
  // This gets widely used in lots of places since the relevant upgrade is "all forms of continuous non-dimension
  // production", which in this case is infinities, eternities, replicanti, dilated time, and time theorem generation.
  // It also includes the 1% IP time study, Teresa's 1% EP upgrade, and the charged RM generation upgrade. Note that
  // removing the hardcap of 10 may cause runaways.
  // It's almost certainly going to need to be rebalanced here after testing earlier Ra.
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
    return V.has(V_UNLOCKS.RUN_UNLOCK_THRESHOLDS[1]) && Ra.pets.teresa.level > 1;
  }
};

const GlyphAlteration = {
  // Adding a secondary effect to some effects
  get additionThreshold() {
    return 1e40;
  },
  // One-time massive boost of a single effect
  get empowermentThreshold() {
    return 1e45;
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
Ra.pets.all = Object.values(Ra.pets);

const RA_UNLOCKS = {
  CHARGE: {
    id: 0,
    description: "Get Teresa to level 2",
    reward: "Unlock charging of Infinity upgrades",
    pet: Ra.pets.teresa,
    level: 2
  },
  TERESA_XP: {
    id: 1,
    description: "Get Teresa to level 3",
    reward: "Unlock Ra's Reality, boost Teresa memory gain based on EP reached in Ra's Reality",
    pet: Ra.pets.teresa,
    level: 3
  },
  EFFARIG_UNLOCK: {
    id: 2,
    description: "Get Teresa to level 5",
    reward: "Unlock Effarig memories",
    pet: Ra.pets.teresa,
    level: 5
  },
  AUTO_TP: {
    id: 3,
    description: "Get Teresa to level 10",
    reward: "Tachyon Particles are given immediately during dilation",
    pet: Ra.pets.teresa,
    level: 10
  },
  PERK_SHOP_INCREASE: {
    id: 4,
    description: "Get Teresa to level 15",
    reward: "Perk shop caps are raised",
    pet: Ra.pets.teresa,
    level: 15
  },
  ALTERED_GLYPHS: {
    id: 5,
    description: "Get Teresa to level 25",
    reward: "Unlock Altered Glyphs",
    pet: Ra.pets.teresa,
    level: 25
  },
  IMPROVED_GLYPHS: {
    id: 6,
    description: "Get Effarig to level 2",
    reward: "Glyph rarity is increased and you gain more glyph choices",
    effect: {
      rarity: () => Ra.pets.effarig.level,
      choice: () => Math.floor(Ra.pets.effarig.level / 5),
    },
    pet: Ra.pets.effarig,
    level: 2
  },
  EFFARIG_XP: {
    id: 7,
    description: "Get Effarig to level 3",
    reward: "Boost Effarig memory gain based on glyph count in Ra's Reality, less glyphs means higher boost",
    pet: Ra.pets.effarig,
    level: 3
  },
  ENSLAVED_UNLOCK: {
    id: 8,
    description: "Get Effarig to level 5",
    reward: "Unlock Enslaved memories",
    pet: Ra.pets.effarig,
    level: 5
  },
  GLYPH_EFFECT_COUNT: {
    id: 9,
    description: "Get Effarig to level 10",
    reward: "Glyphs always have 4 effects (Effarig glyphs can now have more)",
    pet: Ra.pets.effarig,
    level: 10
  },
  SHARD_LEVEL_BOOST: {
    id: 10,
    description: "Get Effarig to level 15",
    reward: "Glyph level is increased based on relic shards gained",
    effect: () => Math.pow(Math.log10(Math.max(Effarig.shardsGained, 1)), 2),
    pet: Ra.pets.effarig,
    level: 15
  },
  GLYPH_ALCHEMY: {
    id: 11,
    description: "Get Effarig to level 25",
    reward: "Unlock Glyph Alchemy",
    pet: Ra.pets.effarig,
    level: 25
  },
  IMPROVED_STORED_TIME: {
    id: 12,
    description: "Get Enslaved to level 2",
    reward: "Stored game time is amplified and stored real time is more efficient",
    effect: {
      gameTimeAmplification: () => 1 + Math.clampMax(Ra.pets.enslaved.level, 25) / 100,
      realTimeEfficiency: () => Ra.pets.enslaved.level / 50,
      realTimeCap: () => 1000 * 3600 * (Ra.pets.enslaved.level + Math.clampMin(Ra.pets.enslaved.level - 25, 0)) / 2,
    },
    pet: Ra.pets.enslaved,
    level: 2
  },
  ENSLAVED_XP: {
    id: 13,
    description: "Get Enslaved to level 3",
    reward: "Boost Enslaved memory gain based on game time in Ra's Reality, lower time means higher boost",
    pet: Ra.pets.enslaved,
    level: 3
  },
  V_UNLOCK: {
    id: 14,
    description: "Get Enslaved to level 5",
    reward: "Unlock V memories",
    pet: Ra.pets.enslaved,
    level: 5
  },
  ADJUSTABLE_STORED_TIME: {
    id: 15,
    description: "Get Enslaved to level 10",
    reward: "Stored game time can be rate-adjusted and automatically released",
    pet: Ra.pets.enslaved,
    level: 10
  },
  PEAK_GAMESPEED: {
    id: 16,
    description: "Get Enslaved to level 15",
    reward: "Gain more dilated time based on peak game speed in each Reality",
    pet: Ra.pets.enslaved,
    level: 15
  },
  TIME_COMPRESSION: {
    id: 17,
    description: "Get Enslaved to level 25",
    reward: "Unlock Time Compression",
    pet: Ra.pets.enslaved,
    level: 25
  },
  MORE_ACHIEVEMENT: {
    id: 18,
    description: "Get V to level 2",
    reward: "Gain extra achievements for free (based on V level)",
    pet: Ra.pets.v,
    level: 2
  },
  V_XP: {
    id: 19,
    description: "Get V to level 3",
    reward: "Boost V memory gain based on purchased TT in Ra's Reality",
    pet: Ra.pets.v,
    level: 3
  },
  INSTANT_AUTOEC: {
    id: 20,
    description: "Get V to level 5",
    // This upgrade also starts the player off with Eternity upgrades immediately instead of after one eternity
    reward: "Auto-EC happens instantly and dilation is auto-unlocked at 17000 TT",
    pet: Ra.pets.v,
    level: 5
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
    level: 10
  },
  TT_ACHIEVEMENT: {
    id: 22,
    description: "Get V to level 15",
    reward: "Achievement multiplier applies to Time Theorem generation",
    effect: () => Player.achievementPower.toNumber(),
    pet: Ra.pets.v,
    level: 15
  },
  SPACE_THEOREMS: {
    id: 23,
    description: "Get V to level 25",
    reward: "Unlock Space Theorems [unimplemented]",
    pet: Ra.pets.v,
    level: 25
  }
};

const RA_LAITELA_UNLOCK = {
  id: 24,
  description: "Get all celestials to level 20",
  reward: "Unlock Lai'tela, the Celestial of Dimensions",
};
