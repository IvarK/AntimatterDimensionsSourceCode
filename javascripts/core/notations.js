class Notation {
  constructor(name) {
    this.name = name;
    this._infDecimal = new Decimal(Number.MAX_VALUE);
  }

  get isPainful() {
    return false;
  }

  /**
   * @param {Decimal | number | string | undefined | null} value
   * @param {number} places
   * @param {number} placesUnder1000
   * @return {string}
   */
  format(value, places, placesUnder1000) {
    if (typeof value === "number" && !Number.isFinite(value)) {
      return this.formatInfinite();
    }

    const decimal = new Decimal(value);

    if (decimal.exponent < 3) {
      return this.formatUnder1000(decimal.toNumber(), placesUnder1000);
    }

    if (this.isInfinite(decimal)) {
      return this.formatInfinite();
    }

    return this.formatDecimal(decimal, places);
  }

  /**
   * @param {number} value
   * @param {number} places
   * @returns {string}
   * @protected
   */
  formatUnder1000(value, places) {
    return value.toFixed(places);
  }

  formatInfinite() {
    return "Infinite";
  }

  /**
   * @param {Decimal} decimal
   * @protected
   */
  isInfinite(decimal) {
    const isPreBreak = !player.break || Challenge.isRunning();
    return !Notation.forcePostBreakFormat && isPreBreak && decimal.gte(this._infDecimal);
  }

  /**
   * @param {Decimal} value
   * @param {number} places
   * @return {string}
   * @abstract
   * @protected
   */
  formatDecimal(value, places) {}

  /**
   * @param {number} power
   * @return {string}
   * @protected
   */
  formatExponent(power) {
    if (power < 100000) return power.toString();
    if (Notation.commasOnExponent(power)) return formatWithCommas(power);
    return this.formatDecimal(power.toDecimal(), 3);
  }

  /**
   * @param {number} power
   * @return {boolean}
   * @protected
   */
  static commasOnExponent(power) {
    return player.options.commas && power < 1000000000;
  }

  /**
   * Fixes cases like (9.6e3, 0), which results in "10e3" (but we need "1e4" instead)
   * because toFixed rounds numbers to closest integer
   * @param {Decimal} value
   * @param {number} places
   * @param {number} threshold
   * @param powerOffset
   * @return {Decimal}
   * @protected
   */
  fixMantissaOverflow(value, places, threshold, powerOffset) {
    const pow10 = Math.pow(10, places);
    const isOverflowing = Math.round(value.mantissa * pow10) >= threshold * pow10;
    if (!isOverflowing) return value;
    return Decimal.fromMantissaExponent_noNormalize(1, value.exponent + powerOffset);
  }

  setCurrent() {
    player.options.notation = this.name;
    ui.notationName = this.name;
  }

  /**
   * @param {string} name
   * @return {Notation}
   */
  static find(name) {
    const notation = Notation.all.find(n => n.name === name);
    return notation === undefined ? Notation.mixedScientific : notation;
  }

  static get current() {
    return GameUI.initialized ? ui.notation : Notation.mixedScientific;
  }
}

Notation.forcePostBreakFormat = false;

Notation.scientific = new class ScientificNotation extends Notation {
  formatDecimal(value, places) {
    const fixedValue = this.fixMantissaOverflow(value, places, 10, 1);
    const mantissa = fixedValue.mantissa.toFixed(places);
    const exponent = this.formatExponent(fixedValue.exponent);
    return `${mantissa}e${exponent}`;
  }
}("Scientific");

class EngineeringNotation extends Notation {
  formatDecimal(value, places) {
    const engineering = this.makeFixedEngineering(value, places);
    const mantissa = engineering.mantissa.toFixed(places);
    const exponent = this.formatExponent(engineering.exponent);
    return `${mantissa}e${exponent}`;
  }

  /**
   * Transforms 1-digit mantissa decimal into 3-digits mantissa decimal
   * For example: 1.5e5 => 150e3
   * Note, that it does so in 3 exponent increments, so 1.5e3 is still 1.5e3
   * @param {Decimal} value
   * @returns {Decimal}
   * @protected
   */
  makeEngineering(value) {
    const exponentOffset = value.exponent % 3;
    return Decimal.fromMantissaExponent_noNormalize(
      value.mantissa * Math.pow(10, exponentOffset),
      value.exponent - exponentOffset
    );
  }

  /**
   * @param {Decimal} value
   * @param {number} places
   * @protected
   */
  makeFixedEngineering(value, places) {
    const result = this.makeEngineering(value);
    return this.fixMantissaOverflow(result, places, 1000, 3);
  }
}

Notation.engineering = new EngineeringNotation("Engineering");

Notation.standard = new class StandardNotation extends EngineeringNotation {
  constructor() {
    super("Standard");
    this.abbreviations = [
      '', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc',
      'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg',
      'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg',
      'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd',
      'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi',
      'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe',
      'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt',
      'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg',
      'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce'
    ];
  }

  get isPainful() {
    return true;
  }

  formatDecimal(value, places) {
    const engineering = this.makeFixedEngineering(value, places);
    const mantissa = engineering.mantissa.toFixed(places);
    const abbreviation = value.exponent <= 303 ?
      this.abbreviations[engineering.exponent / 3] :
      StandardNotation.getAbbreviation(value.exponent);
    return `${mantissa} ${abbreviation}`;
  }

  /**
   * @param {number} e
   * @return {string}
   * @private
   */
  static getAbbreviation(e) {
    const prefixes = [
      ['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
      ['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
      ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']];
    const prefixes2 = ['', 'MI-', 'MC-', 'NA-', 'PC-', 'FM-'];
    e = Math.floor(e / 3) - 1;
    let index2 = 0;
    let prefix = [prefixes[0][e % 10]];
    while (e >= 10) {
      e = Math.floor(e / 10);
      prefix.push(prefixes[(++index2) % 3][e % 10]);
    }
    index2 = Math.floor(index2 / 3);
    while (prefix.length % 3 !== 0) prefix.push("");
    let ret = "";
    while (index2 >= 0) ret += prefix[index2 * 3] + prefix[index2 * 3 + 1] + prefix[index2 * 3 + 2] + prefixes2[index2--];
    if (ret.endsWith("-")) ret = ret.slice(0, ret.length - 1)
    return ret.replace("UM", "M").replace("UNA", "NA").replace("UPC", "PC").replace("UFM", "FM");
  }
}();

Notation.mixedScientific = new class MixedScientificNotation extends Notation {
  formatDecimal(value, places) {
    const notation = value.exponent >= 33 ? Notation.scientific : Notation.standard;
    return notation.format(value, places);
  }
}("Mixed scientific");

Notation.mixedEngineering = new class MixedEngineeringNotation extends Notation {
  formatDecimal(value, places) {
    const notation = value.exponent >= 33 ? Notation.engineering : Notation.standard;
    return notation.format(value, places);
  }
}("Mixed engineering");

Notation.infinity = new class InfinityNotation extends Notation {
  constructor() {
    super("Infinity");
    this._infLog10 = Math.log10(Number.MAX_VALUE);
  }

  formatDecimal(value, places) {
    const log10 = value.log10();
    const infinities = log10 / this._infLog10;
    const infPlaces = infinities < 1000 ? 4 : 3;
    const formatted = infinities.toFixed(Math.max(infPlaces, places));
    if (player.options.commas) {
      const parts = formatted.split(".");
      return `${formatWithCommas(parts[0])}.${parts[1]}∞`;
    }
    else {
      return `${formatted}∞`;
    }
  }
}("Infinity");

Notation.logarithm = new class LogarithmNotation extends Notation {
  formatDecimal(value, places) {
    const log10 = value.log10();
    if (value.exponent < 100000) {
      return "e" + log10.toFixed(Math.max(places, 1));
    }
    if (Notation.commasOnExponent(value.exponent)) {
      return "e" + formatWithCommas(log10.toFixed(places));
    }
    return "ee" + Math.log10(log10).toFixed(3);
  }
}("Logarithm");

Notation.brackets = new class BracketsNotation extends Notation {
  get isPainful() {
    return true;
  }

  formatDecimal(value, places) {
    let table = [")", "[", "{", "]", "(", "}"];
    let log6 = Math.LN10 / Math.log(6) * value.log10();
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
}("Brackets");

class LettersNotation extends EngineeringNotation {
  constructor(name, letters) {
    super(name);
    this._letters = letters;
  }

  /**
   * @private
   */
  letter(power, str) {
    const len = str.length;

    function lN(n) {
      let result = 1;
      for (let j = 0; j < n; ++j) result = len * result + 1;
      return result;
    }

    if (power <= 5) return str[0];
    power = Math.floor(power / 3);
    let i = 0;
    while (power >= lN(++i)) ;
    if (i === 1) return str[power - 1];
    power -= lN(i - 1);
    let ret = '';
    while (i > 0) ret += str[Math.floor(power / Math.pow(len, --i)) % len];
    return ret;
  }

  formatDecimal(value, places) {
    const engineering = this.makeEngineering(value);
    const mantissa = engineering.mantissa.toFixed(places);
    const letters = this.letter(value.exponent, this._letters);
    return mantissa + letters;
  }
}

Notation.letters = new LettersNotation("Letters", "abcdefghijklmnopqrstuvwxyz");

Notation.cancer = new class CancerNotation extends LettersNotation{
  get isPainful() {
    return true;
  }

  setCurrent() {
    super.setCurrent();
    GameUI.notify.success("😂😂😂");
  }
}("Cancer", ['😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢', '🙈', '👍', '☂', '✌', '⚠', '❌', '😋', '⚡']);

Notation.roman = new class RomanNotation extends Notation {
  constructor() {
    super("Roman");
    this._decimalValue = [ 1000000, 900000, 500000, 400000, 100000, 90000, 50000, 40000, 10000, 9000,  5000, 4000, 1000,  900,    500,  400,   100,   90,    50,   40,     10,   9,    5,     4,     1   ];
    this._romanNumeral = [ "M̄",     "C̄M̄",   "D̄",    "C̄D̄",   "C̄",    "X̄C̄",  "L̄",   "X̄L̄",  "X̄",   "ⅯX̄", "V̄",  "ⅯV̄", "Ⅿ",  "ⅭⅯ", "Ⅾ", "ⅭⅮ", "Ⅽ", "ⅩⅭ", "Ⅼ", "ⅩⅬ", "Ⅹ", "ⅠⅩ","Ⅴ", "ⅠⅤ", "Ⅰ" ];
    this._romanFractions = ["", "·", ":", "∴", "∷", "⁙"];
    this.maximum = 4000000;
    this._maxLog10 = Math.log10(this.maximum);
  }

  get isPainful() {
    return true;
  }

  formatInfinite() {
    return "Infinitus";
  }

  formatUnder1000(value, places) {
    return this.romanize(value);
  }

  formatDecimal(value, places) {
    if (value.lt(this.maximum)) {
      return this.romanize(value.toNumber());
    }
    const log10 = value.log10();
    const maximums = log10 / this._maxLog10;
    const current = Math.pow(this.maximum, maximums - Math.floor(maximums));
    return `${this.romanize(current)}↑${this.formatDecimal(maximums.toDecimal())}`;
  }

  /**
   * @param {number} value
   * @return {string}
   * @private
   */
  romanize(value) {
    const decimalValue = this._decimalValue;
    const romanNumeral = this._romanNumeral;
    const romanFractions = this._romanFractions;
    let roman = String.empty;
    for (let i = 0; i < decimalValue.length; i++) {
      while (decimalValue[i] <= value) {
        roman += romanNumeral[i];
        value -= decimalValue[i];
      }
    }
    let duodecimal = Math.round(Math.floor(value * 10) * 1.2);
    if (duodecimal === 0) {
      return roman === String.empty ? "nulla" : roman;
    }
    if (duodecimal > 5) {
      duodecimal -= 6;
      roman += "Ｓ";
    }
    roman += romanFractions[duodecimal];
    return roman;
  }
}("Roman");


Notation.dots = new class DotsNotation extends Notation {
  formatUnder1000(value, places) {
    return this.dotify(value * 254);
  }

  formatInfinite() {
    return "⣿⠀⣿";
  }

  formatDecimal(value, places) {
    if (value.lt(16387063.9980315)) {
      return this.dotify(value.toNumber() * 254);
    }
    const log = value.log(254);
    const exponent = Math.floor(log - 2);
    const mantissa = Math.pow(254, log - exponent);
    return this.dotify(exponent) + "⣿" + this.dotify(mantissa * 254);
  }

  /**
   * @param {number} value
   * @param {boolean?} pad
   * @return {string}
   */
  dotify(value, pad) {
    const DOT_DIGITS =
      "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿" +
      "⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿" +
      "⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿" +
      "⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿";

    value = Math.round(value);
    if (!pad && value < 254) return DOT_DIGITS[value + 1];
    if (value < 64516) return DOT_DIGITS[Math.floor(value / 254) + 1] + DOT_DIGITS[value % 254 + 1];
    return this.dotify(Math.floor(value / 64516)) + this.dotify(value % 64516, true);
  }
}("Dots");

Notation.zalgo = new class ZalgoNotation extends Notation {
  constructor() {
    super("Zalgo");
    this._zalgoChars = ['\u030D', '\u0336', '\u0353', '\u033F', '\u0489', '\u0330', '\u031A', '\u0338', '\u035A', '\u0337'];
    this._heComes = ["H", "E" , " ", "C" , "O" , "M" , "E", "S"];
  }

  get isPainful() {
    return true;
  }

  formatInfinite() {
    return this._heComes
      .map(char => char + this._zalgoChars.randomElement())
      .join("");
  }

  formatUnder1000(value, places) {
    return this.heComes(value.toDecimal());
  }

  formatDecimal(value, places) {
    return this.heComes(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   */
  heComes(value) {
    // Eternity seems to happen around e66666 antimatter, who would've thought? Scaled down to 1000.
    let scaled = value.clampMin(1).log10() / 66666 * 1000;
    let displayPart = scaled.toFixed(2);
    let zalgoPart = Math.floor(Math.abs(Math.pow(2, 30) * (scaled - displayPart)));

    let displayChars = Array.from(formatWithCommas(displayPart));
    let zalgoIndices = Array.from(zalgoPart.toString() + scaled.toFixed(0));

    for (let i = 0; i < zalgoIndices.length; i++) {
      let zalgoIndex = parseInt(zalgoIndices[i]);
      let displayIndex = 7 * i % displayChars.length;
      displayChars[displayIndex] += this._zalgoChars[zalgoIndex];
    }

    return displayChars.join("");
  }
}();


Notation.imperial = new class ImperialNotation extends Notation {
  constructor() {
    super("Imperial");
    // The first column is the size in pL
    // the second is the name
    // the third is an index offset (going backwards) to the smallest unit that
    // is larger than "roudning error" for the unit in question (so, for a tun,
    // this is 7, which means that if we're within one pin of a tun, we'll say we're
    // "almost a tun" rather than "a pin short of a tun"
    this.VOLUME_UNITS = [
      [0, "pL", 0],
      [61611520, "minim", 0],
      [61611520*60, "dram", 1],
      [61611520*60*8, "ounce", 2],
      [61611520*60*8*4, "gill", 2],
      [61611520*60*8*4*2, "cup", 3],
      [61611520*60*8*4*2*2, "pint", 4],
      [61611520*60*8*4*2*2*2, "quart", 4],
      [61611520*60*8*4*2*2*2*4, "gallon", 4],
      [61611520*60*8*4*2*2*2*4*4.5, "pin", 3],
      [61611520*60*8*4*2*2*2*4*9, "firkin", 3],
      [61611520*60*8*4*2*2*2*4*18, "kilderkin", 4],
      [61611520*60*8*4*2*2*2*4*36, "barrel", 4],
      [61611520*60*8*4*2*2*2*4*54, "hogshead", 5],
      [61611520*60*8*4*2*2*2*4*72, "puncheon", 6],
      [61611520*60*8*4*2*2*2*4*108, "butt", 7],
      [61611520*60*8*4*2*2*2*4*216, "tun", 7],
    ];
    this.MINIMS = this.VOLUME_UNITS[1];
    this.VOLUME_ADJECTIVES = ["minute ", "tiny ", "petite ", "small ", "modest ", "medium ", "generous ",
      "large ", "great ", "huge ", "gigantic ", "colossal ", "vast ", "cosmic "];
    this.VOWELS = new Set("aeiouAEIOU");
  }

  get isPainful() {
    return true;
  }

  formatUnder1000(value) {
    return this.formatDecimal(new Decimal(value));
  }

  formatDecimal(value) {
    const logCutoff = 10 * this.VOLUME_UNITS[this.VOLUME_UNITS.length-1][0];
    if (value.lt(logCutoff)) {
      return this.convertToVolume(value.toNumber(), this.VOLUME_ADJECTIVES[0]);
    }
    let logValue = value.log10() - Math.log10(logCutoff);
    const reduceRatio = Math.log10(logCutoff/this.VOLUME_UNITS[1][0]);
    let adjectiveIndex = 1;
    while (logValue > reduceRatio) {
      adjectiveIndex++;
      logValue /= reduceRatio;
    }
    return this.convertToVolume(Math.pow(10, logValue) * this.VOLUME_UNITS[1][0], this.VOLUME_ADJECTIVES[adjectiveIndex]);
  }

  convertToVolume(x, adjective) {
    const volIdx = this.findVolumeUnit(x);
    if (volIdx === 0) return this.formatMetric(x);

    const smallStr = this.checkSmallUnits(adjective, x, volIdx);
    if (smallStr) return smallStr;

    const big = this.VOLUME_UNITS[volIdx]
    const numBig = Math.floor(x / big[0]);
    const remainder = x - numBig * big[0];
    // When we are within a specified rounding error, unit break:
    if (volIdx < this.VOLUME_UNITS.length - 1) {
      const ret = this.checkAlmost(adjective, x, 0, volIdx + 1);
      if (ret) return ret;
    }
    const nearMultiple = this.checkAlmost(adjective, remainder, numBig, volIdx);
    if (nearMultiple) return nearMultiple;
    // just over a multiple, in units that are too small:
    if (remainder < this.VOLUME_UNITS[volIdx - big[2]][0]) {
      return this.pluralOrArticle(numBig, adjective + big[1]);
    }
    // Search for the best unit to pair with:
    let numBest = Math.floor(remainder / this.VOLUME_UNITS[volIdx - 1][0]);
    let bestUnitIndex = volIdx - 1;
    let bestUnitError = remainder - numBest * this.VOLUME_UNITS[volIdx - 1][0];
    for (let thirdUnitIndex = volIdx - 2; thirdUnitIndex > 0 && thirdUnitIndex > volIdx - big[2]; --thirdUnitIndex) {
      const third = this.VOLUME_UNITS[thirdUnitIndex];
      const numThird = Math.floor(remainder / third[0]);
      // If we have a lot of the unit under consideration -- then stop. The exception is in
      // case of minims, where it may be normal to have a bunch of them; in that case, we print
      // drams if possible.
      if (numThird > 9 && (thirdUnitIndex != 1 || bestUnits)) break;
      // we are using floor, so we can compare error diretly, without abs
      const thirdUnitError = remainder - numThird * third[0];
      if (thirdUnitError < 0.99 * bestUnitError) {
        numBest = numThird;
        bestUnitIndex = thirdUnitIndex;
        bestUnitError = thirdUnitError;
      }
    }
    return this.bigAndSmall(adjective, numBig, big, numBest, this.VOLUME_UNITS[bestUnitIndex]);
  }

  /**
   * Format a small quantity that is less than the smallest minim; this is done without adjective
   * @param {number} x
   **/
  formatMetric(x) {
    // The jump from metric to minim is sudden. Small values (< 10) get more decimal places
    // because that's usually something like sacrifice multiplier
    if (x < 1000) {
      return x < 10 || x === Math.round(x) ? x.toFixed(2) : x.toFixed(0) + "pL"
    }
    if (x < 1e6) return (x / 1000).toPrecision(4) + "nL";
    return (x / 1e6).toPrecision(4) + "μL";
  }

  /**
   * handles cases involving everything up to ounces; in the case of ounces it may
   * return nothing, in which case, the normal code path should be used.
   * @param {string} adjective will be attached to unit
   * @param {number} x value to be formatted
   * @param {number} volIdx index into VOLUME_UNITS for x (largest unit smaller than x)
   * @returns {string?} the formatted output, if within the capabilities of this function
   */
  checkSmallUnits(adjective, x, volIdx) {
    const big = this.VOLUME_UNITS[volIdx];
    // Check for some minims short of a small unit break:
    if (volIdx <= 3 && x + 9.5 * this.MINIMS[0] > this.VOLUME_UNITS[volIdx + 1][0]) {
      return this.almostOrShortOf(x, adjective, 1, this.VOLUME_UNITS[volIdx + 1], this.MINIMS);
    }
    // minims to drams. This goes:
    // a minim
    // 1.5 minims                  <-- we don't do this with larger units
    // 10 minims ... 50 minims
    // 9 minims short of a dram
    // a minim short of a dram
    // almost a dram               <-- handled above
    if (volIdx === 1) {
      let deciMinims = Math.round(x * 10 / big[0]);
      if (deciMinims === 10) return this.addArticle(adjective + big[1]);
      let places = deciMinims < 100 ? 1 : 0;
      return `${(deciMinims / 10).toFixed(places)} ${adjective}${big[1]}s`
    }
    if (volIdx === 2) {
      const numBig = Math.floor(x / big[0]);
      const remainder = x - numBig * big[0];
      if (remainder > 50.5 * this.MINIMS[0]) { // 9 minims short of a dram
        return this.almostOrShortOf(x, adjective, numBig + 1, big, this.MINIMS);
      } else { // a dram and 15 minims
        const numSmall = Math.round(remainder / this.MINIMS[0]);
        return this.bigAndSmall(adjective, numBig, big, numSmall, this.MINIMS);
      }
    }
  }


  /**
   * Search for the largest unit smaller than x
   * @param {number} x
   * @returns {number} index into VOLUME_UNITS
   **/
  findVolumeUnit(x) {
    let low = 0;
    let high = this.VOLUME_UNITS.length;
    let guess;
    while (high - low > 1) {
      guess = Math.floor((low + high) / 2);
      if (this.VOLUME_UNITS[guess][0] > x) high = guess;
      else low = guess;
    }
    return low;
  }

  // Try to do "almost a big thing" or "a thing short of a big thing", based on the setting
  // we have for rounding error units; may return nothing if we are not actually near something
  checkAlmost(adjective, x, numBig, bigIndex) {
    const big = this.VOLUME_UNITS[bigIndex];
    if (x + this.VOLUME_UNITS[bigIndex - big[2]][0] >= big[0]) {
      return this.almost(adjective, numBig + 1, big);
    }
    const small = this.VOLUME_UNITS[bigIndex + 1 - big[2]];
    if (x + small[0] >= big[0]) {
      return this.shortOf(adjective, numBig + 1, big, 1, small);
    }
    return;
  }

  bigAndSmall(adjective, numBig, big, numSmall, small) {
    const bigStr = this.pluralOrArticle(numBig, adjective + big[1]);
    return numSmall === 0 ? bigStr : bigStr + " and " + this.pluralOrArticle(numSmall, small[1]);
  }

  almost(adjective, numBig, big) {
    return "almost " + this.pluralOrArticle(numBig, adjective + big[1]);
  }
  
  almostOrShortOf(x, adjective, numBig, big, small) {
    const short = Math.round((numBig * big[0] - x) / small[0]);
    return short
      ? this.shortOf(adjective, numBig, big, short, small)
      : this.almost(adjective, numBig, big);
  }

  shortOf(adjective, numBig, big, numSmall, small) {
    return this.pluralOrArticle(numSmall, small[1]) + " short of " +
      this.pluralOrArticle(numBig, adjective + big[1]);
  }

  pluralOrArticle(num, str) {
    return num === 1 ? this.addArticle(str) : num + " " + str + "s";
  }

  addArticle(x) {
    return (this.VOWELS.has(x[0]) ? "an " : "a ") + x;
  }

}();


/**
 * Explicit array declaration instead of Object.values for sorting purposes
 * (Object.values doesn't guarantee any order)
 * @type {Notation[]}
 */
Notation.all = [
  Notation.scientific,
  Notation.engineering,
  Notation.letters,
  Notation.standard,
  Notation.cancer,
  Notation.mixedScientific,
  Notation.mixedEngineering,
  Notation.logarithm,
  Notation.brackets,
  Notation.infinity,
  Notation.roman,
  Notation.dots,
  Notation.zalgo,
  Notation.imperial,
];