"use strict";

Array.prototype.distinct = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

Math.wrap = function(number, min, max) {
  const range = max - min + 1;
  const offset = ((number - min) % range);
  return offset < 0 ? max + 1 + offset : min + offset;
};

Math.clamp = function(value, min, max) {
  return Math.clampMax(Math.clampMin(value, min), max);
};

Math.clampMin = function(value, min) {
  return Math.max(value, min);
};

Math.clampMax = function(value, max) {
  return Math.min(value, max);
};

Array.prototype.nextSiblingIndex = function(current) {
  const currentIndex = this.indexOf(current);
  if (currentIndex === -1)
    throw "Current item is not in array";
  return currentIndex === this.length - 1 ? 0 : currentIndex + 1;
};

Array.prototype.nextSibling = function(current) {
  return this[this.nextSiblingIndex(current)];
};

Array.prototype.previousSiblingIndex = function(current) {
  const currentIndex = this.indexOf(current);
  if (currentIndex === -1)
    throw "Current item is not in array";
  return currentIndex === 0 ? this.length - 1 : currentIndex - 1;
};

Array.prototype.previousSibling = function(current) {
  return this[this.previousSiblingIndex(current)];
};

Decimal.sumReducer = function(accumulator, previous) {
  return Decimal.add(accumulator, previous);
};

Decimal.prodReducer = function(accumulator, previous) {
  return Decimal.mul(accumulator, previous);
};

Number.sumReducer = function(accumulator, previous) {
  return accumulator + previous;
};

Number.prodReducer = function(accumulator, previous) {
  return accumulator * previous;
};

Decimal.maxReducer = function(a, b) {
  return Decimal.max(a, b);
};

Decimal.prototype.copyFrom = function(decimal) {
  if (!(decimal instanceof Decimal)) {
    throw "Copy value is not Decimal";
  }
  this.mantissa = decimal.mantissa;
  this.exponent = decimal.exponent;
};

const copyToClipboard = (function() {
  let el = document.createElement('textarea');
  document.body.appendChild(el);
  el.style.position = "absolute";
  el.style.left = '-9999999px';
  el.setAttribute('readonly', '');
  return function(str) {
    try {
      el.value = str;
      el.select();
      return document.execCommand('copy');
    } catch(ex) {
      console.log(ex);
      return false;
    }
  };
}());

function copyToClipboardAndNotify(str) {
    if (copyToClipboard(str)) {
        GameUI.notify.info("Exported to clipboard");
    }
}

function safeCall(fn) {
    if (fn) fn();
}

String.prototype.capitalize = function() {
  return this.toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

if (!String.prototype.splice) {
  /**
   * {JSDoc}
   *
   * The splice() method changes the content of a string by removing a range of
   * characters and/or adding new characters.
   *
   * @this {String}
   * @param {number} start Index at which to start changing the string.
   * @param {number} delCount An integer indicating the number of old chars to remove.
   * @param {string} newSubStr The String that is spliced in.
   * @return {string} A new string with the spliced substring.
   */
  String.prototype.splice = function(start, delCount, newSubStr) {
      return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
  };
}

/**
 * @param {number} start
 * @param {number} count
 * @returns {number[]}
 */
Array.range = function(start, count) {
  return [...Array(count).keys()].map(i => i + start);
};

/**
 * @param {number} value
 * @param {number} count
 * @returns {number[]}
 */
Array.repeat = function(value, count) {
  return Array(count).fill(value);
};

/**
 * @param {function} predicate
 */
Array.prototype.first = function(predicate) {
  if (predicate === undefined) {
    return this.length > 0 ? this[0] : undefined;
  }
  if (typeof predicate !== "function")
    throw "Predicate must be a function";
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i]) === true) return this[i];
  }
  throw "Array doesn't contain a matching item";
};

/**
 * @param {function?} predicate
 */
Array.prototype.last = function(predicate) {
  if (predicate === undefined) {
    return this.length > 0 ? this[this.length - 1] : undefined;
  }
  if (typeof predicate !== "function")
    throw "Predicate must be a function";
  for (let i = this.length - 1; i >= 0; i--) {
    if (predicate(this[i]) === true) return this[i];
  }
  throw "Array doesn't contain a matching item";
};

/**
 * @param {function?} keyFun
 * @param {function?} valueFun
 * @returns {object}
 */
Array.prototype.mapToObject = function(keyFun, valueFun) {
  if (typeof keyFun !== "function" || typeof valueFun !== "function")
    throw "keyFun and valueFun must be functions";
  let out = {}
  for (let idx = 0; idx < this.length; ++idx) {
    out[keyFun(this[idx], idx)] = valueFun(this[idx], idx);
  }
  return out;
}

/**
 * @type {number[]}
 */
Array.dimensionTiers = Array.range(1, 8);

/**
 * @returns {number}
 */
Array.prototype.sum = function() {
  if (this.length === 0) return 0;
  return this.reduce(Number.sumReducer);
};

/**
 * @returns {number}
 */
Array.prototype.max = function() {
  if (this.length === 0) return 0;
  return this.reduce((a, b) => Math.max(a, b));
};

/**
 * @returns {number}
 */
Array.prototype.min = function() {
  if (this.length === 0) return 0;
  return this.reduce((a, b) => Math.min(a, b));
};

/**
 * @param {function} predicate
 * @returns {number}
 */
Array.prototype.countWhere = function(predicate) {
  let count = 0;
  for (const item of this) {
    if (predicate(item))++count;
  }
  return count;
};

/**
 * @returns {Decimal}
 */
Decimal.prototype.clampMaxExponent = function(maxExp) {
  return this.exponent >= maxExp
    ? Decimal.fromMantissaExponent_noNormalize(1, maxExp) : this;
};

/**
 * @return {Decimal}
 */
Number.prototype.toDecimal = function() {
  return new Decimal(this.valueOf());
};

Math.log4 = Math.log(4);

Array.prototype.randomElement = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Decimal.prototype.valueOf = () => { throw crash("Implicit conversion from Decimal to number"); };

Set.prototype.countWhere = function(predicate) {
  let count = 0;
  for (const item of this) {
    if (predicate(item))++count;
  }
  return count;
};

Set.prototype.find = function(predicate) {
  for (const item of this) {
    if (predicate(item)) return item;
  }
  return undefined;
};

Set.prototype.every = function(predicate) {
  for (const item of this) {
    if (!predicate(item)) return false;
  }
  return true;
};

Array.prototype.compact = function() {
  return this.filter(x => x !== undefined && x !== null);
};

Decimal.MAX_NUMBER = new Decimal(Number.MAX_VALUE);

String.isWhiteSpace = function(value) {
  return value && !value.trim();
};
