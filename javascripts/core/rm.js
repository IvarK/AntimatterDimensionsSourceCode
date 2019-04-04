// TODO, add more types
//TODO, add more effects for time and effects for dilation and replication and infinity

const orderedEffectList = ["powerpow", "infinitypow", "replicationpow", "timepow",
  "dilationpow", "powermult", "powerdimboost", "powerbuy10",
  "dilationTTgen", "infinityinfmult", "infinityipgain", "timeeternity",
  "dilationdilationMult", "replicationdtgain", "replicationspeed", "timespeed",
  "timefreeTickMult", "dilationgalaxyThreshold", "infinityrate", "replicationglyphlevel",
  "effarigblackhole", "effarigrm", "effarigglyph", "effarigachievement", "effarigforgotten", "effarigdimensions", "effarigantimatter"];

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
    let typeCfg = AutoGlyphSacrifice.types[glyph.type];
    if (AutoGlyphSacrifice.mode === AutoGlyphSacMode.RARITY_THRESHOLDS) {
      return strengthToRarity(glyph.strength) - typeCfg.rarityThreshold;
    }
    if (AutoGlyphSacrifice.mode === AutoGlyphSacMode.ADVANCED) {
      let glyphScore = strengthToRarity(glyph.strength) +
        Object.keys(glyph.effects).map(e => typeCfg.effectScores[glyph.type + e]).sum();
      return glyphScore - typeCfg.scoreThreshold;
    }
    return strengthToRarity(glyph.strength)
  },
  wouldSacrifice(glyph) {
    switch (AutoGlyphSacrifice.mode) {
      case AutoGlyphSacMode.NONE: return false;
      case AutoGlyphSacMode.ALL: return true;
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
    let strength = this.randomStrength(false);
    player.reality.glyphs.last = "power";
    return {
      id: Date.now(),
      idx: null,
      type: "power",
      strength: strength,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: {
        pow: getGlyphEffectStrength("powerpow", level.actualLevel, strength),
      },
    }
  },

  randomGlyph(level, fake) {
    let strength = this.randomStrength(fake);
    let type = this.randomType(fake);
    let numEffects = this.randomNumberOfEffects(strength, level.actualLevel, fake);
    let effects = this.generateEffects(type, numEffects, fake);
    // Effects come out as powerpow, powerdimboost, etc. Glyphs store them
    // abbreviated.
    let abbreviateEffect = e => e.startsWith(type) ? e.substr(type.length) : e;
    return {
      id: this.makeId(fake),
      idx: null,
      type: type,
      strength: strength,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: effects.mapToObject(e => abbreviateEffect(e),
        e => getGlyphEffectStrength(e, level.actualLevel, strength)),
    }
  },

  makeId(fake) {
    let rng = this.getRNG(fake);
    return parseInt(Date.now().toString().slice(-11) + rng().toFixed(2).slice(2));
  },

  get strengthMultiplier() {
    return Effects.max(1, RealityUpgrade(16));
  },

  randomStrength(fake) {
    let result;
    // Divide the extra minimum rarity by the strength multiplier
    // since we'll multiply by the strength multiplier later.
    let minimumValue = 1 + (Perk.glyphRarityIncrease.isBought ? 0.125 / GlyphGenerator.strengthMultiplier : 0);
    do {
      result = GlyphGenerator.gaussianBellCurve(this.getRNG(fake));
    } while (result <= minimumValue);
    result *= GlyphGenerator.strengthMultiplier;
    // Each rarity% is 0.025 strength.
    result += Effects.sum(GlyphSacrifice.effarig) / 40;
    return result;
  },

  randomNumberOfEffects(strength, level, fake) {
    let rng = this.getRNG(fake);
    let ret = Math.min(Math.floor(Math.pow(rng(), 1 - (Math.pow(level * strength, 0.5)) / 100) * 1.5 + 1), 4)
    if (RealityUpgrade(17).isBought && rng() > 0.5) ret = Math.min(ret + 1, 4)
    return ret;
  },

  generateEffects(type, count, fake) {
    let rng = this.getRNG(fake);
    let ret = [];
    if (GlyphTypes[type].primaryEffect) ret.push(GlyphTypes[type].primaryEffect);
    for (let i = ret.length; i < count; ++i) {
      let effect = GlyphTypes[type].randomEffect(rng, ret);
      if (!effect) break;
      ret.push(effect);
    }
    return ret;
  },

  randomType(fake) {
    let rng = this.getRNG(fake);
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
    let x = Math.sin(player.reality.seed++) * 10000;
    return x - Math.floor(x);
  },

  /**
   * More than 3 approx 0.001%
   * More than 2.5 approx 0.2%
   * More than 2 approx 6%
   * More than 1.5 approx 38.43%
   */
  gaussianBellCurve(rng) {
    if (rng === undefined) rng = GlyphGenerator.random;
    let u = Math.max(rng(), Number.MIN_VALUE);
    let v = rng();
    return Math.pow(Math.max(Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) + 1, 1), 0.65);
  },

  copy(glyph) {
    return glyph ? deepmerge({}, glyph) : glyph;
  },
};

const Glyphs = {
  inventory: [],
  active: [],
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
    checkGlyphAchievements();
    GameUI.dispatch(GameEvent.GLYPHS_CHANGED);
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
    GameUI.dispatch(GameEvent.GLYPHS_CHANGED);
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
    GameUI.dispatch(GameEvent.GLYPHS_CHANGED);
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
      GameUI.dispatch(GameEvent.GLYPHS_CHANGED);
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
    GameUI.dispatch(GameEvent.GLYPHS_CHANGED);
  },
  addToInventory(glyph) {
    this.validate();
    let index = this.findFreeIndex();
    if (index < 0) return;
    this.inventory[index] = glyph;
    glyph.idx = index;
    player.reality.glyphs.inventory.push(glyph);
    checkGlyphAchievements();
    GameUI.dispatch(GameEvent.GLYPHS_CHANGED);
    this.validate();
  },
  removeFromInventory(glyph) {
    this.validate();
    // This can get called on a glyph not in inventory, during auto sacrifice.
    let index = player.reality.glyphs.inventory.indexOf(glyph);
    if (index < 0) return;
    this.inventory[glyph.idx] = null;
    player.reality.glyphs.inventory.splice(index, 1);
    checkGlyphAchievements();
    GameUI.dispatch(GameEvent.GLYPHS_CHANGED);
    this.validate();
  },
  validate() {
    for (glyph of player.reality.glyphs.inventory) {
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
      // try to remove padding 5 at a time if possible
      let biggestPadding = GLYPH_TYPES[0];
      for (let t of GLYPH_TYPES) {
        if (byType[t].padding > byType[biggestPadding].padding) biggestPadding = t;
      }
      const delta = byType[biggestPadding].padding > 12 ? 10 : (byType[biggestPadding].padding > 5 ? 5 : 1);
      totalDesiredPadding -= delta;
      byType[biggestPadding].padding -= delta;
    }
    let outIndex = 0;
    for (let t of Object.values(byType)) {
      for (let g of t.glyphs) {
        if (this.inventory[outIndex]) this.swap(this.inventory[outIndex], g);
        else this.moveToEmpty(g, outIndex);
        ++outIndex;
      }
      outIndex += t.padding;
    }
  },
};

class GlyphSacrificeState extends GameMechanicState {
  constructor(config) {
    super(config);
  }
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
  };
})();

// All glyph effects should be calculated here and will be recalculated on-load if rebalanced
function getGlyphEffectStrength(effectKey, level, strength) {
  switch (effectKey) {
    case "powerpow":
      return 1.015 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75
    case "powermult":
      return Decimal.pow(level * strength * 10, level * strength * 9.5)
    case "powerdimboost":
      return Math.pow(level * strength, 0.5)
    case "powerbuy10":
      return 1 + Math.pow(level * strength, 0.8) / 10
    case "infinitypow":
      return 1.007 + Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 75
    case "infinityrate":
      return Math.pow(level, 0.2) * Math.pow(strength, 0.4) * 0.1
    case "infinityipgain":
      return Math.pow(level * strength, 5) * 100
    case "infinityinfmult":
      return Math.pow(level * strength, 1.5) * 2
    case "replicationspeed":
      return level * strength * 3
    case "replicationpow":
      return 1.1 + Math.pow(level, 0.5) * strength / 25
    case "replicationdtgain":
      return 0.0003 * Math.pow(level, 0.3) * Math.pow(strength, 0.65) // player.replicanti.e * x
    case "replicationglyphlevel":
      return Math.pow(Math.pow(level, 0.25) * Math.pow(strength, 0.4), 0.5) / 50
    case "dilationdilationMult":
      return Math.pow(level * strength, 1.5) * 2
    case "dilationgalaxyThreshold":
      return 1 - Math.pow(level, 0.17) * Math.pow(strength, 0.35) / 100
    case "dilationTTgen":
      return Math.pow(level * strength, 0.5) / 10000 //Per second
    case "dilationpow":
      return 1.1 + Math.pow(level, 0.7) * Math.pow(strength, 0.7) / 25
    case "timepow":
      return 1.01 + Math.pow(level, 0.3) * Math.pow(strength, 0.45) / 75
    case "timespeed":
      let ret = 1 + Math.pow(level, 0.3) * Math.pow(strength, 0.65) * 5 / 100
      if (Enslaved.has(ENSLAVED_UNLOCKS.TIME_EFFECT_MULT)) {
        return ret * Math.max(Math.sqrt(Enslaved.totalInfinities.clampMin(1).log10()), 1);
      }
      else return ret
    case "timefreeTickMult":
      return 1 - Math.pow(level, 0.18) * Math.pow(strength, 0.35) / 100
    case "timeeternity":
      return Math.pow(level * strength, 3) * 100
    case "effarigblackhole":
      return 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 75
    case "effarigrm":
      return Math.pow(level, 0.6) * strength;
    case "effarigglyph":
      return Math.floor(10 * Math.pow(level * strength, 0.5));
    case "effarigachievement":
      return 1 + Math.pow(level, 0.4) * Math.pow(strength, 0.6) / 50
    case "effarigforgotten":
      return 1 + 2 * Math.pow(level, 0.25) * Math.pow(strength, 0.4);
    case "effarigdimensions":
      return 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 500
    case "effarigantimatter":
      return 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 5000
    default:
      return 0;
  }
}

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
  let separated = separateEffectKey(effectKey);
  let type = separated[0];
  let effect = separated[1];
  let effectDef = GameDatabase.reality.glyphEffects[effectKey];
  if (effectDef === undefined) {
    throw crash(`Unknown glyph effect requested "${effectKey}"'`)
  }
  return player.reality.glyphs.active
    .filter(glyph => glyph.type === type && glyph.effects[effect] !== undefined)
    .map(glyph => glyph.effects[effect]);
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

// Makes sure level is a positive whole number and rarity is >0% (retroactive fixes) and also recalculates effects accordingly
function calculateGlyph(glyph) {
  if (glyph.color === undefined && glyph.symbol === undefined) {
    glyph.level = Math.max(1, Math.round(glyph.level));
    if (glyph.rawLevel === undefined) {
      // Only correct below the second round of instability, but it only matters for glyphs produced before
      // this was merged, so it's not a big deal.
      glyph.rawLevel = glyph.level < 1000 ? glyph.level : (Math.pow(0.004 * glyph.level - 3, 2) - 1) * 125 + 1000;
    }
    if (glyph.strength == 1)
      glyph.strength = gaussianBellCurve()
    for (let effect in glyph.effects) {
      if (glyph.effects.hasOwnProperty(effect)) {
        if (Effarig.isRunning) {
          glyph.effects[effect] = getGlyphEffectStrength(glyph.type + effect, Math.min(glyph.level, Effarig.glyphLevelCap), glyph.strength);
        }
        else {
          glyph.effects[effect] = getGlyphEffectStrength(glyph.type + effect, glyph.level, glyph.strength);
        }
      }
    }
  }
}

function getRarity(x) {
  return GlyphRarities.find(e => x >= e.minStrength);
}

/**
 * key is type+effect
 */
function separateEffectKey(effectKey) {
  let type = "";
  let effect = ""
  for (let i = 0; i < GLYPH_TYPES.length; i++) {
    if (effectKey.substring(0, GLYPH_TYPES[i].length) === GLYPH_TYPES[i]) {
      type = GLYPH_TYPES[i];
      effect = effectKey.substring(GLYPH_TYPES[i].length);
      break;
    }
  }
  return [type, effect]
}

function checkGlyphAchievements() {
  const glyphs = player.reality.glyphs.inventory;
  if (glyphs.length === 100) giveAchievement("Personal Space")
  if (glyphs.length === 0 && player.realities >= 100) giveAchievement("Do I really have to do this?")
  if (glyphs.some((g) => g.strength >= 3.5)) giveAchievement("Why did you have to add RNG to the game?")
  if (glyphs.every((g) => g.strength >= 2) && glyphs.length === 100) giveAchievement("I'm up all night to get lucky")
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

function canSacrifice(glyph) {
  return RealityUpgrade(19).isBought;
}

function glyphSacrificeGain(glyph) {
  if (!canSacrifice()) return 0;
  return Math.pow(glyph.level + 10, 2.5) * glyph.strength * Teresa.runRewardMultiplier;
}

function sacrificeGlyph(glyph, force = false) {
  let toGain = glyphSacrificeGain(glyph);
  if (!force && !confirm("Do you really want to sacrifice this glyph? Your total power of sacrificed " + glyph.type + " glyphs will increase to " + (player.reality.glyphs.sac[glyph.type] + toGain).toFixed(2))) return
  player.reality.glyphs.sac[glyph.type] += toGain
  if (glyph.type === "time") {
    player.timeDimension8.power = Decimal.pow(2 * Effects.product(GlyphSacrifice.time), player.timeDimension8.bought)
  }
  if (glyph.type === "infinity") {
    player.infinityDimension8.power = Decimal.pow(5 * Effects.product(GlyphSacrifice.infinity), IDAmountToIDPurchases(player.infinityDimension8.baseAmount))
  }
  Glyphs.removeFromInventory(glyph);

  if (glyph.strength >= 3.25) giveAchievement("Transcension sucked anyway")
  if (glyph.strength >= 3.5) giveAchievement("True Sacrifice")
}

function getGlyphLevelInputs() {
  // Glyph levels are the product of 3 or 4 sources (eternities are enabled via upgrade).
  // Once Effarig is unlocked, these contributions can be adjusted; the math is described in detail
  // below. These *Base values are the nominal inputs, as they would be multiplied without Effarig
  const epBase = Math.pow(Math.max(1, player.eternityPoints.log10()) / 4000, 0.5);
  // @ts-ignore
  const replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
  // 0.025148668593658708 comes from 1/Math.sqrt(100000 / Math.sqrt(4000)), but really, the
  // factors assigned to repl and dt can be arbitrarily tuned
  const replBase = Math.pow(Math.max(1, player.replicanti.amount.log10()), replPow) * 0.02514867;
  const dtBase = Math.pow(Math.max(1, player.dilation.dilatedTime.log10()), 1.3) * 0.02514867;
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
  let weights = player.celestials.effarig.glyphWeights;
  var adjustFactor = (input, weight) => input > 0 ? Math.pow(input * preScale, Math.pow(4 * weight, blendExp)) / preScale : 0;
  var epEffect = adjustFactor(epBase, weights.ep / 100);
  var replEffect = adjustFactor(replBase, weights.repl / 100);
  var dtEffect = adjustFactor(dtBase, weights.dt / 100);
  var eterEffect = adjustFactor(eterBase, weights.eternities / 100);
  var baseLevel = epEffect * replEffect * dtEffect * eterEffect * player.celestials.teresa.glyphLevelMult * Ra.glyphMult;
  var scaledLevel = baseLevel;
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
  let scalePenalty = baseLevel / scaledLevel;
  let perkFactor = Effects.sum(
    Perk.glyphLevelIncrease1,
    Perk.glyphLevelIncrease2
  );
  return {
    epEffect: epEffect,
    replEffect: replEffect,
    dtEffect: dtEffect,
    eterEffect: eterEffect,
    perkShop: player.celestials.teresa.glyphLevelMult,
    scalePenalty: scalePenalty,
    perkFactor: perkFactor,
    rawLevel: baseLevel + perkFactor,
    actualLevel: scaledLevel + perkFactor,
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

class RealityUpgradeState extends GameMechanicState {
  get isAffordable() {
    return player.reality.realityMachines.gte(this.cost);
  }

  get isBought() {
    // eslint-disable-next-line no-bitwise
    return (player.reality.upgradeBits & (1 << this.id)) !== 0;
  }

  get canBeBought() {
    return !this.isBought && this.isAffordable && this.isUnlocked;
  }

  get canBeApplied() {
    return this.isBought;
  }

  purchase() {
    const { id } = this;
    if (!this.canBeBought) return false;
    player.reality.realityMachines = player.reality.realityMachines.minus(this.cost);
    if (id < 6) {
      player.reality.rebuyables[id]++;
    } else {
      // eslint-disable-next-line no-bitwise
      player.reality.upgradeBits |= (1 << id);
    }

    if (id === 9 || id === 24) {
      Glyphs.refreshActive();
    }

    if (id === 20) {
      if (!player.blackHole[0].unlocked) return true;
      player.blackHole[1].unlocked = true;
      $("#bhupg2").show();
    }

    if (RealityUpgrades.allBought) giveAchievement("Master of Reality");
    updateBlackHoleUpgrades();
    return true;
  }

  remove() {
    // eslint-disable-next-line no-bitwise
    player.reality.upgradeBits &= ~(1 << this.id);
  }

  get isUnlocked() {
    return player.reality.upgReqs[this.id];
  }

  tryUnlock() {
    if (!this.isUnlocked && this.config.checkRequirement()) {
      player.reality.upgReqs[this.id] = true;
      if (player.realities > 0 || TimeStudy.reality.isBought) {
        GameUI.notify.success("You've unlocked a Reality upgrade!");
      }
    }
  }
}

class RebuyableRealityUpgradeState extends RealityUpgradeState {
  get cost() {
    return this.config.cost();
  }

  get isBought() {
    return false;
  }

  get canBeApplied() {
    return true;
  }

  get canBeBought() {
    return this.isAffordable;
  }
}

RealityUpgradeState.list = mapGameData(
  GameDatabase.reality.upgrades,
  config => (config.id < 6
      ? new RebuyableRealityUpgradeState(config)
      : new RealityUpgradeState(config))
);

/**
 *
 * @param {number} id
 * @return {RealityUpgradeState}
 */
function RealityUpgrade(id) {
  return RealityUpgradeState.list[id];
}

const RealityUpgrades = {
  get list() {
    return RealityUpgradeState.list;
  },

  get allBought() {
    // eslint-disable-next-line no-bitwise
    return (player.reality.upgradeBits >> 6) + 1 === 1 << (GameDatabase.reality.upgrades.length - 5);
  },

  tryUnlock(ids) {
    for (const id of ids) {
      RealityUpgrade(id).tryUnlock();
    }
  }
};
