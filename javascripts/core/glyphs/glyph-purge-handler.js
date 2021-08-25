"use strict";

// Gives a maximum resource total possible, based on the level setting of the Reality autobuyer. This doesn't
// actually enforce any special behavior, but instead only affects various UI properties.
function estimatedAlchemyCap() {
  return GlyphSacrificeHandler.levelAlchemyCap(Math.clampMin(Autobuyer.reality.glyph, 0));
}

// This actually deals with both sacrifice and refining, but I wasn't 100% sure what to call it
const GlyphSacrificeHandler = {
  get canSacrifice() {
    return RealityUpgrade(19).isBought;
  },
  get isRefining() {
    return Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) && AutoGlyphProcessor.sacMode !== AUTO_GLYPH_REJECT.SACRIFICE;
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
    if (!this.canSacrifice) return 0;
    if (glyph.type === "reality") return 0.01 * glyph.level * Achievement(171).effectOrDefault(1);
    const pre10kFactor = Math.pow(Math.clampMax(glyph.level, 10000) + 10, 2.5);
    const post10kFactor = 1 + Math.clampMin(glyph.level - 10000, 0) / 100;
    const power = Ra.has(RA_UNLOCKS.MAX_RARITY_AND_SHARD_SACRIFICE_BOOST) ? 1 + Effarig.maxRarityBoost / 100 : 1;
    return Math.pow(pre10kFactor * post10kFactor * glyph.strength *
      Teresa.runRewardMultiplier * Achievement(171).effectOrDefault(1), power);
  },
  sacrificeGlyph(glyph, force = false) {
    // This also needs to be here because this method is called directly from drag-and-drop sacrificing
    if (this.handleSpecialGlyphTypes(glyph)) return;
    const toGain = this.glyphSacrificeGain(glyph);
    const askConfirmation = !force && player.options.confirmations.glyphSacrifice;
    if (askConfirmation) {
      Modal.glyphSacrifice.show({ idx: glyph.idx, gain: toGain });
      return;
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
    if (!Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) || !generatedTypes.includes(glyph.type)) return 0;
    const glyphActualValue = this.glyphRawRefinementGain(glyph);
    const alchemyResource = this.glyphAlchemyResource(glyph);
    const glyphActualMaxValue = this.levelAlchemyCap(glyph.level);
    return Math.clamp(glyphActualMaxValue - alchemyResource.amount, 0, glyphActualValue);
  },
  attemptRefineGlyph(glyph, force) {
    if (glyph.type === "reality") return;
    if (glyph.type === "cursed") {
      Glyphs.removeFromInventory(glyph);
      return;
    }
    const decoherence = AlchemyResource.decoherence.isUnlocked;
    if (!Ra.has(RA_UNLOCKS.GLYPH_ALCHEMY) ||
        (this.glyphRefinementGain(glyph) === 0 && !decoherence) ||
        (decoherence && AlchemyResources.base.every(x => x.data.amount >= Ra.alchemyResourceCap))) {
      this.sacrificeGlyph(glyph, true);
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
      cap: this.levelAlchemyCap(glyph.level)
    });

  },
  refineGlyph(glyph) {
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
};
