"use strict";

class RaPetState {
  /**
   * @abstract
   */
  get data() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  get name() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  get requiredUnlock() { throw NotImplementedCrash(); }

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
    return Math.floor(4000 * Math.pow(1.18, 4 * this.level - 30));
  }

  addGainedExp() {
    if (!this.isUnlocked) return;
    this.addExp(this.gainedExp * (1 + simulatedRealityCount(false)));
  }

  get gainedExp() {
    const baseExp = Math.pow(2, gainedGlyphLevel().actualLevel / 500 - 10);
    return baseExp * this.expBoost;
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
  get expBoostFactor() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  set expBoostFactor(value) { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  get defaultBoostFactor() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  get nextExpBoostFactor() { throw NotImplementedCrash(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  expFormula(factor) { throw NotImplementedCrash(); }

  updateExpBoost() {
    if (this.level < 3) return;
    this.expBoostFactor = this.nextExpBoostFactor;
  }

  addExp(exp) {
    this.exp += exp;
    while (this.exp > this.requiredExp) {
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

      expFormula(theoremCount) {
        return Math.max(1, Math.pow(theoremCount / 50000, 0.9));
      }
    }()
  },
  // Dev/debug function for easier testing
  reset() {
    const data = player.celestials.ra;
    data.unlocks = [];
    data.run = false;
    data.charged = new Set();
    data.quoteIdx = 0;
    data.disCharge = false;
    data.peakGamespeed = 1;
    for (const pet of Ra.petList) pet.reset();
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
  giveExp() {
    for (const pet of Ra.petList) pet.addGainedExp();
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
    player.celestials.ra.run = startRealityOver() || player.celestials.ra.run;
  },
  toggleMode() {
    player.celestials.ra.activeMode = !player.celestials.ra.activeMode;
  },
  updateExpBoosts() {
    for (const pet of Ra.petList) pet.updateExpBoost();
  },
  gamespeedDTMult() {
    if (!Ra.has(RA_UNLOCKS.PEAK_GAMESPEED)) return 1;
    return Math.max(Math.pow(Math.log10(player.celestials.ra.peakGamespeed) - 90, 3), 1);
  },
  // In some sense we're cheating here for the sake of balance since gamespeed has historically been hard to keep
  // under wraps.  So the way we buff gamespeed in a relatively controlled way here is by manually calculating a
  // sensible "maximum possible gamespeed" on top of the CURRENT black hole power based on a game state which is
  // slightly farther than the player will be when first unlocking this upgrade (hence the "magic numbers").  The
  // state in question is one with a glyph set with two time glyphs and effarig gamespeed pow + achievement pow
  // (due to V), all level 10k with celestial rarity, and Lv20 Enslaved + all achievements.  The boost is simply 2x
  // for any stored time at all if it's below this threshold, but will start scaling up at gamespeeds higher than this.
  // It should be a lot harder for this to cause an unchecked runaway since black hole scaling won't feed into this
  // upgrade's scaling.  There is also an eventual softcap of 1e10 just in case.  If I did the math correctly, the
  // speed boost should scale with (real time)^(effarig gamespeed pow) before the softcap and worse than that after.
  gamespeedStoredTimeMult() {
    let assumedBlackHoleBoost = 1;
    for (const blackHole of BlackHoles.list) {
      assumedBlackHoleBoost *= blackHole.power;
      assumedBlackHoleBoost *= Math.pow(GameDatabase.achievements.normal.length, 2.69);
    }
    const assumedTimeGlyphBoost = Math.pow(2.79, 2);
    const baselineGamespeed = Math.pow(assumedBlackHoleBoost * assumedTimeGlyphBoost, 1.22);
    const baselineStoredTime = Math.pow(baselineGamespeed, 1.2);
    const scaledStoredTime = player.celestials.enslaved.stored / baselineStoredTime;
    if (player.celestials.enslaved.stored === 0) return 1;
    const softcap = 1e10;
    if (scaledStoredTime > softcap) {
      return softcap * Math.pow(10, Math.pow(Math.log10(scaledStoredTime / softcap), 0.4));
    }
    return Math.max(2, scaledStoredTime);
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

/**
 * @type {RaPetState[]}
 */
Ra.petList = Object.values(Ra.pets);

const RA_UNLOCKS = {
  CHARGE: {
    id: 0,
    description: "Get Teresa to level 2",
    reward: "Unlock charging of Infinity upgrades",
    requirement: () => Ra.pets.teresa.level >= 2,
    pet: "Teresa",
    level: 2
  },
  TERESA_XP: {
    id: 1,
    description: "Get Teresa to level 3",
    reward: "Unlock Ra's Reality, boost Teresa memory gain based on EP reached",
    requirement: () => Ra.pets.teresa.level >= 3,
    pet: "Teresa",
    level: 3
  },
  EFFARIG_UNLOCK: {
    id: 2,
    description: "Get Teresa to level 5",
    reward: "Unlock Effarig memories",
    requirement: () => Ra.pets.teresa.level >= 5,
    pet: "Teresa",
    level: 2
  },
  AUTO_TP: {
    id: 3,
    description: "Get Teresa to level 10",
    reward: "Tachyon Particles are given immediately during dilation",
    requirement: () => Ra.pets.teresa.level >= 10,
    pet: "Teresa",
    level: 10
  },
  PERK_SHOP_INCREASE: {
    id: 4,
    description: "Get Teresa to level 15",
    reward: "Perk shop caps are raised",
    requirement: () => Ra.pets.teresa.level >= 15,
    pet: "Teresa",
    level: 15
  },
  LATER_DILATION: {
    id: 5,
    description: "Get Teresa to level 25",
    reward: "Unlock more dilation upgrades [unimplemented]",
    requirement: () => Ra.pets.teresa.level >= 25,
    pet: "Teresa",
    level: 25
  },
  IMPROVED_GLYPHS: {
    id: 6,
    description: "Get Effarig to level 2",
    reward: "Glyph rarity is increased and you gain more glyph choices",
    requirement: () => Ra.pets.effarig.level >= 2,
    effect: {
      rarity: () => Ra.pets.effarig.level,
      choice: () => Math.floor(Ra.pets.effarig.level / 5),
    },
    pet: "Effarig",
    level: 2
  },
  EFFARIG_XP: {
    id: 7,
    description: "Get Effarig to level 3",
    reward: "Boost Effarig memory gain based on glyph count in Ra's Reality",
    requirement: () => Ra.pets.effarig.level >= 3,
    pet: "Effarig",
    level: 3
  },
  ENSLAVED_UNLOCK: {
    id: 8,
    description: "Get Effarig to level 5",
    reward: "Unlock Enslaved memories",
    requirement: () => Ra.pets.effarig.level >= 5,
    pet: "Effarig",
    level: 5
  },
  GLYPH_EFFECT_COUNT: {
    id: 9,
    description: "Get Effarig to level 10",
    reward: "Glyphs always have 4 effects (Effarig glyphs can now have more)",
    requirement: () => Ra.pets.effarig.level >= 10,
    pet: "Effarig",
    level: 10
  },
  SHARD_LEVEL_BOOST: {
    id: 10,
    description: "Get Effarig to level 15",
    reward: "Glyph level is increased based on relic shards gained",
    requirement: () => Ra.pets.effarig.level >= 15,
    effect: () => Math.pow(Math.log10(Math.max(Effarig.shardsGained, 1)), 2),
    pet: "Effarig",
    level: 15
  },
  GLYPH_ALCHEMY: {
    id: 11,
    description: "Get Effarig to level 25",
    reward: "Unlock Glyph Alchemy",
    requirement: () => Ra.pets.effarig.level >= 25,
    pet: "Effarig",
    level: 25
  },
  IMPROVED_STORED_TIME: {
    id: 12,
    description: "Get Enslaved to level 2",
    reward: "Stored game time is amplified and stored real time is more efficient",
    requirement: () => Ra.pets.enslaved.level >= 2,
    effect: {
      gameTimeAmplification: () => 1 + Math.clampMax(Ra.pets.enslaved.level, 25) / 100,
      realTimeEfficiency: () => Ra.pets.enslaved.level / 50,
      realTimeCap: () => 1000 * 3600 * (Ra.pets.enslaved.level + Math.clampMin(Ra.pets.enslaved.level - 25, 0)) / 2,
    },
    pet: "Enslaved",
    level: 2
  },
  ENSLAVED_XP: {
    id: 13,
    description: "Get Enslaved to level 3",
    reward: "Boost Enslaved memory gain based on game time in Ra's Reality",
    requirement: () => Ra.pets.enslaved.level >= 3,
    pet: "Enslaved",
    level: 3
  },
  V_UNLOCK: {
    id: 14,
    description: "Get Enslaved to level 5",
    reward: "Unlock V memories",
    requirement: () => Ra.pets.enslaved.level >= 5,
    pet: "Enslaved",
    level: 5
  },
  ADJUSTABLE_STORED_TIME: {
    id: 15,
    description: "Get Enslaved to level 10",
    reward: "Stored game time can be rate-adjusted and automatically released",
    requirement: () => Ra.pets.enslaved.level >= 10,
    pet: "Enslaved",
    level: 10
  },
  PEAK_GAMESPEED: {
    id: 16,
    description: "Get Enslaved to level 15",
    reward: "Gain more dilated time based on peak game speed in each Reality",
    requirement: () => Ra.pets.enslaved.level >= 15,
    pet: "Enslaved",
    level: 15
  },
  GAMESPEED_BOOST: {
    id: 17,
    description: "Get Enslaved to level 25",
    reward: "Game speed increases based on current stored time",
    requirement: () => Ra.pets.enslaved.level >= 25,
    pet: "Enslaved",
    level: 25
  },
  MORE_EC_COMPLETION: {
    id: 18,
    description: "Get V to level 2",
    reward: "Gain extra achievements for free (based on V level)",
    requirement: () => Ra.pets.v.level >= 2,
    pet: "V",
    level: 2
  },
  V_XP: {
    id: 19,
    description: "Get V to level 3",
    reward: "Boost V memory gain based on purchased TT in Ra's Reality",
    requirement: () => Ra.pets.v.level >= 3,
    pet: "V",
    level: 3
  },
  INSTANT_AUTOEC: {
    id: 20,
    description: "Get V to level 5",
    // This upgrade also starts the player off with Eternity upgrades immediately instead of after one eternity
    reward: "Auto-EC happens instantly and dilation is auto-unlocked at 17000 TT",
    requirement: () => Ra.pets.v.level >= 5,
    pet: "V",
    level: 5
  },
  TT_BOOST: {
    id: 21,
    description: "Get V to level 10",
    reward: "Time Theorems boost all forms of continuous non-dimension production",
    requirement: () => Ra.pets.v.level >= 10,
    effect: {
      ttGen: () => Math.pow(10, 5 * Ra.theoremBoostFactor()),
      eternity: () => Math.pow(10, 2 * Ra.theoremBoostFactor()),
      infinity: () => Math.pow(10, 15 * Ra.theoremBoostFactor()),
      replicanti: () => Math.pow(10, 20 * Ra.theoremBoostFactor()),
      dilatedTime: () => Math.pow(10, 3 * Ra.theoremBoostFactor()),
      autoPrestige: () => 1 + 2.4 * Ra.theoremBoostFactor()
    },
    pet: "V",
    level: 10
  },
  MORE_EC: {
    id: 22,
    description: "Get V to level 15",
    reward: "ECs can now be completed up to 7 times [unimplemented, needs balancing?]",
    requirement: () => Ra.pets.v.level >= 15,
    pet: "V",
    level: 15
  },
  SPACE_THEOREMS: {
    id: 23,
    description: "Get V to level 25",
    reward: "Unlock Space Theorems [unimplemented]",
    requirement: () => Ra.pets.v.level >= 25,
    pet: "V",
    level: 25
  },
  LAITELA_UNLOCK: {
    id: 24,
    description: "Get all celestials to level 20",
    reward: "Unlock Lai'tela, the Celestial of Dimensions",
    requirement: () => Ra.petList.every(pet => pet.level >= 20),
    onObtaining: () => MatterDimension(1).amount = new Decimal(1),
  }
};
