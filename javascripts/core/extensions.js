Array.prototype.distinct = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
};

Math.wrap = function(number, min, max) {
    let range = max - min + 1;
    number = ((number - min) % range);
    return number < 0 ? min + 1 + number : min + number;
};

Math.clamp = function(value, min, max) {
    return (value < min) ? min : (value > max ? max : value);
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

Number.sumReducer = function(accumulator, previous) {
  return accumulator + previous;
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

function copyToClipboard(str) {
    try {
        let el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        let result = document.execCommand('copy');
        document.body.removeChild(el);
        return result;
    } catch(ex) {
        console.log(ex);
        return false;
    }
}

function copyToClipboardAndNotify(str) {
    if (copyToClipboard(str)) {
        ui.notify.info("Exported to clipboard");
    }
}

function safeCall(fn) {
    if (fn) fn();
}

String.empty = "";

String.prototype.capitalize = function() {
  return this.toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

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
 * @param {function} predicate
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
 * @type {number[]}
 */
Array.dimensionTiers = Array.range(1, 8);

Array.prototype.sum = function() {
  if (this.length === 0) return 0;
  return this.reduce(Number.sumReducer);
};

Array.prototype.max = function() {
  if (this.length === 0) return 0;
  return this.reduce((a, b) => Math.max(a, b));
};