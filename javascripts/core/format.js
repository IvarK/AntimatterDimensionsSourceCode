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
  const currentFormat = ui.formatPreBreak;
  ui.formatPreBreak = false;
  const formatted = format(value, places, placesUnder1000);
  ui.formatPreBreak = currentFormat;
  return formatted;
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
