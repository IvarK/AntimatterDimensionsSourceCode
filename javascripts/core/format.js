"use strict";

function format(value, places, placesUnder1000) {
  return Notations.current.format(value, places, placesUnder1000);
}

function formatInt(value) {
  if (Notations.current.isPainful) {
    return format(value, 2, 0);
  }
  return formatWithCommas(typeof value === "number" ? value.toFixed(0) : value.toNumber().toFixed(0));
}

function formatFloat(value, digits) {
  if (Notations.current.isPainful) {
    return format(value, Math.max(2, digits), digits);
  }
  return formatWithCommas(value.toFixed(digits));
}

function formatPostBreak(value, places, placesUnder1000) {
  const notation = Notations.current;
  // This is basically just a copy of the format method from notations library,
  // with the pre-break case removed.
  if (typeof value === "number" && !Number.isFinite(value)) {
    return notation.infinite;
  }

  const decimal = Decimal.fromValue_noAlloc(value);

  if (decimal.exponent < -300) {
    return decimal.sign() < 0
      ? notation.formatVerySmallNegativeDecimal(decimal.abs(), placesUnder1000)
      : notation.formatVerySmallDecimal(decimal, placesUnder1000);
  }

  if (decimal.exponent < 3) {
    const number = decimal.toNumber();
    return number < 0
      ? notation.formatNegativeUnder1000(Math.abs(number), placesUnder1000)
      : notation.formatUnder1000(number, placesUnder1000);
  }

  return decimal.sign() < 0
    ? notation.formatNegativeDecimal(decimal.abs(), places)
    : notation.formatDecimal(decimal, places);
}

function formatX(value, places, placesUnder1000) {
  return `×${format(value, places, placesUnder1000)}`;
}

function formatPow(value, places, placesUnder1000) {
  return `^${format(value, places, placesUnder1000)}`;
}

function formatPercents(value, places) {
  return `${format(value * 100, 2, places)}%`;
}

function formatRarity(value) {
  // We can, annoyingly, have rounding error here, so even though only rarities
  // are passed in, we can't trust our input to always be some integer divided by 10.
  const places = value.toFixed(1).endsWith(".0") ? 0 : 1;
  return `${format(value, 2, places)}%`;
}

function timeDisplay(ms) {
  return TimeSpan.fromMilliseconds(ms).toString();
}

function timeDisplayNoDecimals(ms) {
  return TimeSpan.fromMilliseconds(ms).toStringNoDecimals();
}

function timeDisplayShort(ms) {
  return TimeSpan.fromMilliseconds(ms).toStringShort();
}

const commaRegexp = /\B(?=(\d{3})+(?!\d))/gu;
function formatWithCommas(value) {
  const decimalPointSplit = value.toString().split(".");
  decimalPointSplit[0] = decimalPointSplit[0].replace(commaRegexp, ",");
  return decimalPointSplit.join(".");
}

// Some letters in the english language pluralize in a different manner than simply adding an 's' to the end.
// As such, the regex match should be placed in the first location, followed by the desired string it
// should be replaced with. Note that $ refers to the EndOfLine for regex, and should be included if the plural occurs
// at the end of the string provided, which will be 99% of times. Not including it is highly likely to cause mistakes,
// as it will select the first instance that matches and replace that.
const PLURAL_HELPER = new Map([
  [/y$/u, "ies"],
  [/x$/u, "xes"],
]);

// Some terms in the game are plural by default. These terms should be added, in all lowercase, to this array.
const ALWAYS_SINGULAR = [
  "dilated time",
];

/**
 * A function that pluralizes a word based on a designated amount
 * @param  {string} word           - word to be pluralized
 * @param  {number|Decimal} amount - amount to be used to determine if the value is plural
 * @param  {string} [plural]       - if defined, a specific plural to override the generated plural
 * @return {string}                - if the {amount} is anything other than one, return the {plural} provided or the
 *                                   plural form of the input {word}. If the {amount} is singular, return {word}
 */
function pluralize(word, amount, plural) {
  // If either word or amount is undefined, we cannot continue.
  if (word === undefined || amount === undefined) throw "Arguments must be defined";

  // If the word is in the ALWAYS_SINGULAR array, return true. Otherwise, check if its a number or Decimal type, and
  // check if that is equal to 1.
  const isSingular = () => {
    if (ALWAYS_SINGULAR.includes(word.toLowerCase())) return true;
    if (typeof amount === "number") return amount === 1;
    if (amount instanceof Decimal) return amount.eq(1);
    throw `Amount must be either a number or Decimal. Instead, amount was ${amount}`;
  };

  // If its singular, return the word itself. Afterwards, if plural is defined, return plural
  if (isSingular()) return word;
  if (plural) return plural;

  // Go through the Map PLURAL_HELPER, using the supplied regex, returning the string with text replaced if any matches
  // are found.
  for (const [match, replaceWith] of PLURAL_HELPER.entries()) {
    if (word.match(match)) {
      return word.replace(match, replaceWith);
    }
  }
  // Return the word but with an 's'
  return `${word}s`;
}

/**
 * Returns the formatted value followed by a name, pluralized based on the value input.
 * @param  {string} name                  - name to pluralize and display after {value}
 * @param  {number|Decimal} value         - number to {format}
 * @param  {number} [places]              - number of places to display for the mantissa
 * @param  {number} [placesUnder1000]     - number of decimal places to display
 * @param  {function} [formatType=format] - how to format the {value}. defaults to format
 * @return {string} - the formatted {value} followed by the {name} after having been pluralized based on the {value}
 */
// eslint-disable-next-line max-params
function quantify(name, value, places, placesUnder1000, formatType = format) {
  if (name === undefined || value === undefined) throw "Arguments must be defined";

  const number = formatType(value, places, placesUnder1000);
  const plural = pluralize(name, value);
  return `${number} ${plural}`;
}

/**
 * Returns the value formatted to formatInt followed by a name, pluralized based on the value input.
 * @param  {string} name                  - name to pluralize and display after {value}
 * @param  {number|Decimal} value         - number to format
 * @return {string} - the formatted {value} followed by the {name} after having been pluralized based on the {value}
 */
function quantifyInt(name, value) {
  if (name === undefined || value === undefined) throw "Arguments must be defined";

  const number = formatInt(value);
  const plural = pluralize(name, value);
  return `${number} ${plural}`;
}
