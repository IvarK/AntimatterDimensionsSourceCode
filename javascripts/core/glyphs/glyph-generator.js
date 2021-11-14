/**
 * It turns out reading and writing the RNG state from player is really slow, for
 * some reason. Thus, it's very advantageous to get an RNG as a local variable, and only
 * write the state back out to player when we are done with it.
 * So, this interface is implemented by a real and fake RNG class; after creating one and
 * using it, call finalize on it to write the seed out.
 */
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
      color: "#feaec9"
    };
  },

  musicGlyph() {
    const rng = new GlyphGenerator.MusicGlyphRNG();
    const glyph =
      this.randomGlyph({ actualLevel: Math.floor(player.records.bestReality.glyphLevel * 0.8), rawLevel: 1 }, rng);
    rng.finalize();
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
    let result = GlyphGenerator.gaussianBellCurve(rng) * GlyphGenerator.strengthMultiplier;
    const relicShardFactor = Ra.has(RA_UNLOCKS.EXTRA_CHOICES_AND_RELIC_SHARD_RARITY_ALWAYS_MAX) ? 1 : rng.uniform();
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
