"use strict";

const orderedEffectList = ["powerpow", "infinitypow", "replicationpow", "timepow",
  "dilationpow", "powermult", "powerdimboost", "powerbuy10",
  "dilationTTgen", "infinityinfmult", "infinityipgain", "timeeternity",
  "dilationdilationMult", "replicationdtgain", "replicationspeed", "timespeed",
  "timefreeTickMult", "dilationgalaxyThreshold", "infinityrate", "replicationglyphlevel",
  "effarigblackhole", "effarigrm", "effarigglyph", "effarigachievement",
  "effarigforgotten", "effarigdimensions", "effarigantimatter"];

const GlyphEffectOrder = orderedEffectList.mapToObject(e => e, (e, idx) => idx);

function rarityToStrength(x) {
  return x * 2.5 / 100 + 1;
}

function strengthToRarity(x) {
  return (x - 1) * 100 / 2.5;
}

const AutoGlyphSacrifice = {
  get mode() {
    return player.celestials.effarig.autoGlyphSac.mode;
  },
  set mode(value) {
    player.celestials.effarig.autoGlyphSac.mode = value;
  },
  get types() {
    return player.celestials.effarig.autoGlyphSac.types;
  },
  comparedToThreshold(glyph) {
    const typeCfg = AutoGlyphSacrifice.types[glyph.type];
    if (AutoGlyphSacrifice.mode === AutoGlyphSacMode.RARITY_THRESHOLDS) {
      return strengthToRarity(glyph.strength) - typeCfg.rarityThreshold;
    }
    if (AutoGlyphSacrifice.mode === AutoGlyphSacMode.ADVANCED) {
      const effectList = getGlyphEffectsFromBitmask(glyph.effects, 0, 0).map(effect => effect.id);
      const glyphScore = strengthToRarity(glyph.strength) +
        effectList.map(e => typeCfg.effectScores[e]).sum();
      return glyphScore - typeCfg.scoreThreshold;
    }
    return strengthToRarity(glyph.strength)
  },
  wouldSacrifice(glyph) {
    switch (AutoGlyphSacrifice.mode) {
      case AutoGlyphSacMode.NONE: return false;
      case AutoGlyphSacMode.ALL:
      case AutoGlyphSacMode.ALCHEMY:
        return true;
      case AutoGlyphSacMode.RARITY_THRESHOLDS:
      case AutoGlyphSacMode.ADVANCED:
        return this.comparedToThreshold(glyph) < 0;
    }
    throw crash("Unknown auto glyph sacrifice mode");
  },
};

const AutoGlyphPicker = {
  get mode() {
    return player.celestials.effarig.autoGlyphPick.mode;
  },
  set mode(value) {
    player.celestials.effarig.autoGlyphPick.mode = value;
  },
  getPickScore(glyph) {
    // This function is non-deterministic, keep that in mind when calling it
    // (for example, cache the results).
    switch (AutoGlyphPicker.mode) {
      case AutoGlyphPickMode.RANDOM: return Math.random();
      case AutoGlyphPickMode.RARITY: return strengthToRarity(glyph.strength);
      case AutoGlyphPickMode.ABOVE_SACRIFICE_THRESHOLD:
        let comparedToThreshold = AutoGlyphSacrifice.comparedToThreshold(glyph);
        if (comparedToThreshold < 0) {
          // We're going to sacrifice the glyph anyway. Also, if we have 1000% rarity glyphs everything has broken,
          // so subtracting 1000 should be safe (glyphs we would sacrifice are sorted below all other glyphs).
          return strengthToRarity(glyph.strength) - 1000;
        }
        return comparedToThreshold;
    }
    throw crash("Unknown auto glyph picker mode");
  },
  pick(glyphs) {
    return glyphs
      .map(g => ({glyph: g, score: this.getPickScore(g)}))
      .reduce((x, y) => x.score > y.score ? x : y)
      .glyph;
  }
};

const GlyphGenerator = {
  lastFake: "power",

  startingGlyph(level) {
    player.reality.glyphs.last = "power";
    const initialStrength = 1.5;
    return {
      id: Date.now(),
      idx: null,
      type: "power",
      // The initial strength is very slightly above average.
      strength: initialStrength,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: this.makeEffectBitmask(["powerpow"]),
    };
  },

  randomGlyph(level, fake) {
    const strength = this.randomStrength(fake);
    const type = this.randomType(fake);
    let numEffects = this.randomNumberOfEffects(strength, level.actualLevel, fake);
    if (type !== "effarig" && numEffects > 4) numEffects = 4;
    const effects = this.generateEffects(type, numEffects, fake);
    const effectBitmask = this.makeEffectBitmask(effects);
    return {
      id: this.makeID(),
      idx: null,
      type: type,
      strength: strength,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: effectBitmask,
    };
  },

  realityGlyph(level, chosenEffects) {
    const str = rarityToStrength(100);
    const maxEffects = 4;
    const effects = this.generateRealityEffects(maxEffects, chosenEffects);
    const effectBitmask = this.makeEffectBitmask(effects);
    return {
      id: this.makeID(),
      idx: null,
      type: "reality",
      strength: str,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: effectBitmask,
    };
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

  randomStrength(fake) {
    let result;
    // Divide the extra minimum rarity by the strength multiplier
    // since we'll multiply by the strength multiplier later.
    const minimumValue = 1 + (Perk.glyphRarityIncrease.isBought ? 0.125 / GlyphGenerator.strengthMultiplier : 0);
    do {
      result = GlyphGenerator.gaussianBellCurve(this.getRNG(fake));
    } while (result <= minimumValue);
    result *= GlyphGenerator.strengthMultiplier;
    const increasedRarity = Effects.sum(GlyphSacrifice.effarig) +
      (Ra.has(RA_UNLOCKS.IMPROVED_GLYPHS) ? RA_UNLOCKS.IMPROVED_GLYPHS.effect.rarity() : 0);
    // Each rarity% is 0.025 strength.
    result += increasedRarity / 40;
    return Math.min(result, rarityToStrength(100));
  },

  randomNumberOfEffects(strength, level, fake) {
    const rng = this.getRNG(fake);
    const maxEffects = Ra.has(RA_UNLOCKS.GLYPH_EFFECT_COUNT) ? 7 : 4;
    let num = Math.min(Math.floor(Math.pow(rng(), 1 - (Math.pow(level * strength, 0.5)) / 100) * 1.5 + 1), maxEffects);
    if (RealityUpgrade(17).isBought && rng() > 0.5) num = Math.min(num + 1, maxEffects);
    if (Ra.has(RA_UNLOCKS.GLYPH_EFFECT_COUNT)) num = Math.max(num, 4);
    return num;
  },

  // "count" specifies the total number of effects in the glyph. However, this won't remove effects if chosenEffects
  // is larer than count.
  generateRealityEffects(count, chosenEffects) {
    const rng = this.getRNG();
    let possibleEffects = orderedEffectList.filter(effect => !effect.match("effarig*"));
    for (const chosenEffect of chosenEffects) {
      possibleEffects = possibleEffects.filter(effect => !effect.match(chosenEffect));
    }
    const randomEffects = [];
    for (let i = chosenEffects.length; i < count && possibleEffects.length > 0; i++) {
      const nextEffect = possibleEffects[Math.floor(rng() * possibleEffects.length)];
      possibleEffects = possibleEffects.filter(effect => !effect.match(nextEffect));
      randomEffects.push(nextEffect);
    }
    return randomEffects.concat(chosenEffects);
  },

  generateEffects(type, count, fake) {
    const rng = this.getRNG(fake);
    const effects = [];
    const blacklist = [];
    if (GlyphTypes[type].primaryEffect) {
      effects.push(GlyphTypes[type].primaryEffect);
      blacklist.push(GlyphTypes[type].primaryEffect);
    }
    for (let i = effects.length; i < count; ++i) {
      const effect = GlyphTypes[type].randomEffect(rng, blacklist);
      if (!effect) break;
      effects.push(effect);
      blacklist.push(effect);
      // Ensure RM/instability are mutually exclusive until more than 4 effects
      if (type === "effarig" && count <= 4) {
        if (effect === "effarigrm") blacklist.push("effarigglyph");
        if (effect === "effarigglyph") blacklist.push("effarigrm");
      }
    }
    return effects;
  },

  makeEffectBitmask(effectList) {
    // eslint-disable-next-line no-bitwise
    return effectList.reduce((mask, eff) => mask + (1 << GameDatabase.reality.glyphEffects[eff].bitmaskIndex), 0);
  },

  randomType(fake) {
    const rng = this.getRNG(fake);
    if (fake) {
      GlyphGenerator.lastFake = GlyphTypes.random(rng, [GlyphGenerator.lastFake]);
      return GlyphGenerator.lastFake;
    }
    player.reality.glyphs.last = GlyphTypes.random(rng, [player.reality.glyphs.last]);
    return player.reality.glyphs.last;
  },

  getRNG(fake) {
    return fake ? Math.random : GlyphGenerator.random;
  },

  random() {
    const x = Math.sin(player.reality.seed++) * 10000;
    return x - Math.floor(x);
  },

  /**
   * More than 3 approx 0.001%
   * More than 2.5 approx 0.2%
   * More than 2 approx 6%
   * More than 1.5 approx 38.43%
   */
  gaussianBellCurve(rng = GlyphGenerator.random) {
    const u = Math.max(rng(), Number.MIN_VALUE);
    const v = rng();
    return Math.pow(Math.max(Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) + 1, 1), 0.65);
  },

  copy(glyph) {
    return glyph ? deepmerge({}, glyph) : glyph;
  },
};

const Glyphs = {
  inventory: [],
  active: [],
  get inventoryList() {
    return player.reality.glyphs.inventory;
  },
  get activeList() {
    return player.reality.glyphs.active;
  },
  findFreeIndex() {
    this.validate();
    return this.inventory.indexOf(null);
  },
  get freeInventorySpace() {
    this.validate();
    return this.inventory.filter(e => e === null).length;
  },
  get activeSlotCount() {
    return 3 + Effects.sum(RealityUpgrade(9), RealityUpgrade(24));
  },
  refreshActive() {
    this.active = new Array(this.activeSlotCount).fill(null);
    for (let g of player.reality.glyphs.active) {
      if (this.active[g.idx]) {
        throw crash("Stacked active glyphs?")
      }
      this.active[g.idx] = g;
    }
  },
  refresh() {
    this.refreshActive();
    this.inventory = new Array(player.reality.glyphs.inventorySize).fill(null);
    // Glyphs could previously end up occupying the same inventory slot (Stacking)
    let stacked = [];
    for (let g of player.reality.glyphs.inventory) {
      if (this.inventory[g.idx]) {
        stacked.push(g);
      } else {
        this.inventory[g.idx] = g;
      }
    }
    // Try to unstack glyphs:
    while (stacked.length) {
      let freeIndex = this.findFreeIndex();
      if (freeIndex >= 0) {
        let glyph = stacked.shift();
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
    EventHub.dispatch(GameEvent.GLYPHS_CHANGED);
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
      throw crash("Inconsistent inventory indexing");
    }
    if (this.active[targetSlot] !== null) return;
    if (glyph.type === 'effarig' && this.active.some(x => x && x.type === 'effarig')) return;
    this.removeFromInventory(glyph);
    player.reality.glyphs.active.push(glyph);
    glyph.idx = targetSlot;
    this.active[targetSlot] = glyph;
    EventHub.dispatch(GameEvent.GLYPHS_CHANGED);
    this.validate();
  },
  unequipAll() {
    while (player.reality.glyphs.active.length) {
      let freeIndex = this.findFreeIndex();
      if (freeIndex < 0) break;
      let glyph = player.reality.glyphs.active.pop();
      this.active[glyph.idx] = null;
      Glyphs.addToInventory(glyph);
    }
    EventHub.dispatch(GameEvent.GLYPHS_CHANGED);
  },
  moveToSlot(glyph, targetSlot) {
    if (this.inventory[targetSlot] === null) this.moveToEmpty(glyph, targetSlot);
    else this.swap(glyph, this.inventory[targetSlot]);
  },
  moveToEmpty(glyph, targetSlot) {
    this.validate();
    if (this.findByInventoryIndex(glyph.idx) !== glyph) {
      throw crash("Inconsistent inventory indexing");
    }
    if (this.inventory[targetSlot] === null) {
      this.inventory[glyph.idx] = null;
      this.inventory[targetSlot] = glyph;
      glyph.idx = targetSlot;
      EventHub.dispatch(GameEvent.GLYPHS_CHANGED);
    } else {
      console.log("inventory slot full")
    }
    this.validate();
  },
  swap(glyphA, glyphB) {
    if (glyphA.idx === glyphB.idx) return;
    this.validate();
    this.inventory[glyphA.idx] = glyphB;
    this.inventory[glyphB.idx] = glyphA;
    const tmp = glyphA.idx;
    glyphA.idx = glyphB.idx;
    glyphB.idx = tmp;
    this.validate();
    EventHub.dispatch(GameEvent.GLYPHS_CHANGED);
  },
  addToInventory(glyph) {
    this.validate();
    let index = this.findFreeIndex();
    if (index < 0) return;
    this.inventory[index] = glyph;
    glyph.idx = index;
    player.reality.glyphs.inventory.push(glyph);
    EventHub.dispatch(GameEvent.GLYPHS_CHANGED);
    this.validate();
  },
  removeFromInventory(glyph) {
    this.validate();
    // This can get called on a glyph not in inventory, during auto sacrifice.
    let index = player.reality.glyphs.inventory.indexOf(glyph);
    if (index < 0) return;
    this.inventory[glyph.idx] = null;
    player.reality.glyphs.inventory.splice(index, 1);
    EventHub.dispatch(GameEvent.GLYPHS_CHANGED);
    this.validate();
  },
  validate() {
    for (const glyph of player.reality.glyphs.inventory) {
      if (this.inventory[glyph.idx] !== glyph) {
        throw crash("validation error");
      }
    }
    for (let i = 0; i < this.inventory.length; ++i) {
      if (this.inventory[i] && this.inventory[i].idx !== i) {
        throw crash("backwards validation error");
      }
    }
  },
  sort() {
    const freeSpace = this.freeInventorySpace;
    let byType = GLYPH_TYPES.mapToObject(g => g, () => ({ glyphs: [], padding: 0 }));
    for (let g of player.reality.glyphs.inventory) byType[g.type].glyphs.push(g);
    const compareGlyphs = (a, b) => -a.level * a.strength + b.level * b.strength;
    let totalDesiredPadding = 0;
    for (let t of Object.values(byType)) {
      t.glyphs.sort(compareGlyphs);
      t.padding = Math.ceil(t.glyphs.length / 10) * 10 - t.glyphs.length;
      // Try to get a full row of padding if possible in some cases
      if (t.padding < 5 && t.glyphs.length > 8) t.padding += 10;
      totalDesiredPadding += t.padding;
    }
    while (totalDesiredPadding > freeSpace) {
      // Try to remove padding 5 at a time if possible
      let biggestPadding = GLYPH_TYPES[0];
      for (const t of GLYPH_TYPES) {
        if (byType[t].padding > byType[biggestPadding].padding) biggestPadding = t;
      }
      let delta = byType[biggestPadding].padding > 5 ? 5 : 1;
      if (byType[biggestPadding].padding > 12) delta = 10;
      totalDesiredPadding -= delta;
      byType[biggestPadding].padding -= delta;
    }
    let outIndex = 0;
    for (const t of Object.values(byType)) {
      for (const g of t.glyphs) {
        if (this.inventory[outIndex]) this.swap(this.inventory[outIndex], g);
        else this.moveToEmpty(g, outIndex);
        ++outIndex;
      }
      outIndex += t.padding;
    }
  },
};

class GlyphSacrificeState extends GameMechanicState {
  get canBeApplied() { return true; }
}

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
 * Finds all equipped glyphs with the specified effect and returns an array of effect values.
 * @param {string} effectKey
 * @returns {number[]}
 */
function getGlyphEffectValues(effectKey) {
  if (orderedEffectList.filter(effect => effect === effectKey).length === 0) {
    throw crash(`Unknown glyph effect requested "${effectKey}"'`);
  }
  return player.reality.glyphs.active
  // eslint-disable-next-line no-bitwise
    .filter(glyph => ((1 << GameDatabase.reality.glyphEffects[effectKey].bitmaskIndex) & glyph.effects) !== 0)
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
    glyph => glyph.idx < player.reality.glyphs.inventorySize);
  for (let i = 0; i < player.reality.glyphs.inventory.length; i++) {
    calculateGlyph(player.reality.glyphs.inventory[i]);
  }
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

    if (glyph.strength === 1) glyph.strength = gaussianBellCurve();
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

// Turns a glyph effect bitmask into an effect list and corresponding values
function getGlyphEffectsFromBitmask(bitmask, level, strength) {
  return orderedEffectList
    .map(effectName => GameDatabase.reality.glyphEffects[effectName])
    // eslint-disable-next-line no-bitwise
    .filter(effect => (bitmask & (1 << effect.bitmaskIndex)) !== 0)
    .map(effect => ({
      id: effect.id,
      value: effect.effect(level, strength)
    }));
}

// Pulls out a single effect value from a glyph's bitmask, returning just the value (nothing for missing effects)
function getSingleGlyphEffectFromBitmask(effectName, glyph) {
  const glyphEffect = GameDatabase.reality.glyphEffects[effectName];
  // eslint-disable-next-line no-bitwise
  if ((glyph.effects & (1 << glyphEffect.bitmaskIndex)) === 0) {
    return undefined;
  }
  const level = Effarig.isRunning ? Math.min(glyph.level, Effarig.glyphLevelCap) : glyph.level;
  return glyphEffect.effect(level, glyph.strength);
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
  return orderedEffectList
    .map(effect => ({ effect, values: getGlyphEffectValues(effect) }))
    .filter(ev => ev.values.length > 0)
    .map(ev => ({
      id: ev.effect,
      value: GameDatabase.reality.glyphEffects[ev.effect].combine(ev.values),
    }));
}

function deleteGlyph(id, force) {
  const glyph = Glyphs.findById(id);
  if (canSacrifice()) return sacrificeGlyph(glyph, force);
  if (force || confirm("Do you really want to delete this glyph?")) {
    Glyphs.removeFromInventory(glyph);
  }
}

function respecGlyphs() {
  Glyphs.unequipAll();
  player.reality.respec = false;
}

function canSacrifice() {
  return RealityUpgrade(19).isBought;
}

function glyphSacrificeGain(glyph) {
  if (!canSacrifice()) return 0;
  if (glyph.type === "reality") return 0.01 * glyph.level;
  return Math.pow(glyph.level + 10, 2.5) * glyph.strength * Teresa.runRewardMultiplier;
}

function glyphAlchemyResource(glyph) {
  const type = GlyphTypes[glyph.type];
  return AlchemyResources.all[type.alchemyResource];
}

function glyphRefinementGain(glyph) {
  if (!canSacrifice()) return 0;
  const glyphMaxValue = glyph.level * strengthToRarity(glyph.strength) / 100;
  const alchemyResource = glyphAlchemyResource(glyph);
  return Math.clamp(glyphMaxValue - alchemyResource.amount, 0, 0.01 * glyphMaxValue);
}

function sacrificeGlyph(glyph, force = false) {
  if (AutoGlyphSacrifice.mode === AutoGlyphSacMode.ALCHEMY && glyph.type !== "reality") {
    const resource = glyphAlchemyResource(glyph);
    const refinementGain = glyphRefinementGain(glyph);
    resource.amount += refinementGain;
    const decoherenceGain = refinementGain * AlchemyResource.decoherence.effectValue;
    const otherGlyphTypes = GlyphTypes.list
      .filter(t => t !== GlyphTypes[glyph.type]);
    for (const glyphType of otherGlyphTypes) {
      if (glyphType.id !== "reality") {
        const currAmount = AlchemyResources.all[glyphType.alchemyResource].amount;
        const gainedResource = Math.clamp(decoherenceGain - currAmount, 0, 100 * refinementGain);
        AlchemyResources.all[glyphType.alchemyResource].amount += gainedResource;
      }
    }
    Glyphs.removeFromInventory(glyph);
    return;
  }

  const toGain = glyphSacrificeGain(glyph);
  if (!force && !confirm(`Do you really want to sacrifice this glyph? Your total power of sacrificed ${glyph.type}` +
                          `glyphs will increase to ${(player.reality.glyphs.sac[glyph.type] + toGain).toFixed(2)}`)) {
    return;
  }
  player.reality.glyphs.sac[glyph.type] += toGain;
  if (glyph.type === "time") {
    TimeDimension(8).power = Decimal.pow(
      2 * Effects.product(GlyphSacrifice.time),
      TimeDimension(8).bought
    );
  }
  if (glyph.type === "infinity") {
    InfinityDimension(8).power = Decimal.pow(
      5 * Effects.product(GlyphSacrifice.infinity),
      IDAmountToIDPurchases(InfinityDimension(8).baseAmount)
    );
  }
  Glyphs.removeFromInventory(glyph);
  EventHub.dispatch(GameEvent.GLYPH_SACRIFICED, glyph);
}

function getGlyphLevelInputs() {
  // Glyph levels are the product of 3 or 4 sources (eternities are enabled via upgrade).
  // Once Effarig is unlocked, these contributions can be adjusted; the math is described in detail
  // below. These *Base values are the nominal inputs, as they would be multiplied without Effarig
  const epBase = Math.pow(Math.max(1, player.eternityPoints.pLog10()) / 4000, 0.5);
  // @ts-ignore
  const replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
  // 0.025148668593658708 comes from 1/Math.sqrt(100000 / Math.sqrt(4000)), but really, the
  // factors assigned to repl and dt can be arbitrarily tuned
  const replBase = Math.pow(Math.max(1, player.replicanti.amount.log10()), replPow) * 0.02514867;
  const dtBase = Math.pow(Math.max(1, player.dilation.dilatedTime.pLog10()), 1.3) * 0.02514867;
  const eterBase = Effects.max(1, RealityUpgrade(18));
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
  const adjustFactor = (input, weight) => (input > 0 ? Math.pow(input * preScale, Math.pow(4 * weight, blendExp)) / preScale : 0);
  const epEffect = adjustFactor(epBase, weights.ep / 100);
  const replEffect = adjustFactor(replBase, weights.repl / 100);
  const dtEffect = adjustFactor(dtBase, weights.dt / 100);
  const eterEffect = adjustFactor(eterBase, weights.eternities / 100);
  const perkShopEffect = Effects.max(1, PerkShopUpgrade.glyphLevel);
  let baseLevel = epEffect * replEffect * dtEffect * eterEffect * perkShopEffect;
  let scaledLevel = baseLevel;
  // With begin = 1000 and rate = 250, a base level of 2000 turns into 1500; 4000 into 2000
  const scaleDelay = getAdjustedGlyphEffect("effarigglyph");
  const instabilityScaleBegin = 1000 + scaleDelay;
  const instabilityScaleRate = 500;
  if (scaledLevel > instabilityScaleBegin) {
    const excess = (scaledLevel - instabilityScaleBegin) / instabilityScaleRate;
    scaledLevel = instabilityScaleBegin + 0.5 * instabilityScaleRate * (Math.sqrt(1 + 4 * excess) - 1);
  }
  const hyperInstabilityScaleBegin = 4000 + scaleDelay;
  const hyperInstabilityScaleRate = 1000;
  if (scaledLevel > hyperInstabilityScaleBegin) {
    const excess = (scaledLevel - hyperInstabilityScaleBegin) / hyperInstabilityScaleRate;
    scaledLevel = hyperInstabilityScaleBegin + 0.5 * hyperInstabilityScaleRate * (Math.sqrt(1 + 4 * excess) - 1);
  }
  const scalePenalty = scaledLevel > 0 ? baseLevel / scaledLevel : 1;
  const perkFactor = Effects.sum(
    Perk.glyphLevelIncrease1,
    Perk.glyphLevelIncrease2
  );
  const shardFactor = RA_UNLOCKS.SHARD_LEVEL_BOOST.effect();
  const postInstabilityFactors = perkFactor + shardFactor;
  baseLevel += postInstabilityFactors;
  scaledLevel += postInstabilityFactors;
  const levelHardcap = 10000 + AlchemyResource.boundless.effectValue;
  const levelCapped = scaledLevel > levelHardcap;
  scaledLevel = Math.min(scaledLevel, levelHardcap);
  return {
    epEffect: epEffect,
    replEffect: replEffect,
    dtEffect: dtEffect,
    eterEffect: eterEffect,
    perkShop: perkShopEffect,
    scalePenalty: scalePenalty,
    perkFactor: perkFactor,
    shardFactor: shardFactor,
    rawLevel: baseLevel,
    actualLevel: scaledLevel,
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
  ipMult: new GlyphEffectState("infinityipgain", {
    adjustApply: value => Decimal.max(1, value)
  }),
  epMult: new GlyphEffectState("timeeternity", {
    adjustApply: value => Decimal.max(1, value)
  })
};

class RealityUpgradeState extends BitPurchasableMechanicState {
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

  get isAvailable() {
    return player.reality.upgReqs[this.id];
  }

  tryUnlock() {
    if (this.isAvailable || !this.config.checkRequirement()) return;
    player.reality.upgReqs[this.id] = true;
    if (player.realities > 0 || TimeStudy.reality.isBought) {
      GameUI.notify.success("You've unlocked a Reality upgrade!");
    }
  }

  purchase() {
    if (!super.purchase()) return false;
    EventHub.dispatch(GameEvent.REALITY_UPGRADE_BOUGHT);
    const id = this.id;
    if (id === 9 || id === 24) {
      Glyphs.refreshActive();
    }
    if (id === 20) {
      if (!player.blackHole[0].unlocked) return true;
      player.blackHole[1].unlocked = true;
    }
    return true;
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

EventHub.registerStateCollectionEvents(
  RealityUpgrades.all,
  rupg => rupg.config.checkEvent,
  // eslint-disable-next-line max-params
  (rupg, a1, a2, a3) => rupg.tryUnlock(a1, a2, a3)
);
