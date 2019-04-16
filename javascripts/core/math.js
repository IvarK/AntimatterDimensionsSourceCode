"use strict";

const LOG10_MAX_VALUE = Math.log10(Number.MAX_VALUE);
const LN_SQRT_2_PI = 0.5 * Math.log(2 * Math.PI);
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
 * NOTE: this will not work with slowly increasing prices. This makes the assumption that
 * if you can afford purchase N, you can afford the combined cost of everything before N
 * (it does check and make sure you can afford all of that put together. See below in code
 * for details)
 * @param {Decimal} money Amount of currency available
 * @param {Object} costInfo cost parameters:
 * @param {function(number): Decimal} costInfo.costFunction price of the n'th purchase (starting from 0)
 * @param {Decimal} [costInfo.firstCost] Cost of the next purchase; this is usually available/cached. Will
 *   be calculated from costFunction if not provided.
 * @param {boolean} [costInfo.cumulative] (Defaults to true) specifies whether one must pay a cumulative
 *   cost or just the highest cost.
 * @param {number} alreadyBought amount already purchased
 * @returns {bulkBuyBinarySearch_result | null}
 */
function bulkBuyBinarySearch(money, costInfo, alreadyBought) {
  const costFunction = costInfo.costFunction;
  const firstCost = costInfo.firstCost === undefined ? costFunction(alreadyBought) : costInfo.firstCost;
  const isCumulative = costInfo.cumulative === undefined ? true : costInfo.cumulative;
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
  if (cantBuy > Number.MAX_SAFE_INTEGER) throw crash("Overflow in binary search");
  while (cantBuy - canBuy > 1) {
    const middle = Math.floor((canBuy + cantBuy) / 2);
    if (money.gt(costFunction(alreadyBought + middle - 1))) {
      canBuy = middle;
    } else {
      cantBuy = middle;
    }
  }
  const baseCost = costFunction(alreadyBought + canBuy - 1);
  if (!isCumulative) {
    return { quantity: canBuy, purchasePrice: baseCost };
  }
  let otherCost = new Decimal(0);
  // Account for costs leading up to that purchase; we are basically adding things
  // up until they are insignificant
  let count = 0;
  for (let i = canBuy - 1; i > 0; --i) {
    const newCost = otherCost.plus(costFunction(alreadyBought + i - 1));
    if (newCost.eq(otherCost)) break;
    otherCost = newCost;
    if (++count > 1000) throw crash("unexpected long loop (buggy cost function?)");
  }
  let totalCost = baseCost.plus(otherCost);
  // Check the purchase price again
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
    let logMult = 0;
    const k = this.growth / this.baseRatio;
    for (let x = 0; x < count; ++x) logMult += Math.log1p(k * x);
    return logMult + count * Math.log(this.baseRatio);
  }
}

function getCostWithLinearCostScaling(amountOfPurchases, costScalingStart, initialCost, costMult, costMultGrowth) {
  const preScalingPurchases = Math.max(0, Math.floor(Math.log(costScalingStart / initialCost) / Math.log(costMult)));
  const preScalingCost = Math.ceil(Math.pow(costMult, Math.min(preScalingPurchases, amountOfPurchases)) * initialCost);
  const scaling = new LinearMultiplierScaling(costMult, costMultGrowth);
  const postScalingCost = Math.exp(scaling.logTotalMultiplierAfterPurchases(
    Math.max(0, amountOfPurchases - preScalingPurchases)));
  return preScalingCost * postScalingCost;
}

const logFactorial = (function() {
  const LOGS = Array.range(1, 11).map(Math.log);
  const TABLE = [0];
  for (const x of LOGS) {
    TABLE.push(TABLE[TABLE.length - 1] + x);
  }
  return x => {
    if (typeof x !== "number" || x < 0) return NaN;
    if (x < TABLE.length) return TABLE[x];
    return lngamma(x + 1);
  };
}());

/** 32 bit XORSHIFT generator */
const fastRandom = (function() {
  let state = Math.floor(Date.now()) % Math.pow(2, 32);
  const scale = 1 / (Math.pow(2, 32));
  /* eslint-disable no-bitwise */
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state * scale + 0.5;
  };
  /* eslint-enable no-bitwise */
}());

// Normal distribution with specified mean and standard deviation
const normalDistribution = (function() {
  let haveSpare = false;
  let spare = 0;
  return (mean, stdDev) => {
    if (typeof mean !== "number" || typeof stdDev !== "number") return NaN;
    if (haveSpare) {
      haveSpare = false;
      return mean + stdDev * spare;
    }
    let mag, u, v;
    do {
      u = fastRandom() * 2 - 1;
      v = fastRandom() * 2 - 1;
      mag = u * u + v * v;
    } while (mag >= 1 || mag === 0);
    const t = Math.sqrt(-2 * Math.log(mag) / mag);
    haveSpare = true;
    spare = v * t;
    return mean + stdDev * u * t;
  };
}());

// Helper function for BTRD
const binomialGeneratorFC = (function() {
  const stirlingBase = x => -8.10614667953272582e-2 + (x + 0.5) * Math.log1p(x) - x;
  const TABLE = Array.range(0, 20).map(x => logFactorial(x) - stirlingBase(x));
  return x => {
    if (typeof x !== "number" || x < 0) return NaN;
    if (x < TABLE.length) return TABLE[x];
    const xr = 1 / (x + 1);
    return (1 / 12 - (1 / 360 - (xr * xr) / 1260) * (xr * xr)) * xr;
  };
}());

/**
 * This manually inverts the cumulative probability distribution
 * @param {number} numSamples number of drawn samples
 * @param {number} p probability
 * @returns {number} number of samples that satisfied p
 */
function binomialDistributionSmallExpected(numSamples, p) {
  const R = p / (1 - p);
  const NxR = (numSamples + 1) * R;
  // Calculate (1-p)^n without rounding error at 1 - p
  let pdf = Math.exp(Math.log1p(-p) * numSamples);
  const u = fastRandom();
  let cdf = pdf;
  let output = 0;
  while (u > cdf) {
    ++output;
    pdf *= (NxR / output - R);
    if (cdf + pdf === cdf) break;
    cdf += pdf;
  }
  return output;
}

function binomialDistribution(numSamples, p) {
  if (p === 0) return 0;
  if (numSamples instanceof Decimal) {
    if (numSamples.e < 308) {
      const pNumber = typeof p === "number" ? p : p.toNumber();
      return new Decimal(binomialDistribution(numSamples.toNumber(), pNumber));
    }
    const expected = numSamples.times(p);
    if (expected.e > 32) return expected;
    return poissonDistribution(numSamples.times(p));
  }
  const expected = numSamples * p;
  // BTRD is good past 10, but the inversion method we use is faster up to 15 and is exact
  if (expected < 15) return binomialDistributionSmallExpected(numSamples, p);
  if (p > 0.5) return numSamples - binomialDistribution(numSamples, 1 - p);
  // At some point, the variance is so small relative to the expected value that
  // all samples are within eps of the mean
  if (expected > 1e32) return expected;
  const approximateVariance = expected * (1 - p);
  // Normal approximation is good enough for larger distributions
  if (approximateVariance > 1e4) return Math.round(normalDistribution(expected, Math.sqrt(approximateVariance)));
  return binomialDistributionBTRD(numSamples, p);
}

/**
 * Chooses the method of generation based on the input
 * @param {number|Decimal} expected expected value of distribution
 * @returns {number|Decimal} number of poisson process events
 */
function poissonDistribution(expected) {
  if (expected === 0) return 0;
  if (expected instanceof Decimal) {
    if (expected.e > 32) return expected;
    return new Decimal(poissonDistribution(expected.toNumber()));
  }
  if (expected > 1e32) return expected;
  if (expected > 1e4) return poissonDistributionViaNormal(expected);
  if (expected < 20) return poissonDistributionSmallExpected(expected);
  return poissonDistributionPTRD(expected);
}

/**
 * Uses a normal approximation to sqrt(x)
 */
function poissonDistributionViaNormal(expected) {
  const x = normalDistribution(Math.sqrt(expected), 0.5);
  return Math.floor(x * x);
}

/**
 * This manually inverts the cumulative probability distribution
 */
function poissonDistributionSmallExpected(expected) {
  let pdf = Math.exp(-expected);
  let cdf = pdf;
  const u = fastRandom();
  let output = 0;
  while (u > cdf) {
    ++output;
    pdf *= expected / output;
    if (cdf + pdf === cdf) break;
    cdf += pdf;
  }
  return output;
}

/**
 * Algorithm from https://core.ac.uk/download/pdf/11007254.pdf
 */
function binomialDistributionBTRD(numSamples, p) {
  const expected = numSamples * p;
  const approximateVariance = expected * (1 - p);
  const approxStdev = Math.sqrt(approximateVariance);
  const m = Math.floor(expected + p);
  const R = p / (1 - p);
  const NxR = (numSamples + 1) * R;
  const b = 1.15 + 2.53 * approxStdev;
  const a = -0.0873 + 0.0248 * b + 0.01 * p;
  const c = expected + 0.5;
  const alpha = (2.83 + 5.1 / b) * approxStdev;
  const kU = 0.43;
  const kV = 0.92 - 4.2 / b;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let v = fastRandom();
    if (v <= 2 * kU * kV) {
      const u = v / kV - kU;
      return Math.floor((2 * a / (0.5 - Math.abs(u)) + b) * u + c);
    }
    let u;
    if (v >= kV) {
      u = fastRandom() - 0.5;
    } else {
      const w = v / kV - 0.93;
      v = fastRandom() * kV;
      u = (w > 0 ? 0.5 : -0.5) - w;
    }
    const us = 0.5 - Math.abs(u);
    const k = Math.floor((2 * a / us + b) * u + c);
    if (k < 0 || k > numSamples) continue;
    v *= alpha / (a / (us * us) + b);
    const km = Math.abs(k - m);
    // These loops are very fast, compared to calculating all the logs and stuff below; the
    // original paper has 15 here but 40 seems to be closer to optimal.
    if (km <= 40) {
      let f = 1;
      if (m < k) {
        for (let i = m + 1; i <= k; ++i) f *= (NxR / i - R);
      } else if (m > k) {
        for (let i = k + 1; i <= m; ++i) v *= (NxR / i - R);
      }
      if (v <= f) return k;
      continue;
    }
    const rho = (km / approximateVariance) * (((km / 3 + 0.625) * km + 1 / 6) / approximateVariance + 0.5);
    const t = -km * km / (2 * approximateVariance);
    const logV = Math.log(v);
    if (logV < t - rho) return k;
    if (logV > t + rho) continue;
    const _nm = numSamples - m + 1;
    const _nk = numSamples - k + 1;
    const h = (m + 0.5) * Math.log((m + 1) / (R * _nm)) +
      binomialGeneratorFC(m) + binomialGeneratorFC(numSamples - m);
    const j = (numSamples + 1) * Math.log(_nm / _nk) + (k + 0.5) * Math.log(_nk * R / (k + 1)) -
      binomialGeneratorFC(k) - binomialGeneratorFC(numSamples - k);
    if (logV <= h + j) return k;
  }
}

/**
 * "The transformed rejection method for generating Poisson random variables"
 * http://epub.wu.ac.at/352/1/document.pdf
 * @param {number} mu expected value of distribution
 * @returns {number} (integer) number of events in poisson process
 */
function poissonDistributionPTRD(mu) {
  const sMu = Math.sqrt(mu);
  const b = 0.931 + 2.53 * sMu;
  const a = -0.059 + 0.02483 * b;
  const iAlpha = 1.1239 + 1.328 / (b - 3.4);
  const vR = 0.9277 - 3.6224 / (b - 2);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let v = Math.random();
    if (v < 0.86 * vR) {
      const u = v / vR - 0.43;
      return Math.floor((2 * a / (0.5 - Math.abs(u)) + b) * u + mu + 0.445);
    }
    let u;
    if (v >= vR) {
      u = fastRandom() - 0.5;
    } else {
      const w = v / vR - 0.93;
      u = (w > 0 ? 0.5 : -0.5) - w;
      v = fastRandom() * vR;
    }
    const us = 0.5 - Math.abs(u);
    if (us < 0.013 && us < v) continue;
    const k = Math.floor((2 * a / us + b) * u + mu + 0.445);
    v *= iAlpha / (a / us / us + b);
    const ik = 1 / k;
    if (k >= 10) {
      const t = (k + 0.5) * Math.log(mu * ik) - mu - LN_SQRT_2_PI + k - (1 / 12 - ik * ik / 360) * ik;
      if (Math.log(v * sMu) <= t) return k;
    } else {
      if (Math.log(v) <= k * Math.log(mu) - mu - logFactorial(k)) return k;
    }
  }
}
