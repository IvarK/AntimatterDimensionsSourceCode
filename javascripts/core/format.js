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

function shortenGlyphEffect(money) {
  return shorten(money, 2, 3);
}

function shortenMultiplier(money) {
  return shorten(money, 1, 1);
}

function shortenAutobuyerInput(value) {
  return Notation.scientific.format(value, 2, 0);
}

function shorten(value, places, placesUnder1000) {
  return Notation.current.format(value, places, placesUnder1000);
}

function shortenPostBreak(value, places, placesUnder1000) {
  Notation.forcePostBreakFormat = true;
  const shortened = this.shorten(value, places, placesUnder1000);
  Notation.forcePostBreakFormat = false;
  return shortened;
}

function formatX(value, places, placesUnder1000) {
  return shorten(value, places, placesUnder1000) + "x";
}

function formatPercents(value, places) {
  const placesOOM = Math.pow(10, places);
  return Math.round(value * 100 * placesOOM) / placesOOM + "%";
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

const commaRegexp = /\B(?=(\d{3})+(?!\d))/g;
function formatWithCommas(value) {
  return value.toString().replace(commaRegexp, ",");
}