var timeDimCostMults = [null, 3, 9, 27, 81, 243, 729, 2187, 6561]
var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"]
var timeDimIncScalingAmts = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456]

function timeDimensionCost(tier, bought) {
  if (tier > 4) {
    let cost = Decimal.pow(timeDimCostMults[tier] * 100, bought).times(timeDimStartCosts[tier])
    if (cost.gte("1e6000")) {
      cost = Decimal.pow(timeDimCostMults[tier] * 100, bought + Math.pow(bought - timeDimIncScalingAmts[tier], 1.3)).times(timeDimStartCosts[tier])
    }
    return cost;
  }
  let cost = Decimal.pow(timeDimCostMults[tier], bought).times(timeDimStartCosts[tier])
  if (cost.gte(Number.MAX_VALUE)) {
    cost = Decimal.pow(timeDimCostMults[tier] * 1.5, bought).times(timeDimStartCosts[tier])
  }
  if (cost.gte("1e1300")) {
    cost = Decimal.pow(timeDimCostMults[tier] * 2.2, bought).times(timeDimStartCosts[tier])
  }
  if (cost.gte("1e6000")) {
    cost = Decimal.pow(timeDimCostMults[tier] * 2.2, bought + Math.pow(bought - timeDimIncScalingAmts[tier], 1.3)).times(timeDimStartCosts[tier])
  }
  return cost;
}

function buyTimeDimension(tier, upd) {
  if (upd === undefined) upd = true

  const dim = TimeDimension(tier);
  if (tier > 4 && !TimeStudy.timeDimension(tier).isBought) return false
  if (player.eternityPoints.lt(dim.cost)) return false

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
  for (var i=1; i<9; i++) {
      var dim = player["timeDimension"+i]
      dim.amount = new Decimal(dim.bought)
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
  if (player.eternityPoints.lt(dim.cost)) return false;
  // Attempt to find the max we can purchase. We know we can buy 1, so we try 2, 4, 8, etc
  // to figure out the upper limit
  let cantBuy = 1;
  let nextCost;
  do {
    cantBuy *= 2;
    nextCost = timeDimensionCost(tier, dim.bought + cantBuy - 1);
  } while (player.eternityPoints.gt(nextCost));
  // Deal with the simple case of buying just one
  if (cantBuy === 2) {
    player.eternityPoints = player.eternityPoints.minus(dim.cost)
    dim.amount = dim.amount.plus(1);
    dim.bought += 1
    dim.cost = nextCost;
    dim.power = dim.power
      .times(2)
      .timesEffectsOf(tier === 8 ? GlyphSacrifice.time : null);
    return true
  }
  // The amount we can actually buy is in the interval [canBuy/2, canBuy), we do a binary search
  // to find the exact value:
  let canBuy = cantBuy / 2;
  let buyCost;
  while (cantBuy - canBuy > 1) {
    let middle = Math.floor((canBuy + cantBuy) / 2);
    if (player.eternityPoints.gt(timeDimensionCost(tier, dim.bought + middle - 1))) {
      canBuy = middle;
    } else {
      cantBuy = middle;
    }
  }
  let baseCost = timeDimensionCost(tier, dim.bought + canBuy - 1);
  let otherCost = new Decimal(0);
  // account for costs leading up to that dimension:
  let count = 0;
  for (let i = canBuy - 1; i > 0; --i) {
    const newCost = otherCost.plus(timeDimensionCost(tier, dim.bought + i - 1));
    if (newCost.eq(otherCost)) break;
    otherCost = newCost;
    ++count;
  }
  let totalCost = baseCost.plus(otherCost);
  // check the purchase price again
  if (player.eternityPoints.lt(totalCost)) {
    --canBuy;
    // Since prices grow rather steeply, we can safely assume that we can, indeed, buy
    // one less.
    totalCost = otherCost;
  }
  const oldPoints = player.eternityPoints;
  player.eternityPoints = player.eternityPoints.minus(totalCost);
  dim.amount = dim.amount.plus(canBuy);
  dim.bought += canBuy;
  dim.cost = timeDimensionCost(tier, dim.bought);
  let basePower = 2 * Effects.product(tier === 8 ? GlyphSacrifice.time : null);
  dim.power = Decimal.pow(basePower, dim.bought);
  if (player.eternityPoints.gte(dim.cost))
    throw crash("Should not be able to afford more")
  return true
}

function buyMaxTimeDimensions() {
  if (player.eternityPoints.gte(1e10)) {  // Default behavior: Buy as many as possible, starting with the highest dimension first (reduces overhead at higher EP)
    for (var i = 8; i > 0; i--) buyMaxTimeDimTier(i);
  }
  else {  // Low EP behavior: Try to buy the highest affordable new dimension, then loop buying the cheapest possible
    for (let i=4; i > 0 && player["timeDimension"+i].bought == 0; i--)
      buyTimeDimension(i, false);

    for (let stop = 0; stop < 1000; stop++) { // Should never take more than like 50 iterations; explicit infinite loops make me nervous
      let cheapestDim = 1;
      let cheapestCost = player["timeDimension1"].cost;
      for (let i = 2; i <= 4; i++) {
        if (player["timeDimension"+i].cost.lte(player["timeDimension"+cheapestDim].cost)) {
          cheapestDim = i;
          cheapestCost = player["timeDimension"+cheapestDim].cost;
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
      player.replicanti.unl && player.replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null
    );
  if (EternityChallenge(9).isRunning) {
    mult = mult.times((Decimal.pow(Math.max(player.infinityPower.pow((7 + getAdjustedGlyphEffect("infinityrate")) / 7).log2(), 1), 4)).max(1));
  }

  if (RealityUpgrades.includes(22)) {
    let days = player.thisReality / (1000 * 60 * 60 * 24);
    mult = mult.times(Decimal.pow(10, Math.pow(1 + 2 * Math.log10(days + 1), 1.6)));
  }
  return mult;
}

class TimeDimensionState {
  constructor(tier) {
    this._props = player[`timeDimension${tier}`];
    this._tier = tier;
  }

  get cost() {
    return this._props.cost;
  }

  set cost(value) {
    this._props.cost = value;
  }

  get amount() {
    return this._props.amount;
  }

  set amount(value) {
    this._props.amount = value;
  }

  get power() {
    return this._props.power;
  }

  set power(value) {
    this._props.power = value;
  }

  get bought() {
    return this._props.bought;
  }

  set bought(value) {
    this._props.bought = value;
  }

  get isUnlocked() {
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAffordable() {
    return player.eternityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;

    if (Laitela.isRunning && tier > 1) {
      return new Decimal(0)
    }

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

    mult = mult.clampMin(0).pow(getAdjustedGlyphEffect("effarigdimensions"));

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5)
    } else if (Laitela.isRunning) {
      mult = mult.pow(0.01)
    }

    return mult;
  }

  get productionPerSecond() {
    if (EternityChallenge(1).isRunning || EternityChallenge(10).isRunning || Enslaved.isRunning) {
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
}

function TimeDimension(tier) {
  return new TimeDimensionState(tier);
}