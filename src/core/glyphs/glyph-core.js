import { GameMechanicState } from "../game-mechanics";

export const orderedEffectList = ["powerpow", "infinitypow", "replicationpow", "timepow",
  "dilationpow", "timeshardpow", "powermult", "powerdimboost", "powerbuy10",
  "dilationTTgen", "infinityinfmult", "infinityIP", "timeEP",
  "dilationDT", "replicationdtgain", "replicationspeed",
  "timeetermult", "dilationgalaxyThreshold", "infinityrate", "replicationglyphlevel",
  "timespeed",
  "effarigrm", "effarigglyph", "effarigblackhole", "effarigachievement",
  "effarigforgotten", "effarigdimensions", "effarigantimatter",
  "cursedgalaxies", "cursedtickspeed", "curseddimensions", "cursedEP",
  "realityglyphlevel", "realitygalaxies", "realityrow1pow", "realityDTglyph",
  "companiondescription", "companionEP"];

export const generatedTypes = ["power", "infinity", "replication", "time", "dilation", "effarig"];

// eslint-disable-next-line no-unused-vars
export const GlyphEffectOrder = orderedEffectList.mapToObject(e => e, (e, idx) => idx);

export function rarityToStrength(x) {
  return x * 2.5 / 100 + 1;
}

export function strengthToRarity(x) {
  return (x - 1) * 100 / 2.5;
}

export const Glyphs = {
  inventory: [],
  active: [],
  unseen: [],
  unequipped: [],
  levelBoost: 0,
  factorsOpen: false,
  bestUndoGlyphCount: 0,
  get inventoryList() {
    return player.reality.glyphs.inventory;
  },
  get sortedInventoryList() {
    return this.inventoryList.sort((a, b) => -a.level * a.strength + b.level * b.strength);
  },
  get activeList() {
    return player.reality.glyphs.active;
  },
  get activeWithoutCompanion() {
    return this.activeList.filter(g => g.type !== "companion");
  },
  get allGlyphs() {
    return this.inventoryList.concat(this.activeList);
  },
  // Returns an array of inventory indices of all glyphs, with all null entries filtered out
  get glyphIndexArray() {
    return this.inventory.filter(g => g).map(g => g.idx);
  },
  findFreeIndex(useProtectedSlots) {
    this.validate();
    const isUsableIndex = index => (useProtectedSlots ? index < this.protectedSlots : index >= this.protectedSlots);
    return this.inventory.findIndex((slot, index) => slot === null && isUsableIndex(index));
  },
  // This is stored in GameCache and only invalidated if glyphs change; we check for free inventory space often in
  // lots of places and this is an expensive operation
  get freeInventorySpace() {
    this.validate();
    return this.inventory.filter((e, idx) => e === null && idx >= this.protectedSlots).length;
  },
  get activeSlotCount() {
    if (Pelle.isDoomed) {
      if (PelleRifts.vacuum.milestones[0].canBeApplied) return 1;
      return 0;
    }
    return 3 + Effects.sum(RealityUpgrade(9), RealityUpgrade(24));
  },
  get protectedSlots() {
    return 10 * player.reality.glyphs.protectedRows;
  },
  get totalSlots() {
    return 120;
  },
  changeProtectedRows(rowChange) {
    // Always ensure at least one unprotected row for new glyphs, to prevent some potentially odd-looking behavior
    const newRows = Math.clamp(player.reality.glyphs.protectedRows + rowChange, 0, this.totalSlots / 10 - 1);
    const rowsToAdd = newRows - player.reality.glyphs.protectedRows;

    if (rowsToAdd > 0) {
      // Attempt to shift unprotected glyphs downward if there are any empty unprotected rows. The time complexity on
      // this algorithm isn't that good, but this isn't a particularly hot path and any "smarter" algorithms likely
      // aren't worth the reduced code readability
      let rowsMoved = 0;
      while (rowsMoved < rowsToAdd) {
        // Try to shift down all the unprotected rows from top to bottom, repeating until either no shifting is
        // possible or we've freed up the row
        let hasMoved = false;
        for (let orig = this.protectedSlots / 10 + rowsMoved; !hasMoved && orig < this.totalSlots / 10; orig++) {
          hasMoved = hasMoved || this.moveGlyphRow(orig, orig + 1);
        }
        // No movement happened this scan; there's nothing else we can do here
        if (!hasMoved) break;
        // Check if the topmost unprotected row is free. This isn't necessarily guaranteed because it could come from
        // merging lower rows, which means the empty row isn't in the right spot
        if (!this.glyphIndexArray.some(idx => Math.floor(idx / 10) === this.protectedSlots / 10)) {
          rowsMoved++;
        }
      }
    } else {
      // Similar algorithm to above; we scan repeatedly over protected slots and repeatedly attempt to free up the row
      // that's going to switch to being unprotected
      let rowsMoved = 0;
      while (rowsMoved < -rowsToAdd) {
        let hasMoved = false;
        for (let orig = this.protectedSlots / 10 - rowsMoved - 1; !hasMoved && orig > 0; orig--) {
          hasMoved = hasMoved || this.moveGlyphRow(orig, orig - 1);
        }
        if (!hasMoved) break;
        if (!this.glyphIndexArray.some(idx => Math.floor(idx / 10) === this.protectedSlots / 10 - 1)) {
          rowsMoved++;
          // In addition to all the protected glyph movement, we also move the entire unprotected inventory up one row
          for (let orig = this.protectedSlots / 10 - rowsMoved; orig < this.totalSlots / 10; orig++) {
            this.moveGlyphRow(orig, orig - 1);
          }
        }
      }
    }

    player.reality.glyphs.protectedRows = newRows;
    this.validate();
    GameCache.glyphInventorySpace.invalidate();
  },
  // Move all glyphs from the origin row to the destination row, does nothing if a column-preserving move operation
  // isn't possible. Returns a boolean indicating success/failure on glyph moving. Row is 0-indexed
  moveGlyphRow(orig, dest) {
    if (!player.reality.moveGlyphsOnProtection) return false;
    if (orig >= this.totalSlots / 10 || dest >= this.totalSlots / 10) return false;
    if (this.glyphIndexArray.some(idx => Math.floor(idx / 10) === dest)) {
      // Destination row has some glyphs, attempt to merge the rows
      const hasOverlap = [...Array(10).keys()]
        .some(col => this.inventory[10 * orig + col] !== null && this.inventory[10 * dest + col] !== null);
      if (hasOverlap) return false;
      for (let col = 0; col < 10; col++) {
        const glyph = this.inventory[10 * orig + col];
        if (glyph !== null) {
          this.moveToSlot(glyph, 10 * dest + col);
        }
      }
      this.validate();
      return true;
    }
    // Destination row is empty, just move the glyphs
    for (let col = 0; col < 10; col++) {
      const glyph = this.inventory[10 * orig + col];
      if (glyph !== null) {
        this.moveToSlot(glyph, 10 * dest + col);
      }
    }
    this.validate();
    return true;
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
  // This compares targetGlyph to all the glyphs in searchList, returning a subset of them which fulfills the comparison
  // direction specified by the parameters in fuzzyMatch:
  //  -1: Will find glyphs which are equal to or worse than targetGlyph
  //   0: Will only return glyphs which have identical values
  //  +1: Will find glyphs which are equal to or better than targetGlyph
  findByValues(targetGlyph, searchList, fuzzyMatch = { level, strength, effects }) {
    // We need comparison to go both ways for normal matching and subset matching for partially-equipped sets
    const compFn = (op, comp1, comp2) => {
      switch (op) {
        case -1:
          return comp2 - comp1;
        case 0:
          return comp1 === comp2 ? 0 : -1;
        case 1:
          return comp1 - comp2;
      }
      return false;
    };

    // Returns a number based on how much the small mask is found inside of the large mask. Returns a non-negative
    // number if small contains all of large, with a value equal to the number of extra bits. Otherwise, returns a
    // negative number equal to the negative of the number of bits that large has which small doesn't.
    const matchedEffects = (large, small) => {
      if ((large & small) === large) return countValuesFromBitmask(small - large);
      return -countValuesFromBitmask(large - (large & small));
    };

    // Make an array containing all glyphs which match the given criteria, with an additional "quality" prop in order
    // to determine roughly how good the glyph itself is relative to other matches
    const allMatches = [];
    for (const glyph of searchList) {
      const type = glyph.type === targetGlyph.type;
      let eff;
      switch (fuzzyMatch.effects) {
        case -1:
          eff = matchedEffects(glyph.effects, targetGlyph.effects);
          break;
        case 0:
          eff = glyph.effects === targetGlyph.effects ? 0 : -1;
          break;
        case 1:
          eff = matchedEffects(targetGlyph.effects, glyph.effects);
          break;
      }
      const str = compFn(fuzzyMatch.strength, glyph.strength, targetGlyph.strength) / 2.5;
      const lvl = compFn(fuzzyMatch.level, glyph.level, targetGlyph.level) / 5000;
      const sym = glyph.symbol === targetGlyph.symbol;
      if (type && eff >= 0 && str >= 0 && lvl >= 0 && sym) {
        allMatches.push({
          glyph,
          // Flatten glyph qualities, with 10% rarity, 500 levels, and an extra effect all being equal value. This
          // is used to sort the options by some rough measure of distance from the target glyph
          gap: str + lvl + eff / 10
        });
      }
    }

    // Sort by increasing gap, then discard the value as it's not directly used anywhere else
    allMatches.sort((a, b) => a.gap - b.gap);
    return allMatches.map(m => m.glyph);
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
    const forbiddenByPelle = Pelle.isDisabled("glyphs") || ["effarig", "reality", "cursed"].includes(glyph.type);
    if (Pelle.isDoomed && forbiddenByPelle) return;
    if (GameEnd.creditsEverClosed) return;

    if (glyph.type !== "companion") {
      if (RealityUpgrade(9).isLockingMechanics) {
        if (this.activeWithoutCompanion.length > 0) {
          RealityUpgrade(9).tryShowWarningModal("equip another non-Companion Glyph");
          return;
        }
        if (glyph.level < 3) {
          RealityUpgrade(9).tryShowWarningModal(`equip a Glyph whose level is less than ${formatInt(3)}`);
          return;
        }
      }
      if (RealityUpgrade(24).isLockingMechanics && this.activeWithoutCompanion.length === 0) {
        RealityUpgrade(24).tryShowWarningModal();
        return;
      }
      if (ImaginaryUpgrade(25).isLockingMechanics && this.activeWithoutCompanion.length === 1) {
        ImaginaryUpgrade(25).tryShowWarningModal();
        return;
      }
    }

    this.validate();
    if (this.findByInventoryIndex(glyph.idx) !== glyph) {
      throw new Error("Inconsistent inventory indexing");
    }
    let sameSpecialTypeIndex = -1;
    if (["effarig", "reality"].includes(glyph.type)) {
      sameSpecialTypeIndex = this.active.findIndex(x => x && x.type === glyph.type);
    }
    if (this.active[targetSlot] === null) {
      if (sameSpecialTypeIndex >= 0) {
        Modal.message.show(`You may only have one ${glyph.type.capitalize()} Glyph equipped!`,
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      this.removeFromInventory(glyph);
      this.saveUndo(targetSlot);
      player.reality.glyphs.active.push(glyph);
      glyph.idx = targetSlot;
      this.active[targetSlot] = glyph;
      this.updateRealityGlyphEffects();
      this.updateMaxGlyphCount();
      EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
      EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
      this.validate();
    } else {
      // We can only replace effarig/reality glyph
      if (sameSpecialTypeIndex >= 0 && sameSpecialTypeIndex !== targetSlot) {
        Modal.message.show(`You may only have one ${glyph.type.capitalize()} Glyph equipped!`,
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      if (!player.options.confirmations.glyphReplace) {
        this.swapIntoActive(glyph, targetSlot);
        return;
      }
      Modal.glyphReplace.show({ targetSlot, inventoryIndex: glyph.idx });
    }
    // Loading glyph sets might directly choose glyphs, bypassing the hover-over flag-clearing code
    this.removeVisualFlag("unseen", glyph);
    this.removeVisualFlag("unequipped", glyph);
  },
  // We only ever force when draining rifts causes the single slot to be lost (which will never show the modal)
  unequipAll(forceToUnprotected = false) {
    this.unequipped = [];
    const targetRegion = forceToUnprotected ? false : player.options.respecIntoProtected;
    while (player.reality.glyphs.active.length) {
      const freeIndex = this.findFreeIndex(targetRegion);
      if (freeIndex < 0) break;
      const glyph = player.reality.glyphs.active.pop();
      this.active[glyph.idx] = null;
      this.addToInventory(glyph, freeIndex, true);
    }
    this.updateRealityGlyphEffects();
    this.updateMaxGlyphCount(true);

    // We need to add a slight delay as a setTimeout in order to make sure that the EventHub calls following this
    // don't immediately close this modal after it's shown. Additionally, we want to prevent the modal from appearing
    // for realities shorter than a few seconds in order to stop a UI-based softlock; however at this point the time
    // has already been reset, so we just use the most recent real time record (this leads to some inconsistent behavior
    // when restarting, but that's not easily avoidable)
    const stillEquipped = player.reality.glyphs.active.length;
    const fastReality = player.records.recentRealities[0][1] < 3000;
    if (stillEquipped && !fastReality) {
      const target = player.options.respecIntoProtected ? "Protected slots" : "Main Inventory";
      const hasOther = this.findFreeIndex(!player.options.respecIntoProtected) !== -1;
      setTimeout(() => Modal.message.show(`${quantifyInt("Glyph", stillEquipped)} could not be unequipped due to lack
        of space. Free up some space in your ${target}${hasOther ? " or switch where you are unequipping to" : ""}
        in order to unequip ${stillEquipped === 1 ? "it" : "them"}.`, { closeEvent: GAME_EVENT.GLYPHS_CHANGED }),
      50);
    }

    EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    return !player.reality.glyphs.active.length;
  },
  unequip(activeIndex, requestedInventoryIndex) {
    if (this.active[activeIndex] === null) return;
    const storedIndex = player.reality.glyphs.active.findIndex(glyph => glyph.idx === activeIndex);
    if (storedIndex < 0) return;
    const glyph = player.reality.glyphs.active.splice(storedIndex, 1)[0];
    this.active[activeIndex] = null;
    this.addToInventory(glyph, requestedInventoryIndex, true);
    this.updateRealityGlyphEffects();
    this.updateMaxGlyphCount(true);
    EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
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
  addToInventory(glyph, requestedInventoryIndex, isExistingGlyph = false) {
    this.validate();
    if (!isExistingGlyph) glyph.id = GlyphGenerator.makeID();
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
    if (requestedInventoryIndex === undefined && !isExistingGlyph) this.addVisualFlag("unseen", glyph);
    if (isExistingGlyph) this.addVisualFlag("unequipped", glyph);
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    this.validate();
  },
  // These two visual flag functions update the corner tooltips for "New!" and unequipped glyphs
  addVisualFlag(target, glyph) {
    if (!this[target].includes(glyph.id)) this[target].push(glyph.id);
  },
  removeVisualFlag(target, glyph) {
    const index = Glyphs[target].indexOf(glyph.id);
    if (index > -1) Glyphs[target].splice(index, 1);
  },
  isMusicGlyph(glyph) {
    return glyph?.cosmetic === "music";
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
    const freeSpace = GameCache.glyphInventorySpace.value;
    const sortOrder = ["power", "infinity", "replication", "time", "dilation", "effarig",
      "reality", "cursed", "companion"];
    const byType = sortOrder.mapToObject(g => g, () => ({ glyphs: [], padding: 0 }));
    for (const g of glyphsToSort) byType[g.type].glyphs.push(g);
    let totalDesiredPadding = 0;
    for (const t of Object.values(byType)) {
      t.glyphs.sort(sortFunction);
      t.padding = Math.ceil(t.glyphs.length / 10) * 10 - t.glyphs.length;
      totalDesiredPadding += t.padding;
    }
    // If we want more padding than we actually have available, trim it down until it fits
    while (totalDesiredPadding > freeSpace) {
      let biggestPadding = sortOrder[0];
      for (const t of sortOrder) {
        if (byType[t].padding > byType[biggestPadding].padding) biggestPadding = t;
      }
      // Try to remove padding 5 at a time if possible
      const delta = byType[biggestPadding].padding > 5 ? 5 : 1;
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
  sortByLevel() {
    this.sort((a, b) => b.level - a.level);
  },
  sortByPower() {
    this.sort((a, b) => b.level * b.strength - a.level * a.strength);
  },
  sortByScore() {
    this.sort((a, b) => AutoGlyphProcessor.filterValue(b) - AutoGlyphProcessor.filterValue(a));
  },
  sortByEffect() {
    function reverseBitstring(eff) {
      return parseInt(((1 << 30) + (eff >>> 0)).toString(2).split("").reverse().join(""), 2);
    }
    // The bitwise reversal is so that the effects with the LOWER id are valued higher in the sorting.
    // This primarily meant for effarig glyph effect sorting, which makes it prioritize timespeed pow highest.
    this.sort((a, b) => reverseBitstring(b.effects) - reverseBitstring(a.effects));
  },
  // If there are enough glyphs that are better than the specified glyph, in every way, then
  // the glyph is objectively a useless piece of garbage.
  isObjectivelyUseless(glyph, threshold, inventoryIn) {
    if (player.reality.applyFilterToPurge && AutoGlyphProcessor.wouldKeep(glyph)) return false;
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
    const toCompare = (inventoryIn ?? this.inventory).concat(this.active)
      .filter(g => g !== null &&
        g.type === glyph.type &&
        g.id !== glyph.id &&
        (g.level >= glyph.level || g.strength >= glyph.strength) &&
        ((g.effects & glyph.effects) === glyph.effects));
    let compareThreshold = glyph.type === "effarig" || glyph.type === "reality" ? 1 : 5;
    compareThreshold = Math.clampMax(compareThreshold, threshold);
    if (toCompare.length < compareThreshold) return false;
    const comparedEffects = getGlyphEffectsFromBitmask(glyph.effects).filter(x => x.id.startsWith(glyph.type));
    const betterCount = toCompare.countWhere(other => !hasSomeBetterEffects(glyph, other, comparedEffects));
    return betterCount >= compareThreshold;
  },
  // Note that this same function is called with different parameters for purge (5), harsh purge (1), and sac all (0)
  // If deleteGlyphs === false, we are running this from the modal and are doing so purely to *count* the number of
  // removed glyphs. In this case, we copy the inventory and run the purge on the copy - we need to be able to remove
  // glyphs as we go, or else the purge logic will be wrong (eg. 7 identical glyphs will all be "worse than 5 others")
  autoClean(threshold = 5, deleteGlyphs = true) {
    const isHarsh = threshold < 5;
    let toBeDeleted = 0;
    const inventoryCopy = deleteGlyphs ? undefined : this.fakePurgeInventory();
    // If the player hasn't unlocked sacrifice yet, prevent them from removing any glyphs.
    if (!GlyphSacrificeHandler.canSacrifice) return toBeDeleted;
    // We look in backwards order so that later glyphs get cleaned up first
    for (let inventoryIndex = this.totalSlots - 1; inventoryIndex >= this.protectedSlots; --inventoryIndex) {
      const glyph = (inventoryCopy ?? this.inventory)[inventoryIndex];
      // Never clean companion, and only clean cursed if we choose to sacrifice all
      if (glyph === null || glyph.type === "companion" || (glyph.type === "cursed" && threshold !== 0)) continue;
      // Don't auto-clean custom glyphs (eg. music glyphs) unless it's harsh or delete all
      const isCustomGlyph = glyph.color !== undefined || glyph.symbol !== undefined;
      if (isCustomGlyph && !isHarsh) continue;
      // If the threshold for better glyphs needed is zero, the glyph is definitely getting deleted
      // no matter what (well, unless it can't be gotten rid of in current glyph removal mode).
      if (threshold === 0 || this.isObjectivelyUseless(glyph, threshold, inventoryCopy)) {
        if (deleteGlyphs) AutoGlyphProcessor.getRidOfGlyph(glyph);
        else inventoryCopy.splice(inventoryCopy.indexOf(glyph), 1);
        toBeDeleted++;
      }
    }
    if (player.reality.autoCollapse && deleteGlyphs) this.collapseEmptySlots();
    return toBeDeleted;
  },
  // Similar to copyForRecords, except that it also preserves null entries, passes on the IDs, and doesn't
  // sort the glyphs; these are all necessary for the purge logic to work correctly
  fakePurgeInventory() {
    return this.inventory.map(g => (g === null
      ? null
      : {
        id: g.id,
        type: g.type,
        level: g.level,
        strength: g.strength,
        effects: g.effects,
        color: g.color,
        symbol: g.symbol
      }));
  },
  harshAutoClean() {
    this.autoClean(1);
  },
  deleteAllUnprotected() {
    this.autoClean(0);
  },
  deleteAllRejected(deleteGlyphs = true) {
    let toBeDeleted = 0;
    for (const glyph of Glyphs.inventory) {
      if (glyph !== null && glyph.idx >= this.protectedSlots && !AutoGlyphProcessor.wouldKeep(glyph)) {
        if (deleteGlyphs) AutoGlyphProcessor.getRidOfGlyph(glyph);
        toBeDeleted++;
      }
    }
    if (player.reality.autoCollapse && deleteGlyphs) this.collapseEmptySlots();
    return toBeDeleted;
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
    if (VUnlocks.autoAutoClean.canBeApplied && player.reality.autoAutoClean) this.autoClean();
    switch (player.reality.autoSort) {
      case AUTO_SORT_MODE.NONE:
        break;
      case AUTO_SORT_MODE.LEVEL:
        this.sortByLevel();
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
    return 1000 + getAdjustedGlyphEffect("effarigglyph") + ImaginaryUpgrade(7).effectOrDefault(0);
  },
  get hyperInstabilityThreshold() {
    return 3000 + this.instabilityThreshold;
  },
  clearUndo() {
    player.reality.glyphs.undo = [];
  },
  saveUndo(targetSlot) {
    const undoData = {
      targetSlot,
      am: new Decimal(Currency.antimatter.value),
      ip: new Decimal(Currency.infinityPoints.value),
      ep: new Decimal(Currency.eternityPoints.value),
      tt: Currency.timeTheorems.max.minus(TimeTheorems.totalPurchased()),
      ecs: EternityChallenges.all.map(e => e.completions),
      thisInfinityTime: player.records.thisInfinity.time,
      thisInfinityRealTime: player.records.thisInfinity.realTime,
      thisEternityTime: player.records.thisEternity.time,
      thisEternityRealTime: player.records.thisEternity.realTime,
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
    const inventorySlot = Glyphs.findFreeIndex(player.options.respecIntoProtected);
    if (inventorySlot === -1 || player.reality.glyphs.undo.length === 0) return;
    const undoData = player.reality.glyphs.undo.pop();
    // We store this value here so that we can restore it later on in the reality reset code, since we immediately
    // change equipped glyph status here but only update requirement checks within finishProcessReality()
    this.bestUndoGlyphCount = player.requirementChecks.reality.maxGlyphs;
    this.unequip(undoData.targetSlot, inventorySlot);
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
    player.records.thisInfinity.time = undoData.thisInfinityTime;
    player.records.thisInfinity.realTime = undoData.thisInfinityRealTime;
    player.records.thisEternity.time = undoData.thisEternityTime;
    player.records.thisEternity.realTime = undoData.thisEternityRealTime;
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
    if (Player.automatorUnlocked && AutomatorBackend.state.forceRestart) {
      AutomatorBackend.start(player.reality.automator.state.editorScript);
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
    const activeGlyphList = this.activeWithoutCompanion;
    const currCount = activeGlyphList.length - 4 * activeGlyphList.filter(x => x && x.type === "cursed").length;
    if (startingReality) player.requirementChecks.reality.maxGlyphs = currCount;
    player.requirementChecks.reality.maxGlyphs = Math.max(player.requirementChecks.reality.maxGlyphs, currCount);
  },
  // Modifies a basic glyph to have timespeed, and adds the new effect to time glyphs
  applyGamespeed(glyph) {
    if (!Ra.unlocks.allGamespeedGlyphs.canBeApplied) return;
    if (BASIC_GLYPH_TYPES.includes(glyph.type)) {
      glyph.effects |= (1 << GlyphEffects.timespeed.bitmaskIndex);
      if (glyph.type === "time") {
        glyph.effects |= (1 << GlyphEffects.timeshardpow.bitmaskIndex);
      }
    }
  },
  swapIntoActive(glyph, targetSlot) {
    this.removeFromInventory(glyph);
    this.unequip(targetSlot, glyph.idx);
    finishProcessReality({
      reset: true,
      glyphUndo: false,
      restoreCelestialState: true,
    });
    player.reality.glyphs.active.push(glyph);
    this.active[targetSlot] = glyph;
    glyph.idx = targetSlot;
    this.updateRealityGlyphEffects();
    this.updateMaxGlyphCount(true);
    EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
    EventHub.dispatch(GAME_EVENT.GLYPHS_CHANGED);
    this.validate();
  },
  // Mostly used for key-swapping glyph set UI elements; composites the entire glyph set together in a way which is
  // relatively unlikely to cause collisions between different glyph sets unless they're actually the same glyphs.
  // Different permutations of the same glyphs should produce the same hash, but aren't guaranteed to
  hash(glyphSet) {
    let hash = 1;
    for (const glyph of glyphSet) {
      // This should be at most around e23 or so in practice
      const singleGlyphHash = Math.pow(glyph.level, 2) * Math.pow(glyph.strength, 4) * glyph.effects *
        glyph.type.charCodeAt(0);
      hash *= singleGlyphHash;
    }
    return hash;
  },
  giveCursedGlyph() {
    if (GameCache.glyphInventorySpace.value === 0) {
      Modal.message.show("No available inventory space; Sacrifice some Glyphs to free up space.",
        { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
      return;
    }
    const cursedCount = this.allGlyphs.filter(g => g !== null && g.type === "cursed").length;
    if (cursedCount >= 5) {
      GameUI.notify.error(`You don't need more than ${format(5)} Cursed Glyphs!`);
    } else {
      this.addToInventory(GlyphGenerator.cursedGlyph());
      GameUI.notify.error("Created a Cursed Glyph");
    }
  }
};

class GlyphSacrificeState extends GameMechanicState { }

export const GlyphSacrifice = mapGameDataToObject(
  GameDatabase.reality.glyphSacrifice,
  config => new GlyphSacrificeState(config)
);

export function recalculateAllGlyphs() {
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
export function calculateGlyph(glyph) {
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

export function getRarity(x) {
  return GlyphRarities.find(e => x >= e.minStrength);
}

export function getAdjustedGlyphLevel(glyph, realityGlyphBoost = Glyphs.levelBoost, ignoreCelestialEffects = false) {
  const level = glyph.level;
  if (!ignoreCelestialEffects) {
    if (Pelle.isDoomed) return Math.min(level, Pelle.glyphMaxLevel);
    if (Enslaved.isRunning) return Math.max(level, Enslaved.glyphLevelMin);
    if (Effarig.isRunning) return Math.min(level, Effarig.glyphLevelCap);
  }
  if (BASIC_GLYPH_TYPES.includes(glyph.type)) return level + realityGlyphBoost;
  return level;
}

export function respecGlyphs() {
  if (!Glyphs.unequipAll()) {
    Modal.message.show("Some of your Glyphs could not be unequipped due to lack of inventory space.",
      { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
  }
  player.reality.respec = false;
}
