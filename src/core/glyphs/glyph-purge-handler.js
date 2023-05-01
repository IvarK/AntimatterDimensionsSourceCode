// This actually deals with both sacrifice and refining, but I wasn't 100% sure what to call it
export const GlyphSacrificeHandler = {
  // Anything scaling on sacrifice caps at this value, even though the actual sacrifice values can go higher
  maxSacrificeForEffects: 1e100,
  // This is used for glyph UI-related things in a few places, but is handled here as a getter which is only called
  // sparingly - that is, whenever the cache is invalidated after a glyph is sacrificed. Thus it only gets recalculated
  // when glyphs are actually sacrificed, rather than every render cycle.
  get logTotalSacrifice() {
    // We check elsewhere for this equalling zero to determine if the player has ever sacrificed. Technically this
    // should check for -Infinity, but the clampMin works in practice because the minimum possible sacrifice
    // value is greater than 1 for even the weakest possible glyph
    return BASIC_GLYPH_TYPES.reduce(
      (tot, type) => tot + Math.log10(Math.clampMin(player.reality.glyphs.sac[type], 1)), 0);
  },
  get canSacrifice() {
    return RealityUpgrade(19).isBought;
  },
  get isRefining() {
    return Ra.unlocks.unlockGlyphAlchemy.canBeApplied && AutoGlyphProcessor.sacMode !== AUTO_GLYPH_REJECT.SACRIFICE;
  },
  handleSpecialGlyphTypes(glyph) {
    switch (glyph.type) {
      case "companion":
        Modal.deleteCompanion.show();
        return true;
      case "cursed":
        Glyphs.removeFromInventory(glyph);
        return true;
    }
    return false;
  },
  // Removes a glyph, accounting for sacrifice unlock and alchemy state
  removeGlyph(glyph, force = false) {
    if (this.handleSpecialGlyphTypes(glyph)) return;
    if (!this.canSacrifice) this.deleteGlyph(glyph, force);
    else if (this.isRefining) this.attemptRefineGlyph(glyph, force);
    else this.sacrificeGlyph(glyph, force);
  },
  deleteGlyph(glyph, force) {
    if (force || !player.options.confirmations.glyphSacrifice) Glyphs.removeFromInventory(glyph);
    else Modal.glyphDelete.show({ idx: glyph.idx });
  },
  glyphSacrificeGain(glyph) {
    if (!this.canSacrifice || Pelle.isDoomed) return 0;
    if (glyph.type === "reality") return 0.01 * glyph.level * Achievement(171).effectOrDefault(1);
    const pre10kFactor = Math.pow(Math.clampMax(glyph.level, 10000) + 10, 2.5);
    const post10kFactor = 1 + Math.clampMin(glyph.level - 10000, 0) / 100;
    const power = Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.effectOrDefault(1);
    return Math.pow(pre10kFactor * post10kFactor * glyph.strength *
      Teresa.runRewardMultiplier * Achievement(171).effectOrDefault(1), power);
  },
  sacrificeGlyph(glyph, force = false) {
    if (Pelle.isDoomed) return;
    // This also needs to be here because this method is called directly from drag-and-drop sacrificing
    if (this.handleSpecialGlyphTypes(glyph)) return;
    const toGain = this.glyphSacrificeGain(glyph);
    const askConfirmation = !force && player.options.confirmations.glyphSacrifice;
    if (askConfirmation) {
      Modal.glyphSacrifice.show({ idx: glyph.idx, gain: toGain });
      return;
    }
    player.reality.glyphs.sac[glyph.type] += toGain;
    GameCache.logTotalGlyphSacrifice.invalidate();
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
  // Refined glyphs give this proportion of their maximum attainable value from their level
  glyphRefinementEfficiency: 0.05,
  glyphRawRefinementGain(glyph) {
    if (!Ra.unlocks.unlockGlyphAlchemy.canBeApplied) return 0;
    const glyphMaxValue = this.levelRefinementValue(glyph.level);
    const rarityModifier = strengthToRarity(glyph.strength) / 100;
    return this.glyphRefinementEfficiency * glyphMaxValue * rarityModifier;
  },
  glyphRefinementGain(glyph) {
    if (!Ra.unlocks.unlockGlyphAlchemy.canBeApplied || !generatedTypes.includes(glyph.type)) return 0;
    const resource = this.glyphAlchemyResource(glyph);
    if (!resource.isUnlocked) return 0;
    const glyphActualValue = this.glyphRawRefinementGain(glyph);
    if (resource.cap === 0) return glyphActualValue;
    const amountUntilCap = this.glyphEffectiveCap(glyph) - resource.amount;
    return Math.clamp(amountUntilCap, 0, glyphActualValue);
  },
  // The glyph that is being refined can increase the cap, which means the effective cap
  // will be the current resource cap or the cap after this glyph is refined, whichever is higher.
  glyphEffectiveCap(glyph) {
    const resource = this.glyphAlchemyResource(glyph);
    const currentCap = resource.cap;
    const capAfterRefinement = this.highestRefinementValue(glyph);
    const higherCap = Math.clampMin(currentCap, capAfterRefinement);
    return Math.clampMax(higherCap, Ra.alchemyResourceCap);
  },
  highestRefinementValue(glyph) {
    return this.glyphRawRefinementGain(glyph) / this.glyphRefinementEfficiency;
  },
  attemptRefineGlyph(glyph, force) {
    if (glyph.type === "reality") return;
    if (glyph.type === "cursed") {
      Glyphs.removeFromInventory(glyph);
      return;
    }
    const decoherence = AlchemyResource.decoherence.isUnlocked;
    if (!Ra.unlocks.unlockGlyphAlchemy.canBeApplied ||
        (this.glyphRefinementGain(glyph) === 0 && !decoherence) ||
        (decoherence && AlchemyResources.base.every(x => x.data.amount >= Ra.alchemyResourceCap))) {
      this.sacrificeGlyph(glyph, force);
      return;
    }

    if (!player.options.confirmations.glyphRefine || force) {
      this.refineGlyph(glyph);
      return;
    }
    const resource = this.glyphAlchemyResource(glyph);
    Modal.glyphRefine.show({
      idx: glyph.idx,
      resourceName: resource.name,
      resourceAmount: resource.amount,
      gain: this.glyphRefinementGain(glyph),
      cap: resource.cap
    });

  },
  refineGlyph(glyph) {
    if (Pelle.isDoomed) return;
    const resource = this.glyphAlchemyResource(glyph);
    // This technically completely trashes the glyph for no rewards if not unlocked, but this will only happen ever
    // if the player specificially tries to do so (in which case they're made aware that it's useless) or if the
    // Reality choices contain *only* locked glyph choices. That's a rare enough edge case that I think it's okay
    // to just delete it instead of complicating the program flow more than it already is by attempting sacrifice.
    if (!resource.isUnlocked) {
      Glyphs.removeFromInventory(glyph);
      return;
    }
    const rawRefinementGain = this.glyphRawRefinementGain(glyph);
    const refinementGain = this.glyphRefinementGain(glyph);
    resource.amount += refinementGain;
    const decoherenceGain = rawRefinementGain * AlchemyResource.decoherence.effectValue;
    for (const glyphTypeName of ALCHEMY_BASIC_GLYPH_TYPES) {
      if (glyphTypeName !== glyph.type) {
        const glyphType = GlyphTypes[glyphTypeName];
        const otherResource = AlchemyResources.all[glyphType.alchemyResource];
        const maxResource = Math.max(otherResource.cap, otherResource.amount);
        otherResource.amount = Math.clampMax(otherResource.amount + decoherenceGain, maxResource);
      }
    }
    if (resource.isBaseResource) {
      resource.highestRefinementValue = this.highestRefinementValue(glyph);
    }
    Glyphs.removeFromInventory(glyph);
  }
};
