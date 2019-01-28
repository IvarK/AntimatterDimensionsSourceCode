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
  get isPainful() {
    return true;
  }

  format(value, places, placesUnder1000) {
    // Eternity seems to happen around e66666 antimatter, who would've thought?  Scaled down to 1000.
    let scaledNum = new Decimal(value).clampMin(1).log10() / 66666 * 1000;
    let displayPart = scaledNum.toFixed(2);
    let zalgoPart = Math.floor(Math.abs(Math.pow(2, 30) * (scaledNum - displayPart)));
    
    let zalgoConsts = ['\u030D', '\u0336', '\u0353', '\u033F', '\u0489', '\u0330', '\u031A', '\u0338', '\u035A', '\u0337'];
    let displayChars = Array.from(formatWithCommas(displayPart));
    let zalgoChars = Array.from("" + zalgoPart + scaledNum.toFixed(0));

    for (let i = 0; i < zalgoChars.length; i++) {
      let currZalgo = parseInt(zalgoChars[i]);
      let indexToAddChar = 7 * i % displayChars.length;
      displayChars[indexToAddChar] += zalgoConsts[currZalgo]
    }

    return displayChars.reduce((num, char) => num + char, "");
  }

  formatDecimal(value, places) {}
}("Zalgo");

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
];