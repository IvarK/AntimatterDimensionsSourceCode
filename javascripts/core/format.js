"use strict";

function format(value, places, placesUnder1000) {
  return Notations.current.format(value, places, placesUnder1000);
}

function formatInt(value) {
  if (Notations.current.isPainful) {
    return format(value, 2, 2);
  }
  return formatWithCommas(typeof value === "number" ? value.toFixed(0) : value.toNumber().toFixed(0));
}

// There's probably a better way, but I basically needed formatInt behavior but with some decimal points
function formatContinuum(value) {
  if (Notations.current.isPainful) {
    return format(value, 2, 2);
  }
  return formatWithCommas(value.toFixed(2));
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
  return `${format(value, places, placesUnder1000)}x`;
}

function formatPow(value, places, placesUnder1000) {
  return `^${format(value, places, placesUnder1000)}`;
}

function formatPercents(value, places) {
  return `${format(value * 100, 2, places)}%`;
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
