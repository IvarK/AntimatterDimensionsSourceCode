'use strict';

/**
 * This is a file for general math utilities that can be used by many mechanics
 */

/**
 * @typedef {Object} bulkBuyBinarySearch_result
 * @property {number} quantity amount purchased (relative)
 * @property {Decimal} purchasePrice amount that needs to be paid to get that
 */

/**
 * bulkBuyBinarySearch is a helper for bulk buyers of non-linear prices. If the price of
 * a thing is f(n), it's hard to figure out how much of it can be bought without an inverse
 * of f. This helper starts at some n0, and then searches forward in powers of 2 until it
 * finds a value that is not affordable. After that, it performs a binary search to figure
 * out how much can actually be bought. Returns an object with a quantity and price, or
 * null if nothing can be bought
 * @param {Decimal} money Amount of currency available
 * @param {function(number): Decimal} costFunction price of the n'th purchase (starting from 0)
 * @param {number} alreadyBought amount already purchased
 * @param {Decimal} [firstCost] Cost of the next purchase; this is usually available/cached. Will
 *   be calculated from costFunction if not provided.
 * @returns {bulkBuyBinarySearch_result | null}
 */
function bulkBuyBinarySearch(money, costFunction, alreadyBought, firstCost) {
  if (firstCost === undefined) firstCost = costFunction(alreadyBought);
  if (money.lt(firstCost)) return null;
  // Attempt to find the max we can purchase. We know we can buy 1, so we try 2, 4, 8, etc
  // to figure out the upper limit
  let cantBuy = 1;
  let nextCost;
  do {
    cantBuy *= 2;
    nextCost = costFunction(alreadyBought + cantBuy - 1);
  } while (money.gt(nextCost));
  // Deal with the simple case of buying just one
  if (cantBuy === 2) {
    return { quantity: 1, purchasePrice: firstCost };
  }
  // The amount we can actually buy is in the interval [canBuy/2, canBuy), we do a binary search
  // to find the exact value:
  let canBuy = cantBuy / 2;
  let buyCost;
  while (cantBuy - canBuy > 1) {
    let middle = Math.floor((canBuy + cantBuy) / 2);
    if (money.gt(costFunction(alreadyBought + middle - 1))) {
      canBuy = middle;
    } else {
      cantBuy = middle;
    }
  }
  let baseCost = costFunction(alreadyBought + canBuy - 1);
  let otherCost = new Decimal(0);
  // account for costs leading up to that purchase; we are basically adding things
  // up until they are insignificant
  let count = 0;
  for (let i = canBuy - 1; i > 0; --i) {
    const newCost = otherCost.plus(costFunction(alreadyBought + i - 1));
    if (newCost.eq(otherCost)) break;
    otherCost = newCost;
    if (++count > 1000) throw crash("unexpected long loop"); // buggy cost function?
  }
  let totalCost = baseCost.plus(otherCost);
  // check the purchase price again
  if (money.lt(totalCost)) {
    --canBuy;
    // Since prices grow rather steeply, we can safely assume that we can, indeed, buy
    // one less (e.g. if prices were A, B, C, D, we could afford D, but not A+B+C+D; we
    // assume we can afford A+B+C because A+B+C < D)
    totalCost = otherCost;
  }
  return { quantity: canBuy, purchasePrice: totalCost };
}

/**
 * LinearMultiplierScaling performs calculations for multipliers that scale up
 * linearly. The simplest case you might consider could be a factorial -- or something
 * much slower, like 2 * 2.01 * 2.02 * 2.03 * ...
 * In terms of accuracy, it's better for slower growing multipliers than fast. For
 * example, with a factorial setup, it evaluates 11! as 39826281.18738219 rather than 39916800
 * The ratio between the estimated 10! and 11! is 10.99999474474497 which is pretty good.
 * For base = 2, growth = 0.1, after 10 purchases, the result is 7268.488254368145, rather
 * than 7268.490028799995. After 100 purchases, it's 4.582662e+79 rather than
 * 4.582664e+79.
 * Note: this doesn't do well with small initial multipliers (close to 1). 1.01 is about low
 * as it's reasonable to go.
 */
class LinearMultiplierScaling {
  /**
   * Construct the helper object, which can be invoked for various calculations
   * @param {number} baseRatio The first multiplier
   * @param {number} growth The growth rate; multiplier after purchase N, starting at 0, is baseRatio + N * growth
   */
  constructor(baseRatio, growth) {
    this.baseRatio = baseRatio;
    this.growth = growth;
  }
  /**
   * Multiply both the base ratio and the growth rate by the specified factor
   * @param {number} ratio
   * @returns this object for easy chaining
   */
  scale(ratio) {
    this.baseRatio *= ratio;
    this.growth *= ratio;
    return this;
  }
  /**
   * Shift by the specified number of purchases. For example, if you set up 2, 0.1, but you
   * want the first scale factor to be 2.1, you could shift by 1
   * @param {number} count number of purchases to shift by
   * @returns this
   */
  shift(count) {
    this.baseRatio += this.growth * count;
    return this;
  }
  /**
   * Find the combined multiplier after N purchases. N = 0 means a multiplier of 1 -- since no
   * purchases have been made, no scaling has been applied. N = 1 is baseRatio, N=2 gives
   * baseRatio * (baseRatio + growth), and so on. This is done using a corrected integral
   * approximation
   * @param {number} count number of purchases that have happened
   * @returns {number} the natural log of the combined multiplier
   */
  logTotalMultiplierAfterPurchases(count) {
    if (count === 0) return 0;
    const k = this.growth / this.baseRatio;
    const u = k * count;
    return (1 / k + count - 0.5) * Math.log1p(u) + count * (Math.log(this.baseRatio) - 1) -  k * u / (12 * (1 + u));
  }

  /**
   * Invert the function given a combined multiplier. This doesn't do any rounding (so you
   * can choose how to handle that).
   * @param {number} logMult natural logarithm of combined multiplier
   */
  purchasesForLogTotalMultiplier(logMult) {
    if (this.baseRatio < 1.01) throw crash("Ratio is too small for good calculations")
    let Lb = Math.log(this.baseRatio);
    const k = this.growth / this.baseRatio;
    // Final refinement step, applying 2nd order iteration directly to the formula of
    // logTotalMultiplierAfterPurchases
    const refineFinal = g => {
      const u = k * g;
      const Lg = Math.log1p(u);
      const tmp = 0.5 * k / (1 + u);
      const fVal = (1 / k + g - 0.5) * Lg + g * (Lb - 1) - (logMult + tmp * u / 6);
      const fDeriv = Lg + Lb - tmp * (tmp / 3 + 1);
      const fD2 = tmp * (2 + tmp * (2 + tmp / 3));
      const delta1 = fVal / fDeriv;
//      return g - delta1;
      return g - 2 * delta1 / (1 + Math.sqrt(1 - 2 * delta1 * fD2 / fDeriv));
    };
    // We calculate an initial estimate, assuming that the price doesn't increase:
    const g0 = logMult / Lb;
    // If the growth rate is really slow and there's not many steps, this is great guess
    // the other method (below) doesn't do well in that case.
    if (k * g0 < 0.01) return refineFinal(refineFinal(g0));
    const rhs_0 = this.growth * logMult + this.baseRatio * (Lb - 1);

    // First, we make a good guess at a solution, based on an approximation of the sum sas an
    // uncorrected integral; these parameters came from an optimization. We are solving for
    // the value of base + x * growth - 1 here
    const K1 = 0.183709519164226;
    const K2 = 0.693791942633232;
    const K3 = 0.049293492810849;
    const y = Math.sqrt(2 * (rhs_0 + 1));
    const h0 = y * (1 + K1 * y) / (1 + K2 * Math.log1p(K3 * y));

    // Apply a refinement step; this also shifts the answer by 1
    const h1 = (1 + h0 + rhs_0) / Math.log1p(h0);

    // At this point we should have a pretty solid guess -- enough that this calcuolation
    // should be pretty accurate; the final refinement 
    const g1 = (h1 - this.baseRatio) / this.growth;
    return refineFinal(refineFinal(g1));
  }

  /**
   * Manual calculation, for testing purposes
   * @param {number} count
   */
  logTotalMultiplierAfterPurchases_baseline(count) {
    let ret = 0;
    const k = this.growth / this.baseRatio;
    for (let x = 0; x < count; ++x) ret += Math.log1p(k * x);
    return ret + count * Math.log(this.baseRatio);
  }
}

function getCostWithLinearCostScaling(amountOfPurchases, costScalingStart, initialCost, costMult, costMultGrowth) {
  let preScalingPurchases = Math.max(0, Math.floor(Math.log(costScalingStart / initialCost) / Math.log(costMult)));
  let preScalingCost = Math.ceil(Math.pow(costMult, Math.min(preScalingPurchases, amountOfPurchases)) * initialCost);
  let scaling = new LinearMultiplierScaling(costMult, costMultGrowth);
  let postScalingCost = Math.exp(scaling.logTotalMultiplierAfterPurchases(Math.max(0, amountOfPurchases - preScalingPurchases)));
  return preScalingCost * postScalingCost;
}