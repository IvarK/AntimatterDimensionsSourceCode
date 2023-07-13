/**
 * It turns out reading and writing the RNG state from player is really slow, for
 * some reason. Thus, it's very advantageous to get an RNG as a local variable, and only
 * write the state back out to player when we are done with it.
 * So, this interface is implemented by a real and fake RNG class; after creating one and
 * using it, call finalize on it to write the seed out.
 */
import { deepmerge } from "@/utility/deepmerge";

class GlyphRNG {
  static get SECOND_GAUSSIAN_DEFAULT_VALUE() {
    return 1e6;
  }

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
    if (this.secondGaussian !== GlyphRNG.SECOND_GAUSSIAN_DEFAULT_VALUE) {
      const toReturn = this.secondGaussian;
      this.secondGaussian = GlyphRNG.SECOND_GAUSSIAN_DEFAULT_VALUE;
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

export const GlyphGenerator = {
  // Glyph choices will have more uniformly-distributed properties up for this many groups
  // of uniform glyphs. The size of a uniformity group is 5, so this gives uniformly-distributed
  // properties up to a reality count one more than 5x this value; the modified RNG for uniform
  // glyphs excludes the first fixed glyph and only starts from the 2nd one onward
  uniformityGroups: 4,

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

  MusicGlyphRNG: class extends GlyphRNG {
    constructor() { super(player.reality.musicSeed, player.reality.musicSecondGaussian); }
    finalize() {
      player.reality.musicSeed = this.seed;
      player.reality.musicSecondGaussian = this.secondGaussian;
    }
    get isFake() { return false; }
  },
  /* eslint-enable lines-between-class-members */

  startingGlyph(level) {
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

  // These Glyphs are given on entering Doomed to prevent the player
  // from having none of each basic glyphs which are requied to beat pelle
  doomedGlyph(type) {
    const effectList = GlyphEffects.all.filter(e => e.id.startsWith(type));
    effectList.push(GlyphEffects.timespeed);
    let bitmask = 0;
    for (const effect of effectList) bitmask |= 1 << effect.bitmaskIndex;
    const glyphLevel = Math.max(player.records.bestReality.glyphLevel, 5000);
    return {
      id: undefined,
      idx: null,
      type,
      strength: 3.5,
      level: glyphLevel,
      rawLevel: glyphLevel,
      effects: bitmask,
    };
  },

  companionGlyph(eternityPoints) {
    // Store the pre-Reality EP value in the glyph's rarity
    const str = rarityToStrength(eternityPoints.log10() / 1e6);
    const effects = orderedEffectList.filter(effect => effect.match("companion*"));
    const effectBitmask = makeGlyphEffectBitmask(effects);
    return {
      id: undefined,
      idx: null,
      type: "companion",
      strength: str,
      level: 1,
      rawLevel: 1,
      effects: effectBitmask,
    };
  },

  musicGlyph() {
    const rng = new GlyphGenerator.MusicGlyphRNG();
    const glyph =
      this.randomGlyph({ actualLevel: Math.floor(player.records.bestReality.glyphLevel * 0.8), rawLevel: 1 }, rng);
    rng.finalize();
    glyph.cosmetic = "music";
    glyph.fixedCosmetic = "music";
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
    if (Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.canBeApplied) return rarityToStrength(100);
    let result = GlyphGenerator.gaussianBellCurve(rng) * GlyphGenerator.strengthMultiplier;
    const relicShardFactor = Ra.unlocks.extraGlyphChoicesAndRelicShardRarityAlwaysMax.canBeApplied ? 1 : rng.uniform();
    const increasedRarity = relicShardFactor * Effarig.maxRarityBoost +
      Effects.sum(Achievement(146), GlyphSacrifice.effarig);
    // Each rarity% is 0.025 strength.
    result += increasedRarity / 40;
    // Raise the result to the next-highest 0.1% rarity.
    result = Math.ceil(result * 400) / 400;
    return Math.min(result, rarityToStrength(100));
  },

  // eslint-disable-next-line max-params
  randomNumberOfEffects(type, strength, level, rng) {
    // Call the RNG twice before anything else to advance the RNG seed properly, even if the whole method returns early.
    // This prevents the position of effarig glyphs in the choice list from affecting the choices themselves, as well
    // as preventing all of the glyphs changing drastically when RU17 is purchased.
    const random1 = rng.uniform();
    const random2 = rng.uniform();
    if (type !== "effarig" && Ra.unlocks.glyphEffectCount.canBeApplied) return 4;
    const maxEffects = Ra.unlocks.glyphEffectCount.canBeApplied ? 7 : 4;
    let num = Math.min(
      maxEffects,
      Math.floor(Math.pow(random1, 1 - (Math.pow(level * strength, 0.5)) / 100) * 1.5 + 1)
    );
    // If we do decide to add anything else that boosts chance of an extra effect, keeping the code like this
    // makes it easier to do (add it to the Effects.max).
    if (RealityUpgrade(17).isBought && random2 < Effects.max(0, RealityUpgrade(17))) {
      num = Math.min(num + 1, maxEffects);
    }
    return Ra.unlocks.glyphEffectCount.canBeApplied ? Math.max(num, 4) : num;
  },

  // Populate a list of reality glyph effects based on level
  generateRealityEffects(level) {
    const numberOfEffects = realityGlyphEffectLevelThresholds.filter(lv => lv <= level).length;
    const sortedRealityEffects = GlyphEffects.all
      .filter(eff => eff.glyphTypes.includes("reality"))
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
      const unincluded = effectValues[20] < effectValues[21] ? 20 : 21;
      effectValues[unincluded] = -1;
    }
    // This is timepow/infinitypow/powerpow
    for (const i of [0, 12, 16]) {
      if (i in effectValues) {
        effectValues[i] = 2;
      }
    }
    // Sort from highest to lowest value.
    const effects = Object.keys(effectValues).sort((a, b) => effectValues[b] - effectValues[a]).slice(0, count);
    return effects.map(Number).toBitmask();
  },

  randomType(rng, typesSoFar = []) {
    const generatable = generatedTypes.filter(x => EffarigUnlock.reality.isUnlocked || x !== "effarig");
    const maxOfSameTypeSoFar = generatable.map(x => typesSoFar.countWhere(y => y === x)).max();
    const blacklisted = typesSoFar.length === 0
      ? [] : generatable.filter(x => typesSoFar.countWhere(y => y === x) === maxOfSameTypeSoFar);
    return GlyphTypes.random(rng, blacklisted);
  },

  /**
   * To generate glyphs with a "uniformly random" effect spread, we effectively need to generate all the glyphs in
   *  uniform groups of some size at once, and then select from that generated group. In this case, we've decided
   *  that a group which satisfies uniformity is that of 5 realities, such that all 20 choices amongst the group
   *  must contain each individual glyph effect at least once. This makes types more "uniform" by ensuring that
   *  any individual glyph type is never *repeatedly* absent for more than 2 realities in a row (which can only
   *  happen between groups), as well as ensuring that trends of long-term type/effect absences never happen
   * Note: At this point, realityCount should be the number of realities BEFORE processing completes (ie. the first
   *  random generated set begins at a parameter of 1)
   */
  uniformGlyphs(level, rng, realityCount) {
    // Reality count divided by 5 determines which group of 5 we're in, while count mod 5 determines the index
    // within that block. Note that we have a minus 1 because we want to exclude the first fixed glyph
    const groupNum = Math.floor((realityCount - 1) / 5);
    const groupIndex = (realityCount - 1) % 5;

    // The usage of the initial seed is complicated in order to prevent future prediction without using information
    // not normally available in-game (ie. the console). This makes it appear less predictable overall
    const initSeed = player.reality.initialSeed;
    const typePerm = permutationIndex(5, (31 + initSeed % 7) * groupNum + initSeed % 1123);

    // Figure out a permutation index for each generated glyph type this reality by counting through the sets
    // for choices which have already been generated for options in previous realities for this group
    const typePermIndex = Array.repeat(0, 5);
    for (let i = 0; i < groupIndex; i++) {
      for (let type = 0; type < 5; type++) {
        if (type !== typePerm[i]) typePermIndex[type]++;
      }
    }

    // Determine which effect needs to be added for uniformity (startID is a hardcoded array of the lowest ID glyph
    // effect of each type, in the same type order as BASIC_GLYPH_TYPES). We use type, initial seed, and group index
    // to pick a random permutation, again to make it less predictable and to make sure they're generally different
    const uniformEffects = [];
    const startID = [16, 12, 8, 0, 4];
    const typesThisReality = Array.range(0, 5);
    typesThisReality.splice(typePerm[groupIndex], 1);
    for (let i = 0; i < 4; i++) {
      const type = typesThisReality[i];
      const effectPerm = permutationIndex(4, 5 * type + (7 + initSeed % 5) * groupNum + initSeed % 11);
      uniformEffects.push(startID[type] + effectPerm[typePermIndex[type]]);
    }

    // Generate the glyphs without uniformity applied first, assuming 4 glyph choices early on, then fix it to contain
    // the new effect. This fixing process is a 50% chance to add to existing effects and 50% to replace them instead.
    // Note that if this would give us "too many" effects, we remove one of the existing ones, and the threshold for
    // having "too many" depends on if the player has the upgrade that improves effect count - we don't want the
    // uniformity code to make glyph generation disproportionately worse in that case
    const glyphs = [];
    for (let i = 0; i < 4; ++i) {
      const newGlyph = GlyphGenerator.randomGlyph(level, rng, BASIC_GLYPH_TYPES[typesThisReality[i]]);
      const newMask = (initSeed + realityCount + i) % 2 === 0
        ? (1 << uniformEffects[i])
        : newGlyph.effects | (1 << uniformEffects[i]);
      const maxEffects = RealityUpgrade(17).isBought ? 3 : 2;
      if (countValuesFromBitmask(newMask) > maxEffects) {
        // Turn the old effect bitmask into an array of removable effects and then deterministically remove one
        // of the non-power effects based on seed and reality count
        const replacable = getGlyphEffectsFromBitmask(newGlyph.effects)
          .filter(eff => eff.isGenerated)
          .map(eff => eff.bitmaskIndex)
          .filter(eff => ![0, 12, 16].includes(eff));
        const toRemove = replacable[Math.abs(initSeed + realityCount) % replacable.length];
        newGlyph.effects = newMask & ~(1 << toRemove);
      } else {
        newGlyph.effects = newMask;
      }

      // Add the power effects on power/infinity/time, since the initial setting of newMask removes them half the time
      const dimPowers = { power: 16, infinity: 12, time: 0 };
      if (dimPowers[newGlyph.type] !== undefined) {
        newGlyph.effects |= 1 << dimPowers[newGlyph.type];
      }

      glyphs.push(newGlyph);
    }

    return glyphs;
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
