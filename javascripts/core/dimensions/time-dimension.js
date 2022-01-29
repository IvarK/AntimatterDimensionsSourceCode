import { DimensionState } from "./dimension.js";
import { DC } from "../constants.js";
import { Pelle } from "../globals.js";

export function buySingleTimeDimension(tier) {
  const dim = TimeDimension(tier);
  if (tier > 4 && !TimeStudy.timeDimension(tier).isBought) return false;
  if (Currency.eternityPoints.lt(dim.cost)) return false;
  if (Enslaved.isRunning && dim.bought > 0) return false;

  Currency.eternityPoints.subtract(dim.cost);
  dim.amount = dim.amount.plus(1);
  dim.bought += 1;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function resetTimeDimensions() {
  for (const dim of TimeDimensions.all) dim.amount = new Decimal(dim.bought);
}

export function fullResetTimeDimensions() {
  for (const dim of TimeDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = DC.D0;
    dim.bought = 0;
  }
}

export function toggleAllTimeDims() {
  const areEnabled = Autobuyer.timeDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.timeDimension(i).isActive = !areEnabled;
  }
}

export function buyMaxTimeDimension(tier) {
  const dim = TimeDimension(tier);
  if (tier > 4 && !TimeStudy.timeDimension(tier).isBought) return false;
  if (Enslaved.isRunning) return buySingleTimeDimension(tier);
  const bulk = bulkBuyBinarySearch(Currency.eternityPoints.value, {
    costFunction: bought => dim.nextCost(bought),
    cumulative: true,
    firstCost: dim.cost,
  }, dim.bought);
  if (!bulk) return false;
  Currency.eternityPoints.subtract(bulk.purchasePrice);
  dim.amount = dim.amount.plus(bulk.quantity);
  dim.bought += bulk.quantity;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllTimeDimensions(checkAutobuyers = false) {
  // Default behavior: Buy as many as possible, starting with the highest dimension first
  // (reduces overhead at higher EP)
  if (Currency.eternityPoints.exponent >= 10) {
    for (let i = 8; i > 0; i--) {
      if (!checkAutobuyers || Autobuyer.timeDimension(i).isActive) buyMaxTimeDimension(i);
    }
  } else {
    // Low EP behavior: Try to buy the highest affordable new dimension, then loop buying the cheapest possible
    for (let i = 4; i > 0 && TimeDimension(i).bought === 0; i--) {
      if (!checkAutobuyers || Autobuyer.timeDimension(i).isActive) buySingleTimeDimension(i);
    }

    // Should never take more than like 50 iterations; explicit infinite loops make me nervous
    for (let stop = 0; stop < 1000; stop++) {
      let cheapestDim = 0;
      let cheapestCost = 1e10;
      for (let i = 1; i <= 4; i++) {
        if (TimeDimension(i).cost.lte(cheapestCost) && (!checkAutobuyers || Autobuyer.timeDimension(i).isActive)) {
          cheapestDim = i;
          cheapestCost = TimeDimension(i).cost;
        }
      }
      let bought = false;
      if (cheapestDim !== 0 && Currency.eternityPoints.gte(cheapestCost)) bought = buySingleTimeDimension(cheapestDim);
      if (!bought) break;
    }
  }
}

export function timeDimensionCommonMultiplier() {
  let mult = new Decimal(ShopPurchase.allDimPurchases.currentMult)
    .timesEffectsOf(
      Achievement(105),
      Achievement(128),
      TimeStudy(93),
      TimeStudy(103),
      TimeStudy(151),
      TimeStudy(221),
      TimeStudy(301),
      EternityChallenge(1).reward,
      EternityChallenge(10).reward,
      EternityUpgrade.tdMultAchs,
      EternityUpgrade.tdMultTheorems,
      EternityUpgrade.tdMultRealTime,
      Replicanti.areUnlocked && Replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
      Pelle.isDoomed ? null : RealityUpgrade(22),
      AlchemyResource.dimensionality,
      PelleRifts.chaos
    );
  if (EternityChallenge(9).isRunning) {
    mult = mult.times(
      Decimal.pow(
        Math.clampMin(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate / 7).log2(), 1),
        4)
        .clampMin(1));
  }
  return mult;
}

class TimeDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.time, tier);
    const BASE_COSTS = [null, DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 3, 9, 27, 81, 24300, 72900, 218700, 656100];
    this._costMultiplier = COST_MULTS[tier];
    const E6000_SCALING_AMOUNTS = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456];
    this._e6000ScalingAmount = E6000_SCALING_AMOUNTS[tier];
    const COST_THRESHOLDS = [Decimal.NUMBER_MAX_VALUE, DC.E1300, DC.E6000];
    this._costIncreaseThresholds = COST_THRESHOLDS;
  }

  /** @returns {Decimal} */
  get cost() { return this.data.cost; }
  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    if (this._tier > 4 && bought < this.e6000ScalingAmount) {
      return Decimal.pow(this.costMultiplier, bought).times(this.baseCost);
    }

    const costMultIncreases = [1, 1.5, 2.2];
    for (let i = 0; i < this._costIncreaseThresholds.length; i++) {
      const cost = Decimal.pow(this.costMultiplier * costMultIncreases[i], bought).times(this.baseCost);
      if (cost.lt(this._costIncreaseThresholds[i])) return cost;
    }

    let base = this.costMultiplier;
    if (this._tier <= 4) base *= 2.2;
    const exponent = this.e6000ScalingAmount + (bought - this.e6000ScalingAmount) * TimeDimensions.scalingPast1e6000;
    return Decimal.pow(base, exponent).times(this.baseCost);
  }

  get isUnlocked() {
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get isAffordable() {
    return Currency.eternityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;

    if (EternityChallenge(1).isRunning || EternityChallenge(10).isRunning ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return DC.D0;
    }

    if (EternityChallenge(11).isRunning) return DC.D1;
    let mult = GameCache.timeDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? TimeStudy(11) : null,
        tier === 3 ? TimeStudy(73) : null,
        tier === 4 ? TimeStudy(227) : null
      );

    const dim = TimeDimension(tier);
    const bought = tier === 8 ? Math.clampMax(dim.bought, 1e8) : dim.bought;
    mult = mult.times(Decimal.pow(dim.powerMultiplier, bought));

    mult = mult.pow(getAdjustedGlyphEffect("timepow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.time);
    mult = mult.pow(Ra.momentumValue);
    mult = mult.pow(ImaginaryUpgrade(11).effectOrDefault(1));

    if (player.dilation.active) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    }

    return mult;
  }

  get productionPerSecond() {
    if (EternityChallenge(11).isRunning) {
      return this.amount;
    }
    let production = this.amount.times(this.multiplier);
    if (EternityChallenge(7).isRunning) {
      production = production.times(Tickspeed.perSecond);
    }
    if (this._tier === 1 && !EternityChallenge(7).isRunning) {
      production = production.pow(getAdjustedGlyphEffect("timeshardpow"));
    }
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = TimeDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get powerMultiplier() {
    return DC.D4
      .timesEffectsOf(this._tier === 8 ? GlyphSacrifice.time : null)
      .pow(ImaginaryUpgrade(14).effectOrDefault(1));
  }

  get e6000ScalingAmount() {
    return this._e6000ScalingAmount;
  }

  get costIncreaseThresholds() {
    return this._costIncreaseThresholds;
  }

  get requirementReached() {
    return this._tier < 5 ||
      (TimeStudy.timeDimension(this._tier).isAffordable && TimeStudy.timeDimension(this._tier - 1).isBought);
  }

  tryUnlock() {
    if (this.isUnlocked) return;
    TimeStudy.timeDimension(this._tier).purchase();
  }
}

/**
 * @function
 * @param {number} tier
 * @return {TimeDimensionState}
 */
export const TimeDimension = TimeDimensionState.createAccessor();

export const TimeDimensions = {
  /**
   * @type {TimeDimensionState[]}
   */
  all: TimeDimension.index.compact(),

  get scalingPast1e6000() {
    return 4;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      TimeDimension(tier).produceDimensions(TimeDimension(tier - 1), diff / 10);
    }

    if (EternityChallenge(7).isRunning) {
      TimeDimension(1).produceDimensions(InfinityDimension(8), diff);
    } else {
      TimeDimension(1).produceCurrency(Currency.timeShards, diff);
    }

    EternityChallenge(7).reward.applyEffect(production => {
      InfinityDimension(8).amount = InfinityDimension(8).amount.plus(production.times(diff / 1000));
    });
  }
};

export function tryUnlockTimeDimensions() {
  if (TimeDimension(8).isUnlocked) return;
  for (let tier = 5; tier <= 8; ++tier) {
    if (TimeDimension(tier).isUnlocked) continue;
    TimeDimension(tier).tryUnlock();
  }
}
