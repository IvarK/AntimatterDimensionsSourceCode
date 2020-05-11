"use strict";

const orderedEffectList = ["powerpow", "infinitypow", "replicationpow", "timepow",
  "dilationpow", "timeshardpow", "powermult", "powerdimboost", "powerbuy10",
  "dilationTTgen", "infinityinfmult", "infinityIP", "timeEP",
  "dilationDT", "replicationdtgain", "replicationspeed", "timespeed",
  "timeetermult", "dilationgalaxyThreshold", "infinityrate", "replicationglyphlevel",
  "effarigblackhole", "effarigrm", "effarigglyph", "effarigachievement",
  "effarigforgotten", "effarigdimensions", "effarigantimatter",
  "cursedgalaxies", "cursedtickspeed", "curseddimensions", "cursedEP",
  "realityglyphlevel", "realitygalaxies", "realitydimboost", "realityrow1pow",
  "companiondescription", "companionEP", "companionreduction"];
const generatedTypes = ["power", "infinity", "replication", "time", "dilation", "effarig"];

// eslint-disable-next-line no-unused-vars
const GlyphEffectOrder = orderedEffectList.mapToObject(e => e, (e, idx) => idx);

function rarityToStrength(x) {
  return x * 2.5 / 100 + 1;
}

function strengthToRarity(x) {
  return (x - 1) * 100 / 2.5;
}

const AutoGlyphProcessor = {
  get scoreMode() {
    return player.celestials.effarig.glyphScoreSettings.mode;
  },
  set scoreMode(value) {
    player.celestials.effarig.glyphScoreSettings.mode = value;
  },
  get sacMode() {
    return player.celestials.effarig.glyphTrashMode;
  },
  set sacMode(value) {
    player.celestials.effarig.glyphTrashMode = value;
  },
  get types() {
    return player.celestials.effarig.glyphScoreSettings.types;
  },
  // This function is meant to be something which assigns a value to every glyph, with the assumption that
  // higher numbers correspond to better glyphs. This value is also displayed on tooltips when it depends
  // on only the glyph itself and not external factors.
  filterValue(glyph) {
    const typeCfg = this.types[glyph.type];
    switch (this.scoreMode) {
      case AUTO_GLYPH_SCORE.LOWEST_SACRIFICE:
        // Picked glyphs are never kept in this mode
        return -player.reality.glyphs.sac[glyph.type];
      case AUTO_GLYPH_SCORE.EFFECT_COUNT:
        // Effect count, plus a very small rarity term to break ties in favor of rarer glyphs
        return strengthToRarity(glyph.strength) / 1000 + getGlyphEffectsFromBitmask(glyph.effects, 0, 0)
          .filter(effect => effect.isGenerated).length;
      case AUTO_GLYPH_SCORE.RARITY_THRESHOLD:
        return strengthToRarity(glyph.strength);
      case AUTO_GLYPH_SCORE.SPECIFIED_EFFECT: {
        // Value is equal to rarity but minus 200 for each missing effect. This makes all glyphs which don't
        // satisfy the requirements have a negative score and generally the worse a glyph misses the requirements,
        // the more negative of a score it will have
        const glyphEffectList = getGlyphEffectsFromBitmask(glyph.effects, 0, 0)
          .filter(effect => effect.isGenerated)
          .map(effect => effect.id);
        if (glyphEffectList.length < typeCfg.effectCount) {
          return strengthToRarity(glyph.strength) - 200 * (typeCfg.effectCount - glyphEffectList.length);
        }
        let missingEffects = 0;
        for (const effect of Object.keys(typeCfg.effectChoices)) {
          if (typeCfg.effectChoices[effect] && !glyphEffectList.includes(effect)) missingEffects++;
        }
        return strengthToRarity(glyph.strength) - 200 * missingEffects;
      }
      case AUTO_GLYPH_SCORE.ADVANCED_MODE: {
        const effectList = getGlyphEffectsFromBitmask(glyph.effects, 0, 0)
          .filter(effect => effect.isGenerated)
          .map(effect => effect.id);
        const effectScore = effectList.map(e => typeCfg.effectScores[e]).sum();
        return strengthToRarity(glyph.strength) + effectScore;
      }
      case AUTO_GLYPH_SCORE.LOWEST_ALCHEMY:
        // Picked glyphs are never kept in this mode
        return -AlchemyResource[glyph.type].amount;
      case AUTO_GLYPH_SCORE.ALCHEMY_VALUE:
        return GlyphSacrificeHandler.glyphRefinementGain(glyph);
      default:
        throw new Error("Unknown glyph score mode in score assignment");
    }
  },
  // This is a mode-specific threshold which determines if selected glyphs are "good enough" to keep
  thresholdValue(glyph) {
    switch (this.scoreMode) {
      case AUTO_GLYPH_SCORE.EFFECT_COUNT:
        return player.celestials.effarig.glyphScoreSettings.simpleEffectCount;
      case AUTO_GLYPH_SCORE.RARITY_THRESHOLD:
      case AUTO_GLYPH_SCORE.SPECIFIED_EFFECT:
        return this.types[glyph.type].rarityThreshold;
      case AUTO_GLYPH_SCORE.ADVANCED_MODE:
        return this.types[glyph.type].scoreThreshold;
      case AUTO_GLYPH_SCORE.LOWEST_SACRIFICE:
      case AUTO_GLYPH_SCORE.LOWEST_ALCHEMY:
      case AUTO_GLYPH_SCORE.ALCHEMY_VALUE:
        // These modes never keep glyphs and always refine/sacrfice
        return Number.MAX_VALUE;
      default:
        throw new Error("Unknown glyph score mode in threshold check");
    }
  },
  wouldKeep(glyph) {
    return this.filterValue(glyph) >= this.thresholdValue(glyph);
  },
  // Given a list of glyphs, pick the one with the highest score
  pick(glyphs) {
    return glyphs
      .map(g => ({ glyph: g, score: this.filterValue(g) }))
      .reduce((x, y) => (x.score > y.score ? x : y))
      .glyph;
  },
  getRidOfGlyph(glyph) {
    // Auto clean calls this function too, which chokes without a special case for these types
    if (glyph.type === "cursed" || glyph.type === "companion") {
      GlyphSacrificeHandler.deleteGlyph(glyph, true);
      return;
    }

    switch (this.sacMode) {
      case AUTO_GLYPH_REJECT.SACRIFICE:
        GlyphSacrificeHandler.sacrificeGlyph(glyph, true);
        break;
      case AUTO_GLYPH_REJECT.ALWAYS_REFINE:
        GlyphSacrificeHandler.refineGlyph(glyph);
        break;
      case AUTO_GLYPH_REJECT.REFINE_TO_CAP:
        if (GlyphSacrificeHandler.glyphRefinementGain(glyph) === 0) GlyphSacrificeHandler.sacrificeGlyph(glyph, true);
        else GlyphSacrificeHandler.refineGlyph(glyph);
        break;
      default:
        throw new Error("Unknown auto glyph sacrifice mode");
    }
  }
};

/**
 * It turns out reading and writing the RNG state from player is really slow, for
 * some reason. Thus, it's very advantageous to get an RNG as a local variable, and only
 * write the state back out to player when we are done with it.
 * So, this interface is implemented by a real and fake RNG class; after creating one and
 * using it, call finalize on it to write the seed out.
 */
class GlyphRNG {
  constructor(seed, secondGaussian) {
    this.seed = seed;
    this.secondGaussian = secondGaussian;
  }

  uniform() {
    const state = xorshift32Update(this.seed);
    this.seed = state;
    return state * 2.3283064365386963e-10 + 0.5;
  }

  normal() {
    if (this.secondGaussian !== null) {
      const toReturn = this.secondGaussian;
      this.secondGaussian = null;
      return toReturn;
    }
    let u = 0, v = 0, s = 0;
    do {
      u = this.uniform() * 2 - 1;
      v = this.uniform() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    s = Math.sqrt(-2 * Math.log(s) / s);
    this.secondGaussian = v * s;
    return u * s;
  }

  /**
   * Write the seed out to where it can be restored
   * @abstract
   */
  finalize() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get isFake() { throw new NotImplementedError(); }
}

const GlyphGenerator = {
  fakeSeed: Date.now() % Math.pow(2, 32),
  fakeSecondGaussian: null,
  /* eslint-disable lines-between-class-members */
  RealGlyphRNG: class extends GlyphRNG {
    constructor() { super(player.reality.seed, player.reality.secondGaussian); }
    finalize() {
      player.reality.seed = this.seed;
      player.reality.secondGaussian = this.secondGaussian;
    }
    get isFake() { return false; }
  },

  FakeGlyphRNG: class extends GlyphRNG {
    constructor() { super(GlyphGenerator.fakeSeed, GlyphGenerator.fakeSecondGaussian); }
    finalize() {
      GlyphGenerator.fakeSeed = this.seed;
      GlyphGenerator.fakeSecondGaussian = this.secondGaussian;
    }
    get isFake() { return true; }
  },
  /* eslint-enable lines-between-class-members */

  startingGlyph(level) {
    player.reality.glyphs.last = "power";
    const initialStrength = 1.5;
    return {
      id: undefined,
      idx: null,
      type: "power",
      // The initial strength is very slightly above average.
      strength: initialStrength,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: makeGlyphEffectBitmask(["powerpow"]),
    };
  },

  randomGlyph(level, rngIn, typeIn = null) {
    const rng = rngIn || new GlyphGenerator.RealGlyphRNG();
    const strength = this.randomStrength(rng);
    const type = typeIn || this.randomType(rng);
    let numEffects = this.randomNumberOfEffects(type, strength, level.actualLevel, rng);
    if (type !== "effarig" && numEffects > 4) numEffects = 4;
    const effectBitmask = this.generateEffects(type, numEffects, rng);
    if (rngIn === undefined) rng.finalize();
    return {
      id: undefined,
      idx: null,
      type,
      strength,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: effectBitmask,
    };
  },

  realityGlyph(level) {
    const str = rarityToStrength(100);
    const effects = this.generateRealityEffects(level);
    const effectBitmask = makeGlyphEffectBitmask(effects);
    return {
      id: undefined,
      idx: null,
      type: "reality",
      strength: str,
      level,
      rawLevel: level,
      effects: effectBitmask,
    };
  },

  cursedGlyph() {
    const str = rarityToStrength(100);
    const effectBitmask = makeGlyphEffectBitmask(
      orderedEffectList.filter(effect => effect.match("cursed*"))
    );
    return {
      id: undefined,
      idx: null,
      type: "cursed",
      strength: str,
      level: 6666,
      rawLevel: 6666,
      effects: effectBitmask,
    };
  },

  companionGlyph(eternityPoints) {
    // Store the pre-Reality EP value in the glyph's rarity
    const str = rarityToStrength(eternityPoints.log10() / 1e6);
    const effects = orderedEffectList.filter(effect => effect.match("companion*"));
    // The last effect is the nerf reduction text, get rid of it if it doesn't apply
    if (!(player.saveOverThresholdFlag && eternityPoints.gte("1e6000"))) effects.pop();
    const effectBitmask = makeGlyphEffectBitmask(effects);
    return {
      id: undefined,
      idx: null,
      type: "companion",
      strength: str,
      level: 1,
      rawLevel: 1,
      effects: effectBitmask,
      color: "#feaec9"
    };
  },

  musicGlyph() {
      const glyph = this.randomGlyph({ actualLevel: Math.floor(player.bestGlyphLevel * 0.8), rawLevel: 1 });
      glyph.symbol = "key266b";
      glyph.color = "#FF80AB";
      return glyph;
  },

  // Generates a unique ID for glyphs, used for deletion and drag-and-drop.  Non-unique IDs can cause buggy behavior.
  makeID() {
    return this.maxID + 1;
  },

  get maxID() {
    return player.reality.glyphs.active
      .concat(player.reality.glyphs.inventory)
      .reduce((max, glyph) => Math.max(max, glyph.id), 0);
  },

  get strengthMultiplier() {
    return Effects.max(1, RealityUpgrade(16));
  },

  randomStrength(rng) {
    // Technically getting this upgrade really changes glyph gen but at this point almost all
    // the RNG is gone anyway.
    if (Ra.has(RA_UNLOCKS.MAX_RARITY_AND_SHARD_SACRIFICE_BOOST)) return rarityToStrength(100);
    let result = GlyphGenerator.gaussianBellCurve(rng) *  GlyphGenerator.strengthMultiplier;
    const relicShardFactor = Ra.has(RA_UNLOCKS.EXTRA_CHOICES_AND_RELIC_SHARD_RARITY_ALWAYS_MAX) ? 1 : rng.uniform();
    const increasedRarity = relicShardFactor * Effarig.maxRarityBoost + Effects.sum(Achievement(146), GlyphSacrifice.effarig);
    // Each rarity% is 0.025 strength.
    result += increasedRarity / 40;
    return Math.min(result, rarityToStrength(100));
  },

  // eslint-disable-next-line max-params
  randomNumberOfEffects(type, strength, level, rng) {
    // Call the RNG twice before anything else to advance the RNG seed properly, even if the whole method returns early.
    // This prevents the position of effarig glyphs in the choice list from affecting the choices themselves, as well
    // as preventing all of the glyphs changing drastically when RU17 is purchased.
    const random1 = rng.uniform();
    const random2 = rng.uniform();
    if (type !== "effarig" && Ra.has(RA_UNLOCKS.GLYPH_EFFECT_COUNT)) return 4;
    const maxEffects = Ra.has(RA_UNLOCKS.GLYPH_EFFECT_COUNT) ? 7 : 4;
    let num = Math.min(
      maxEffects,
      Math.floor(Math.pow(random1, 1 - (Math.pow(level * strength, 0.5)) / 100) * 1.5 + 1));
    // If we do decide to add anything else that boosts chance of an extra effect, keeping the code like this
    // makes it easier to do (add it to the Effects.max).
    if (RealityUpgrade(17).isBought && random2 < Effects.max(0, RealityUpgrade(17))) {
      num = Math.min(num + 1, maxEffects);
    }
    if (Ra.has(RA_UNLOCKS.GLYPH_EFFECT_COUNT)) num = Math.max(num, 4);
    return num;
  },

  // Populate a list of reality glyph effects based on level
  generateRealityEffects(level) {
    const numberOfEffects = realityGlyphEffectLevelThresholds.filter(lv => lv <= level).length;
    const sortedRealityEffects = Object.values(GameDatabase.reality.glyphEffects)
      .filter(eff => eff.id.match("reality*"))
      .sort((a, b) => a.bitmaskIndex - b.bitmaskIndex)
      .map(eff => eff.id);
    return sortedRealityEffects.slice(0, numberOfEffects);
  },

  generateEffects(type, count, rng) {
    const effectValues = GlyphTypes[type].effects.mapToObject(x => x.bitmaskIndex, () => rng.uniform());
    // Get a bunch of random numbers so that we always use 7 here.
    Array.range(0, 7 - GlyphTypes[type].effects.length).forEach(() => rng.uniform());
    if (type === "effarig") {
      // This is effarigrm/effarigglyph
      const unincluded = effectValues[21] < effectValues[22] ? 21 : 22;
      effectValues[unincluded] = -1;
    }
    // This is timepow/infinitypow/powerpow
    for (let i in [0, 12, 16]) {
      if (i in effectValues) {
        effectValues[i] = 2;
      }
    }
    // Sort from highest to lowest value.
    let effects = Object.keys(effectValues).sort((a, b) => effectValues[b] - effectValues[a]).slice(0, count);
    return effects.map(i => +i).toBitmask();
  },

  randomType(rng, typesSoFar = []) {
    const generatable = generatedTypes.filter(x => EffarigUnlock.reality.isUnlocked || x !== "effarig");
    const maxOfSameTypeSoFar = generatable.map(x => typesSoFar.countWhere(y => y === x)).max();
    const blacklisted = typesSoFar.length === 0
        ? [] : generatable.filter(x => typesSoFar.countWhere(y => y === x) === maxOfSameTypeSoFar);
    return GlyphTypes.random(rng, blacklisted);
  },

  getRNG(fake) {
    return fake ? new GlyphGenerator.FakeGlyphRNG() : new GlyphGenerator.RealGlyphRNG();
  },

  /**
   * More than 3 approx 0.001%
   * More than 2.5 approx 0.2%
   * More than 2 approx 6%
   * More than 1.5 approx 38.43%
   */
  gaussianBellCurve(rng) {
    // Old code used max, instead of abs -- but we rejected any samples that were
    // at the boundary anyways. Might as well use abs, and not cycle as many times.
    // The function here is an approximation of ^0.65, here is the old code:
    //     return Math.pow(Math.max(rng.normal() + 1, 1), 0.65);
    const x = Math.sqrt(Math.abs(rng.normal(), 0) + 1);
    return -0.111749606737000 + x * (0.900603878243551 + x * (0.229108274476697 + x * -0.017962545983249));
  },

  copy(glyph) {
    return glyph ? deepmerge({}, glyph) : glyph;
  },
};

const Glyphs = {
  inventory: [],
  active: [],
  copies: [],
  levelBoost: 0,
  get inventoryList() {
    return player.reality.glyphs.inventory;
  },
  get activeList() {
    return player.reality.glyphs.active;
  },
  findFreeIndex(useProtectedSlots) {
    this.validate();
    const isUsableIndex = index => (useProtectedSlots ? index < this.protectedSlots : index >= this.protectedSlots);
    return this.inventory.findIndex((slot, index) => slot === null && isUsableIndex(index));
  },
  get freeInventorySpace() {
    this.validate();
    return this.inventory.filter((e, idx) => e === null && idx >= this.protectedSlots).length;
  },
  get activeSlotCount() {
    return 3 + Effects.sum(RealityUpgrade(9), RealityUpgrade(24));
  },
  get protectedSlots() {
    return 20;
  },
  get totalSlots() {
    return 120;
  },
  refreshActive() {
    this.active = new Array(this.activeSlotCount).fill(null);
    for (const g of player.reality.glyphs.active) {
      if (this.active[g.idx]) {
        throw new Error("Stacked active glyphs?");
      }
      this.active[g.idx] = g;
    }
  },
  refresh() {
    this.refreshActive();
    this.inventory = new Array(this.totalSlots).fill(null);
    // Glyphs could previously end up occupying the same inventory slot (Stacking)
    const stacked = [];
    for (const g of player.reality.glyphs.inventory) {
      if (this.inventory[g.idx]) {
        stacked.push(g);
      } else {
        this.inventory[g.idx] = g;
      }
    }
    // Try to unstack glyphs:
    while (stacked.length) {
      const freeIndex = this.findFreeIndex();
      if (freeIndex >= 0) {
        const glyph = stacked.shift();
        this.inventory[freeIndex] = glyph;
        glyph.idx = freeIndex;
      } else {
        break;
      }
    }
    while (stacked.length) {
      this.removeFromInventory(stacked.pop());
    }
    this.validate();
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  },
  findById(id) {
    return player.reality.glyphs.inventory.find(glyph => glyph.id === id);
  },
  findByInventoryIndex(inventoryIndex) {
    return this.inventory[inventoryIndex];
  },
  activeGlyph(activeIndex) {
    return this.active[activeIndex];
  },
  equip(glyph, targetSlot) {
    this.validate();
    if (this.findByInventoryIndex(glyph.idx) !== glyph) {
      throw new Error("Inconsistent inventory indexing");
    }
    let sameSpecialTypeIndex = -1;
    if (glyph.type === "effarig" || glyph.type === "reality") {
      sameSpecialTypeIndex = this.active.findIndex(x => x && x.type === glyph.type);
    }
    const inventoryIndex = glyph.idx;
    if (this.active[targetSlot] === null) {
      if (sameSpecialTypeIndex >= 0) return;
      this.removeFromInventory(glyph);
      this.saveUndo(inventoryIndex, targetSlot);
    } else {
      // We can only replace effarig/reality glyph
      if (sameSpecialTypeIndex >= 0 && sameSpecialTypeIndex !== targetSlot) {
        Modal.message.show(`You may only have one ${glyph.type} glyph equipped`);
        return;
      }
      if (player.options.confirmations.glyphReplace &&
        !confirm("Replacing a glyph will restart this Reality. Proceed?")) return;
      // Remove from inventory first so that there's room to unequip to the same inventory slot
      this.removeFromInventory(glyph);
      this.unequip(targetSlot, inventoryIndex);
      finishProcessReality({
        reset: true,
        glyphUndo: false,
        restoreCelestialState: true,
      });
    }
    player.reality.glyphs.active.push(glyph);
    glyph.idx = targetSlot;
    this.active[targetSlot] = glyph;
    this.updateRealityGlyphEffects();
    this.updateGlyphCountForV();
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    this.validate();
  },
  unequipAll() {
    while (player.reality.glyphs.active.length) {
      const freeIndex = this.findFreeIndex(player.options.respecIntoProtected);
      if (freeIndex < 0) break;
      const glyph = player.reality.glyphs.active.pop();
      this.active[glyph.idx] = null;
      this.addToInventory(glyph, freeIndex);
    }
    this.updateRealityGlyphEffects();
    this.updateGlyphCountForV();
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  },
  unequip(activeIndex, requestedInventoryIndex) {
    if (this.active[activeIndex] === null) return;
    const storedIndex = player.reality.glyphs.active.findIndex(glyph => glyph.idx === activeIndex);
    if (storedIndex < 0) return;
    const glyph = player.reality.glyphs.active.splice(storedIndex, 1)[0];
    this.active[activeIndex] = null;
    this.addToInventory(glyph, requestedInventoryIndex);
    this.updateRealityGlyphEffects();
    this.updateGlyphCountForV();
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  },
  updateRealityGlyphEffects() {
    // There should only be one reality glyph; this picks one pseudo-randomly if multiple are cheated/glitched in
    const realityGlyph = player.reality.glyphs.active.filter(g => g.type === "reality")[0];
    if (realityGlyph === undefined) {
      this.levelBoost = 0;
      return;
    }
    this.levelBoost = getAdjustedGlyphEffect("realityglyphlevel");
  },
  moveToSlot(glyph, targetSlot) {
    if (this.inventory[targetSlot] === null) this.moveToEmpty(glyph, targetSlot);
    else this.swap(glyph, this.inventory[targetSlot]);
  },
  moveToEmpty(glyph, targetSlot) {
    this.validate();
    if (this.findByInventoryIndex(glyph.idx) !== glyph) {
      throw new Error("Inconsistent inventory indexing");
    }
    if (this.inventory[targetSlot] === null) {
      this.inventory[glyph.idx] = null;
      this.inventory[targetSlot] = glyph;
      glyph.idx = targetSlot;
      EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    } else {
      throw new Error("Attempted glyph move into non-empty slot");
    }
    this.validate();
  },
  swap(glyphA, glyphB) {
    if (glyphA.idx === glyphB.idx) return;
    this.validate();
    this.inventory[glyphA.idx] = glyphB;
    this.inventory[glyphB.idx] = glyphA;
    const swapGlyph = glyphA.idx;
    glyphA.idx = glyphB.idx;
    glyphB.idx = swapGlyph;
    this.validate();
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  },
  addToInventory(glyph, requestedInventoryIndex) {
    this.validate();
    glyph.id = GlyphGenerator.makeID();
    const isProtectedIndex = requestedInventoryIndex < this.protectedSlots;
    let index = this.findFreeIndex(isProtectedIndex);
    if (index < 0) return;
    if (requestedInventoryIndex !== undefined) {
      if (this.inventory[requestedInventoryIndex] === null) index = requestedInventoryIndex;
    }
    this.inventory[index] = glyph;
    glyph.idx = index;

    // This is done here when adding to the inventory in order to keep it out of the glyph generation hot path
    // It thus doesn't show up in manually choosing a glyph
    // This also only does anything if Ra has the appropriate unlock already.
    this.applyGamespeed(glyph);

    // This should only apply to glyphs you actually choose, so can't be done in glyph generation.
    // Sometimes a glyph you already have is added to the inventory (for example, unequipping),
    // but that's not an issue because then this line just won't do anything, which is fine.
    player.bestGlyphStrength = Math.clampMin(player.bestGlyphStrength, glyph.strength);

    player.reality.glyphs.inventory.push(glyph);
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    this.validate();
  },
  removeFromInventory(glyph) {
    // This can get called on a glyph not in inventory, during auto sacrifice.
    if (glyph.idx === null) return;
    this.validate();
    const index = player.reality.glyphs.inventory.indexOf(glyph);
    if (index < 0) return;
    this.inventory[glyph.idx] = null;
    player.reality.glyphs.inventory.splice(index, 1);
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    this.validate();
  },
  validate() {
    for (const glyph of player.reality.glyphs.inventory) {
      if (this.inventory[glyph.idx] !== glyph) {
        throw new Error("validation error");
      }
    }
    for (let i = 0; i < this.inventory.length; ++i) {
      if (this.inventory[i] && this.inventory[i].idx !== i) {
        throw new Error("backwards validation error");
      }
    }
  },
  sort(sortFunction) {
    const glyphsToSort = player.reality.glyphs.inventory.filter(g => g.idx >= this.protectedSlots);
    const freeSpace = this.freeInventorySpace;
    const sortOrder = ["power", "infinity", "replication", "time", "dilation", "effarig",
      "reality", "cursed", "companion"];
    const byType = sortOrder.mapToObject(g => g, () => ({ glyphs: [], padding: 0 }));
    for (const g of glyphsToSort) byType[g.type].glyphs.push(g);
    let totalDesiredPadding = 0;
    for (const t of Object.values(byType)) {
      t.glyphs.sort(sortFunction);
      t.padding = Math.ceil(t.glyphs.length / 10) * 10 - t.glyphs.length;
      // Try to get a full row of padding if possible in some cases
      if (t.padding < 5 && t.glyphs.length > 8) t.padding += 10;
      totalDesiredPadding += t.padding;
    }
    while (totalDesiredPadding > freeSpace) {
      // Try to remove padding 5 at a time if possible
      let biggestPadding = sortOrder[0];
      for (const t of sortOrder) {
        if (byType[t].padding > byType[biggestPadding].padding) biggestPadding = t;
      }
      let delta = byType[biggestPadding].padding > 5 ? 5 : 1;
      if (byType[biggestPadding].padding > 12) delta = 10;
      totalDesiredPadding -= delta;
      byType[biggestPadding].padding -= delta;
    }
    let outIndex = this.protectedSlots;
    for (const t of Object.values(byType)) {
      for (const g of t.glyphs) {
        if (this.inventory[outIndex]) this.swap(this.inventory[outIndex], g);
        else this.moveToEmpty(g, outIndex);
        ++outIndex;
      }
      outIndex += t.padding;
    }
  },
  // If there are enough glyphs that are better than the specified glyph, in every way, then
  // the glyph is objectively a useless piece of garbage.
  isObjectivelyUseless(glyph, thresholdOverride) {
    function hasSomeBetterEffects(glyphA, glyphB, comparedEffects) {
      for (const effect of comparedEffects) {
        const c = effect.compareValues(
          effect.effect(glyphA.level, glyphA.strength),
          effect.effect(glyphB.level, glyphB.strength));
        // If the glyph in question is better in even one effect, it passes this comparison
        if (c > 0) return true;
      }
      return false;
    }
    const toCompare = this.inventory.concat(this.active)
      .filter(g => g !== null &&
        g.type === glyph.type &&
        g.id !== glyph.id &&
        (g.level >= glyph.level || g.strength >= glyph.strength) &&
        // eslint-disable-next-line no-bitwise
        ((g.effects & glyph.effects) === glyph.effects));
    let compareThreshold = glyph.type === "effarig" || glyph.type === "reality" ? 1 : 5;
    compareThreshold = Math.clampMax(compareThreshold, thresholdOverride);
    if (toCompare.length < compareThreshold) return false;
    const comparedEffects = getGlyphEffectsFromBitmask(glyph.effects).filter(x => x.id.startsWith(glyph.type));
    const betterCount = toCompare.countWhere(other => !hasSomeBetterEffects(glyph, other, comparedEffects));
    return betterCount >= compareThreshold;
  },
  autoClean(thresholdIn) {
    const thresholdOverride = thresholdIn === undefined ? 5 : thresholdIn;
    const isHarsh = thresholdOverride < 5;
    // If the player hasn't unlocked sacrifice yet, we warn them.
    if (!GlyphSacrificeHandler.canSacrifice &&
      // eslint-disable-next-line prefer-template
      !confirm("This will not give you any benefit" +
        (RealityUpgrade(19).isAvailableForPurchase ? "" : " and may reduce the number of glyphs in your inventory. " +
        "It may be hard to get more glyphs. The Reality upgrade to unlock glyph sacrifice requires 30 glyphs") +
        ". Also, when you unlock glyph sacrifice, you will not be able to later sacrifice glyphs you delete now. " +
        "Are you sure you want to do this?")) {
      return;
    }
    // If the player has unlocked sacrifice (so has not gotten the above warning) and auto clean could remove
    // useful glyphs, we warn them.
    if (GlyphSacrificeHandler.canSacrifice && isHarsh && player.options.confirmations.harshAutoClean &&
      // eslint-disable-next-line prefer-template
      !confirm("This could delete glyphs in your inventory that are good enough that you might want to use them " +
        "later. Are you sure you want to do this?")) {
      return;
    }
    // We look in backwards order so that later glyphs get cleaned up first
    for (let inventoryIndex = this.totalSlots - 1; inventoryIndex >= this.protectedSlots; --inventoryIndex) {
      const glyph = this.inventory[inventoryIndex];
      if (glyph === null) continue;
      // Don't auto-clean custom glyphs (eg. music glyphs) unless it's harsh or delete all
      const isCustomGlyph = glyph.color !== undefined || glyph.symbol !== undefined;
      if (isCustomGlyph && !isHarsh) continue;
      // If the threshold for better glyphs needed is zero, the glyph is definitely getting deleted
      // no matter what (well, unless it can't be gotten rid of in current glyph removal mode).
      if (thresholdOverride === 0 || this.isObjectivelyUseless(glyph, thresholdOverride)) {
        AutoGlyphProcessor.getRidOfGlyph(glyph);
      }
    }
  },
  harshAutoClean() {
    this.autoClean(1);
  },
  deleteAllUnprotected() {
    this.autoClean(0);
  },
  get levelCap() {
    return 1000000;
  },
  get instabilityThreshold() {
    return 1000 + getAdjustedGlyphEffect("effarigglyph");
  },
  get hyperInstabilityThreshold() {
    return 4000 + getAdjustedGlyphEffect("effarigglyph");
  },
  clearUndo() {
    player.reality.glyphs.undo = [];
  },
  saveUndo(oldIndex, targetSlot) {
    const undoData = {
      oldIndex,
      targetSlot,
      am: new Decimal(Currency.antimatter.value),
      ip: new Decimal(player.infinityPoints),
      ep: new Decimal(player.eternityPoints),
      tt: player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost() - TimeTheorems.totalPurchased()),
      ecs: EternityChallenges.all.map(e => e.completions),
      thisReality: player.thisReality,
      thisRealityRealTime: player.thisRealityRealTime,
      storedTime: player.celestials.enslaved.stored,
      dilationStudies: player.dilation.studies.toBitmask(),
      dilationUpgrades: player.dilation.upgrades.toBitmask(),
      dilationRebuyables: DilationUpgrades.rebuyable.mapToObject(d => d.id, d => d.boughtAmount),
      tp: new Decimal(player.dilation.tachyonParticles),
      dt: new Decimal(player.dilation.dilatedTime),
    };
    player.reality.glyphs.undo.push(undoData);
  },
  undo() {
    if (player.reality.glyphs.undo.length === 0) return;
    const undoData = player.reality.glyphs.undo.pop();
    this.unequip(undoData.targetSlot, undoData.oldIndex);
    finishProcessReality({
      reset: true,
      glyphUndo: true,
      restoreCelestialState: true,
    });
    Currency.antimatter.value = new Decimal(undoData.am);
    player.infinityPoints.fromValue(undoData.ip);
    player.eternityPoints.fromValue(undoData.ep);
    player.timestudy.theorem.fromValue(undoData.tt);
    EternityChallenges.all.map((ec, ecIndex) => ec.completions = undoData.ecs[ecIndex]);
    player.thisReality = undoData.thisReality;
    player.thisRealityRealTime = undoData.thisRealityRealTime;
    player.celestials.enslaved.stored = undoData.storedTime || 0;
    if (undoData.dilationStudies) {
      player.dilation.studies = Array.fromBitmask(undoData.dilationStudies);
      player.dilation.upgrades = new Set(Array.fromBitmask(undoData.dilationUpgrades));
      for (const id of Object.keys(undoData.dilationRebuyables)) {
        DilationUpgrades.fromId(id).boughtAmount = undoData.dilationRebuyables[id];
      }
      player.dilation.tachyonParticles.fromValue(undoData.tp);
      player.dilation.dilatedTime.fromValue(undoData.dt);
    }
  },
  copyForRecords(glyphList) {
    // Sorting by effect ensures consistent ordering by type, based on how the effect bitmasks are structured
    return glyphList.map(g => ({
        type: g.type,
        level: g.level,
        strength: g.strength,
        effects: g.effects, }))
      .sort((a, b) => b.effects - a.effects);
  },
  // Normal glyph count minus 3 for each cursed glyph, uses 4 instead of 3 in the calculation because cursed glyphs
  // still contribute to the length of the active list. Note that it only ever decreases if startingReality is true.
  updateGlyphCountForV(startingReality = false) {
    const activeGlyphList = this.activeList;
    const currCount = activeGlyphList.length - 4 * activeGlyphList.filter(x => x && x.type === "cursed").length;
    if (startingReality) player.celestials.v.maxGlyphsThisRun = currCount;
    player.celestials.v.maxGlyphsThisRun = Math.max(player.celestials.v.maxGlyphsThisRun, currCount);
  },
  // Modifies a basic glyph to have timespeed, and adds the new effect to time glyphs
  applyGamespeed(glyph) {
    if (!Ra.has(RA_UNLOCKS.ALWAYS_GAMESPEED)) return;
    if (BASIC_GLYPH_TYPES.includes(glyph.type)) {
      // eslint-disable-next-line no-bitwise
      glyph.effects |= (1 << GameDatabase.reality.glyphEffects.timespeed.bitmaskIndex);
      if (glyph.type === "time") {
        // eslint-disable-next-line no-bitwise
        glyph.effects |= (1 << GameDatabase.reality.glyphEffects.timeshardpow.bitmaskIndex);
      }
    }
  }
};

class GlyphSacrificeState extends GameMechanicState { }

const GlyphSacrifice = (function() {
  const db = GameDatabase.reality.glyphSacrifice;
  return {
    time: new GlyphSacrificeState(db.time),
    dilation: new GlyphSacrificeState(db.dilation),
    replication: new GlyphSacrificeState(db.replication),
    infinity: new GlyphSacrificeState(db.infinity),
    power: new GlyphSacrificeState(db.power),
    effarig: new GlyphSacrificeState(db.effarig),
    reality: new GlyphSacrificeState(db.reality),
  };
}());

/**
 * This returns just the value, unlike getTotalEffect(), which outputs the softcap status as well
 * This variant is used by GameCache
 * @param {string} effectKey
 * @return {number | Decimal}
 */
function getAdjustedGlyphEffectUncached(effectKey) {
  return getTotalEffect(effectKey).value;
}

/**
 * This returns just the value, unlike getTotalEffect(), which outputs the softcap status as well
 * @param {string} effectKey
 * @return {number | Decimal}
 */
function getAdjustedGlyphEffect(effectKey) {
  return GameCache.glyphEffects.value[effectKey];
}

/**
 * Takes the glyph effect value and feeds it through the conversion function that gives the value of the secondary
 * effect from glyph alteration.
 * @param {string} effectKey
 * @return {number | Decimal}
 */
function getSecondaryGlyphEffect(effectKey) {
  return GameDatabase.reality.glyphEffects[effectKey].conversion(getAdjustedGlyphEffect(effectKey));
}

/**
 * Finds all equipped glyphs with the specified effect and returns an array of effect values.
 * @param {string} effectKey
 * @returns {number[]}
 */
function getGlyphEffectValues(effectKey) {
  if (orderedEffectList.filter(effect => effect === effectKey).length === 0) {
    throw new Error(`Unknown glyph effect requested "${effectKey}"'`);
  }
  return player.reality.glyphs.active
  // eslint-disable-next-line no-bitwise
    .filter(glyph => ((1 << GameDatabase.reality.glyphEffects[effectKey].bitmaskIndex) & glyph.effects) !== 0)
    .filter(glyph => generatedTypes.includes(glyph.type) === GameDatabase.reality.glyphEffects[effectKey].isGenerated)
    .map(glyph => getSingleGlyphEffectFromBitmask(effectKey, glyph));
}

// Combines all specified glyph effects, reduces some boilerplate
function getTotalEffect(effectKey) {
  return GameDatabase.reality.glyphEffects[effectKey].combine(getGlyphEffectValues(effectKey));
}

function recalculateAllGlyphs() {
  for (let i = 0; i < player.reality.glyphs.active.length; i++) {
    calculateGlyph(player.reality.glyphs.active[i]);
  }
  // Delete any glyphs that are in overflow spots:
  player.reality.glyphs.inventory = player.reality.glyphs.inventory.filter(
    glyph => glyph.idx < Glyphs.totalSlots);
  for (let i = 0; i < player.reality.glyphs.inventory.length; i++) {
    calculateGlyph(player.reality.glyphs.inventory[i]);
  }
  Glyphs.updateRealityGlyphEffects();
  Glyphs.refresh();
}

// Makes sure level is a positive whole number and rarity is >0% (retroactive fixes) and recalculates effects
function calculateGlyph(glyph) {
  if (glyph.color === undefined && glyph.symbol === undefined) {
    glyph.level = Math.max(1, Math.round(glyph.level));
    if (glyph.rawLevel === undefined) {
      // Only correct below the second round of instability, but it only matters for glyphs produced before
      // this was merged, so it's not a big deal.
      glyph.rawLevel = glyph.level < 1000 ? glyph.level : (Math.pow(0.004 * glyph.level - 3, 2) - 1) * 125 + 1000;
    }

    // Used to randomly generate strength in this case; I don't think we actually care.
    if (glyph.strength === 1) glyph.strength = 1.5;
    glyph.strength = Math.min(rarityToStrength(100), glyph.strength);
  }
}

function getRarity(x) {
  return GlyphRarities.find(e => x >= e.minStrength);
}

/**
 * Key is type+effect
 */
function separateEffectKey(effectKey) {
  let type = "";
  let effect = "";
  for (let i = 0; i < GLYPH_TYPES.length; i++) {
    if (effectKey.substring(0, GLYPH_TYPES[i].length) === GLYPH_TYPES[i]) {
      type = GLYPH_TYPES[i];
      effect = effectKey.substring(GLYPH_TYPES[i].length);
      break;
    }
  }
  return [type, effect];
}

// Turns a glyph effect bitmask into an effect list and corresponding values. This also picks up non-generated effects,
// since there is some id overlap. Those should be filtered out as needed after calling this function.
function getGlyphEffectValuesFromBitmask(bitmask, level, strength) {
  return getGlyphEffectsFromBitmask(bitmask)
    .map(effect => ({
      id: effect.id,
      value: effect.effect(level, strength)
    }));
}

function getAdjustedGlyphLevel(glyph) {
  const level = glyph.level;
  if (Enslaved.isRunning) return Math.max(level, Enslaved.glyphLevelMin);
  if (Effarig.isRunning) return Math.min(level, Effarig.glyphLevelCap);
  // Copied glyphs have rawLevel === 0
  if (BASIC_GLYPH_TYPES.includes(glyph.type) && glyph.rawLevel !== 0) return level + Glyphs.levelBoost;
  return level;
}

// Pulls out a single effect value from a glyph's bitmask, returning just the value (nothing for missing effects)
function getSingleGlyphEffectFromBitmask(effectName, glyph) {
  const glyphEffect = GameDatabase.reality.glyphEffects[effectName];
  // eslint-disable-next-line no-bitwise
  if ((glyph.effects & (1 << glyphEffect.bitmaskIndex)) === 0) {
    return undefined;
  }
  return glyphEffect.effect(getAdjustedGlyphLevel(glyph), glyph.strength);
}

function countEffectsFromBitmask(bitmask) {
  let numEffects = 0;
  let bits = bitmask;
  while (bits !== 0) {
    // eslint-disable-next-line no-bitwise
    numEffects += bits & 1;
    // eslint-disable-next-line no-bitwise
    bits >>= 1;
  }
  return numEffects;
}

// Returns both effect value and softcap status
function getActiveGlyphEffects() {
  let effectValues = orderedEffectList
    .map(effect => ({ effect, values: getGlyphEffectValues(effect) }))
    .filter(ev => ev.values.length > 0)
    .map(ev => ({
      id: ev.effect,
      value: GameDatabase.reality.glyphEffects[ev.effect].combine(ev.values),
    }));
  const effectNames = effectValues.map(e => e.id);

  // Numerically combine cursed effects with other glyph effects which directly conflict with them
  const cursedEffects = ["cursedgalaxies", "curseddimensions", "cursedEP"];
  const conflictingEffects = ["realitygalaxies", "effarigdimensions", "timeEP"];
  const combineFunction = [GlyphCombiner.multiply, GlyphCombiner.multiply, GlyphCombiner.multiplyDecimal];
  for (let i = 0; i < cursedEffects.length; i++) {
    if (effectNames.includes(cursedEffects[i]) && effectNames.includes(conflictingEffects[i])) {
      const combined = combineFunction[i]([getAdjustedGlyphEffect(cursedEffects[i]),
        getAdjustedGlyphEffect(conflictingEffects[i])]);
      if (Decimal.lt(combined, 1)) {
        effectValues = effectValues.filter(e => e.id !== conflictingEffects[i]);
        effectValues.filter(e => e.id === cursedEffects[i])[0].value.value = combined;
      } else {
        effectValues = effectValues.filter(e => e.id !== cursedEffects[i]);
        effectValues.filter(e => e.id === conflictingEffects[i])[0].value.value = combined;
      }
    }
  }

  return effectValues;
}

function respecGlyphs() {
  Glyphs.unequipAll();
  player.reality.respec = false;
}

// This actually deals with both sacrifice and refining, but I wasn't 100% sure what to call it
const GlyphSacrificeHandler = {
  get canSacrifice() {
    return RealityUpgrade(19).isBought;
  },
  get isRefining() {
    return Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) && AutoGlyphProcessor.sacMode !== AUTO_GLYPH_REJECT.SACRIFICE;
  },
  // Removes a glyph, accounting for sacrifice unlock and alchemy state
  removeGlyph(glyph, force = false) {
    if (!this.canSacrifice) this.deleteGlyph(glyph, force);
    else if (this.isRefining) this.refineGlyph(glyph);
    else this.sacrificeGlyph(glyph, force);
  },
  deleteGlyph(glyph, force) {
    if (glyph.type === "companion") {
      Modal.deleteCompanion.show();
    } else if (force || confirm("Do you really want to delete this glyph?")) {
      Glyphs.removeFromInventory(glyph);
    }
  },
  glyphSacrificeGain(glyph) {
    if (!this.canSacrifice) return 0;
    if (glyph.type === "reality") return 0.01 * glyph.level * Achievement(171).effectOrDefault(1);
    const pre10kFactor = Math.pow(Math.clampMax(glyph.level, 10000) + 10, 2.5);
    const post10kFactor = 1 + Math.clampMin(glyph.level - 10000, 0) / 100;
    const power = Ra.has(RA_UNLOCKS.MAX_RARITY_AND_SHARD_SACRIFICE_BOOST) ? 1 + Effarig.maxRarityBoost / 100 : 1;
    return Math.pow(pre10kFactor * post10kFactor * glyph.strength *
      Teresa.runRewardMultiplier * Achievement(171).effectOrDefault(1), power);
  },
  sacrificeGlyph(glyph, force = false) {
    if (glyph.type === "cursed") {
      Glyphs.removeFromInventory(glyph);
      return;
    }

    const toGain = this.glyphSacrificeGain(glyph);
    const askConfirmation = !force && player.options.confirmations.glyphSacrifice;
    if (askConfirmation) {
      if (!confirm(`Do you really want to sacrifice this glyph? Your total power of sacrificed ${glyph.type} ` +
        `glyphs will increase from ${format(player.reality.glyphs.sac[glyph.type], 2, 2)} to ` +
        `${format(player.reality.glyphs.sac[glyph.type] + toGain, 2, 2)}.`)) {
          return;
      }
    }
    player.reality.glyphs.sac[glyph.type] += toGain;
    Glyphs.removeFromInventory(glyph);
    EventHub.dispatch(GAME_EVENT.GLYPH_SACRIFICED, glyph);
  },
  glyphAlchemyResource(glyph) {
    const type = GlyphTypes[glyph.type];
    return AlchemyResources.all[type.alchemyResource];
  },
  // Scaling function to make refinement value ramp up with higher glyph levels
  levelRefinementValue(level) {
    return Math.pow(level, 3) / 1e8;
  },
  levelAlchemyCap(level) {
    return Math.clampMax(Ra.alchemyResourceCap, this.levelRefinementValue(level));
  },
  // Refined glyphs give this proportion of their maximum attainable value from their level
  glyphRefinementEfficiency: 0.2,
  glyphRawRefinementGain(glyph) {
    if (!Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY)) return 0;
    const glyphMaxValue = this.levelRefinementValue(glyph.level);
    return this.glyphRefinementEfficiency * glyphMaxValue * (strengthToRarity(glyph.strength) / 100);
  },
  glyphRefinementGain(glyph) {
    if (!Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY)) return 0;
    const glyphActualValue = this.glyphRawRefinementGain(glyph);
    const alchemyResource = this.glyphAlchemyResource(glyph);
    const glyphActualMaxValue = this.levelAlchemyCap(glyph.level);
    return Math.clamp(glyphActualMaxValue - alchemyResource.amount, 0, glyphActualValue);
  },
  refineGlyph(glyph) {
    if (glyph.type === "reality") return;
    if (glyph.type === "cursed") {
      Glyphs.removeFromInventory(glyph);
      return;
    }
    if (!Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) || (this.glyphRefinementGain(glyph) === 0 &&
      !AlchemyResource.decoherence.isUnlocked)) {
      this.sacrificeGlyph(glyph, true);
      return;
    }
    if (this.glyphAlchemyResource(glyph).isUnlocked) {
      const resource = this.glyphAlchemyResource(glyph);
      const rawRefinementGain = this.glyphRawRefinementGain(glyph);
      const refinementGain = this.glyphRefinementGain(glyph);
      resource.amount += refinementGain;
      const decoherenceGain = rawRefinementGain * AlchemyResource.decoherence.effectValue;
      const alchemyCap = this.levelAlchemyCap(glyph.level);
      for (const glyphTypeName of ALCHEMY_BASIC_GLYPH_TYPES) {
        if (glyphTypeName !== glyph.type) {
          const glyphType = GlyphTypes[glyphTypeName];
          const otherResource = AlchemyResources.all[glyphType.alchemyResource];
          const maxResouce = Math.max(alchemyCap, otherResource.amount);
          otherResource.amount = Math.clampMax(otherResource.amount + decoherenceGain, maxResouce);
        }
      }
      Glyphs.removeFromInventory(glyph);
    }
  }
};

// Gives a maximum resource total possible, based on the highest level glyph in recent realities. This doesn't
// actually enforce any special behavior, but instead only affects various UI properties.
function estimatedAlchemyCap() {
  return GlyphSacrificeHandler.levelAlchemyCap(player.lastTenRealities.map(([, , , , lvl]) => lvl).max());
}

function autoAdjustGlyphWeights() {
  const sources = getGlyphLevelSources();
  const f = x => Math.pow(Math.clampMin(1, Math.log(5 * x)), 3 / 2);
  const totalWeight = Object.values(sources).map(f).sum();
  player.celestials.effarig.glyphWeights.ep = 100 * f(sources.epBase) / totalWeight;
  player.celestials.effarig.glyphWeights.repl = 100 * f(sources.replBase) / totalWeight;
  player.celestials.effarig.glyphWeights.dt = 100 * f(sources.dtBase) / totalWeight;
  player.celestials.effarig.glyphWeights.eternities = 100 * f(sources.eterBase) / totalWeight;
}

function getGlyphLevelSources() {
  // Glyph levels are the product of 3 or 4 sources (eternities are enabled via upgrade).
  // Once Effarig is unlocked, these contributions can be adjusted; the math is described in detail
  // in getGlyphLevelInputs. These *Base values are the nominal inputs, as they would be multiplied without Effarig
  const eternityPoints = canEternity() ? player.eternityPoints.plus(gainedEternityPoints()) : player.eternityPoints;
  const epBase = Math.pow(Math.max(1, eternityPoints.pLog10()) / 4000, 0.5);
  // @ts-ignore
  const replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
  // 0.025148668593658708 comes from 1/Math.sqrt(100000 / Math.sqrt(4000)), but really, the
  // factors assigned to repl and dt can be arbitrarily tuned
  const replBase = Math.pow(Math.max(1, player.replicanti.amount.log10()), replPow) * 0.02514867;
  const dtBase = Math.pow(Math.max(1, player.dilation.dilatedTime.pLog10()), 1.3) * 0.02514867;
  const eterBase = Effects.max(1, RealityUpgrade(18));
  return { epBase, replBase, dtBase, eterBase };
}

function getGlyphLevelInputs() {
  const { epBase, replBase, dtBase, eterBase } = getGlyphLevelSources();
  // If the nomial blend of inputs is a * b * c * d, then the contribution can be tuend by
  // changing the exponents on the terms: aⁿ¹ * bⁿ² * cⁿ³ * dⁿ⁴
  // If n1..n4 just add up to 4, then the optimal strategy is to just max out the one over the
  // largest term -- so probably replicants, So, instead of using the weights directly, a
  // function of the weights is used: n_i = (4 w_i)^blendExp; put differently, the exponents
  // don't add up to 4, but their powers do (for blendExp = 1/3, the cubes of the exponents sum to
  // 4.
  // The optimal weights, given a blendExp, are proportional to log(x)^(1/(1- blendExp))
  const blendExp = 1 / 3;
  // Besides adding an exponent to a, b, c, and d, we can also scale them before exponentiation.
  // So, we'd have (s a)ⁿ¹ * (s b)ⁿ² * (s c)ⁿ³ * (s d)ⁿ⁴
  // Then, we can divide the result by s⁴; this does nothing for even weights
  // This can reduce the effect that Effarig can have; consider the following examples:
  // Inputs : 100, 1, 1, 1. Nominal result : 100
  // blendExp = 1/3; optimal weights: 1, 0, 0, 0; result = 1493
  // Scaling by 100: 10000, 100, 100, 100
  //                 optimal weights: 0.485, 0.17, 0.17, 0.17; result = 191.5
  // The degree of this effect depends on the scale of the inputs:
  // Inputs: 1000, 1, 1, 1. Nominal result: 1000
  //                 optimal weights: 1, 0, 0, 0; result = 57836
  // Scaling by 100: 100000, 100, 100, 100
  //                 optimal weights: 0.57, 0.14, 0.14, 0.14; result = 3675
  // Scaling does allow the user to produce results less than 1
  // 100000, 100, 100, 100 with weights of 0, 1, 0, 0 results in 1.49e-5
  // For display purposes, each term is divided independently by s.
  const preScale = 5;
  const weights = player.celestials.effarig.glyphWeights;
  const adjustFactor = (input, weight) =>
    (input > 0 ? Math.pow(input * preScale, Math.pow(4 * weight, blendExp)) / preScale : 0);
  const epEffect = adjustFactor(epBase, weights.ep / 100);
  const replEffect = adjustFactor(replBase, weights.repl / 100);
  const dtEffect = adjustFactor(dtBase, weights.dt / 100);
  const eterEffect = adjustFactor(eterBase, weights.eternities / 100);
  const perkShopEffect = Effects.max(1, PerkShopUpgrade.glyphLevel);
  const shardFactor = Ra.has(RA_UNLOCKS.SHARD_LEVEL_BOOST) ? RA_UNLOCKS.SHARD_LEVEL_BOOST.effect() : 0;
  let baseLevel = epEffect * replEffect * dtEffect * eterEffect * perkShopEffect + shardFactor;

  const singularityEffect = SingularityMilestone(18).isUnlocked ? SingularityMilestone(18).effectValue : 1;
  baseLevel *= singularityEffect;

  let scaledLevel = baseLevel;
  // With begin = 1000 and rate = 250, a base level of 2000 turns into 1500; 4000 into 2000
  const instabilityScaleBegin = Glyphs.instabilityThreshold;
  const instabilityScaleRate = 500;
  if (scaledLevel > instabilityScaleBegin) {
    const excess = (scaledLevel - instabilityScaleBegin) / instabilityScaleRate;
    scaledLevel = instabilityScaleBegin + 0.5 * instabilityScaleRate * (Math.sqrt(1 + 4 * excess) - 1);
  }
  const hyperInstabilityScaleBegin = Glyphs.hyperInstabilityThreshold;
  const hyperInstabilityScaleRate = 400;
  if (scaledLevel > hyperInstabilityScaleBegin) {
    const excess = (scaledLevel - hyperInstabilityScaleBegin) / hyperInstabilityScaleRate;
    scaledLevel = hyperInstabilityScaleBegin + 0.5 * hyperInstabilityScaleRate * (Math.sqrt(1 + 4 * excess) - 1);
  }
  const scalePenalty = scaledLevel > 0 ? baseLevel / scaledLevel : 1;
  const rowFactor = [Array.range(1, 5).every(x => RealityUpgrade(x).boughtAmount > 0)]
    .concat(Array.range(1, 4).map(x => Array.range(1, 5).every(y => RealityUpgrade(5 * x + y).isBought)))
    .filter(x => x)
    .length;
  const achievementFactor = Effects.sum(Achievement(148), Achievement(166));
  baseLevel += rowFactor + achievementFactor;
  scaledLevel += rowFactor + achievementFactor;
  // Temporary runaway prevention (?)
  const levelHardcap = 1000000;
  const levelCapped = scaledLevel > levelHardcap;
  scaledLevel = Math.min(scaledLevel, levelHardcap);
  return {
    epEffect,
    replEffect,
    dtEffect,
    eterEffect,
    perkShop: perkShopEffect,
    scalePenalty,
    rowFactor,
    achievementFactor,
    shardFactor,
    rawLevel: baseLevel,
    actualLevel: Math.max(1, scaledLevel),
    capped: levelCapped
  };
}

class GlyphEffectState {
  constructor(id, props) {
    this._id = id;
    this._adjustApply = props.adjustApply;
  }

  applyEffect(applyFn) {
    let effectValue = getAdjustedGlyphEffect(this._id);
    if (this._adjustApply !== undefined) {
      effectValue = this._adjustApply(effectValue);
    }
    applyFn(effectValue);
  }
}

const GlyphEffect = {
  dimBoostPower: new GlyphEffectState("powerdimboost", {
    adjustApply: value => Math.max(1, value)
  }),
  ipMult: new GlyphEffectState("infinityIP", {
    adjustApply: value => Decimal.max(1, value)
  }),
  epMult: new GlyphEffectState("timeEP", {
    adjustApply: value => Decimal.max(1, value)
  })
};

class RealityUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get currency() {
    return Currency.realityMachines;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.reality.upgradeBits;
  }

  set bits(value) {
    player.reality.upgradeBits = value;
  }

  get isAvailableForPurchase() {
    return player.reality.upgReqs[this.id];
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    if (this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.reality.upgReqs[this.id] = true;
    if (player.realities > 0 || TimeStudy.reality.isBought) {
      GameUI.notify.reality(`You've unlocked a Reality Upgrade: ${this.config.name}`);
    }
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.REALITY_UPGRADE_BOUGHT);
    const id = this.id;
    if (id === 9 || id === 24) {
      Glyphs.refreshActive();
    }
    if (id === 10) {
      applyRUPG10();
      EventHub.dispatch(GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT);
    }
    if (id === 20 && player.blackHole[0].unlocked) {
      player.blackHole[1].unlocked = true;
    }
  }
}

class RebuyableRealityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.realityMachines;
  }

  get boughtAmount() {
    return player.reality.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.reality.rebuyables[this.id] = value;
  }

  get autobuyerId() {
    return this.id - 1;
  }

  get isAutobuyerOn() {
    return player.reality.rebuyablesAuto[this.autobuyerId];
  }

  set isAutobuyerOn(value) {
    player.reality.rebuyablesAuto[this.autobuyerId] = value;
  }
}

RealityUpgradeState.index = mapGameData(
  GameDatabase.reality.upgrades,
  config => (config.id < 6
      ? new RebuyableRealityUpgradeState(config)
      : new RealityUpgradeState(config))
);

/**
 * @param {number} id
 * @return {RealityUpgradeState|RebuyableRealityUpgradeState}
 */
const RealityUpgrade = id => RealityUpgradeState.index[id];

const RealityUpgrades = {
  /**
   * @type {(RealityUpgradeState|RebuyableRealityUpgradeState)[]}
   */
  all: RealityUpgradeState.index.compact(),
  get allBought() {
    // eslint-disable-next-line no-bitwise
    return (player.reality.upgradeBits >> 6) + 1 === 1 << (GameDatabase.reality.upgrades.length - 5);
  }
};
