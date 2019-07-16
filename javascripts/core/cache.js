"use strict";

class Lazy {
  constructor(getValue) {
    this._getValue = getValue;
    Lazy.registerLazy(this);
  }

  static get registrar() {
    if (Lazy._registrar === undefined) {
      Lazy._registrar = [];
    }
    return Lazy._registrar;
  }

  static registerLazy(object) {
    Lazy.registrar.push(object);
  }

  static invalidateAll() {
    for (const obj of Lazy.registrar) {
      obj.invalidate();
    }
  }

  get value() {
    if (this._value === undefined) {
      this._value = this._getValue();
    }
    return this._value;
  }

  invalidate() {
    this._value = undefined;
  }
}

const GameCache = {
  worstChallengeTime: new Lazy(() => Math.max(player.challenge.normal.bestTimes.max(), 100)),

  bestRunIPPM: new Lazy(() =>
    player.lastTenRuns
      .map(run => ratePerMinute(run[1], run[0]))
      .reduce(Decimal.maxReducer)
  ),

  averageEPPerRun: new Lazy(() => {
    return player.lastTenEternities
      .map(run => run[1])
      .reduce(Decimal.sumReducer)
      .dividedBy(player.lastTenEternities.length);
  }),

  tickSpeedMultDecrease: new Lazy(() => {
    return 10 - Effects.sum(
      BreakInfinityUpgrade.tickspeedCostMult,
      EternityChallenge(11).reward
    );
  }),

  dimensionMultDecrease: new Lazy(() => {
    if (Enslaved.isRunning && !NormalChallenge(10).isRunning) return 10;
    return 10 - Effects.sum(
      BreakInfinityUpgrade.dimCostMult,
      EternityChallenge(6).reward
    );
  }),

  timeStudies: new Lazy(() => {
    return NormalTimeStudyState.studies
      .map(s => player.timestudy.studies.includes(s.id));
  }),

  achSkipPerkCount: new Lazy(() => {
    return Effects.max(
      0,
      Perk.achievementRowGroup1,
      Perk.achievementRowGroup2,
      Perk.achievementRowGroup3,
      Perk.achievementRowGroup4,
      Perk.achievementRowGroup5,
      Perk.achievementRowGroup6
    );
  }),

  buyablePerks: new Lazy(() => Perks.all.filter(p => p.canBeBought)),

  normalDimensionCommonMultiplier: new Lazy(() => {
    // The effect is defined in normal_dimensions.js because that's where the non-cached
    // code originally lived.
    return normalDimensionCommonMultiplier();
  }),

  // 0 will cause a crash if invoked; this way the tier can be used as an index
  normalDimensionFinalMultipliers: Array.range(0, 9)
    .map(tier => new Lazy(() => getDimensionFinalMultiplierUncached(tier))),

  infinityDimensionCommonMultiplier: new Lazy(() => {
    return infinityDimensionCommonMultiplier();
  }),

  timeDimensionCommonMultiplier: new Lazy(() => {
    return timeDimensionCommonMultiplier();
  }),

  glyphEffects: new Lazy(() => orderedEffectList.mapToObject(k => k, k => getAdjustedGlyphEffectUncached(k))),

  totalIPMult: new Lazy(() => totalIPMult()),

  // This seemingly-random number is in order to match the per-row value of achievements to pre-update values
  achievementPower: new Lazy(() => Decimal.pow(
    1.1841138514709035,
    Array.range(1, 14)
      .map(Achievements.row)
      .countWhere(row => row.every(ach => ach.isEnabled))
  ).times(Math.pow(1.03, Achievements.effectiveCount))),

  challengeTimeSum: new Lazy(() => player.challenge.normal.bestTimes.sum()),

  infinityChallengeTimeSum: new Lazy(() => player.challenge.infinity.bestTimes.sum()),

  realityAchTimeModifier: new Lazy(() => Math.pow(0.9, Math.clampMin(player.realities - 1, 0))),

  baseTimeForAllAchs: new Lazy(() => TimeSpan.fromDays(2).totalMilliseconds * GameCache.realityAchTimeModifier.value)
};

EventHub.logic.on(GameEvent.GLYPHS_CHANGED, () => {
  GameCache.glyphEffects.invalidate();
}, GameCache.glyphEffects);

GameCache.normalDimensionFinalMultipliers.invalidate = function() {
  for (const x of this) x.invalidate();
};
