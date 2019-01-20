var FormatList = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce',];
const commaRegexp = /\B(?=(\d{3})+(?!\d))/g;

function letter(power,str) {
    const len = str.length;
    function lN(n) {
        let result = 1;
        for (var j = 0; j < n; ++j) result = len*result+1;
        return result;
    }
    if (power <= 5) return str[0];
    power = Math.floor(power / 3);
    let i=0;
    while (power >= lN(++i));
    if (i==1) return str[power-1];
    power -= lN(i-1);
    let ret = '';
    while (i>0) ret += str[Math.floor(power/Math.pow(len,--i))%len]
    return ret;
}

function getAbbreviation(e) {
    const prefixes = [
    ['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
    ['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
    ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
    const prefixes2 = ['', 'MI-', 'MC-', 'NA-', 'PC-', 'FM-']
    e = Math.floor(e/3)-1;
    let index2 = 0;
    let prefix = [prefixes[0][e%10]];
    while (e >= 10) {
        e = Math.floor(e/10);
        prefix.push(prefixes[(++index2)%3][e%10])
    }
    index2 = Math.floor(index2/3)
    while (prefix.length%3 != 0) prefix.push("");
    let ret = "";
    while (index2 >= 0) ret += prefix[index2*3] + prefix[index2*3+1] + prefix[index2*3+2] + prefixes2[index2--];
    if (ret.endsWith("-")) ret = ret.slice(0,ret.length-1)
    return ret.replace("UM","M").replace("UNA","NA").replace("UPC","PC").replace("UFM","FM")
}

let forcePostBreakFormat = false;

const inflog10 = Math.log10(Number.MAX_VALUE);
const infDecimal = new Decimal(Number.MAX_VALUE);
function formatValue(notation, value, places, placesUnder1000) {
  const decimal = new Decimal(value);

  if (decimal.exponent < 3) {
    return decimal.toNumber().toFixed(placesUnder1000);
  }

  const notFinite = typeof value === "number" && !Number.isFinite(value);
  const isPreBreak = !player.break || Challenge.isRunning();
  if (notFinite || !forcePostBreakFormat && isPreBreak && decimal.gte(infDecimal)) {
    return "Infinite";
  }

  let power = decimal.exponent;
  let mantissa = decimal.mantissa;
  // If commas is false, exponent will be formatted with current notation
  let commas = player.options.commas && power < 1000000000;

  function formatPower(power) {
    if (power < 100000) return power.toString();
    if (commas) return formatWithCommas(power);
    return formatValue(notation, power, 3, 3);
  }

  if (notation === "Scientific" || (notation === "Mixed scientific" && power >= 33)) {
    return `${mantissa.toFixed(places)}e${formatPower(power)}`;
  }

  if (notation === "Infinity") {
    commas = player.options.commas;
    const log10 = decimal.log10();
    const infinities = log10 / inflog10;
    const infPlaces = infinities < 1000 ? 4 : 3;
    const formatted = infinities.toFixed(Math.max(infPlaces, places));
    if (commas) {
      const parts = formatted.split(".");
      return `${formatWithCommas(parts[0])}.${parts[1]}∞`;
    }
    else {
      return `${formatted}∞`;
    }
  }

  if (notation === "Logarithm") {
    const log10 = decimal.log10();
    if (power < 100000) {
      return "e" + log10.toFixed(Math.max(places, 1));
    }
    if (commas) {
      return "e" + formatWithCommas(log10.toFixed(places));
    }
    return "ee" + Math.log10(log10).toFixed(3);
  }

  if (notation === "Brackets") {
    let table = [")", "[", "{", "]", "(", "}"];
    let log6 = Math.LN10 / Math.log(6) * decimal.log10();
    let wholePartOfLog = Math.floor(log6);
    let decimalPartOfLog = log6 - wholePartOfLog;
    //Easier to convert a number between 0-35 to base 6 than messing with fractions and shit
    let decimalPartTimes36 = Math.floor(decimalPartOfLog * 36);
    let string = "";
    while (wholePartOfLog >= 6) {
      let remainder = wholePartOfLog % 6;
      wholePartOfLog -= remainder;
      wholePartOfLog /= 6;
      string = table[remainder] + string;
    }
    string = "e" + table[wholePartOfLog] + string + ".";
    string += table[Math.floor(decimalPartTimes36 / 6)];
    string += table[decimalPartTimes36 % 6];
    return string;
  }

  // 3-digit mantissa notations below

  const powerOffset = power % 3;
  mantissa *= Math.pow(10, powerOffset);
  function concatResult(powerFormat) {
    return mantissa.toFixed(places) + powerFormat;
  }

  if (notation === "Engineering" || (notation === "Mixed engineering" && power >= 33)) {
    return concatResult("e" + formatPower(power - powerOffset));
  }

  if (notation === "Standard" || notation === "Mixed scientific" || notation === "Mixed engineering") {
    const abbreviation = power <= 303 ? FormatList[(power - powerOffset) / 3] : getAbbreviation(power);
    return concatResult(" " + abbreviation);
  }

  if (notation === "Letters") {
    return concatResult(letter(power, 'abcdefghijklmnopqrstuvwxyz'));
  }

  if (notation === "Cancer") {
    return concatResult(letter(power, ['😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢', '🙈', '👍', '☂', '✌', '⚠', '❌', '😋', '⚡']));
  }

  return "1337 H4CK3R";
}

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

function shortenAutobuyerInput(money) {
  return formatValue("Scientific", money, 2, 0);
}

function shorten(value, places, placesUnder1000) {
    return formatValue(Notation.current().name, value, places, placesUnder1000);
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

function formatWithCommas(value) {
  return value.toString().replace(commaRegexp, ",");
}