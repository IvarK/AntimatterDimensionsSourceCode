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

  get requiredExp() {
    return Ra.requiredExpForLevel(this.level);
  }

  /**
   * @abstract
   */
  get color() { throw new NotImplementedError(); }
  
  get memoriesPerSecond() {
    return -1;
  }
  
  get hasRecollection() {
    return Ra.petWithRecollection === this.name;
  }

  addExp(baseExp) {
    this.exp += baseExp * this.memoryProductionMultiplier * Ra.globalMemoryMult;
    while (this.exp >= this.requiredExp) {
      this.exp -= this.requiredExp;
      this.level++;
      // TODO Change this once we have a proper fix for things happening before the UI is initialized
      if (GameUI.initialized) {
        GameUI.notify.success(`${this.name} has leveled up to level ${this.level}!`);
      }
      // All Ra unlocks require a pet to gain a level so it suffices to do this here.
      Ra.checkForUnlocks();
    }
  }

  reset() {
    this.data.level = 1;
    this.data.exp = 0;
  }
}

const Ra = {
  pets: {
    teresa: new class TeresaRaPetState extends RaPetState {
      get name() { return "Teresa"; }
      get data() { return player.celestials.ra.pets.teresa; }
      get requiredUnlock() { return undefined; }
      get color() { return "#86ea84"; }
      get memoryProductionMultiplier() {
        return Ra.has(RA_UNLOCKS.TERESA_XP)
          ? 1 + Math.pow(player.reality.realityMachines.pLog10() / 100, 0.5)
          : 1;
      }

      // Ra-Teresa: memoryResource gets incremented instead of TT when buying with antimatter
      addMemories() {
        this.addExp(player.celestials.ra.memoryResource);
        player.celestials.ra.memoryResource = 0;
      }
    }(),
    effarig: new class EffarigRaPetState extends RaPetState {
      get name() { return "Effarig"; }
      get data() { return player.celestials.ra.pets.effarig; }
      get requiredUnlock() { return RA_UNLOCKS.EFFARIG_UNLOCK; }
      get color() { return "#ea8585"; }
      get memoryProductionMultiplier() {
        return Ra.has(RA_UNLOCKS.EFFARIG_XP)
          ? 1 + player.bestGlyphLevel / 7000
          : 1;
      }

      // Ra-Effarig: Adds memory on glyph sacrifice (which is forced every time)
      addMemories(sacrificeValue) {
        this.addExp(Math.pow(Math.log10(sacrificeValue), 2.6));
      }
    }(),
    enslaved: new class EnslavedRaPetState extends RaPetState {
      get name() { return "Enslaved"; }
      get data() { return player.celestials.ra.pets.enslaved; }
      get requiredUnlock() { return RA_UNLOCKS.ENSLAVED_UNLOCK; }
      get color() { return "#f1aa7f"; }
      get memoryProductionMultiplier() {
        return Ra.has(RA_UNLOCKS.ENSLAVED_XP)
          ? 1 + Math.log10(player.totalTimePlayed) / 200
          : 1;
      }

      // Ra-Enslaved: Passively gives memories while inside the reality, based on time shards
      addMemories(realDiff) {
        const seconds = realDiff / 1000;
        this.addExp(seconds * player.timeShards.pLog10() / 10);
      }
    }(),
    v: new class VRaPetState extends RaPetState {
      get name() { return "V"; }
      get data() { return player.celestials.ra.pets.v; }
      get requiredUnlock() { return RA_UNLOCKS.V_UNLOCK; }
      get color() { return "#ead584"; }
      get memoryProductionMultiplier() {
        return Ra.has(RA_UNLOCKS.V_XP)
          ? 1 + Ra.totalPetLevel / 50
          : 1;
      }

      // Ra-V: Always passively gives memories based on record amounts of certain things
      addMemories(realDiff) {
        const seconds = realDiff / 1000;
        const records = player.celestials.ra.vRecords;
        const EPterm = 1 + (records.eternityPoints.pLog10() - 10000) / 1000;
        const levelTerm = 1 + (records.glyphLevel - 6000) / 500;
        const dilatedTerm = 1 + (records.dilatedAntimatter.pLog10() - 1e8) / 3e7;
        const infTerm = 1 + (records.infinities.pLog10() - 300) / 50;
        const allTerms = [EPterm, levelTerm, dilatedTerm, infTerm];

        // Combining all terms in quadrature makes sure they're all relevant, but don't let the player "cheat" with
        // really low values which end up being scaled to negative
        if (allTerms.some(term => term < 0)) return;
        const combinedValue = Math.sqrt(allTerms.reduce((total, value) => total + Math.pow(value, 2), 0));
        this.addExp(seconds * 5000 * combinedValue);
      }
    }(),
  },
  // Dev/debug function for easier testing
  reset() {
    const data = player.celestials.ra;
    data.unlockBits = 0;
    data.run = false;
    data.charged = new Set();
    data.disCharge = false;
    data.peakGamespeed = 1;
    for (const pet of Ra.pets.all) pet.reset();
    data.memoryResource = 0;
    data.vRecords = {
      eternityPoints: new Decimal(0),
      glyphLevel: 0,
      dilatedAntimatter: new Decimal(0),
      infinities: new Decimal(0),
    };
    player.celestials.ra.activeReality = RA_REALITY_TYPE.NONE;
  },
  // Scans through all glyphs and fills base resources to the specified amount, ignoring caps
  fillAlchemyResources(amount) {
    for (const resource of AlchemyResources.base) {
      resource.amount = Math.max(this.alchemyResourceCap, amount);
    }
  },
  get globalMemoryMult() {
    return RA_UNLOCKS.TT_BOOST.effect.memories() * Achievement(168).effectOrDefault(1);
  },
  tickAllPets(realDiff) {
    // V memories generate passively, even outside the reality
    Ra.pets.v.addMemories(realDiff);
    if (!Ra.isRunning) return;

    switch (player.celestials.ra.activeReality) {
      case RA_REALITY_TYPE.TERESA: {
        Ra.pets.teresa.addMemories();
        const totalGalaxies = Replicanti.galaxies.total + player.galaxies + player.dilation.freeGalaxies;
        if (totalGalaxies >= 2000) resetReality(true);
        break;
      }
      case RA_REALITY_TYPE.EFFARIG:
        // Memory gain happens on-sacrifice when completing the reality
        break;
      case RA_REALITY_TYPE.ENSLAVED:
        Ra.pets.enslaved.addMemories(realDiff);
        break;
      case RA_REALITY_TYPE.V: {
        const records = player.celestials.ra.vRecords;
        records.eternityPoints = player.eternityPoints.clampMin(records.eternityPoints);
        records.glyphLevel = Math.clampMin(records.glyphLevel, gainedGlyphLevel().actualLevel);
        if (player.dilation.active) records.dilatedAntimatter = player.antimatter.clampMin(records.dilatedAntimatter);
        records.infinities = player.infinitied.clampMin(records.infinities);
        break;
      }
    }
  },
  // This is the exp required ON "level" in order to reach "level + 1"
  requiredExpForLevel(level) {
    if (level >= 25) return Infinity;
    return Math.floor(1e7 + 1e6 * Math.pow(level - 1, 3));
  },
  // Calculates the cumulative exp needed to REACH a level starting from nothing.
  // TODO mathematically optimize this once Ra exp curves and balancing are finalized
  totalExpForLevel(maxLevel) {
    let runningTotal = 0;
    for (let lv = 1; lv < maxLevel; lv++) runningTotal += this.requiredExpForLevel(lv);
    return runningTotal;
  },
  get totalPetLevel() {
    return this.pets.all.map(pet => (pet.isUnlocked ? pet.level : 0)).sum();
  },
  checkForUnlocks() {
    if (!V.has(V_UNLOCKS.RA_UNLOCK)) return;
    for (const unl of Object.values(RA_UNLOCKS)) {
      const isUnlockable = unl.totalLevels === undefined
        ? unl.pet.isUnlocked && unl.pet.level >= unl.level
        : this.totalPetLevel >= unl.totalLevels;
      if (isUnlockable && !this.has(unl)) {
        // eslint-disable-next-line no-bitwise
        player.celestials.ra.unlockBits |= (1 << unl.id);
        if (unl.id === RA_UNLOCKS.ALWAYS_GAMESPEED.id) {
          const allGlyphs = player.reality.glyphs.active
            .concat(player.reality.glyphs.inventory);
          for (const glyph of allGlyphs) {
            Glyphs.applyGamespeed(glyph);
          }
        }
        if (unl.id === RA_UNLOCKS.RA_LAITELA_UNLOCK.id) {
          MatterDimension(1).amount = new Decimal(1);
        }
      }
    }
  },
  has(info) {
    // eslint-disable-next-line no-bitwise
    return Boolean(player.celestials.ra.unlockBits & (1 << info.id));
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.ra.run = true;
    player.celestials.ra.memoryResource = 0;
    switch (this.petWithRecollection) {
      case "Teresa":
        player.celestials.ra.activeReality = RA_REALITY_TYPE.TERESA;
        break;
      case "Effarig":
        player.celestials.ra.activeReality = RA_REALITY_TYPE.EFFARIG;
        if (Glyphs.active.countWhere(g => g && g.type === "effarig") !== 0) respecGlyphs();
        recalculateAllGlyphs();
        break;
      case "Enslaved":
        player.celestials.ra.activeReality = RA_REALITY_TYPE.ENSLAVED;
        break;
      case "V":
        player.celestials.ra.activeReality = RA_REALITY_TYPE.V;
        break;
      default:
        player.celestials.ra.activeReality = RA_REALITY_TYPE.NONE;
        break;
    }
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
  get teresaRealityActive() {
    return player.celestials.ra.activeReality === RA_REALITY_TYPE.TERESA;
  },
  get effarigRealityActive() {
    return player.celestials.ra.activeReality === RA_REALITY_TYPE.EFFARIG;
  },
  get enslavedRealityActive() {
    return player.celestials.ra.activeReality === RA_REALITY_TYPE.ENSLAVED;
  },
  get vRealityActive() {
    return player.celestials.ra.activeReality === RA_REALITY_TYPE.V;
  },
  enslavedSlowdownFactor(ep) {
    return Math.pow(10, Math.pow(ep.pLog10(), 0.75));
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
  AUTO_TP: {
    id: 0,
    description: "Unlock Teresa",
    reward: "Tachyon Particles are given immediately when Time Dilation is active",
    pet: Ra.pets.teresa,
    level: 1,
    displayIcon: `<span class="fas fa-atom"></span>`
  },
  CHARGE: {
    id: 1,
    description: "Get Teresa to level 2",
    reward: () => `Unlock charging of Infinity upgrades (one every ${formatInt(2)} levels)`,
    pet: Ra.pets.teresa,
    level: 2,
    displayIcon: `<span class="fas fa-infinity"></span>`
  },
  TERESA_XP: {
    id: 2,
    description: "Get Teresa to level 5",
    reward: "All Celestials produce more memories based on RM",
    pet: Ra.pets.teresa,
    level: 5,
    displayIcon: `Δ`
  },
  ALTERED_GLYPHS: {
    id: 3,
    description: "Get Teresa to level 8",
    reward: "Unlock Altered Glyphs (effects improved based on glyph sacrifice; see Glyphs tab)",
    pet: Ra.pets.teresa,
    level: 8,
    displayIcon: `<span class="fas fa-bolt"></span>`
  },
  EFFARIG_UNLOCK: {
    id: 4,
    description: "Get Teresa to level 10",
    reward: "Unlock Effarig's memories",
    pet: Ra.pets.teresa,
    level: 10,
    displayIcon: `Ϙ`
  },
  PERK_SHOP_INCREASE: {
    id: 5,
    description: "Get Teresa to level 15",
    reward: "Perk shop caps are raised",
    pet: Ra.pets.teresa,
    level: 15,
    displayIcon: `<span class="fas fa-project-diagram"></span>`
  },
  START_TP: {
    id: 6,
    description: "Get Teresa to level 25",
    reward: `When unlocking Time Dilation in non-celestial Realities, gain TP as if you reached the square root
      of your total antimatter in Dilation`,
    effect: () => player.totalAntimatter.pow(0.5),
    pet: Ra.pets.teresa,
    level: 25,
    displayIcon: `<i class="far fa-dot-circle"></i>`
  },
  GLYPH_CHOICES: {
    id: 7,
    description: "Unlock Effarig",
    reward: "Choose from twice as many glyphs",
    pet: Ra.pets.effarig,
    level: 1,
    displayIcon: `<i class="fas fa-grip-horizontal"></i>`
  },
  GLYPH_ALCHEMY: {
    id: 8,
    description: "Get Effarig to level 2",
    reward: "Unlock Glyph Alchemy (one resource per level; new subtab in Reality)",
    pet: Ra.pets.effarig,
    level: 2,
    displayIcon: `<span class="fas fa-vial"></span>`
  },
  EFFARIG_XP: {
    id: 9,
    description: "Get Effarig to level 5",
    reward: "All Celestials produce more memories based on highest glyph level",
    pet: Ra.pets.effarig,
    level: 5,
    displayIcon: `<span class="fas fa-clone"></span>`
  },
  GLYPH_EFFECT_COUNT: {
    id: 10,
    description: "Get Effarig to level 8",
    reward: () => `Glyphs always have ${formatInt(4)} effects (Effarig glyphs can now have up to ${formatInt(7)})`,
    pet: Ra.pets.effarig,
    level: 8,
    displayIcon: `<span class="fas fa-braille"></span>`
  },
  ENSLAVED_UNLOCK: {
    id: 11,
    description: "Get Effarig to level 10",
    reward: "Unlock Enslaved's memories",
    pet: Ra.pets.effarig,
    level: 10,
    displayIcon: `<span class="fas fa-link"></span>`
  },
  SHARD_LEVEL_BOOST: {
    id: 12,
    description: "Get Effarig to level 15",
    reward: "Glyph level is increased based on relic shards gained",
    effect: () => 100 * Math.pow(Math.log10(Math.max(Effarig.shardsGained, 1)), 2),
    pet: Ra.pets.effarig,
    level: 15,
    displayIcon: `<span class="fas fa-fire"></span>`
  },
  MAX_RARITY: {
    id: 13,
    description: "Get Effarig to level 25",
    reward: () => `Glyphs are always generated with ${formatPercents(1)} rarity`,
    pet: Ra.pets.effarig,
    level: 25,
    displayIcon: `<i class="fas fa-ankh"></i>`
  },
  AUTO_BLACK_HOLE_POWER: {
    id: 14,
    description: "Unlock Enslaved",
    reward: "Black Hole power upgrades are bought automatically",
    pet: Ra.pets.enslaved,
    level: 1,
    displayIcon: `<span class="fas fa-circle"></span>`
  },
  IMPROVED_STORED_TIME: {
    id: 15,
    description: "Get Enslaved to level 2",
    reward: "Stored game time is amplified and you can store more real time (scales with level)",
    effect: {
      gameTimeAmplification: () => 1 + Math.clampMax(Ra.pets.enslaved.level, 25) / 100,
      realTimeCap: () => 1000 * 3600 * Ra.pets.enslaved.level,
    },
    pet: Ra.pets.enslaved,
    level: 2,
    displayIcon: `<span class="fas fa-history"></span>`
  },
  ENSLAVED_XP: {
    id: 16,
    description: "Get Enslaved to level 5",
    reward: "All Celestials produce more memories based on total time played",
    pet: Ra.pets.enslaved,
    level: 5,
    displayIcon: `<span class="fas fa-stopwatch"></span>`
  },
  ADJUSTABLE_STORED_TIME: {
    id: 17,
    description: "Get Enslaved to level 8",
    reward: () => `Black Hole charging can be done at an adjustable rate and automatically
      pulsed every ${formatInt(5)} ticks (see The Enslaved Ones' tab)`,
    pet: Ra.pets.enslaved,
    level: 8,
    displayIcon: `<span class="fas fa-expand-arrows-alt"></span>`
  },
  V_UNLOCK: {
    id: 18,
    description: "Get Enslaved to level 10",
    reward: "Unlock V's memories.",
    pet: Ra.pets.enslaved,
    level: 10,
    displayIcon: `⌬`
  },
  PEAK_GAMESPEED: {
    id: 19,
    description: "Get Enslaved to level 15",
    reward: "Gain more Dilated Time based on peak game speed in each Reality",
    pet: Ra.pets.enslaved,
    level: 15,
    displayIcon: `<span class="fas fa-tachometer-alt"></span>`
  },
  ALWAYS_GAMESPEED: {
    id: 20,
    description: "Get Enslaved to level 25",
    reward: `All basic glyphs gain the increased game speed effect from time glyphs,
      and time glyphs gain an additional effect`,
    pet: Ra.pets.enslaved,
    level: 25,
    displayIcon: `<span class="fas fa-clock"></span>`
  },
  AUTO_REALITY_UPGRADES: {
    id: 21,
    description: "Unlock V",
    reward: "The rebuyable Reality upgrades are bought automatically",
    pet: Ra.pets.v,
    level: 1,
    displayIcon: `<span class="fas fa-sync-alt"></span>`
  },
  INSTANT_AUTOEC: {
    id: 22,
    description: "Get V to level 2",
    reward: () => `Auto-EC happens instantly and Time Dilation is unlocked automatically
      at ${formatInt(17000)} Time Theorems`,
    pet: Ra.pets.v,
    level: 2,
    displayIcon: `<span class="fas fa-fast-forward"></span>`
  },
  V_XP: {
    id: 23,
    description: "Get V to level 5",
    reward: () => `All Celestials produce more memories based on total Celestial levels,
      unlock a Triad study every ${formatInt(5)} levels (see bottom of the Time Studies page)`,
    pet: Ra.pets.v,
    level: 5,
    displayIcon: `<span class="fas fa-book"></span>`
  },
  HARD_V: {
    id: 24,
    description: "Get V to level 8",
    reward: "Unlock more V-achievements (see V's tab)",
    pet: Ra.pets.v,
    level: 8,
    displayIcon: `<span class="fas fa-trophy"></span>`
  },
  TT_BOOST: {
    id: 25,
    description: "Get V to level 10",
    reward: "Time Theorems boost all forms of continuous non-dimension production",
    effect: {
      ttGen: () => Math.pow(10, 5 * Ra.theoremBoostFactor()),
      eternity: () => Math.pow(10, 2 * Ra.theoremBoostFactor()),
      infinity: () => Math.pow(10, 15 * Ra.theoremBoostFactor()),
      replicanti: () => Math.pow(10, 20 * Ra.theoremBoostFactor()),
      dilatedTime: () => Math.pow(10, 3 * Ra.theoremBoostFactor()),
      memories: () => 1 + Ra.theoremBoostFactor() / 50,
      autoPrestige: () => 1 + 2.4 * Ra.theoremBoostFactor()
    },
    pet: Ra.pets.v,
    level: 10,
    displayIcon: `<span class="fas fa-university"></span>`
  },
  TT_ACHIEVEMENT: {
    id: 26,
    description: "Get V to level 15",
    reward: "Achievement multiplier applies to Time Theorem generation",
    effect: () => Achievements.power,
    pet: Ra.pets.v,
    level: 15,
    displayIcon: `<span class="fas fa-graduation-cap"></span>`
  },
  ACHIEVEMENT_POW: {
    id: 27,
    description: "Get V to level 25",
    reward: () => `Achievement multiplier is raised ${formatPow(1.5, 1, 1)}`,
    pet: Ra.pets.v,
    level: 25,
    displayIcon: `<i class="fab fa-buffer"></i>`
  },
  RA_LAITELA_UNLOCK: {
    id: 28,
    description: "Get 100 total celestial levels",
    reward: "Unlock Lai'tela, the Celestial of Dimensions",
    totalLevels: 100,
  }
};
