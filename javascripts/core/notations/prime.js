"use strict";

Notation.prime = new class PrimeNotation extends Notation {
  constructor() {
    super("Prime");
    // The maximum number we can reliably find all prime factors for.
    this._maxInt = 10006;
    this._maxIntDecimal = new Decimal(this._maxInt);
    this._maxIntLog10 = Math.log10(this._maxInt);
    // List of primes from 2-9973, cause thats how many I check for.
    const primes = [];
    const visitedMarks = new Array(this._maxInt).fill(false);
    const sieveLimit = Math.ceil(Math.sqrt(this._maxInt));
    for (let number = 2; number < sieveLimit; number++) {
      if (visitedMarks[number]) continue;
      primes.push(number);
      for (let mark = number; mark <= this._maxInt; mark += number) {
        visitedMarks[mark] = true;
      }
    }
    for (let number = sieveLimit; number < this._maxInt; number++) {
      if (!visitedMarks[number]) {
        primes.push(number);
      }
    }
    this._primes = primes;
    this._lastPrimeIndex = primes.length - 1;
    this._maxPrime = this._primes[this._lastPrimeIndex];

    // Unicode characters for exponents ranging 0 - 13.
    this._exponentCharacters = [
      "\u2070", "\u00B9", "\u00B2", "\u00B3", "\u2074",
      "\u2075", "\u2076", "\u2077", "\u2078", "\u2079",
      "\u00B9\u2070", "\u00B9\u00B9", "\u00B9\u00B2", "\u00B9\u00B3"
    ];
  }

  formatInfinite() {
    return "Primefinity?";
  }

  formatUnder1000(value) {
    return this.primify(value.toDecimal());
  }

  formatDecimal(value) {
    return this.primify(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   * @private
   */
  primify(value) {
    // We take the number and do 1 of 3 things depending on how big it is.
    // If the number is smaller than maxInt, 10006, then we just find the primes and
    // format them.
    // If not we need a way of representing the number, using only primes of course.
    // So we derive an exponent that will keep the base under the maxInt, then
    // we derive prime factors for both and format them as (base)^(exponent).
    // If the number is greater than 1e10006, we need to again format it differently.
    // So we increase our stack size to three, and repeat the process above from
    // top down.
    if (value.lte(this._maxIntDecimal)) {
      const floored = Math.floor(value.toNumber());
      if (floored === 0) return 0;
      if (floored === 1) return 1;
      return this.formatFromList(this.primesFromInt(floored));
    }
    let exp = value.log10() / this._maxIntLog10;
    let base = Math.pow(this._maxInt, exp / Math.ceil(exp));
    if (exp <= this._maxInt) {
      return this.formatBaseExp(base, exp);
    }
    const exp2 = Math.log10(exp) / Math.log10(this._maxInt);
    const exp2Ceil = Math.ceil(exp2);
    exp = Math.pow(this._maxInt, exp2 / exp2Ceil);
    base = Math.pow(this._maxInt, exp / Math.ceil(exp));
    const exp2List = this.primesFromInt(exp2Ceil);
    const formatedExp2 = exp2List.length === 1
      ? this._exponentCharacters[exp2List[0]]
      : `^(${this.formatFromList(exp2List)})`;
    return this.formatBaseExp(base, exp) + formatedExp2;
  }

  /**
   * @param {Array} base
   * @param {Array} exp
   * @return {string}
   * @private
   */
  formatBaseExp(base, exp) {
    const formatedBase = this.formatFromList(this.primesFromInt(Math.floor(base)));
    const formatedExp = this.formatFromList(this.primesFromInt(Math.ceil(exp)));
    return `(${formatedBase})^(${formatedExp})`;
  }

  /**
   * @param {Array} list
   * @return {string}
   * @private
   */
  formatFromList(list) {
    // Formats an array of prime numbers such that all like pairs are combined,
    // they are then raised to an exponent signifying how many times the value apears.
    // Finally multiplication signs are put between all values.
    const out = [];
    let last = 0;
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === last) {
        count++;
      } else {
        if (last > 0) {
          if (count > 1) out.push(last + this._exponentCharacters[count]);
          else out.push(last);
        }
        last = list[i];
        count = 1;
      }
      if (i === list.length - 1) {
        if (count > 1) out.push(list[i] + this._exponentCharacters[count]);
        else out.push(list[i]);
      }
    }
    return out.join("\u00D7");
  }

  findGreatestLtePrimeIndex(value) {
    // Lte stands for "less than or equal"
    if (value >= this._maxPrime) return this._lastPrimeIndex;
    let min = 0;
    let max = this._lastPrimeIndex;
    while (max !== min + 1) {
      const middle = Math.floor((max + min) / 2);
      const prime = this._primes[middle];
      if (prime === value) return middle;
      if (value < prime) max = middle;
      else min = middle;
    }
    return min;
  }

  /**
   * @param {Decimal} list
   * @return {Array}
   * @private
   */
  primesFromInt(value) {
    const factors = [];
    let factoringValue = value;
    while (factoringValue !== 1) {
      const ltePrimeIndex = this.findGreatestLtePrimeIndex(factoringValue);
      const ltePrime = this._primes[ltePrimeIndex];
      if (ltePrime === factoringValue) {
        factors.push(factoringValue);
        break;
      }
      // Search for greatest prime that is lesser than factored / 2, because
      // all greater values won't be factors anyway
      const halfFactoring = factoringValue / 2;
      let primeIndex = this.findGreatestLtePrimeIndex(halfFactoring);
      let factor;
      while (factor === undefined) {
        const prime = this._primes[primeIndex--];
        if (factoringValue % prime === 0) {
          factor = prime;
        }
      }
      factoringValue /= factor;
      factors.push(factor);
    }
    return factors.reverse();
  }
}();