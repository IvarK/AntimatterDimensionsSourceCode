const AutomatorKeyword = {
  BUY: "BUY",
  STUDY: "STUDY",
  STUDYUNTIL: "STUDYUNTIL",
  STUDYPATH: "STUDYPATH",
  STUDYIMPORT: "STUDYIMPORT",
  TTIP: "TTIP",
  TTEP: "TTEP",
  TTAM: "TTAM",
  TTMAX: "TTMAX",
  TTGEN: "TTGEN",
  WAIT: "WAIT",
  TIME: "TIME",
  IF: "IF",
  RG: "RG",
  MAX: "MAX",
  TT: "TT",
  ANTIMATTER: "ANTIMATTER",
  IP: "IP",
  EP: "EP",
  REPLICANTI: "REPLICANTI",
  UNLOCK: "UNLOCK",
  START: "START",
  EC: "EC",
  DILATION: "DILATION",
  CHANGE: "CHANGE",
  IPAUTOBUYER: "IPAUTOBUYER",
  EPAUTOBUYER: "EPAUTOBUYER",
  TOGGLE: "TOGGLE",
  ON: "ON",
  OFF: "OFF",
  D1: "D1",
  D2: "D2",
  D3: "D3",
  D4: "D4",
  D5: "D5",
  D6: "D6",
  D7: "D7",
  D8: "D8",
  TICKSPEED: "TICKSPEED",
  DIMBOOST: "DIMBOOST",
  GALAXY: "GALAXY",
  INFINITY: "INFINITY",
  SACRIFICE: "SACRIFICE",
  ETERNITY: "ETERNITY",
  RESPEC: "RESPEC",
  STOP: "STOP",
  NOTIFY: "NOTIFY",
  STRING: "STRING",
  NUMBER: "NUMBER",
  PATH: "PATH",
  TREE: "TREE",
  ALL: "ALL",
  NONE: "NONE",
  NORMAL: "NORMAL",
  ND: "ND",
  ID: "ID",
  TD: "TD",
  ACTIVE: "ACTIVE",
  PASSIVE: "PASSIVE",
  IDLE: "IDLE",
  GOTO: "GOTO",
};

const AutomatorTokenType = {
  COMMENT: "COMMENT",
  LINE_END: "LINE_END",
  WHITESPACE: "WHITESPACE",
  OPERATOR: "OPERATOR",
  KEYWORD: "KEYWORD",
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  ERROR: "ERROR",
  LABEL: "LABEL"
};

class AutomatorToken {
  /**
   * @param {string} type
   * @param {string} value
   * @param {number} position
   * @param {string?} error
   */
  constructor(type, value, position, error) {
    this.type = type;
    this.value = value;
    this.position = position;
    this.error = error;
  }
}

class AutomatorLexer {
  /**
   * @param {string} program
   */
  constructor(program) {
    this._program = program.replace("\r\n", "\n");
    this._position = 0;
    this._length = program.length;
  }

  /**
   * @return {AutomatorToken|undefined}
   */
  nextToken() {
    if (this._position === this._length) return undefined;
    const char = this.currentChar;
    if (this.isAlpha(char)) {
      return this.lexIdentifierKeywordLabel();
    }
    if (this.isWhiteSpace(char)) {
      return this.lexWhiteSpace();
    }
    if (this.isDigit(char)) {
      return this.lexNumber();
    }
    let nextChar = this.nextChar;
    if (char === "/" && nextChar === "/") {
      return this.lexComment();
    }
    if (this.isLineEnd(char)) {
      return this.makeToken(AutomatorTokenType.LINE_END, this._position + 1);
    }
    if (["!=", ">=", "<="].includes(char + nextChar)) {
      if (!this.isLexemeSeparator(this.charAt(this._position + 2))) return this.lexError();
      return this.makeToken(AutomatorTokenType.OPERATOR, this._position + 2);
    }
    if (["=", ">", "<"].includes(char)) {
      if (!this.isLexemeSeparator(this.charAt(this._position + 1))) return this.lexError();
      return this.makeToken(AutomatorTokenType.OPERATOR, this._position + 1);
    }
    return this.lexError();
  }

  lexIdentifierKeywordLabel() {
    const end = this.takeWhile(this._position + 1, c => this.isAlphaNumeric(c));
    const isLabel = this.charAt(end) === ":" && this.isLexemeSeparator(this.charAt(end + 1));
    const lexeme = this._program.substring(this._position, end);
    let keyword = AutomatorKeyword[lexeme];
    if (keyword === undefined) {
      const isLowerCase = lexeme === lexeme.toLowerCase();
      if (isLowerCase) {
        keyword = AutomatorKeyword[lexeme.toUpperCase()];
      }
    }
    if (isLabel) {
      if (keyword !== undefined) {
        return this.lexError("Keywords cannot be used as labels");
      }
      return this.makeToken(AutomatorTokenType.LABEL, end + 1);
    }
    if (!this.isLexemeSeparator(this.charAt(end))) return this.lexError();
    const type = keyword !== undefined ?
      AutomatorTokenType.KEYWORD :
      AutomatorTokenType.IDENTIFIER;
    return this.makeToken(type, end);
  }

  /**
   * @private
   * @return {AutomatorToken}
   */
  lexNumber() {
    let end = this.takeWhile(this._position + 1, c => this.isDigit(c));
    if (this.charAt(end) === "e") {
      end = this.takeWhile(end + 1, c => this.isDigit(c));
    }
    if (!this.isLexemeSeparator(this.charAt(end))) return this.lexError();
    return this.makeToken(AutomatorTokenType.NUMBER, end);
  }

  /**
   * @private
   * @return {AutomatorToken}
   */
  lexWhiteSpace() {
    const end = this.takeWhile(this._position + 1, c => this.isWhiteSpace(c));
    return this.makeToken(AutomatorTokenType.WHITESPACE, end);
  }

  /**
   * @private
   * @return {AutomatorToken}
   */
  lexComment() {
    const end = this.takeWhile(this._position + 2, c => !this.isLineEnd(c));
    return this.makeToken(AutomatorTokenType.COMMENT, end);
  }

  /**
   * @private
   * @return {AutomatorToken}
   */
  lexError(errorMessage) {
    const end = this.takeWhile(this._position + 1, c => !this.isWhiteSpace(c) && !this.isLineEnd(c));
    return this.makeToken(AutomatorTokenType.ERROR, end, errorMessage || "Invalid token");
  }

  /**
   * @private
   * @param {number} start
   * @param {function} predicate
   */
  takeWhile(start, predicate) {
    let end = start;
    while (end < this._length && predicate(this.charAt(end))) {
      end++;
    }
    return end;
  }

  /**
   * @private
   * @param {string} type
   * @param {number} endPosition
   * @param {string?} error
   * @return {AutomatorToken}
   */
  makeToken(type, endPosition, error) {
    const token = new AutomatorToken(
      type,
      this._program.substring(this._position, endPosition),
      this._position,
      error
    );
    this._position = endPosition;
    return token;
  }

  /**
   * @private
   * @return {string}
   */
  get currentChar() {
    return this.charAt(this._position);
  }

  /**
   * @private
   * @return {string}
   */
  get nextChar() {
    return this.charAt(this._position + 1);
  }

  /**
   * @private
   * @param {string} char
   * @return {boolean}
   */
  isLexemeSeparator(char) {
    return this.isWhiteSpace(char) || this.isLineEnd(char);
  }

  /**
   * @private
   * @param {string} char
   * @return {boolean}
   */
  isWhiteSpace(char) {
    return char === " " || char === "\t";
  }

  /**
   * @private
   * @param {string} char
   * @return {boolean}
   */
  isLineEnd(char) {
    return char === "\n" || char === "";
  }

  /**
   * @private
   * @param {string} char
   * @return {boolean}
   */
  isAlphaNumeric(char) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  /**
   * @private
   * @param {string} char
   * @return {boolean}
   */
  isDigit(char) {
    return char >= "0" && char <= "9";
  }

  /**
   * @private
   * @param {string} char
   * @return {boolean}
   */
  isAlpha(char) {
    return (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_" || char === "$";
  }

  charAt(position) {
    return this._program.charAt(position);
  }

  /**
   * @return {AutomatorToken[]}
   */
  remainingTokens() {
    const tokens = [];
    let token;
    while ((token = this.nextToken()) !== undefined) {
      tokens.push(token);
    }
    return tokens;
  }
}
