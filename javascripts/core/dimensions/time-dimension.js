"use strict";

function timeDimensionCost(tier, bought) {
  const scalingPast1e6000 = TimeDimensions.scalingPast1e6000;
  const dimension = TimeDimension(tier);
  if (tier > 4) {
    let cost = Decimal.pow(dimension.costMultiplier * 100, bought).times(dimension.baseCost);
    if (cost.gte("1e6000")) {
      const base = dimension.costMultiplier * 100;
      const exponent = dimension.e6000ScalingAmount + (bought - dimension.e6000ScalingAmount) * scalingPast1e6000;
      cost = Decimal.pow(base, exponent).times(dimension.baseCost);
    }
    return cost;
  }
  let cost = Decimal.pow(dimension.costMultiplier, bought).times(dimension.baseCost);
  if (cost.gte(Decimal.MAX_NUMBER)) {
    cost = Decimal.pow(dimension.costMultiplier * 1.5, bought).times(dimension.baseCost);
  }
  if (cost.gte("1e1300")) {
    cost = Decimal.pow(dimension.costMultiplier * 2.2, bought).times(dimension.baseCost);
  }
  if (cost.gte("1e6000")) {
    const base = dimension.costMultiplier * 2.2;
    const exponent = dimension.e6000ScalingAmount + (bought - dimension.e6000ScalingAmount) * scalingPast1e6000;
    cost = Decimal.pow(base, exponent).times(dimension.baseCost);
  }
  return cost;
}

function buyTimeDimension(tier, upd) {
  if (upd === undefined) upd = true

  const dim = TimeDimension(tier);
  if (tier > 4 && !TimeStudy.timeDimension(tier).isBought) return false
  if (player.eternityPoints.lt(dim.cost)) return false
  if (Enslaved.isRunning && dim.bought > 0) return false;

  player.eternityPoints = player.eternityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(1);
  dim.bought += 1
  dim.cost = timeDimensionCost(tier, dim.bought);
  dim.power = dim.power
    .times(2)
    .timesEffectsOf(tier === 8 ? GlyphSacrifice.time : null);
  return true
}

function resetTimeDimensions() {
  for (const dim of TimeDimensions.all) dim.amount = new Decimal(dim.bought);
}

function fullResetTimeDimensions() {
  for (const dim of TimeDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = new Decimal(0);
    dim.bought = 0;
    dim.power = new Decimal(1);
  }
}

function toggleAllTimeDims() {
  const areEnabled = player.reality.tdbuyers[0];
  for (let i = 1; i < 9; i++) {
    player.reality.tdbuyers[i - 1] = !areEnabled;
  }
}

function buyMaxTimeDimTier(tier) {
  const dim = TimeDimension(tier);
  if (tier > 4 && !TimeStudy.timeDimension(tier).isBought) return false;
  if (Enslaved.isRunning) return buyTimeDimension(tier);
  const bulk = bulkBuyBinarySearch(player.eternityPoints, {
    costFunction: bought => timeDimensionCost(tier, bought),
    cumulative: true,
    firstCost: dim.cost,
  }, dim.bought);
  if (!bulk) return false;
  player.eternityPoints = player.eternityPoints.minus(bulk.purchasePrice);
  dim.amount = dim.amount.plus(bulk.quantity);
  dim.bought += bulk.quantity;
  dim.cost = timeDimensionCost(tier, dim.bought);
  const basePower = 2 * Effects.product(tier === 8 ? GlyphSacrifice.time : null);
  dim.power = Decimal.pow(basePower, dim.bought);
  return true
}

function buyMaxTimeDimensions() {
  // Default behavior: Buy as many as possible, starting with the highest dimension first
  // (reduces overhead at higher EP)
  if (player.eternityPoints.gte(1e10)) {
    for (let i = 8; i > 0; i--) buyMaxTimeDimTier(i);
  } else {
    // Low EP behavior: Try to buy the highest affordable new dimension, then loop buying the cheapest possible
    for (let i = 4; i > 0 && TimeDimension(i).bought === 0; i--)
      buyTimeDimension(i, false);

    // Should never take more than like 50 iterations; explicit infinite loops make me nervous
    for (let stop = 0; stop < 1000; stop++) {
      let cheapestDim = 1;
      let cheapestCost = TimeDimension(1).cost;
      for (let i = 2; i <= 4; i++) {
        if (TimeDimension(i).cost.lte(cheapestCost)) {
          cheapestDim = i;
          cheapestCost = TimeDimension(i).cost;
        }
      }
      let bought = false;
      if (player.eternityPoints.gte(cheapestCost))
        bought = buyTimeDimension(cheapestDim, false);
      if (!bought)
        break;
    }
  }
}

function timeDimensionCommonMultiplier() {
  let mult = new Decimal(kongAllDimMult)
    .timesEffectsOf(
      Achievement(105),
      Achievement(128),
      TimeStudy(93),
      TimeStudy(103),
      TimeStudy(151),
      TimeStudy(221),
      EternityChallenge(1).reward,
      EternityChallenge(10).reward,
      EternityUpgrade.tdMultAchs,
      EternityUpgrade.tdMultTheorems,
      EternityUpgrade.tdMultRealTime,
      player.replicanti.unl && player.replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
      RealityUpgrade(22)
    );
  if (EternityChallenge(9).isRunning) {
    mult = mult.times((Decimal.pow(Math.max(player.infinityPower.pow((7 + getAdjustedGlyphEffect("infinityrate")) / 7).log2(), 1), 4)).max(1));
  }
  return mult;
}

class TimeDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.time, tier);
    const BASE_COSTS = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
    const COST_MULTS = [null, 3, 9, 27, 81, 243, 729, 2187, 6561];
    this._costMultiplier = COST_MULTS[tier];
    const E6000_SCALING_AMOUNTS = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456];
    this._e6000ScalingAmount = E6000_SCALING_AMOUNTS[tier];
  }

  get isUnlocked() {
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAffordable() {
    return player.eternityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;

    if (EternityChallenge(11).isRunning) return new Decimal(1);
    let mult = this.power
      .pow(2)
      .times(GameCache.timeDimensionCommonMultiplier.value)
      .timesEffectsOf(
        tier === 1 ? TimeStudy(11) : null,
        tier === 3 ? TimeStudy(73) : null,
        tier === 4 ? TimeStudy(227) : null
      );

    mult = mult.clampMin(0).pow(getAdjustedGlyphEffect("timepow"));

    if (Laitela.has(LAITELA_UNLOCKS.DIM_POW)) mult = mult.pow(Laitela.dimensionMultPowerEffect);

    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    } else if (Laitela.isRunning) {
      mult = mult.pow(Laitela.dimMultNerf);
    }

    return mult;
  }

  get productionPerSecond() {
    if (EternityChallenge(1).isRunning || EternityChallenge(10).isRunning) {
      return new Decimal(0);
    }

    if (EternityChallenge(11).isRunning) {
      return this.amount;
    }
    let production = this.amount.times(this.multiplier);
    if (EternityChallenge(7).isRunning) {
      production = production.dividedBy(Tickspeed.current.dividedBy(1000));
    }
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return new Decimal(0);
    }
    const toGain = TimeDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupFactor());
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get e6000ScalingAmount() {
    return this._e6000ScalingAmount;
  }
}

TimeDimensionState.index = DimensionState.createIndex(TimeDimensionState);

/**
 * @param {number} tier
 * @return {TimeDimensionState}
 */
const TimeDimension = tier => TimeDimensionState.index[tier];

const TimeDimensions = {
  /**
   * @type {TimeDimensionState[]}
   */
  all: TimeDimensionState.index.compact(),
  get scalingPast1e6000() {
    return 4;
  }
};
