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
  // eslint-disable-next-line no-unused-vars
  formatDecimal(value, places) { throw NotImplementedCrash(); }

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
      "", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc",
      "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc", "Vg", "UVg", "DVg", "TVg",
      "QaVg", "QtVg", "SxVg", "SpVg", "OVg", "NVg", "Tg", "UTg", "DTg", "TTg", "QaTg",
      "QtTg", "SxTg", "SpTg", "OTg", "NTg", "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd",
      "SxQd", "SpQd", "OQd", "NQd", "Qi", "UQi", "DQi", "TQi", "QaQi", "QtQi", "SxQi",
      "SpQi", "OQi", "NQi", "Se", "USe", "DSe", "TSe", "QaSe", "QtSe", "SxSe", "SpSe",
      "OSe", "NSe", "St", "USt", "DSt", "TSt", "QaSt", "QtSt", "SxSt", "SpSt", "OSt",
      "NSt", "Og", "UOg", "DOg", "TOg", "QaOg", "QtOg", "SxOg", "SpOg", "OOg", "NOg",
      "Nn", "UNn", "DNn", "TNn", "QaNn", "QtNn", "SxNn", "SpNn", "ONn", "NNn", "Ce"
    ];
  }

  get isPainful() {
    return true;
  }

  formatDecimal(value, places) {
    const engineering = this.makeFixedEngineering(value, places);
    const mantissa = engineering.mantissa.toFixed(places);
    const abbreviation = value.exponent <= 303
      ? this.abbreviations[engineering.exponent / 3]
      : StandardNotation.getAbbreviation(value.exponent);
    return `${mantissa} ${abbreviation}`;
  }

  /**
   * @param {number} e
   * @return {string}
   * @private
   */
  static getAbbreviation(e) {
    const prefixes = [
      ["", "U", "D", "T", "Qa", "Qt", "Sx", "Sp", "O", "N"],
      ["", "Dc", "Vg", "Tg", "Qd", "Qi", "Se", "St", "Og", "Nn"],
      ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Si", "Oe", "Ne"]];
    const prefixes2 = ["", "MI-", "MC-", "NA-", "PC-", "FM-"];
    e = Math.floor(e / 3) - 1;
    let index2 = 0;
    const prefix = [prefixes[0][e % 10]];
    while (e >= 10) {
      e = Math.floor(e / 10);
      prefix.push(prefixes[(++index2) % 3][e % 10]);
    }
    index2 = Math.floor(index2 / 3);
    while (prefix.length % 3 !== 0) prefix.push("");
    let abbreviation = "";
    while (index2 >= 0) {
      abbreviation += prefix[index2 * 3] + prefix[index2 * 3 + 1] + prefix[index2 * 3 + 2] + prefixes2[index2--];
    }
    if (abbreviation.endsWith("-")) {
      abbreviation = abbreviation.slice(0, abbreviation.length - 1);
    }
    return abbreviation
      .replace("UM", "M")
      .replace("UNA", "NA")
      .replace("UPC", "PC")
      .replace("UFM", "FM");
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
    
      return `${formatted}∞`;
    
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

  formatDecimal(value) {
    const table = [")", "[", "{", "]", "(", "}"];
    const log6 = Math.LN10 / Math.log(6) * value.log10();
    let wholePartOfLog = Math.floor(log6);
    const decimalPartOfLog = log6 - wholePartOfLog;
    // Easier to convert a number between 0-35 to base 6 than messing with fractions and shit
    const decimalPartTimes36 = Math.floor(decimalPartOfLog * 36);
    let string = "";
    while (wholePartOfLog >= 6) {
      const remainder = wholePartOfLog % 6;
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
    let letter = "";
    while (i > 0) {
      letter += str[Math.floor(power / Math.pow(len, --i)) % len];
    }
    return letter;
  }

  formatDecimal(value, places) {
    const engineering = this.makeEngineering(value);
    const mantissa = engineering.mantissa.toFixed(places);
    const letters = this.letter(value.exponent, this._letters);
    return mantissa + letters;
  }
}

Notation.letters = new LettersNotation("Letters", "abcdefghijklmnopqrstuvwxyz");

Notation.cancer = new class CancerNotation extends LettersNotation {
  get isPainful() {
    return true;
  }

  setCurrent() {
    super.setCurrent();
    GameUI.notify.success("😂😂😂");
  }
}(
  "Cancer",
  [
    "😠", "🎂", "🎄", "💀", "🍆", "👪", "🌈", "💯", "🍦", "🎃", "💋", "😂", "🌙",
    "⛔", "🐙", "💩", "❓", "☢", "🙈", "👍", "☂", "✌", "⚠", "❌", "😋", "⚡"
  ]
);

Notation.roman = new class RomanNotation extends Notation {
  constructor() {
    super("Roman");
    this._romanNumbers = [
      [1000000, "M̄"],
      [900000, "C̄M̄"],
      [500000, "D̄"],
      [400000, "C̄D̄"],
      [100000, "C̄"],
      [90000, "X̄C̄"],
      [50000, "L̄"],
      [40000, "X̄L̄"],
      [10000, "X̄"],
      [9000, "ⅯX̄"],
      [5000, "V̄"],
      [4000, "ⅯV̄"],
      [1000, "Ⅿ"],
      [900, "ⅭⅯ"],
      [500, "Ⅾ"],
      [400, "ⅭⅮ"],
      [100, "Ⅽ"],
      [90, "ⅩⅭ"],
      [50, "Ⅼ"],
      [40, "ⅩⅬ"],
      [10, "Ⅹ"],
      [9, "ⅠⅩ"],
      [5, "Ⅴ"],
      [4, "ⅠⅤ"],
      [1, "Ⅰ"],
    ];
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

  formatUnder1000(value) {
    return this.romanize(value);
  }

  formatDecimal(value) {
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
    const romanNumbers = this._romanNumbers;
    let romanized = "";
    for (const numberPair of romanNumbers) {
      const decimal = numberPair[0];
      const roman = numberPair[1];
      while (decimal <= value) {
        romanized += roman;
        value -= decimal;
      }
    }
    let duodecimal = Math.round(Math.floor(value * 10) * 1.2);
    if (duodecimal === 0) {
      return romanized === "" ? "nulla" : romanized;
    }
    if (duodecimal > 5) {
      duodecimal -= 6;
      romanized += "Ｓ";
    }
    const romanFractions = this._romanFractions;
    romanized += romanFractions[duodecimal];
    return romanized;
  }
}("Roman");

Notation.dots = new class DotsNotation extends Notation {
  formatUnder1000(value) {
    return this.dotify(value * 254);
  }

  formatInfinite() {
    return "⣿⠀⣿";
  }

  formatDecimal(value) {
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
    this._zalgoChars = [
      "\u030D", "\u0336", "\u0353", "\u033F", "\u0489",
      "\u0330", "\u031A", "\u0338", "\u035A", "\u0337"
    ];
    this._heComes = ["H", "E", " ", "C", "O", "M", "E", "S"];
  }

  get isPainful() {
    return true;
  }

  formatInfinite() {
    return this._heComes
      .map(char => char + this._zalgoChars.randomElement())
      .join("");
  }

  formatUnder1000(value) {
    return this.heComes(value.toDecimal());
  }

  formatDecimal(value) {
    return this.heComes(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   */
  heComes(value) {
    // Eternity seems to happen around e66666 antimatter, who would've thought? Scaled down to 1000.
    const scaled = value.clampMin(1).log10() / 66666 * 1000;
    const displayPart = scaled.toFixed(2);
    const zalgoPart = Math.floor(Math.abs(Math.pow(2, 30) * (scaled - displayPart)));

    const displayChars = Array.from(formatWithCommas(displayPart));
    const zalgoIndices = Array.from(zalgoPart.toString() + scaled.toFixed(0));

    for (let i = 0; i < zalgoIndices.length; i++) {
      const zalgoIndex = parseInt(zalgoIndices[i], 10);
      const displayIndex = 7 * i % displayChars.length;
      displayChars[displayIndex] += this._zalgoChars[zalgoIndex];
    }

    return displayChars.join("");
  }
}();

Notation.hex = new class HexNotation extends Notation {
  constructor() {
    super("Hex");
    this.signs = { POSITIVE: 0, NEGATIVE: 1 };
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
    return this.rawValue(value, 32, 8).toString(16).toUpperCase().padStart(8, "0");
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
    const signs = [];
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
      [61611520 * 60, "dram", 1],
      [61611520 * 60 * 8, "ounce", 2],
      [61611520 * 60 * 8 * 4, "gill", 2],
      [61611520 * 60 * 8 * 4 * 2, "cup", 3],
      [61611520 * 60 * 8 * 4 * 2 * 2, "pint", 4],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2, "quart", 4],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4, "gallon", 4],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 4.5, "pin", 3],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 9, "firkin", 3],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 18, "kilderkin", 4],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 36, "barrel", 4],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 54, "hogshead", 5],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 72, "puncheon", 6],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 108, "butt", 7],
      [61611520 * 60 * 8 * 4 * 2 * 2 * 2 * 4 * 216, "tun", 7],
    ];
    this.MINIMS = this.VOLUME_UNITS[1];
    this.VOLUME_ADJECTIVES = ["minute ", "tiny ", "petite ", "small ", "modest ", "medium ", "generous ",
      "large ", "great ", "huge ", "gigantic ", "colossal ", "vast ", "cosmic "];
    this.VOWELS = new Set("aeiouAEIOU");
    this.maxVolume = 10 * this.VOLUME_UNITS[this.VOLUME_UNITS.length - 1][0];
    this.logMaxVolume = Math.log10(this.maxVolume);
    this.reduceRatio = Math.log10(this.maxVolume / this.MINIMS[0]);
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

    const big = this.VOLUME_UNITS[volIdx];
    const numBig = Math.floor(x / big[0]);
    const remainder = x - numBig * big[0];
    // When we are within a specified rounding error, unit break:
    if (volIdx < this.VOLUME_UNITS.length - 1) {
      const volume = this.checkAlmost(adjective, x, 0, volIdx + 1);
      if (volume) return volume;
    }
    const nearMultiple = this.checkAlmost(adjective, remainder, numBig, volIdx);
    if (nearMultiple) return nearMultiple;
    // Just over a multiple, in units that are too small:
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
      if (numThird > 9 && (thirdUnitIndex !== 1 || bestUnits)) break;
      // We are using floor, so we can compare error diretly, without abs
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
   */
  formatMetric(x) {
    // The jump from metric to minim is sudden. Small values (< 10) get more decimal places
    // because that's usually something like sacrifice multiplier
    if (x < 1000) {
      return ((x < 10 || x === Math.round(x)) ? x.toFixed(2) : x.toFixed(0)) + "pL";
    }
    if (x < 1e6) return (x / 1000).toPrecision(4) + "nL";
    return (x / 1e6).toPrecision(4) + "μL";
  }

  /**
   * Handles cases involving everything up to ounces; in the case of ounces it may
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
    // Minims to drams. This goes:
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
      return `${(deciMinims / 10).toFixed(places)} ${adjective}${big[1]}s`;
    }
    if (volIdx === 2) {
      const numBig = Math.floor(x / big[0]);
      const remainder = x - numBig * big[0];
      if (remainder > 50.5 * this.MINIMS[0]) {
        // 9 minims short of a dram
        return this.almostOrShortOf(x, adjective, numBig + 1, big, this.MINIMS);
      }
      // For example, a dram and 15 minims
      const numSmall = Math.round(remainder / this.MINIMS[0]);
      return this.bigAndSmall(adjective, numBig, big, numSmall, this.MINIMS);
    }
    return null;
  }

  /**
   * Search for the largest unit smaller than x
   * @param {number} x
   * @returns {number} index into VOLUME_UNITS
   */
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

  formatUnder1000(value) {
    return this.clockwise(value.toDecimal());
  }

  formatDecimal(value) {
    return this.clockwise(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   * @private
   */
  clockwise(value) {
    if (value.lt(12)) return this.hour(value.toNumber());
    // Say the clock goes 0123456789ab. A single digit covers 0 through 11.
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

Notation.prime = new class PrimeNotation extends Notation {
  constructor() {
    super("Prime");
    // The maximum number we can reliably find all prime factors for.
    this._maxInt = 10006;
    this._maxIntDecimal = new Decimal(this._maxInt);
    this._maxIntLog10 = Math.log10(this._maxInt);
    // List of primes from 2-9973, cause thats how many I check for.
    const primes = [];
    const visitedMarks = new Array(this._maxInt).fill(false);
    const sieveLimit = Math.ceil(Math.sqrt(this._maxInt));
    for (let number = 2; number < sieveLimit; number++) {
      if (visitedMarks[number]) continue;
      primes.push(number);
      for (let mark = number; mark <= this._maxInt; mark += number) {
        visitedMarks[mark] = true;
      }
    }
    for (let number = sieveLimit; number < this._maxInt; number++) {
      if (!visitedMarks[number]) {
        primes.push(number);
      }
    }
    this._primes = primes;
    this._lastPrimeIndex = primes.length - 1;
    this._maxPrime = this._primes[this._lastPrimeIndex];
    
    // Unicode characters for exponents ranging 0 - 13.
    this._exponentCharacters = [
      "\u2070", "\u00B9", "\u00B2", "\u00B3", "\u2074",
      "\u2075", "\u2076", "\u2077", "\u2078", "\u2079",
      "\u00B9\u2070", "\u00B9\u00B9", "\u00B9\u00B2", "\u00B9\u00B3"
    ];
  }

  formatInfinite() {
    return "Primefinity?";
  }

  formatUnder1000(value) {
    return this.primify(value.toDecimal());
  }

  formatDecimal(value) {
    return this.primify(value);
  }

  /**
   * @param {Decimal} value
   * @return {string}
   * @private
   */
  primify(value) {
    // We take the number and do 1 of 3 things depending on how big it is.
    // If the number is smaller than maxInt, 10006, then we just find the primes and 
    // format them.
    // If not we need a way of representing the number, using only primes of course.
    // So we derive an exponent that will keep the base under the maxInt, then
    // we derive prime factors for both and format them as (base)^(exponent).
    // If the number is greater than 1e10006, we need to again format it differently.
    // So we increase our stack size to three, and repeat the process above from 
    // top down.
    if (value.lte(this._maxIntDecimal)) {
      const floored = Math.floor(value.toNumber());
      if (floored === 0) return 0;
      if (floored === 1) return 1;
      return this.formatFromList(this.primesFromInt(floored));
    }
    let exp = value.log10() / this._maxIntLog10;
    let base = Math.pow(this._maxInt, exp / Math.ceil(exp));
    if (exp <= this._maxInt) {
      return this.formatBaseExp(base, exp);
    }
    const exp2 = Math.log10(exp) / Math.log10(this._maxInt);
    const exp2Ceil = Math.ceil(exp2);
    exp = Math.pow(this._maxInt, exp2 / exp2Ceil);
    base = Math.pow(this._maxInt, exp / Math.ceil(exp));
    const exp2List = this.primesFromInt(exp2Ceil);
    const formatedExp2 = exp2List.length === 1
      ? this._exponentCharacters[exp2List[0]]
      : `^(${this.formatFromList(exp2List)})`;
    return this.formatBaseExp(base, exp) + formatedExp2;
  }

  /**
   * @param {Array} base
   * @param {Array} exp
   * @return {string}
   * @private
   */
  formatBaseExp(base, exp) {
    const formatedBase = this.formatFromList(this.primesFromInt(Math.floor(base)));
    const formatedExp = this.formatFromList(this.primesFromInt(Math.ceil(exp)));
    return `(${formatedBase})^(${formatedExp})`;
  }

  /**
   * @param {Array} list
   * @return {string}
   * @private
   */
  formatFromList(list) {
    // Formats an array of prime numbers such that all like pairs are combined,
    // they are then raised to an exponent signifying how many times the value apears.
    // Finally multiplication signs are put between all values.
    const out = [];
    let last = 0;
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i] === last) {
        count++;
      } else {
        if (last > 0) {
          if (count > 1) out.push(last + this._exponentCharacters[count]);
          else out.push(last);
        }
        last = list[i];
        count = 1;
      }
      if (i === list.length - 1) {
        if (count > 1) out.push(list[i] + this._exponentCharacters[count]);
        else out.push(list[i]);
      }
    }
    return out.join("\u00D7");
  }

  findGreatestLtePrimeIndex(value) {
    // Lte stands for "less than or equal"
    if (value >= this._maxPrime) return this._lastPrimeIndex;
    let min = 0;
    let max = this._lastPrimeIndex;
    while (max !== min + 1) {
      const middle = Math.floor((max + min) / 2);
      const prime = this._primes[middle];
      if (prime === value) return middle;
      if (value < prime) max = middle;
      else min = middle;
    }
    return min;
  }
  
  /**
   * @param {Decimal} list
   * @return {Array}
   * @private
   */
  primesFromInt(value) {
    const factors = [];
    let factoringValue = value;
    while (factoringValue !== 1) {
      const ltePrimeIndex = this.findGreatestLtePrimeIndex(factoringValue);
      const ltePrime = this._primes[ltePrimeIndex];
      if (ltePrime === factoringValue) {
        factors.push(factoringValue);
        break;
      }
      // Search for greatest prime that is lesser than factored / 2, because
      // all greater values won't be factors anyway
      const halfFactoring = factoringValue / 2;
      let primeIndex = this.findGreatestLtePrimeIndex(halfFactoring);
      let factor;
      while (factor === undefined) {
        const prime = this._primes[primeIndex--];
        if (factoringValue % prime === 0) {
          factor = prime;
        }
      }
      factoringValue /= factor;
      factors.push(factor);
    }
    return factors.reverse();
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
  Notation.hex,
  Notation.imperial,
  Notation.clock,
  Notation.prime,
];
