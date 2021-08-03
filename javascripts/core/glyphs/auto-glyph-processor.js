"use strict";

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
    if (glyph.type === "cursed") return -Infinity;
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
        // This ternary check is required to filter out the additional effects given by Ra-Enslaved 25, which don't
        // exist in the glyph filter settings. It can be safely ignored since the effect is always given.
        const effectScore = effectList.map(e => (typeCfg.effectScores[e] ? typeCfg.effectScores[e] : 0)).sum();
        return strengthToRarity(glyph.strength) + effectScore;
      }
      // Picked glyphs are never kept in Alchemy modes.
      // Glyphs for non-unlocked Alchemy Resources are assigned NEGATIVE_INFINITY
      // to make them picked last, because we can't refine them.
      case AUTO_GLYPH_SCORE.LOWEST_ALCHEMY: {
        const resource = AlchemyResource[glyph.type];
        return resource.isUnlocked
          ? -resource.amount
          : Number.NEGATIVE_INFINITY;
      }
      case AUTO_GLYPH_SCORE.ALCHEMY_VALUE:
        return AlchemyResource[glyph.type].isUnlocked
          ? GlyphSacrificeHandler.glyphRefinementGain(glyph)
          : Number.NEGATIVE_INFINITY;
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
      case AUTO_GLYPH_REJECT.REFINE:
        GlyphSacrificeHandler.attemptRefineGlyph(glyph, true);
        break;
      case AUTO_GLYPH_REJECT.REFINE_TO_CAP:
        if (GlyphSacrificeHandler.glyphRefinementGain(glyph) === 0) GlyphSacrificeHandler.sacrificeGlyph(glyph, true);
        else GlyphSacrificeHandler.attemptRefineGlyph(glyph, true);
        break;
      default:
        throw new Error("Unknown auto Glyph Sacrifice mode");
    }
  }
};

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
  const eternityPoints = Player.canEternity
    ? Currency.eternityPoints.value.plus(gainedEternityPoints())
    : Currency.eternityPoints.value;
  const epBase = Math.pow(Math.max(1, eternityPoints.pLog10()) / 4000, 0.5);
  // @ts-ignore
  const replPow = 0.4 + getAdjustedGlyphEffect("replicationglyphlevel");
  // 0.025148668593658708 comes from 1/Math.sqrt(100000 / Math.sqrt(4000)), but really, the
  // factors assigned to repl and dt can be arbitrarily tuned
  const replBase = Math.pow(Math.max(1, player.replicanti.amount.log10()), replPow) * 0.02514867;
  const dtPow = 1.3 + getAdjustedGlyphEffect("realityDTglyph");
  const dtBase = Math.pow(Math.max(1, Currency.dilatedTime.value.pLog10()), dtPow) * 0.02514867;
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

  const singularityEffect = SingularityMilestone.glyphLevelFromSingularities.isUnlocked
    ? SingularityMilestone.glyphLevelFromSingularities.effectValue
    : 1;
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
