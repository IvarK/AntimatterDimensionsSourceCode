"use strict";

function shortenRateOfChange(money) {
  return shorten(money, 2, 2);
}

function shortenCosts(money) {
  return shorten(money, 0, 0);
}

function shortenDimensions(money) {
  return shorten(money, 2, 0);
}

function shortenMoney(money) {
  return shorten(money, 2, 1);
}

function shortenMultiplier(money) {
  return shorten(money, 1, 1);
}

function shorten(value, places, placesUnder1000) {
  return Notations.current.format(value, places, placesUnder1000);
}

function shortenSmallInteger(value) {
  return Notations.current.isPainful
    ? shorten(value, 2, 2)
    : formatWithCommas(typeof value === "number" ? value.toFixed(0) : value.toNumber().toFixed(0));
}

function shortenPostBreak(value, places, placesUnder1000) {
  const currentFormat = ui.formatPreBreak;
  ui.formatPreBreak = false;
  const shortened = shorten(value, places, placesUnder1000);
  ui.formatPreBreak = currentFormat;
  return shortened;
}

function format(value, places, placesUnder1000) {
  return shorten(value, places, placesUnder1000);
}

function formatX(value, places, placesUnder1000) {
  return `${shorten(value, places, placesUnder1000)}x`;
}

function formatPow(value, places, placesUnder1000) {
  return `^${shorten(value, places, placesUnder1000)}`;
}

function formatPercents(value, places) {
  return `${shorten(value * 100, 2, places)}%`;
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
