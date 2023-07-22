import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function solarDimensionCommonMultiplier() {
  return DC.D1;
}

export function buySingleSolarDimension(tier) {
  const dim = SolarDimension(tier);
  if (Currency.planetPoints.lt(dim.cost)) return false;

  Currency.planetPoints.subtract(dim.cost);
  dim.amount = dim.amount.plus(1);
  dim.bought++;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function buyMaxSolarDimension(tier, portionToSpend = 1) {
  const dim = SolarDimension(tier);
  const points = Currency.planetPoints.value.times(portionToSpend);

  if (points.lt(dim.cost)) return false;

  const bulk = bulkBuyBinarySearch(points, {
    costFunction: bought => dim.nextCost(bought),
    cumulative: true,
    firstCost: dim.cost
  }, dim.bought);

  if (!bulk) return false;

  Currency.planetPoints.subtract(bulk.purchasePrice);
  dim.amount = dim.amount.plus(bulk.quantity);
  dim.bought += bulk.quantity;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllSolarDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 8; i > 0 && SolarDimension(i).bought === 0; i--) {
    buySingleSolarDimension(i);
  }

  // Buy everything costing less than 1% of initial EP
  for (let i = 8; i > 0; i--) {
    buyMaxSolarDimension(i, 0.01);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const unlockedDimensions = SolarDimensions.all.filter(d => d.isUnlocked);
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = unlockedDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleSolarDimension(cheapestDim.tier, true)) break;
  }
}

export function fullResetSolarDimensions() {
  for (const dim of SolarDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = DC.D0;
    dim.bought = 0;
  }
  player.watts = new Decimal(0);
}

class SolarDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.solar, tier);
    const BASE_COSTS = [null, DC.D1, DC.D5, DC.E3, DC.E10, DC.E100, DC.E1000, DC.E5000, DC.E10000];
    this._baseCost = BASE_COSTS[tier];
    const BASE_COST_MULTIPLIERS = [null, DC.D2, DC.D5, DC.E3, DC.E10, DC.E100, DC.E1000, DC.E5000, DC.E10000];
    this._baseCostMultiplier = BASE_COST_MULTIPLIERS[tier];
  }

  get cost() { return this.data.cost; }
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    return Decimal.pow(this._baseCostMultiplier, bought).times(this.baseCost);
  }

  get isUnlocked() {
    return true;
  }

  get isAffordable() {
    return Currency.planetPoints.gte(this.cost);
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get multiplier() {
    const tier = this._tier;

    const dim = SolarDimension(tier);
    const bought = tier === 8 ? Math.clampMax(dim.bought, 1e8) : dim.bought;
    return GameCache.solarDimensionCommonMultiplier.value.times(Decimal.pow(dim.powerMultiplier, bought));
  }

  get productionPerSecond() {
    return this.amount.times(this.multiplier);
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = SolarDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current);
  }

  get isProducting() {
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get baseAmount() {
    return this.data.baseAmount;
  }

  set baseAmount(value) {
    this.data.baseAmount = value;
  }

  get powerMultiplier() {
    return DC.D4;
  }
}

export const SolarDimension = SolarDimensionState.createAccessor();

export const SolarDimensions = {
  all: SolarDimension.index.compact(),
  canBuy() {
    return true;
  },
  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      SolarDimension(tier).produceDimensions(SolarDimension(tier - 1), diff / 10);
    }

    SolarDimension(1).produceCurrency(Currency.watts, diff);
  },
  buySingle() {
    if (!this.isAvailableForPurchase) return false;
    Currency.planetPoints.purchase(this.cost);
    this.cost = dim.nextCost(dim.bought);
    this.amount = this.amount.plus(1);

    return true;
  },
  buyMax() {
    if (!this.isAvailableForPurchase) return false;

    const costScaling = new LinearCostScaling(
      Currency.planetPoints.value,
      this.cost,
      this.costMultiplier
    );

    if (costScaling.purchases <= 0) return false;

    Currency.planetPoints.purchase(costScaling.totalCost);
    this.cost = this.cost.times(costScaling.totalCostMultiplier);
    this.amount = this.amount.plus(costScaling.purchases);

    return true;
  }
};