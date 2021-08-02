"use strict";

const orderedEffectList = ["powerpow", "infinitypow", "replicationpow", "timepow",
  "dilationpow", "timeshardpow", "powermult", "powerdimboost", "powerbuy10",
  "dilationTTgen", "infinityinfmult", "infinityIP", "timeEP",
  "dilationDT", "replicationdtgain", "replicationspeed", "timespeed",
  "timeetermult", "dilationgalaxyThreshold", "infinityrate", "replicationglyphlevel",
  "effarigblackhole", "effarigrm", "effarigglyph", "effarigachievement",
  "effarigforgotten", "effarigdimensions", "effarigantimatter",
  "cursedgalaxies", "cursedtickspeed", "curseddimensions", "cursedEP",
  "realityglyphlevel", "realitygalaxies", "realityrow1pow", "realityDTglyph",
  "companiondescription", "companionEP"];

const generatedTypes = ["power", "infinity", "replication", "time", "dilation", "effarig"];

// eslint-disable-next-line no-unused-vars
const GlyphEffectOrder = orderedEffectList.mapToObject(e => e, (e, idx) => idx);

function rarityToStrength(x) {
  return x * 2.5 / 100 + 1;
}

function strengthToRarity(x) {
  return (x - 1) * 100 / 2.5;
}

const Glyphs = {
  inventory: [],
  active: [],
  copies: [],
  levelBoost: 0,
  get inventoryList() {
    return player.reality.glyphs.inventory;
  },
  get sortedInventoryList() {
    return this.inventoryList.sort((a, b) => -a.level * a.strength + b.level * b.strength);
  },
  get activeList() {
    return player.reality.glyphs.active;
  },
  get allGlyphs() {
    return this.inventoryList.concat(this.activeList);
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
    return 10 * player.reality.glyphs.protectedRows;
  },
  get totalSlots() {
    return 120;
  },
  // Always ensure at least one unprotected row for new glyphs, to prevent some potentially odd-looking behavior
  changeProtectedRows(rowsToAdd) {
    player.reality.glyphs.protectedRows = Math.clamp(player.reality.glyphs.protectedRows + rowsToAdd, 0, 11);
    this.validate();
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
  findByValues(finding, ignore = { level, strength, effects }) {
    for (const glyph of this.sortedInventoryList) {
      const type = glyph.type === finding.type;
      const effects = glyph.effects === finding.effects ||
            (ignore.effects && hasAtLeastGlyphEffects(glyph.effects, finding.effects));
      const str = ignore.strength || glyph.strength === finding.strength;
      const lvl = ignore.level || glyph.level === finding.level;
      const sym = Boolean(glyph.symbol) || glyph.symbol === finding.symbol;
      if (type && effects && str && lvl && sym) return glyph;
    }
    return undefined;
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
    this.updateMaxGlyphCount();
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
    if (player.reality.glyphs.active.length) {
      Modal.message.show("Some of your glyphs could not be unequipped due to lack of inventory space.");
    }
    this.updateRealityGlyphEffects();
    this.updateMaxGlyphCount();
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
    this.updateMaxGlyphCount();
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
  },
  updateRealityGlyphEffects() {
    // There should only be one reality glyph; this picks one pseudo-randomly if multiple are cheated/glitched in
    const realityGlyph = player.reality.glyphs.active.filter(g => g.type === "reality")[0];
    if (realityGlyph === undefined) {
      this.levelBoost = 0;
      return;
    }
    // The cache at this point may not be correct yet (if we're importing a save),
    // so we use the uncached value.
    this.levelBoost = getAdjustedGlyphEffectUncached("realityglyphlevel");
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
    player.records.bestReality.glyphStrength = Math.clampMin(player.records.bestReality.glyphStrength, glyph.strength);

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
    if (player.reality.autoCollapse) this.collapseEmptySlots();
  },
  sortByPower() {
    this.sort((a, b) => -a.level * a.strength + b.level * b.strength);
  },
  sortByScore() {
    this.sort((a, b) => -AutoGlyphProcessor.filterValue(a) + AutoGlyphProcessor.filterValue(b));
  },
  sortByEffect() {
    function reverseBitstring(eff) {
      // eslint-disable-next-line no-bitwise
      return parseInt(((1 << 30) + (eff >>> 0)).toString(2).split("").reverse().join(""), 2);
    }
    // The bitwise reversal is so that the effects with the LOWER id are valued higher in the sorting.
    // This primarily meant for effarig glyph effect sorting, which makes it prioritize timespeed pow highest.
    this.sort((a, b) => -reverseBitstring(a.effects) + reverseBitstring(b.effects));
  },
  // If there are enough glyphs that are better than the specified glyph, in every way, then
  // the glyph is objectively a useless piece of garbage.
  isObjectivelyUseless(glyph, threshold) {
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
    compareThreshold = Math.clampMax(compareThreshold, threshold);
    if (toCompare.length < compareThreshold) return false;
    const comparedEffects = getGlyphEffectsFromBitmask(glyph.effects).filter(x => x.id.startsWith(glyph.type));
    const betterCount = toCompare.countWhere(other => !hasSomeBetterEffects(glyph, other, comparedEffects));
    return betterCount >= compareThreshold;
  },
  autoClean(threshold = 5) {
    const isHarsh = threshold < 5;
    // If the player hasn't unlocked sacrifice yet, prevent them from removing any glyphs.
    if (!GlyphSacrificeHandler.canSacrifice) return;
    // If auto clean could remove useful glyphs, we warn them.
    if (isHarsh && player.options.confirmations.harshAutoClean) {
      Modal.harshGlyphPurge.show();
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
      if (threshold === 0 || this.isObjectivelyUseless(glyph, threshold)) {
        AutoGlyphProcessor.getRidOfGlyph(glyph);
      }
    }
    if (player.reality.autoCollapse) this.collapseEmptySlots();
  },
  harshAutoClean() {
    this.autoClean(1);
  },
  deleteAllUnprotected() {
    this.autoClean(0);
  },
  deleteAllRejected() {
    for (const glyph of Glyphs.inventory) {
      if (glyph !== null && glyph.idx >= this.protectedSlots && !AutoGlyphProcessor.wouldKeep(glyph)) {
        AutoGlyphProcessor.getRidOfGlyph(glyph);
      }
    }
    if (player.reality.autoCollapse) this.collapseEmptySlots();
  },
  collapseEmptySlots() {
    const unprotectedGlyphs = player.reality.glyphs.inventory
      .filter(g => g.idx >= this.protectedSlots)
      .sort((a, b) => a.idx - b.idx);
    for (let index = 0; index < unprotectedGlyphs.length; index++) {
      this.moveToSlot(unprotectedGlyphs[index], this.protectedSlots + index);
    }
  },
  processSortingAfterReality() {
    if (V.has(V_UNLOCKS.AUTO_AUTOCLEAN) && player.reality.autoAutoClean) this.autoClean();
    switch (player.reality.autoSort) {
      case AUTO_SORT_MODE.NONE:
        break;
      case AUTO_SORT_MODE.POWER:
        this.sortByPower();
        break;
      case AUTO_SORT_MODE.EFFECT:
        this.sortByEffect();
        break;
      case AUTO_SORT_MODE.SCORE:
        this.sortByScore();
        break;
      default:
        throw new Error("Unrecognized auto-sort mode");
    }
  },
  get levelCap() {
    return 1000000;
  },
  get instabilityThreshold() {
    return 1000 + getAdjustedGlyphEffect("effarigglyph") + ImaginaryUpgrade(7).effectValue;
  },
  get hyperInstabilityThreshold() {
    return 3000 + this.instabilityThreshold;
  },
  clearUndo() {
    player.reality.glyphs.undo = [];
  },
  saveUndo(oldIndex, targetSlot) {
    const undoData = {
      oldIndex,
      targetSlot,
      am: new Decimal(Currency.antimatter.value),
      ip: new Decimal(Currency.infinityPoints.value),
      ep: new Decimal(Currency.eternityPoints.value),
      tt: Currency.timeTheorems.max.minus(TimeTheorems.totalPurchased()),
      ecs: EternityChallenges.all.map(e => e.completions),
      thisRealityTime: player.records.thisReality.time,
      thisRealityRealTime: player.records.thisReality.realTime,
      storedTime: player.celestials.enslaved.stored,
      dilationStudies: player.dilation.studies.toBitmask(),
      dilationUpgrades: player.dilation.upgrades.toBitmask(),
      dilationRebuyables: DilationUpgrades.rebuyable.mapToObject(d => d.id, d => d.boughtAmount),
      tp: new Decimal(Currency.tachyonParticles.value),
      dt: new Decimal(Currency.dilatedTime.value),
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
    Currency.infinityPoints.value = new Decimal(undoData.ip);
    Currency.eternityPoints.value = new Decimal(undoData.ep);
    Currency.timeTheorems.value = new Decimal(undoData.tt);
    EternityChallenges.all.map((ec, ecIndex) => ec.completions = undoData.ecs[ecIndex]);
    player.records.thisReality.time = undoData.thisRealityTime;
    player.records.thisReality.realTime = undoData.thisRealityRealTime;
    player.celestials.enslaved.stored = undoData.storedTime || 0;
    if (undoData.dilationStudies) {
      player.dilation.studies = Array.fromBitmask(undoData.dilationStudies);
      player.dilation.upgrades = new Set(Array.fromBitmask(undoData.dilationUpgrades));
      for (const id of Object.keys(undoData.dilationRebuyables)) {
        DilationUpgrades.fromId(id).boughtAmount = undoData.dilationRebuyables[id];
      }
      Currency.tachyonParticles.value = new Decimal(undoData.tp);
      Currency.dilatedTime.value = new Decimal(undoData.dt);
    }
  },
  copyForRecords(glyphList) {
    // Sorting by effect ensures consistent ordering by type, based on how the effect bitmasks are structured
    return glyphList.map(g => ({
      type: g.type,
      level: g.level,
      strength: g.strength,
      effects: g.effects,
      color: g.color,
      symbol: g.symbol, }))
      .sort((a, b) => b.effects - a.effects);
  },
  // Normal glyph count minus 3 for each cursed glyph, uses 4 instead of 3 in the calculation because cursed glyphs
  // still contribute to the length of the active list. Note that it only ever decreases if startingReality is true.
  updateMaxGlyphCount(startingReality = false) {
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

function getAdjustedGlyphLevel(glyph) {
  const level = glyph.level;
  if (Enslaved.isRunning) return Math.max(level, Enslaved.glyphLevelMin);
  if (Effarig.isRunning) return Math.min(level, Effarig.glyphLevelCap);
  if (BASIC_GLYPH_TYPES.includes(glyph.type)) return level + Glyphs.levelBoost;
  return level;
}

function respecGlyphs() {
  Glyphs.unequipAll();
  player.reality.respec = false;
}
