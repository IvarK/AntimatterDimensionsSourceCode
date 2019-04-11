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
  worstChallengeTime: new Lazy(() => Math.max(player.challengeTimes.max(), 100)),

  bestRunIPPM: new Lazy(() => {
    const bestRunIppm = player.lastTenRuns
      .map(run => ratePerMinute(run[1], run[0]))
      .reduce(Decimal.maxReducer);

    if (bestRunIppm.gte(1e8)) giveAchievement("Oh hey, you're still here");
    if (bestRunIppm.gte(1e300)) giveAchievement("MAXIMUM OVERDRIVE");
    return bestRunIppm;
  }),

  averageEPPerRun: new Lazy(() => player.lastTenEternities
      .map(run => run[1])
      .reduce(Decimal.sumReducer)
      .dividedBy(player.lastTenEternities.length)),

  tickSpeedMultDecrease: new Lazy(() => 10 - Effects.sum(
      BreakInfinityUpgrade.tickspeedCostMult,
      EternityChallenge(11).reward
    )),

  dimensionMultDecrease: new Lazy(() => 10 - Effects.sum(
      BreakInfinityUpgrade.dimCostMult,
      EternityChallenge(6).reward
    )),

  timeStudies: new Lazy(() => NormalTimeStudyState.studies
      .map(s => player.timestudy.studies.includes(s.id))),

  achSkipPerkCount: new Lazy(() => Effects.max(
      0,
      Perk.achievementRowGroup1,
      Perk.achievementRowGroup2,
      Perk.achievementRowGroup3,
      Perk.achievementRowGroup4,
      Perk.achievementRowGroup5,
      Perk.achievementRowGroup6
    )),

  buyablePerks: new Lazy(() => Perk.all.filter(p => p.canBeBought)),

  normalDimensionCommonMultiplier: new Lazy(() => 
    // The effect is defined in normal_dimensions.js because that's where the non-cached
    // code originally lived.
     normalDimensionCommonMultiplier()
  ),

  infinityDimensionCommonMultiplier: new Lazy(() => infinityDimensionCommonMultiplier()),

  timeDimensionCommonMultiplier: new Lazy(() => timeDimensionCommonMultiplier()),

  glyphEffects: new Lazy(() => orderedEffectList.mapToObject(k => k, k => getAdjustedGlyphEffectUncached(k))),

  totalIPMult: new Lazy(() => totalIPMult()),

  achievementPower: new Lazy(() => Decimal.pow(
    1.5,
    Array.range(1, TOTAL_ACH_ROWS)
      .map(Achievements.row)
      .countWhere(row => row.every(ach => ach.isEnabled))
  ))
};

EventHub.global.on(GameEvent.GLYPHS_CHANGED, () => {
  GameCache.glyphEffects.invalidate();
}, GameCache.glyphEffects);
