/**
 * @type {TokenTester[][]}
 */
const AutomatorGrammarX = (function() {
  class TokenTester {
    /**
     * @param {AutomatorToken} token
     * @return {string}
     */
    test(token) { return false; }
  }
  class KeywordTokenTester extends TokenTester {
    constructor(keyword) {
      super();
      this._keyword = keyword;
    }

    test(token) {
      return token.type === AutomatorTokenType.KEYWORD &&
        token.value.toLowerCase() === this._keyword.toLowerCase();
    }
  }
  const keyword = keyword => new KeywordTokenTester(keyword);
  return [
    [keyword(AutomatorKeyword.BUY), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.WAIT), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.IF), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.TT), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.ANTIMATTER), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.IP), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.EP), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.REPLICANTI), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.RG), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.UNLOCK), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.START), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.CHANGE), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.TOGGLE), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.RESPEC), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.ETERNITY), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.STOP), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.NOTIFY), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.NUMBER), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.TREE), keyword(AutomatorKeyword.STUDY)],
    [keyword(AutomatorKeyword.GOTO), keyword(AutomatorKeyword.STUDY)],
  ];
})();

const AutomatorLineType = {
  CODE: 0,
  COMMENT: 1,
  ERROR: 2,
  DECLARATION: 3
};

class AutomatorLine {
  constructor(type, tokens, codeLine) {
    this.type = type;
    this.tokens = tokens;
    this.codeLine = codeLine;
  }

  viewModel() {
    return {
      type: this.type,
      codeLine : this.codeLine
    };
  }
}

class AutomatorParser {
  /**
   * @param {AutomatorToken[]} tokens
   */
  constructor(tokens) {
    this._tokens = tokens;
    this._position = 0;
    this._codeLines = 0;
    this._length = tokens.length;
  }

  /**
   * @return {AutomatorLine|undefined}
   */
  nextLine() {
    if (this._position >= this._length) return undefined;
    const tokens = [];
    let token;
    do {
      token = this._tokens[this._position++];
      tokens.push(token);
    }
    while (token.type !== AutomatorTokenType.LINE_END && this._position < this._length);
    if (tokens.every(t => t.type !== AutomatorTokenType.ERROR)) {
      const meaningfulTokens = tokens.filter(t =>
        t.type !== AutomatorTokenType.WHITESPACE &&
        t.type !== AutomatorTokenType.LINE_END &&
        t.type !== AutomatorTokenType.COMMENT
      );
      if (meaningfulTokens.length > 0) {
        this.validate(meaningfulTokens, this._codeLines + 1);
      }
    }
    return new AutomatorLine(AutomatorLineType.CODE, tokens, ++this._codeLines);
  }

  /**
   * @param {AutomatorToken[]} tokens
   */
  validate(tokens) {
    const rules = this.testRules(AutomatorGrammar, tokens[0], 0);
    if (rules.length === 0) {
      tokens[0].error = "Unexpected";
    }
  }

  testRules(rules, token, index) {
    return rules.filter(rule => rule[index].test(token));
  }

  /**
   * @return {AutomatorLine[]}
   */
  remainingLines() {
    const lines = [];
    let line;
    while ((line = this.nextLine()) !== undefined) {
      lines.push(line);
    }
    return lines;
  }
}