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

Notation.hex = new class HexNotation extends Notation {
  constructor() {
    super("Hex")
    this.signs = {POSITIVE: 0, NEGATIVE: 1};
  }

  formatUnder1000(value) {
    return this.formatDecimal(new Decimal(value));
  }

  formatInfinite() {
    return "FFFFFFFF";
  }

  formatDecimal(value) {
    // The `this.rawValue(x, 32, 8)` returns an integer between 0 and 2^32,
    // the .toString(16).toUpperCase().padStart(8, '0') formats it as
    // 8 hexadecimal digits.
    return this.rawValue(value, 32, 8).toString(16).toUpperCase().padStart(8, '0');
  }

  modifiedLogarithm(x) {
    // This function implements a tweak to the usual logarithm.
    // It has the same value at powers of 2 but is linear between
    // powers of 2 (so for example, f(3) = 1.5).
    const floorOfLog = Math.floor(Decimal.log2(x));
    const previousPowerOfTwo = Decimal.pow(2, floorOfLog);
    const fractionToNextPowerOfTwo = Decimal.div(x, previousPowerOfTwo).toNumber() - 1;
    return floorOfLog + fractionToNextPowerOfTwo;
  }

  rawValue(value, numberOfBits, extraPrecisionForRounding) {
    return this.getValueFromSigns(this.getSigns(value, numberOfBits, extraPrecisionForRounding), numberOfBits);
  }

  isFinite(x) {
    if (typeof x === "number") {
      return isFinite(x);
    }
    return isFinite(x.e) && isFinite(x.mantissa);
  }

  getSigns(value, numberOfBits, extraPrecisionForRounding) {
    // Extra precision is an arbitrary number, it only controls rounding of
    // the last digit, if it's 0 the last digit will almost always be odd
    // for non-dyadic x, if it's too high the code might be slower.
    // 8 (the value used) should be high enough for good results.
    let signs = [];
    for (let i = 0; i < numberOfBits + extraPrecisionForRounding; i++) {
      if (!this.isFinite(value)) {
        break;
      }
      if (Decimal.lt(value, 0)) {
        signs.push(this.signs.NEGATIVE);
        value = Decimal.times(value, -1);
      } else {
        signs.push(this.signs.POSITIVE);
      }
      value = this.modifiedLogarithm(value);
    }
    return signs;
  }

  getValueFromSigns(signs, numberOfBits) {
    // We need to use 0 as the initial value for result,
    // rather than, for example, 0.5. This is so that the sign list of 0
    // (passed in here as signs), which is just [Notation.hex.signs.POSITIVE],
    // becomes 1 / 2 + 0 = 0.5.
    // Another way of thinking about this:
    // The general way getSigns terminates, when it starts with a finite number,
    // is by taking the log of 0, which is -Infinity, which is the lowest number,
    // and which is also not finite, leading to the getSigns loop breaking. If you pass
    // -Infinity into getSigns, the result will be an empty list, so we want this function
    // to turn an empty list into 0. So the initial value has to be 0.
    // If you pass Infinity into getSigns, the result will also be an empty list,
    // but modifiedLogarithm never returns Infinity so the only way value can be Infinity
    // in getSigns is if Infinity was initially passed in, which should never happen.
    let result = 0;
    for (let i = signs.length - 1; i >= 0; i--) {
      if (signs[i] === this.signs.NEGATIVE) {
        result = 1 / 2 - result / 2;
      } else {
        result = 1 / 2 + result / 2;
      }
    }
    return Math.round(result * Math.pow(2, numberOfBits));
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
    this.maxVolume = 10 * this.VOLUME_UNITS[this.VOLUME_UNITS.length-1][0];
    this.logMaxVolume = Math.log10(this.maxVolume);
    this.reduceRatio = Math.log10(this.maxVolume/this.MINIMS[0]);
  }

  get isPainful() {
    return true;
  }

  formatUnder1000(value) {
    return this.formatDecimal(new Decimal(value));
  }

  formatDecimal(value) {
    if (value.lt(this.maxVolume)) {
      return this.convertToVolume(value.toNumber(), this.VOLUME_ADJECTIVES[0]);
    }
    let logValue = value.log10() - this.logMaxVolume;
    let adjectiveIndex = 1;
    while (logValue > this.reduceRatio) {
      adjectiveIndex++;
      logValue /= this.reduceRatio;
    }
    return this.convertToVolume(Math.pow(10, logValue) * this.MINIMS[0], this.VOLUME_ADJECTIVES[adjectiveIndex]);
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
      return ((x < 10 || x === Math.round(x)) ? x.toFixed(2) : x.toFixed(0)) + "pL"
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
      const deciMinims = Math.round(x * 10 / big[0]);
      if (deciMinims === 10) return this.addArticle(adjective + big[1]);
      const places = deciMinims < 100 ? 1 : 0;
      return `${(deciMinims / 10).toFixed(places)} ${adjective}${big[1]}s`
    }
    if (volIdx === 2) {
      const numBig = Math.floor(x / big[0]);
      const remainder = x - numBig * big[0];
      if (remainder > 50.5 * this.MINIMS[0]) { // 9 minims short of a dram
        return this.almostOrShortOf(x, adjective, numBig + 1, big, this.MINIMS);
      }
      // for example, a dram and 15 minims
      const numSmall = Math.round(remainder / this.MINIMS[0]);
      return this.bigAndSmall(adjective, numBig, big, numSmall, this.MINIMS);
    }
    return null;
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
    return null;
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

Notation.clock = new class ClockNotation extends Notation {
  constructor() {
    super("Clock");
    this._hours = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"];
    this.LOG12 = Math.log10(12);
  }

  formatInfinite() {
    return "🕛🕡";
  }

  formatUnder1000(value, places) {
    return this.clockwise(value.toDecimal());
  }

  formatDecimal(value, places) {
    return this.clockwise(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   * @private
   */
  clockwise(value) {
    if (value.lt(12)) return this.hour(value.toNumber());
    // say the clock goes 0123456789ab. A single digit covers 0 through 11.
    // Two digits (clocks) go 00, 01, 02... 0b, 10, 11, ... bb
    // The leading digit is distinct from the absense of a clock. So, if we make
    // 00 be 12, and go up by multiples of 12, then 01 is 24, 02 is 36, etc; 0b is then
    // 144.
    // This, of course, is confusing, because we'd expect 10 to be 144. So, we go up
    // by multiples of 11 instead. Thus, we have 00 = 12, 01 = 23, 02 = 34, ... 0b = 133
    // Then we get to 10, 11, 12, etc. Same issue here -- so we go up by 132's (11*12).
    // Eventually, b0 is 12^12 == 8916100448256, so the limit of two digits is 12^13
    // With 3 clocks, we continue a scientific-like notation, with 2 clocks for the
    // exponent. The smallest exponent we need to show is 13; that's 00; so bb (143)
    // will be 156
    // 4 clocks, in general, is hyper scientific. However, when the fourth clock shows
    // up (showing 0), we do another cycle of scientific (so, mantissa + 2 exponent digits)
    // This gives another 144 possible values for the exponent, which gets to 300.
    const log = value.log10() / this.LOG12;
    let exponent = Math.floor(log);
    if (log < 301) {
      const clockLow = (Math.pow(12, log - exponent + 1) - 12) / 11;
      if (exponent < 13) return this.hour(exponent - 1) + this.hour(clockLow);
      exponent -= 13;
      let prefix = "";
      if (exponent >= 144) {
        prefix = this.hour(0);
        exponent -= 144;
      }
      return prefix + this.hour(exponent / 12) + this.hour(exponent % 12) + this.hour(clockLow);
    }
    // With the first clock of 4 showing 1, we do 3 digits of exponent. So, 000 is 301, and bbb
    // is 2028. Past that, we go by 12's, and so on.
    exponent -= 301;
    let clockHigh = 1;
    while (exponent >= 1728) {
      exponent = (exponent - 1728) / 12;
      ++clockHigh;
    }
    return this.hour(clockHigh) + this.hour(exponent / 144) +
        this.hour((exponent % 144) / 12) + this.hour(exponent % 12);
  }

  /**
   * @param {number} number
   * @return {string}
   * @private
   */
  hour(number) {
    return this._hours[Math.clamp(Math.floor(number), 0, 11)];
  }
}("Clock");

Notation.Prime = new class PrimeNotation extends Notation {
  constructor() {
    super("Prime");
    // List of primes from 2-9973, cause thats how many I check for.
    const primeImport =
`2	3	5	7	11	13	17	19	23	29
31	37	41	43	47	53	59	61	67	71
73	79	83	89	97	101	103	107	109	113
127	131	137	139	149	151	157	163	167	173
179	181	191	193	197	199	211	223	227	229
233	239	241	251	257	263	269	271	277	281
283	293	307	311	313	317	331	337	347	349
353	359	367	373	379	383	389	397	401	409
419	421	431	433	439	443	449	457	461	463
467	479	487	491	499	503	509	521	523	541
547	557	563	569	571	577	587	593	599	601
607	613	617	619	631	641	643	647	653	659
661	673	677	683	691	701	709	719	727	733
739	743	751	757	761	769	773	787	797	809
811	821	823	827	829	839	853	857	859	863
877	881	883	887	907	911	919	929	937	941
947	953	967	971	977	983	991	997	1009	1013
1019	1021	1031	1033	1039	1049	1051	1061	1063	1069
1087	1091	1093	1097	1103	1109	1117	1123	1129	1151
1153	1163	1171	1181	1187	1193	1201	1213	1217	1223
1229	1231	1237	1249	1259	1277	1279	1283	1289	1291
1297	1301	1303	1307	1319	1321	1327	1361	1367	1373
1381	1399	1409	1423	1427	1429	1433	1439	1447	1451
1453	1459	1471	1481	1483	1487	1489	1493	1499	1511
1523	1531	1543	1549	1553	1559	1567	1571	1579	1583
1597	1601	1607	1609	1613	1619	1621	1627	1637	1657
1663	1667	1669	1693	1697	1699	1709	1721	1723	1733
1741	1747	1753	1759	1777	1783	1787	1789	1801	1811
1823	1831	1847	1861	1867	1871	1873	1877	1879	1889
1901	1907	1913	1931	1933	1949	1951	1973	1979	1987
1993	1997	1999	2003	2011	2017	2027	2029	2039	2053
2063	2069	2081	2083	2087	2089	2099	2111	2113	2129
2131	2137	2141	2143	2153	2161	2179	2203	2207	2213
2221	2237	2239	2243	2251	2267	2269	2273	2281	2287
2293	2297	2309	2311	2333	2339	2341	2347	2351	2357
2371	2377	2381	2383	2389	2393	2399	2411	2417	2423
2437	2441	2447	2459	2467	2473	2477	2503	2521	2531
2539	2543	2549	2551	2557	2579	2591	2593	2609	2617
2621	2633	2647	2657	2659	2663	2671	2677	2683	2687
2689	2693	2699	2707	2711	2713	2719	2729	2731	2741
2749	2753	2767	2777	2789	2791	2797	2801	2803	2819
2833	2837	2843	2851	2857	2861	2879	2887	2897	2903
2909	2917	2927	2939	2953	2957	2963	2969	2971	2999
3001	3011	3019	3023	3037	3041	3049	3061	3067	3079
3083	3089	3109	3119	3121	3137	3163	3167	3169	3181
3187	3191	3203	3209	3217	3221	3229	3251	3253	3257
3259	3271	3299	3301	3307	3313	3319	3323	3329	3331
3343	3347	3359	3361	3371	3373	3389	3391	3407	3413
3433	3449	3457	3461	3463	3467	3469	3491	3499	3511
3517	3527	3529	3533	3539	3541	3547	3557	3559	3571
3581	3583	3593	3607	3613	3617	3623	3631	3637	3643
3659	3671	3673	3677	3691	3697	3701	3709	3719	3727
3733	3739	3761	3767	3769	3779	3793	3797	3803	3821
3823	3833	3847	3851	3853	3863	3877	3881	3889	3907
3911	3917	3919	3923	3929	3931	3943	3947	3967	3989
4001	4003	4007	4013	4019	4021	4027	4049	4051	4057
4073	4079	4091	4093	4099	4111	4127	4129	4133	4139
4153	4157	4159	4177	4201	4211	4217	4219	4229	4231
4241	4243	4253	4259	4261	4271	4273	4283	4289	4297
4327	4337	4339	4349	4357	4363	4373	4391	4397	4409
4421	4423	4441	4447	4451	4457	4463	4481	4483
4493	4507	4513	4517	4519	4523	4547	4549	4561	4567
4583	4591	4597	4603	4621	4637	4639	4643	4649	4651
4657	4663	4673	4679	4691	4703	4721	4723	4729	4733
4751	4759	4783	4787	4789	4793	4799	4801	4813	4817
4831	4861	4871	4877	4889	4903	4909	4919	4931	4933
4937	4943	4951	4957	4967	4969	4973	4987	4993	4999
5003	5009	5011	5021	5023	5039	5051	5059	5077	5081
5087	5099	5101	5107	5113	5119	5147	5153	5167	5171
5179	5189	5197	5209	5227	5231	5233	5237	5261	5273
5279	5281	5297	5303	5309	5323	5333	5347	5351	5381
5387	5393	5399	5407	5413	5417	5419	5431	5437	5441
5443	5449	5471	5477	5479	5483	5501	5503	5507	5519
5521	5527	5531	5557	5563	5569	5573	5581	5591	5623
5639	5641	5647	5651	5653	5657	5659	5669	5683	5689
5693	5701	5711	5717	5737	5741	5743	5749	5779	5783
5791	5801	5807	5813	5821	5827	5839	5843	5849	5851
5857	5861	5867	5869	5879	5881	5897	5903	5923	5927
5939	5953	5981	5987	6007	6011	6029	6037	6043	6047
6053	6067	6073	6079	6089	6091	6101	6113	6121	6131
6133	6143	6151	6163	6173	6197	6199	6203	6211	6217
6221	6229	6247	6257	6263	6269	6271	6277	6287	6299
6301	6311	6317	6323	6329	6337	6343	6353	6359	6361
6367	6373	6379	6389	6397	6421	6427	6449	6451	6469
6473	6481	6491	6521	6529	6547	6551	6553	6563	6569
6571	6577	6581	6599	6607	6619	6637	6653	6659	6661
6673	6679	6689	6691	6701	6703	6709	6719	6733	6737
6761	6763	6779	6781	6791	6793	6803	6823	6827	6829
6833	6841	6857	6863	6869	6871	6883	6899	6907	6911
6917	6947	6949	6959	6961	6967	6971	6977	6983	6991
6997	7001	7013	7019	7027	7039	7043	7057	7069	7079
7103	7109	7121	7127	7129	7151	7159	7177	7187	7193
7207	7211	7213	7219	7229	7237	7243	7247	7253	7283
7297	7307	7309	7321	7331	7333	7349	7351	7369	7393
7411	7417	7433	7451	7457	7459	7477	7481	7487	7489
7499	7507	7517	7523	7529	7537	7541	7547	7549	7559
7561	7573	7577	7583	7589	7591	7603	7607	7621	7639
7643	7649	7669	7673	7681	7687	7691	7699	7703	7717
7723	7727	7741	7753	7757	7759	7789	7793	7817	7823
7829	7841	7853	7867	7873	7877	7879	7883	7901	7907
7919	7927	7933	7937	7949	7951	7963	7993	8009	8011
8017	8039	8053	8059	8069	8081	8087	8089	8093	8101
8111	8117	8123	8147	8161	8167	8171	8179	8191	8209
8219	8221	8231	8233	8237	8243	8263	8269	8273	8287
8291	8293	8297	8311	8317	8329	8353	8363	8369	8377
8387	8389	8419	8423	8429	8431	8443	8447	8461	8467
8501	8513	8521	8527	8537	8539	8543	8563	8573	8581
8597	8599	8609	8623	8627	8629	8641	8647	8663	8669
8677	8681	8689	8693	8699	8707	8713	8719	8731	8737
8741	8747	8753	8761	8779	8783	8803	8807	8819	8821
8831	8837	8839	8849	8861	8863	8867	8887	8893	8923
8929	8933	8941	8951	8963	8969	8971	8999	9001	9007
9011	9013	9029	9041	9043	9049	9059	9067	9091	9103
9109	9127	9133	9137	9151	9157	9161	9173	9181	9187
9199	9203	9209	9221	9227	9239	9241	9257	9277	9281
9283	9293	9311	9319	9323	9337	9341	9343	9349	9371
9377	9391	9397	9403	9413	9419	9421	9431	9433	9437
9439	9461	9463	9467	9473	9479	9491	9497	9511	9521
9533	9539	9547	9551	9587	9601	9613	9619	9623	9629
9631	9643	9649	9661	9677	9679	9689	9697	9719	9721
9721	9733	9739	9743	9749	9767	9769	9781	9787	9791
9803	9811	9817	9829	9833	9839	9851	9857	9859	9871
9883	9887	9901	9907	9923	9929	9931	9941	9949	9967
9973`;
    const importArray = [];
    // Put all number into 1 giant array.
    primeImport.split("\n").forEach(y => importArray.push(...(y.split("	").map(z => parseInt(z)))));
    // Split up the giant array in to multiple smaller arrays, so we don't need to look trough all values every time.
    this.__primeArrays = [];
    for (let i = 0; i < importArray.length; i += 100) {
      this.__primeArrays.push(importArray.slice(i, Math.min(importArray.length, i + 100)));
    }
    // Find the smallest number in each of the sub arrays.
    this.__primeMin = this.__primeArrays.map(x => parseInt(x[0]));
    // The maximum number we can reliably find all prime factors for.
    this.__maxInt = 10006;
    // Unicode characters for exponents ranging 0 - 13.
    this.__sup = ["\u2070", "\u00B9", "\u00B2", "\u00B3", "\u2074", "\u2075", "\u2076", "\u2077", "\u2078", "\u2079", "\u00B9\u2070", "\u00B9\u00B9", "\u00B9\u00B2", "\u00B9\u00B3"];
  }

  formatInfinite() {
    return "Primefinity?";
  }

  formatUnder1000(value, places) {
    return this.primify(value.toDecimal());
  }

  formatDecimal(value, places) {
    return this.primify(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   * @private
   */
  primify(value) {
    const temp = value;
    // Basic checks to see if number is 0 or 1.
    if (temp.floor().eq(0)) return 0;
    if (temp.floor().eq(1)) return 1;
    // We take the number and do 1 of 3 things depending on how big it is.
    // If the number is smaller than maxInt, 10006, then we just find the primes and 
    // format them.
    // If not we need a way of representing the number, using only primes of course.
    // So we derive an exponent that will keep the base bellow the maxInt, then
    // we derive prime factorials for both and format them as (base)^(exponent).
    // If the number is greater than 1e10006, we need to again format it differently.
    // So we increase our stack size to three, and repeat the process above from 
    // top down.
    if (temp.lte(this.__maxInt)) {
      return this.formatFromList(this.primesFromInt(temp.floor().toNumber()));
    }
    let exp = temp.log10() / Math.log10(this.__maxInt);
    let base = Math.pow(this.__maxInt, exp / Math.ceil(exp));
    if (exp <= this.__maxInt) {
      return "(" + this.formatFromList(this.primesFromInt(Math.floor(base))) + ")^(" + this.formatFromList(this.primesFromInt(Math.ceil(exp))) + ")";
    }
    const exp2 = Math.log10(exp) / Math.log10(this.__maxInt);
    exp = Math.pow(this.__maxInt, exp2 / Math.ceil(exp2));
    base = Math.pow(this.__maxInt, exp / Math.ceil(exp));
    const exp2List = this.primesFromInt(Math.ceil(exp2));
    return "(" + this.formatFromList(this.primesFromInt(Math.floor(base))) + ")^(" + this.formatFromList(this.primesFromInt(Math.ceil(exp))) + ")" + (exp2List.length === 1 ? this.__sup[exp2List[0]] : "^(" + this.formatFromList(exp2List) + ")");
  }

  /**
   * @param {Array} list
   * @return {string}
   * @private
   */
  formatFromList(list) {
    const out = [];
    let last = 0;
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === last) {
        count++;
      } else {
        if (last > 0) {
          if (count > 1) out.push(last + this.__sup[count]);
          else out.push(last);
        }
        last = list[i];
        count = 1;
      }
      if (i === list.length - 1) {
        if (count > 1) out.push(list[i] + this.__sup[count]);
        else out.push(list[i]);
      }
    }
    return out.join("\u00D7");
  }

  /**
   * @param {Decimal} list
   * @return {Array}
   * @private
   */
  primesFromInt(value) {
    let temp = value;
    const usefulArrays = this.__primeArrays.filter((x, i) => this.__primeMin[i] <= value);
    const list = [];
    for (let i = 0; i < 10000; i++) {
      const highestPrimes = usefulArrays[usefulArrays.length - 1];
      if (highestPrimes.indexOf(temp) > -1) {
        list.push(temp);
        temp = 1;
        break;
      }
      for (let j = highestPrimes.length - 1; j >= 0; j--) {
        if (temp % highestPrimes[j] === 0) {
          list.push(highestPrimes[j]);
          temp /= highestPrimes[j];
          break;
        }
        if (j === 0) {
          usefulArrays.pop();
        }
      }
    }
    return list.reverse();
  }

}("Prime");



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
  Notation.hex,
  Notation.imperial,
  Notation.clock,
  Notation.Prime,
];
